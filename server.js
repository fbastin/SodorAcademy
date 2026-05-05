import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

const app = express();
const PORT = process.env.PORT || 3000;
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

apiRouter.post('/register', async (req, res) => {
  const { name, pin } = req.body;
  if (!name || !pin) return res.status(400).json({ error: 'Name and PIN required' });

  const users = await readUsers();
  if (users.find(u => u.name === name)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    pin,
    stats: {
      score: 0,
      completedLessons: 0,
      enginesCollected: [],
      currentGrade: 'Primary'
    }
  };

  users.push(newUser);
  await writeUsers(users);
  res.status(201).json({ user: { id: newUser.id, name: newUser.name, stats: newUser.stats } });
});

apiRouter.post('/login', async (req, res) => {
  const { name, pin } = req.body;
  const users = await readUsers();
  const user = users.find(u => u.name === name && u.pin === pin);

  if (!user) {
    return res.status(401).json({ error: 'Invalid name or PIN' });
  }

  res.json({ user: { id: user.id, name: user.name, stats: user.stats } });
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
