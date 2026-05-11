require('dotenv').config();

for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']) {
  if (process.env[key]?.includes('127.0.0.1:9')) {
    delete process.env[key];
  }
}

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlists');
const quizRoutes = require('./routes/quizzes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Backend calisiyor: http://localhost:${PORT}`));
