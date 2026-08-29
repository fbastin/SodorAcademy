import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

class Mutex {
  constructor() {
    this.queue = Promise.resolve();
  }
  lock() {
    let unlockNext;
    const willLock = new Promise(resolve => unlockNext = resolve);
    const willUnlock = this.queue.then(() => unlockNext);
    this.queue = this.queue.then(() => willLock);
    return willUnlock;
  }
}
const dbMutex = new Mutex();

async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Invalid DB format");
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    console.error("Database corruption detected:", error);
    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

async function updateUsers(callback) {
  const unlock = await dbMutex.lock();
  try {
    const users = await readUsers();
    await callback(users);
    await writeUsers(users);
  } finally {
    unlock();
  }
}

// --- API Routes ---

const apiRouter = express.Router();

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  const userId = req.params.userId || req.body.userId;
  
  if (!token) return res.status(401).json({ error: 'Authentication token required' });
  
  readUsers().then(users => {
    const user = users.find(u => u.token === token);
    if (!user) return res.status(401).json({ error: 'Invalid or expired token' });
    if (userId && user.id !== userId && !user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to modify this user' });
    }
    req.user = user;
    next();
  }).catch(err => res.status(500).json({ error: 'Database Error' }));
}

apiRouter.post('/register', async (req, res) => {
  const { name, pin, email } = req.body;
  if (!name || !pin || !email) return res.status(400).json({ error: 'Name, PIN, and Email required' });

  try {
    const hashedPin = await bcrypt.hash(pin, 10);
    let newUser = null;
    await updateUsers(async (users) => {
      if (users.find(u => u.name === name)) {
        throw new Error('Username already exists');
      }

      const validationCode = generateCode();
      const validationExpires = Date.now() + 15 * 60 * 1000;
      const token = generateToken();
      
      newUser = {
        id: Date.now().toString(),
        name,
        email,
        pin: hashedPin,
        isActive: false,
        validationCode,
        validationExpires,
        token,
        stats: {
          score: 0,
          completedLessons: 0,
          enginesCollected: [],
          videosUnlocked: ['welcome'],
          currentGrade: 'Primary'
        }
      };
      users.push(newUser);
    });

    console.log(`[REGISTRATION] New user: ${name}, Email: ${email}`);

    await sendEmail(
      email,
      'Welcome to Sodor Academy! 🚂',
      `Hello ${name}!\n\nWelcome to Sodor Academy. To start your journey, please use this 6-digit validation code:\n\n${newUser.validationCode}\n\nThis code will expire in 15 minutes.\n\nAll aboard!`,
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 20px;">
          <h2 style="color: #1e40af;">Welcome to Sodor Academy! 🚂</h2>
          <p>Hello <strong>${name}</strong>!</p>
          <p>Welcome to Sodor Academy. To start your journey, please use this 6-digit validation code:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e40af;">${newUser.validationCode}</span>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>All aboard!</p>
        </div>
      `
    );

    res.status(201).json({ 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        stats: newUser.stats, 
        isActive: newUser.isActive,
        isAdmin: newUser.isAdmin || false,
        token: newUser.token
      } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/validate-email', async (req, res) => {
  const { name, email, code } = req.body;
  if (!name || !email || !code) return res.status(400).json({ error: 'Name, Email, and code required' });

  try {
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.name === name && u.email === email);
      if (index === -1) throw new Error('User not found');
      if (users[index].validationCode !== code) throw new Error('Invalid validation code');
      if (Date.now() > users[index].validationExpires) throw new Error('Validation code expired');

      users[index].isActive = true;
      delete users[index].validationCode;
      delete users[index].validationExpires;
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/login', async (req, res) => {
  const { name, pin } = req.body;
  let loggedInUser = null;

  try {
    const currentUsers = await readUsers();
    const userToAuth = currentUsers.find(u => u.name === name);
    if (!userToAuth || !(await bcrypt.compare(pin, userToAuth.pin))) {
      throw new Error('Invalid name or PIN');
    }
    if (userToAuth.isActive !== true) {
      const error = new Error('Account not validated');
      error.email = userToAuth.email;
      throw error;
    }

    await updateUsers(async (users) => {
      const user = users.find(u => u.name === name);
      if (!user) throw new Error('User not found during update');
      user.token = generateToken(); // Issue a new session token
      loggedInUser = user;
    });

    res.json({ 
      user: { 
        id: loggedInUser.id, 
        name: loggedInUser.name, 
        email: loggedInUser.email, 
        stats: loggedInUser.stats,
        isAdmin: loggedInUser.isAdmin || false,
        token: loggedInUser.token
      } 
    });
  } catch (err) {
    if (err.message === 'Account not validated') {
      res.status(403).json({ error: err.message, email: err.email });
    } else {
      res.status(401).json({ error: err.message });
    }
  }
});

// --- Admin Routes ---

apiRouter.get('/admin/users', requireAuth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  const users = await readUsers();
  const sanitizedUsers = users.map(({ pin, validationCode, validationExpires, recoveryCode, recoveryExpires, token, ...u }) => u);
  res.json({ users: sanitizedUsers });
});

apiRouter.delete('/admin/users/:userId', requireAuth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  try {
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.id === req.params.userId);
      if (index === -1) throw new Error('User not found');
      users.splice(index, 1);
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/admin/users/:userId/validate', requireAuth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  try {
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.id === req.params.userId);
      if (index === -1) throw new Error('User not found');
      users[index].isActive = true;
      delete users[index].validationCode;
      delete users[index].validationExpires;
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/request-recovery', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and Email required' });

  try {
    let recoveryCode;
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.name === name && u.email === email);
      if (index === -1) throw new Error('Account not found for this name and email');

      recoveryCode = generateCode();
      users[index].recoveryCode = recoveryCode;
      users[index].recoveryExpires = Date.now() + 15 * 60 * 1000;
    });

    await sendEmail(
      email,
      'Sodor Academy - Account Recovery 🛡️',
      `Hello ${name}!\n\nYou requested a recovery code for your Sodor Academy account. Please use this 6-digit code to reset your PIN:\n\n${recoveryCode}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 20px;">
          <h2 style="color: #1e40af;">Account Recovery 🛡️</h2>
          <p>Hello <strong>${name}</strong>!</p>
          <p>You requested a recovery code for your Sodor Academy account. Please use this 6-digit code to reset your PIN:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e40af;">${recoveryCode}</span>
          </div>
          <p>This code expires in 15 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    );

    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/reset-pin', async (req, res) => {
  const { name, email, code, newPin } = req.body;
  if (!name || !email || !code || !newPin) return res.status(400).json({ error: 'Name, Email, code, and new PIN required' });

  try {
    const hashedPin = await bcrypt.hash(newPin, 10);
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.name === name && u.email === email);
      if (index === -1) throw new Error('User not found');
      if (users[index].recoveryCode !== code) throw new Error('Invalid recovery code');
      if (Date.now() > users[index].recoveryExpires) throw new Error('Recovery code expired');

      users[index].pin = hashedPin;
      users[index].token = generateToken(); // Invalidate old sessions
      delete users[index].recoveryCode;
      delete users[index].recoveryExpires;
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/progress/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  const { stats } = req.body;
  try {
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      users[index].stats = stats;
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/change-pin', requireAuth, async (req, res) => {
  const { userId, newPin } = req.body;
  if (!userId || !newPin) return res.status(400).json({ error: 'User ID and new PIN required' });

  try {
    const hashedPin = await bcrypt.hash(newPin, 10);
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      users[index].pin = hashedPin;
      users[index].token = generateToken(); // Re-issue token to invalidate old
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/change-name', requireAuth, async (req, res) => {
  const { userId, newName } = req.body;
  if (!userId || !newName) return res.status(400).json({ error: 'User ID and new name required' });

  try {
    await updateUsers(async (users) => {
      if (users.find(u => u.name === newName && u.id !== userId)) {
        throw new Error('Username already exists');
      }
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      users[index].name = newName;
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/account/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    await updateUsers(async (users) => {
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      users.splice(index, 1);
    });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/import', async (req, res) => {
  const { userData } = req.body;
  if (!userData || !userData.name || !userData.pin || !userData.stats) {
    return res.status(400).json({ error: 'Invalid user data format' });
  }

  try {
    let finalUserData = null;
    const isHashed = typeof userData.pin === 'string' && (userData.pin.startsWith('$2a$') || userData.pin.startsWith('$2b$') || userData.pin.startsWith('$2y$'));
    const newPinHashed = isHashed ? userData.pin : await bcrypt.hash(userData.pin, 10);
    
    const currentUsers = await readUsers();
    const existingUserRead = currentUsers.find(u => u.name === userData.name);
    
    if (existingUserRead) {
      if (isHashed) {
        if (userData.pin !== existingUserRead.pin) throw new Error('Incorrect PIN for import overwrite');
      } else {
        if (!(await bcrypt.compare(userData.pin, existingUserRead.pin))) throw new Error('Incorrect PIN for import overwrite');
      }
    }

    await updateUsers(async (users) => {
      const existingIndex = users.findIndex(u => u.name === userData.name);
      
      if (existingIndex !== -1) {
        const existingUser = users[existingIndex];
        existingUser.stats = userData.stats;
        existingUser.token = generateToken(); // Reset session
        finalUserData = existingUser;
      } else {
        finalUserData = {
          name: userData.name,
          email: userData.email,
          stats: userData.stats,
          isActive: true,
          pin: newPinHashed,
          id: Date.now().toString(),
          token: generateToken()
        };
        users.push(finalUserData);
      }
    });

    res.status(200).json({ 
      user: { 
        id: finalUserData.id, 
        name: finalUserData.name, 
        stats: finalUserData.stats,
        token: finalUserData.token 
      } 
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Mount the API router on the base path
app.use(`${BASE_PATH}/api`, apiRouter);

// --- Static Files ---

// Serve the standalone piano application
app.use(`${BASE_PATH}/piano`, express.static(path.join(__dirname, 'dist-piano')));

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
