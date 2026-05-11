const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { db } = require('../firebase');
const spotify = require('../services/spotify');
const { requireAuth } = require('../middleware/auth');
const { generateAutoQuestions, generatePersonalQuestions, shuffle } = require('../services/questionGen');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const MIN_SONGS = 80;

const OWNER_COLORS = ['#7c5cbf', '#c7527a', '#d97d25', '#2a9db5', '#3a8f5c', '#b54a4a', '#6b7cc4', '#c45bb0'];

function randomColor() {
  return OWNER_COLORS[Math.floor(Math.random() * OWNER_COLORS.length)];
}

function makeSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 24);
  return `${base || 'quiz'}-${nanoid(5)}`;
}

function makeHandle(name) {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'user';
}

function canManageQuiz(quiz, user) {
  if (quiz.ownerId === user.uid) return true;

  const userName = String(user.name || user.email || '').trim().toLowerCase();
  const userHandle = makeHandle(userName);
  const quizName = String(quiz.ownerName || '').trim().toLowerCase();
  const quizHandle = String(quiz.ownerHandle || '').trim().toLowerCase();

  return !!userName && (quizName === userName || quizHandle === userHandle);
}

function deduplicateTracks(tracks) {
  const seen = new Set();
  return tracks.filter((track) => {
    if (!track?.id || seen.has(track.id)) return false;
    seen.add(track.id);
    return true;
  });
}

function maskName(name) {
  const text = String(name || 'Kullanıcı').trim();
  if (!text) return 'K**';
  return `${text[0]}**`;
}

function isValidPersonalAnswer(value) {
  const text = String(value || '').trim();
  return text.length >= 2 && /[\p{L}\p{N}]/u.test(text);
}

