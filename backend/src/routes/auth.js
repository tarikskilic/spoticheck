const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const spotify = require('../services/spotify');
const { db } = require('../firebase');
const { requireAuth } = require('../middleware/auth');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const STATE_SECRET = process.env.SPOTIFY_STATE_SECRET || process.env.SESSION_SECRET || 'dev-state-secret';

function signState(payload) {
  return crypto.createHmac('sha256', STATE_SECRET).update(payload).digest('base64url');
}

function makeState(uid, returnTo = '/create-quiz') {
  const payload = Buffer.from(JSON.stringify({
    uid,
    returnTo,
    nonce: crypto.randomBytes(12).toString('base64url'),
    ts: Date.now(),
  })).toString('base64url');

  return `${payload}.${signState(payload)}`;
}

function readState(state) {
  const [payload, sig] = String(state || '').split('.');
  if (!payload || !sig || signState(payload) !== sig) return null;

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!data.uid || Date.now() - data.ts > 10 * 60 * 1000) return null;
  return data;
}

router.post('/spotify/start', requireAuth, (req, res) => {
  const returnTo = req.body?.returnTo === '/profile' ? '/profile' : '/create-quiz';
  res.json({ url: spotify.getAuthUrl(makeState(req.user.uid, returnTo)) });
});

router.get('/spotify/session', requireAuth, async (req, res) => {
  const snap = await db.collection('spotifySessions').doc(req.user.uid).get();
  if (!snap.exists) return res.json({ connected: false });

  const data = snap.data();
  return res.json({
    connected: true,
    name: data.displayName || '',
    songCount: data.trackCount || 0,
    playlists: data.playlistCount || 0,
  });
});

function buildFallbackProfile(data = {}) {
  const tracks = Array.isArray(data.tracks) ? data.tracks : [];
  const loyalArtists = buildLoyalArtists(tracks);

  const topArtists = loyalArtists.map((artist) => ({
    name: artist.name,
    image: null,
    genres: [],
  }));

  const topTracks = tracks
    .filter((track) => track?.name)
    .slice(0, 5)
    .map((track) => ({
      name: track.name,
      artist: track.artist || 'Bilinmiyor',
      image: null,
    }));

  return {
    displayName: data.displayName || '',
    image: data.image || null,
    topArtists,
    topTracks,
    topArtistsByRange: {
      short_term: topArtists,
      medium_term: topArtists,
      long_term: topArtists,
    },
    topTracksByRange: {
      short_term: topTracks,
      medium_term: topTracks,
      long_term: topTracks,
    },
    topArtistsSource: 'liked_artists',
    topTracksSource: 'liked_recent',
    loyalArtists,
    mood: deriveMood({ tracks, topArtists }),
    listeningTime: deriveListeningTime(data.recentTracks || []),
    songPersona: deriveSongPersona({
      tracks,
      topTracks,
      topArtists,
      mood: deriveMood({ tracks, topArtists }),
      listeningTime: deriveListeningTime(data.recentTracks || []),
      dominantGenre: '',
    }),
    dominantGenre: '',
    personality: spotify.getPersonality(''),
    songCount: data.trackCount || tracks.length || 0,
    playlistCount: data.playlistCount || 0,
    updatedAt: new Date(),
  };
}

function buildLoyalArtists(tracks = []) {
  const counts = new Map();

  for (const track of tracks) {
    const artist = track?.artist;
    if (!artist) continue;
    counts.set(artist, (counts.get(artist) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function cleanForFirestore(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(cleanForFirestore);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cleanForFirestore(item)])
    );
  }
  return value;
}

