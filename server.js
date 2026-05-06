import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// --- Email Configuration ---

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, text, html) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[MOCK EMAIL] Transporter not configured. Outputting to console:');
    console.log(`To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: `"Sodor Academy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send email:', error);
    throw error;
  }
}

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_PATH = '/SodorAcademy';

app.use(express.json());

// --- Database Helpers ---

async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

// --- API Routes ---

const apiRouter = express.Router();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

apiRouter.post('/register', async (req, res) => {
  const { name, pin, email } = req.body;
  if (!name || !pin || !email) return res.status(400).json({ error: 'Name, PIN, and Email required' });

  const users = await readUsers();
  if (users.find(u => u.name === name)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPin = await bcrypt.hash(pin, 10);
  const validationCode = generateCode();
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    pin: hashedPin,
    isActive: false,
    validationCode,
    stats: {
      score: 0,
      completedLessons: 0,
      enginesCollected: [],
      videosUnlocked: ['welcome'],
      currentGrade: 'Primary'
    }
  };

  console.log(`[REGISTRATION] New user: ${name}, Email: ${email}`);

  await sendEmail(
    email,
    'Welcome to Sodor Academy! 🚂',
    `Hello ${name}!\n\nWelcome to Sodor Academy. To start your journey, please use this 6-digit validation code:\n\n${validationCode}\n\nAll aboard!`,
    `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 20px;">
        <h2 style="color: #1e40af;">Welcome to Sodor Academy! 🚂</h2>
        <p>Hello <strong>${name}</strong>!</p>
        <p>Welcome to Sodor Academy. To start your journey, please use this 6-digit validation code:</p>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e40af;">${validationCode}</span>
        </div>
        <p>All aboard!</p>
      </div>
    `
  );

  users.push(newUser);
  await writeUsers(users);
  res.status(201).json({ 
    user: { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      stats: newUser.stats, 
      isActive: newUser.isActive,
      isAdmin: newUser.isAdmin || false
    } 
  });
});

apiRouter.post('/validate-email', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

  const users = await readUsers();
  const index = users.findIndex(u => u.email === email);

  if (index === -1) return res.status(404).json({ error: 'User not found' });
  if (users[index].validationCode !== code) return res.status(400).json({ error: 'Invalid validation code' });

  users[index].isActive = true;
  delete users[index].validationCode;
  await writeUsers(users);

  res.json({ success: true });
});

apiRouter.post('/login', async (req, res) => {
  const { name, pin } = req.body;
  const users = await readUsers();
  const user = users.find(u => u.name === name);

  if (!user || !(await bcrypt.compare(pin, user.pin))) {
    return res.status(401).json({ error: 'Invalid name or PIN' });
  }

  if (user.isActive === false) {
    return res.status(403).json({ error: 'Account not validated', email: user.email });
  }

  res.json({ 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      stats: user.stats,
      isAdmin: user.isAdmin || false
    } 
  });
});

// --- Admin Routes ---

apiRouter.get('/admin/users', async (req, res) => {
  const adminId = req.headers['x-admin-id'];
  const users = await readUsers();
  const admin = users.find(u => u.id === adminId);

  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  // Sanitize user data for the admin list
  const sanitizedUsers = users.map(({ pin, validationCode, recoveryCode, ...u }) => u);
  res.json({ users: sanitizedUsers });
});

apiRouter.delete('/admin/users/:userId', async (req, res) => {
  const adminId = req.headers['x-admin-id'];
  const targetUserId = req.params.userId;
  
  const users = await readUsers();
  const admin = users.find(u => u.id === adminId);

  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  const initialLength = users.length;
  const updatedUsers = users.filter(u => u.id !== targetUserId);

  if (updatedUsers.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }

  await writeUsers(updatedUsers);
  res.json({ success: true });
});

apiRouter.post('/admin/users/:userId/validate', async (req, res) => {
  const adminId = req.headers['x-admin-id'];
  const targetUserId = req.params.userId;
  
  const users = await readUsers();
  const admin = users.find(u => u.id === adminId);

  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  const index = users.findIndex(u => u.id === targetUserId);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index].isActive = true;
  delete users[index].validationCode;
  await writeUsers(users);

  res.json({ success: true });
});