router.get('/public', async (req, res) => {
  try {
    const snap = await db
      .collection('quizzes')
      .limit(50)
      .get();

    const quizzes = snap.docs
      .map((doc) => {
        const quiz = { id: doc.id, ...doc.data() };
        if (quiz.visibility !== 'public') return null;
        return { ...quiz, locked: false };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });

    return res.json(quizzes);
  } catch (err) {
    console.error('Public quiz listeleme hatasi:', err.message);
    return res.status(500).json({ error: 'Quizler yüklenemedi' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const {
    source,
    spotifyConnected,
    playlistIds = [],
    personalAnswers = [],
    visibility = 'public',
    ownerName,
  } = req.body;

  const uid = req.user.uid;
  const safeVisibility = visibility === 'link_only' ? 'link_only' : 'public';
  const safeOwnerName = ownerName || req.user.name || req.user.email || 'Kullanıcı';

  if (!Array.isArray(personalAnswers) || personalAnswers.filter(isValidPersonalAnswer).length !== 5) {
    return res.status(400).json({ error: '5 kişisel cevap gerekli' });
  }

  try {
    let tracks = [];

    if (source === 'spotify' && spotifyConnected) {
      const session = await db.collection('spotifySessions').doc(uid).get();
      if (!session.exists) {
        return res.status(400).json({ error: 'Spotify bağlantısı bulunamadı, tekrar bağla' });
      }
      tracks = session.data().tracks || [];
    }

    if (source === 'playlist' && Array.isArray(playlistIds) && playlistIds.length > 0) {
      for (const plId of new Set(playlistIds)) {
        const plTracks = await spotify.getPlaylistTracks(plId);
        tracks.push(...plTracks);
      }
    }

    tracks = deduplicateTracks(tracks);

    if (tracks.length < MIN_SONGS) {
      return res.status(400).json({
        error: `En az ${MIN_SONGS} benzersiz şarkı gerekiyor (şu an: ${tracks.length})`,
      });
    }

    const slug = makeSlug(safeOwnerName);
    const shareUrl = `${FRONTEND_URL}/quiz/${slug}`;
    const tipSongs = shuffle(tracks).slice(0, 5).map((track) => `${track.name} - ${track.artist}`);
    const ownerColor = randomColor();

    const quizData = {
      slug,
      shareUrl,
      ownerId: uid,
      ownerName: safeOwnerName,
      ownerHandle: makeHandle(safeOwnerName),
      ownerColor,
      visibility: safeVisibility,
      createdAt: new Date(),
      plays: 0,
      avgScore: 0,
      scoreCount: 0,
      songCount: tracks.length,
      tipSongs,
      tracks: tracks.slice(0, 300),
      personalAnswers: personalAnswers.map((a) => String(a).trim()).filter(isValidPersonalAnswer),
    };

    const ref = await db.collection('quizzes').add(quizData);

    if (source === 'spotify') {
      db.collection('spotifySessions').doc(uid).delete().catch(() => {});
    }

    return res.status(201).json({ id: ref.id, slug, shareUrl });
  } catch (err) {
    console.error('Quiz olusturma hatasi:', err.message);
    return res.status(500).json({ error: 'Quiz oluşturulamadı' });
  }
});

router.patch('/:id/visibility', requireAuth, async (req, res) => {
  const { id } = req.params;
  const visibility = req.body?.visibility === 'public' ? 'public' : 'link_only';

  try {
    const ref = db.collection('quizzes').doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Quiz bulunamadi' });

    const quiz = snap.data();
    if (!canManageQuiz(quiz, req.user)) {
      return res.status(403).json({ error: 'Bu quiz sana ait degil' });
    }

    await ref.update({ visibility });
    return res.json({ ok: true, visibility });
  } catch (err) {
    console.error('Quiz gorunurluk hatasi:', err.message);
    return res.status(500).json({ error: 'Quiz guncellenemedi' });
  }
});

router.get('/:id/questions', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const ref = db.collection('quizzes').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Quiz bulunamadı' });

    const quiz = doc.data();
    ref.update({ plays: (quiz.plays || 0) + 1 }).catch(() => {});

    const tracks = quiz.tracks || [];
    if (tracks.length < 10) {
      return res.status(400).json({ error: 'Yeterli şarkı verisi yok' });
    }

    const autoQ = generateAutoQuestions(tracks, quiz.ownerName);
    const personalQ = generatePersonalQuestions(quiz.personalAnswers || [], tracks);
    const questions = [...shuffle(autoQ).slice(0, 15), ...personalQ];

    if (questions.length !== 20) {
      return res.status(500).json({ error: '20 soru üretilemedi' });
    }

    return res.json(questions);
  } catch (err) {
    console.error('Soru uretme hatasi:', err.message);
    return res.status(500).json({ error: 'Sorular üretilemedi' });
  }
});

router.post('/:id/score', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { score, total } = req.body;
  const numericScore = Number(score);
  const numericTotal = Number(total);

  if (!Number.isInteger(numericScore) || !Number.isInteger(numericTotal) || numericTotal <= 0) {
    return res.status(400).json({ error: 'score ve total gerekli' });
  }

  if (numericScore < 0 || numericScore > numericTotal) {
    return res.status(400).json({ error: 'Geçersiz skor' });
  }

  try {
    const ref = db.collection('quizzes').doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Quiz bulunamadı' });

    const userName = req.user.name || req.user.email || 'Kullanıcı';
    await ref.collection('scores').add({
      userId: req.user.uid,
      userName,
      score: numericScore,
      total: numericTotal,
      completedAt: new Date(),
    });

    const data = snap.data();
    const scoreCount = data.scoreCount || 0;
    const pct = Math.round((numericScore / numericTotal) * 100);
    const avgScore = Math.round(((data.avgScore || 0) * scoreCount + pct) / (scoreCount + 1));

    await ref.update({ avgScore, scoreCount: scoreCount + 1 });
    return res.json({ avgScore });
  } catch (err) {
    console.error('Skor kaydetme hatasi:', err.message);
    return res.status(500).json({ error: 'Skor kaydedilemedi' });
  }
});

module.exports = router;