function deriveMood({ tracks = [], topArtists = [], dominantGenre = '' }) {
  const text = [
    dominantGenre,
    ...tracks.slice(0, 80).flatMap((track) => [track?.name, track?.artist]),
    ...topArtists.flatMap((artist) => [artist?.name, ...(artist?.genres || [])]),
  ].join(' ').toLowerCase();

  const moods = [
    { label: 'Melankolik', tone: 'Duygusal ve derin bir seçki', words: ['sad', 'melanch', 'arabesk', 'blues', 'slow', 'dert', 'yalniz', 'ask', 'ayrilik'] },
    { label: 'Enerjik', tone: 'Yüksek tempo ve hareketli ruh', words: ['dance', 'edm', 'electronic', 'pop', 'party', 'club', 'enerji'] },
    { label: 'Nostaljik', tone: 'Eski tatlara sadık bir kulak', words: ['classic', 'oldies', 'nostalji', '70s', '80s', '90s', 'anatolian', 'turku'] },
    { label: 'İsyankar', tone: 'Rock, rap ve güçlü tavır', words: ['rock', 'metal', 'punk', 'rap', 'hip hop', 'grunge'] },
    { label: 'Sakin', tone: 'Yumuşak ve dengeli dinleme hali', words: ['acoustic', 'folk', 'indie', 'jazz', 'soul', 'ambient'] },
  ];

  const scored = moods
    .map((mood) => ({
      ...mood,
      score: mood.words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  return {
    label: best?.score > 0 ? best.label : 'Karışık Mod',
    tone: best?.score > 0 ? best.tone : 'Farklı türler arasında gezen geniş bir zevk',
  };
}

function deriveListeningTime(recentTracks = []) {
  const buckets = {
    night: { count: 0, label: 'Gececi Dinleyici', tone: 'Son dinlemelerin gece saatlerinde yogunlasiyor.', window: '23:00 - 05:00' },
    morning: { count: 0, label: 'Sabah Motivasyoncusu', tone: 'Gune muzikle baslamayi seviyorsun.', window: '05:00 - 11:00' },
    afternoon: { count: 0, label: 'Gun Ortasi Ritmi', tone: 'Dinleme aliskanligin oglen ve gun ortasinda canlaniyor.', window: '11:00 - 17:00' },
    evening: { count: 0, label: 'Aksam Melankoli Modu', tone: 'Aksam saatlerinde kulakliklar daha cok sende.', window: '17:00 - 23:00' },
  };

  for (const track of recentTracks) {
    if (!track?.playedAt) continue;
    const hour = Number(new Intl.DateTimeFormat('tr-TR', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/Istanbul',
    }).format(new Date(track.playedAt)));

    if (Number.isNaN(hour)) continue;
    if (hour >= 23 || hour < 5) buckets.night.count += 1;
    else if (hour < 11) buckets.morning.count += 1;
    else if (hour < 17) buckets.afternoon.count += 1;
    else buckets.evening.count += 1;
  }

  const entries = Object.entries(buckets);
  const [key, best] = entries.sort((a, b) => b[1].count - a[1].count)[0];
  const total = entries.reduce((sum, [, bucket]) => sum + bucket.count, 0);

  if (!total) {
    return {
      label: 'Dinleme Verisi Bekleniyor',
      tone: 'Spotify son dinlenenler verisi geldikce zaman profilin burada olusacak.',
      window: '',
      dominant: 'none',
      total: 0,
      buckets: Object.fromEntries(entries.map(([name, bucket]) => [name, bucket.count])),
    };
  }

  return {
    label: best.label,
    tone: best.tone,
    window: best.window,
    dominant: key,
    total,
    buckets: Object.fromEntries(entries.map(([name, bucket]) => [name, bucket.count])),
  };
}

function deriveSongPersona({ tracks = [], topTracks = [], topArtists = [], mood = {}, listeningTime = {}, dominantGenre = '' }) {
  const sourceTracks = (topTracks.length ? topTracks : tracks).filter(track => track?.name);
  const sourceArtists = [
    ...topArtists.map(artist => artist?.name),
    ...sourceTracks.map(track => track?.artist),
  ].filter(Boolean);

  const seedText = [
    dominantGenre,
    mood.label,
    listeningTime.label,
    ...sourceTracks.slice(0, 20).flatMap(track => [track.name, track.artist]),
    ...sourceArtists.slice(0, 20),
  ].join(' ').toLowerCase();

  const artist = sourceArtists[0] || 'senin ic sesin';
  const titleParts = [
    { title: 'Geceye Saklanan Nakarat', words: ['gece', 'night', 'melankolik', 'sad', 'slow', 'arabesk', 'blues'] },
    { title: 'Sabah Icin Yanan Kivilcim', words: ['sabah', 'morning', 'enerjik', 'dance', 'pop', 'party'] },
    { title: 'Kalabalikta Kendi Ritmin', words: ['rock', 'rap', 'hip hop', 'metal', 'isyankar', 'punk'] },
    { title: 'Yol Ustu Hafif Bir Sarki', words: ['indie', 'folk', 'acoustic', 'sakin', 'ambient'] },
    { title: 'Eski Bir Plaktan Yeni His', words: ['nostaljik', 'classic', '70s', '80s', '90s', 'anatolian'] },
  ];

  const match = titleParts.find(item => item.words.some(word => seedText.includes(word))) || {
    title: 'Karismayi Seven Bir Nakarat',
  };

  const tempo = seedText.includes('enerjik') || seedText.includes('dance') || seedText.includes('pop')
    ? 'yuksek tempolu'
    : seedText.includes('melankolik') || seedText.includes('slow') || seedText.includes('arabesk')
      ? 'dusuk tempolu'
      : 'orta tempolu';

  const color = listeningTime.dominant === 'night'
    ? 'gece mavisi'
    : listeningTime.dominant === 'morning'
      ? 'sabah yesili'
      : listeningTime.dominant === 'evening'
        ? 'aksam kehribari'
        : 'karisik neon';

  return {
    title: match.title,
    artist,
    subtitle: `${tempo}, ${color}`,
    line: `${mood.label || 'Karisik Mod'} ruhu ve ${listeningTime.label || 'zamansiz'} dinleme aliskanligi olan bir sarki olurdun.`,
  };
}

async function getTopByRanges(accessToken, getter) {
  const ranges = ['short_term', 'medium_term', 'long_term'];
  const result = {};

  for (const range of ranges) {
    result[range] = await getter(accessToken, range).catch((err) => {
      console.warn(`Spotify top ${range} okunamadi:`, err.message);
      return [];
    });
  }

  return result;
}

async function buildSpotifyProfileSnapshot(accessToken) {
  const profile = await spotify.getUserProfile(accessToken);
  const tracks = await spotify.getLikedTracks(accessToken);
  const playlistCount = await spotify.getPlaylistCount(accessToken).catch((err) => {
    console.warn('Spotify playlist sayisi okunamadi:', err.message);
    return 0;
  });
  const topArtistsByRange = await getTopByRanges(accessToken, spotify.getTopArtists);
  const topTracksByRange = await getTopByRanges(accessToken, spotify.getTopTracks);
  const recentTracks = await spotify.getRecentTracks(accessToken).catch((err) => {
    console.warn('Spotify son dinlenenler okunamadi:', err.message);
    return [];
  });
  const topArtists = topArtistsByRange.medium_term || [];
  const topTracks = topTracksByRange.medium_term || [];
  const allGenres = topArtists.flatMap(a => a.genres);
  const genreCounts = {};
  allGenres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
  const dominantGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0] || '';
  const personality = spotify.getPersonality(dominantGenre);
  const fallback = buildFallbackProfile({
    displayName: profile.display_name || profile.id,
    image: profile.images?.[0]?.url || null,
    tracks,
    trackCount: tracks.length,
    playlistCount,
  });
  const loyalArtists = buildLoyalArtists(tracks);
  const mood = deriveMood({ tracks, topArtists, dominantGenre });
  const listeningTime = deriveListeningTime(recentTracks);
  const songPersona = deriveSongPersona({
    tracks,
    topTracks: topTracks.length ? topTracks : fallback.topTracks,
    topArtists: topArtists.length ? topArtists : fallback.topArtists,
    mood,
    listeningTime,
    dominantGenre,
  });

  return {
    spotifyId: profile.id,
    session: {
      spotifyId: profile.id,
      displayName: profile.display_name || profile.id,
      image: profile.images?.[0]?.url || null,
      tracks,
      recentTracks,
      trackCount: tracks.length,
      playlistCount,
      savedAt: new Date(),
    },
    profile: {
      displayName: profile.display_name || profile.id,
      image: profile.images?.[0]?.url || null,
      topArtists: topArtists.length ? topArtists.slice(0, 5) : fallback.topArtists,
      topTracks: topTracks.length ? topTracks.slice(0, 5) : fallback.topTracks,
      topArtistsByRange: topArtists.length ? topArtistsByRange : fallback.topArtistsByRange,
      topTracksByRange: topTracks.length ? topTracksByRange : fallback.topTracksByRange,
      topArtistsSource: topArtists.length ? 'spotify_top' : 'liked_artists',
      topTracksSource: topTracks.length ? 'spotify_top' : 'liked_recent',
      loyalArtists,
      mood,
      listeningTime,
      songPersona,
      dominantGenre,
      personality,
      songCount: tracks.length,
      playlistCount,
      updatedAt: new Date(),
    },
  };
}

async function buildInitialSpotifySnapshot(accessToken) {
  const profile = await spotify.getUserProfile(accessToken);
  const tracks = await spotify.getLikedTracks(accessToken, 200);
  const playlistCount = await spotify.getPlaylistCount(accessToken).catch((err) => {
    console.warn('Spotify playlist sayisi okunamadi:', err.message);
    return 0;
  });

  const session = {
    spotifyId: profile.id,
    displayName: profile.display_name || profile.id,
    image: profile.images?.[0]?.url || null,
    tracks,
    recentTracks: [],
    trackCount: tracks.length,
    playlistCount,
    savedAt: new Date(),
  };

  return {
    spotifyId: profile.id,
    session,
    profile: buildFallbackProfile(session),
  };
}

router.get('/spotify/profile', requireAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();
    const savedProfile = userSnap.exists ? userSnap.data().spotifyProfile : null;

    if (savedProfile) {
      const fallbackArtistSource = (savedProfile.topArtists || []).length
        ? savedProfile.topArtists
        : (savedProfile.topTracks || [])
          .map((track) => ({ name: track.artist }))
          .filter((artist) => artist.name);
      const fallbackLoyalArtists = fallbackArtistSource
        .slice(0, 5)
        .map((artist, index) => ({
          name: artist.name,
          count: null,
          rank: index + 1,
        }));
      const normalizedProfile = {
        ...savedProfile,
        mood: savedProfile.mood || deriveMood({
          tracks: [],
          topArtists: savedProfile.topArtists || [],
          dominantGenre: savedProfile.dominantGenre || '',
        }),
        listeningTime: savedProfile.listeningTime || deriveListeningTime([]),
        songPersona: savedProfile.songPersona || deriveSongPersona({
          tracks: [],
          topTracks: savedProfile.topTracks || [],
          topArtists: savedProfile.topArtists || [],
          mood: savedProfile.mood || deriveMood({
            tracks: [],
            topArtists: savedProfile.topArtists || [],
            dominantGenre: savedProfile.dominantGenre || '',
          }),
          listeningTime: savedProfile.listeningTime || deriveListeningTime([]),
          dominantGenre: savedProfile.dominantGenre || '',
        }),
        loyalArtists: (savedProfile.loyalArtists && savedProfile.loyalArtists.length)
          ? savedProfile.loyalArtists
          : fallbackLoyalArtists,
        topArtistsByRange: savedProfile.topArtistsByRange || {
          short_term: savedProfile.topArtists || [],
          medium_term: savedProfile.topArtists || [],
          long_term: savedProfile.topArtists || [],
        },
        topTracksByRange: savedProfile.topTracksByRange || {
          short_term: savedProfile.topTracks || [],
          medium_term: savedProfile.topTracks || [],
          long_term: savedProfile.topTracks || [],
        },
        topArtistsSource: savedProfile.topArtistsSource || 'liked_artists',
        topTracksSource: savedProfile.topTracksSource || (
          (savedProfile.topTracks || []).some((track) => track?.image || track?.id)
            ? 'spotify_top'
            : 'liked_recent'
        ),
      };
      return res.json({ connected: true, profile: normalizedProfile });
    }

    const sessionSnap = await db.collection('spotifySessions').doc(req.user.uid).get();
    if (!sessionSnap.exists) return res.json({ connected: false, profile: null });

    const fallbackProfile = buildFallbackProfile(sessionSnap.data());
    await userRef.set({ spotifyProfile: fallbackProfile }, { merge: true });

    return res.json({ connected: true, profile: fallbackProfile });
  } catch (err) {
    console.error('Spotify profil okuma hatasi:', err.message);
    return res.status(500).json({ error: 'Spotify profili okunamadi' });
  }
});