apiRouter.post('/request-recovery', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const users = await readUsers();
  const index = users.findIndex(u => u.email === email);

  if (index === -1) return res.status(404).json({ error: 'Email not found' });

  const recoveryCode = generateCode();
  users[index].recoveryCode = recoveryCode;
  await writeUsers(users);

  await sendEmail(
    email,
    'Sodor Academy - Account Recovery 🛡️',
    `Hello!\n\nYou requested a recovery code for your Sodor Academy account. Please use this 6-digit code to reset your PIN:\n\n${recoveryCode}\n\nIf you did not request this, you can safely ignore this email.`,
    `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 20px;">
        <h2 style="color: #1e40af;">Account Recovery 🛡️</h2>
        <p>Hello!</p>
        <p>You requested a recovery code for your Sodor Academy account. Please use this 6-digit code to reset your PIN:</p>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e40af;">${recoveryCode}</span>
        </div>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `
  );

  res.json({ success: true });
});

apiRouter.post('/reset-pin', async (req, res) => {
  const { email, code, newPin } = req.body;
  if (!email || !code || !newPin) return res.status(400).json({ error: 'Email, code, and new PIN required' });

  const users = await readUsers();
  const index = users.findIndex(u => u.email === email);

  if (index === -1) return res.status(404).json({ error: 'User not found' });
  if (users[index].recoveryCode !== code) return res.status(400).json({ error: 'Invalid recovery code' });

  const hashedPin = await bcrypt.hash(newPin, 10);
  users[index].pin = hashedPin;
  delete users[index].recoveryCode;
  await writeUsers(users);

  res.json({ success: true });
});

apiRouter.post('/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  const { stats } = req.body;
  const users = await readUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) return res.status(404).json({ error: 'User not found' });

  users[index].stats = stats;
  await writeUsers(users);
  res.json({ success: true });
});

apiRouter.post('/change-pin', async (req, res) => {
  const { userId, newPin } = req.body;
  if (!userId || !newPin) return res.status(400).json({ error: 'User ID and new PIN required' });

  const users = await readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const hashedPin = await bcrypt.hash(newPin, 10);
  users[index].pin = hashedPin;
  await writeUsers(users);
  res.json({ success: true });
});

apiRouter.post('/change-name', async (req, res) => {
  const { userId, newName } = req.body;
  if (!userId || !newName) return res.status(400).json({ error: 'User ID and new name required' });

  const users = await readUsers();
  if (users.find(u => u.name === newName && u.id !== userId)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  users[index].name = newName;
  await writeUsers(users);
  res.json({ success: true });
});

apiRouter.delete('/account/:userId', async (req, res) => {
  const { userId } = req.params;
  let users = await readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId);

  if (users.length === initialLength) return res.status(404).json({ error: 'User not found' });

  await writeUsers(users);
  res.json({ success: true });
});

apiRouter.post('/import', async (req, res) => {
  const { userData } = req.body;
  if (!userData || !userData.name || !userData.pin || !userData.stats) {
    return res.status(400).json({ error: 'Invalid user data format' });
  }

  const users = await readUsers();
  const existingIndex = users.findIndex(u => u.name === userData.name);

  // If the pin is not already hashed, hash it
  const isHashed = userData.pin.startsWith('$2a$') || userData.pin.startsWith('$2b$') || userData.pin.startsWith('$2y$');
  const finalUserData = { ...userData };
  if (!isHashed) {
    finalUserData.pin = await bcrypt.hash(userData.pin, 10);
  }

  if (existingIndex !== -1) {
    users[existingIndex] = finalUserData;
  } else {
    users.push(finalUserData);
  }

  await writeUsers(users);
  res.status(200).json({ user: { id: finalUserData.id, name: finalUserData.name, stats: finalUserData.stats } });
});

// Mount the API router on the base path
app.use(`${BASE_PATH}/api`, apiRouter);

// --- Static Files ---

// Serve static files from the 'dist' directory under the base path
app.use(BASE_PATH, express.static(path.join(__dirname, 'dist')));

// Serve the media folder under the base path
app.use(`${BASE_PATH}/media`, express.static(path.join(__dirname, 'media')));

// For any other request to the base path, serve the index.html from 'dist'
app.get(`${BASE_PATH}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Redirect root to base path
app.get('/', (req, res) => {
  res.redirect(BASE_PATH);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}${BASE_PATH} to view your app.`);
});