router.post('/spotify/profile/refresh', requireAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();
    const refreshToken = userSnap.exists ? userSnap.data().spotifyTokens?.refreshToken : null;

    if (!refreshToken) {
      return res.status(409).json({
        error: 'Spotify profilini arka planda yenilemek icin bir kez yeniden baglanman gerekiyor',
        needsReconnect: true,
      });
    }

    const tokens = await spotify.refreshAccessToken(refreshToken);
    const snapshot = await buildSpotifyProfileSnapshot(tokens.access_token);

    await db.collection('spotifySessions').doc(req.user.uid).set(cleanForFirestore(snapshot.session));
    await userRef.set({
      spotifyProfile: cleanForFirestore(snapshot.profile),
      spotifyTokens: {
        spotifyId: snapshot.spotifyId,
        refreshToken: tokens.refresh_token || refreshToken,
        updatedAt: new Date(),
      },
    }, { merge: true });

    return res.json({ connected: true, profile: cleanForFirestore(snapshot.profile) });
  } catch (err) {
    console.error('Spotify profil yenileme hatasi:', err.message);
    return res.status(500).json({ error: 'Spotify profili yenilenemedi' });
  }
});

router.get('/spotify/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const stateData = readState(state);

  if (error || !code || !stateData) {
    return res.redirect(`${FRONTEND_URL}/create-quiz?spotify_error=true`);
  }

  try {
    const tokens = await spotify.exchangeCode(code);
    const snapshot = await buildInitialSpotifySnapshot(tokens.access_token);

    await db.collection('spotifySessions').doc(stateData.uid).set(snapshot.session);

    const spotifyTokens = {
      spotifyId: snapshot.spotifyId,
      updatedAt: new Date(),
    };
    if (tokens.refresh_token) {
      spotifyTokens.refreshToken = tokens.refresh_token;
    }

    await db.collection('users').doc(stateData.uid).set({
      spotifyProfile: snapshot.profile,
      spotifyTokens,
    }, { merge: true });

    const nextRedirectPath = stateData.returnTo === '/profile' ? '/profile?spotify=connected' : '/create-quiz?spotify=connected';
    return res.redirect(`${FRONTEND_URL}${nextRedirectPath}`);

    /* Dominant genre & kişilik */
    /* Quiz oluşturma için geçici session */
    /* Kalıcı müzik profili */
  } catch (err) {
    console.error('Spotify callback hatasi:', err.message);
    const errorRedirectPath = stateData?.returnTo === '/profile' ? '/profile?spotify_error=true' : '/create-quiz?spotify_error=true';
    return res.redirect(`${FRONTEND_URL}${errorRedirectPath}`);
  }
});

module.exports = router;
