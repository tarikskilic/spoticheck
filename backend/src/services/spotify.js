const axios = require('axios');

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI  = process.env.SPOTIFY_REDIRECT_URI;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function spotifyRequest(config, attempt = 0) {
  try {
    return await axios(config);
  } catch (err) {
    const retryAfter = Number(err.response?.headers?.['retry-after']);
    if (err.response?.status === 429 && attempt < 2) {
      const waitSeconds = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter
        : 2 + attempt * 2;
      await sleep(waitSeconds * 1000);
      return spotifyRequest(config, attempt + 1);
    }
    throw err;
  }
}

/* ── Client credentials token (public playlist erişimi için) ── */
let ccToken     = null;
let ccExpiresAt = 0;

async function getClientToken() {
  if (ccToken && Date.now() < ccExpiresAt) return ccToken;
  const res = await spotifyRequest({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
  });
  ccToken     = res.data.access_token;
  ccExpiresAt = Date.now() + res.data.expires_in * 1000 - 60_000;
  return ccToken;
}

/* ── Authorization URL ── */
function getAuthUrl(state) {
  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    response_type: 'code',
    redirect_uri:  REDIRECT_URI,
    scope:         'user-library-read playlist-read-private user-read-email user-read-private user-top-read user-read-recently-played',
    state,
    show_dialog:   'true',
  });
  return `https://accounts.spotify.com/authorize?${params}`;
}

/* ── Code → Access token ── */
async function exchangeCode(code) {
  const res = await spotifyRequest({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
  });
  return res.data; // { access_token, refresh_token, expires_in }
}

async function refreshAccessToken(refreshToken) {
  const res = await spotifyRequest({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
  });
  return res.data; // { access_token, refresh_token?, expires_in }
}

/* ── Kullanıcı profili ── */
async function getUserProfile(accessToken) {
  const res = await spotifyRequest({
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

/* ── Beğenilen şarkılar (max 500) ── */
async function getLikedTracks(accessToken, maxTracks = 500) {
  const tracks = [];
  let url = 'https://api.spotify.com/v1/me/tracks?limit=50&market=TR';

  while (url && tracks.length < maxTracks) {
    const res = await spotifyRequest({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    for (const item of res.data.items) {
      if (item.track) {
        tracks.push({
          id:     item.track.id,
          name:   item.track.name,
          artist: item.track.artists[0]?.name || 'Bilinmiyor',
          image:  item.track.album?.images?.[0]?.url || null,
        });
      }
    }
    url = tracks.length < maxTracks ? res.data.next : null;
  }
  return tracks.slice(0, maxTracks);
}

/* ── Kullanıcı playlistleri (sayı için) ── */
async function getPlaylistCount(accessToken) {
  const res = await spotifyRequest({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/playlists?limit=1',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.total;
}

/* ── Public playlist bilgisi (client credentials) ── */
async function getPlaylistInfo(playlistId) {
  const token = await getClientToken();
  const res = await spotifyRequest({
    method: 'get',
    url: `https://api.spotify.com/v1/playlists/${playlistId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
  const trackCount = res.data.tracks?.total ?? res.data.tracks?.items?.length ?? 0;
  return {
    id:         res.data.id,
    name:       res.data.name,
    trackCount,
  };
}

/* ── Public playlist track'leri ── */
async function getPlaylistTracks(playlistId) {
  const token  = await getClientToken();
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&market=TR&fields=next,items(track(id,name,artists))`;

  while (url && tracks.length < 500) {
    const res = await spotifyRequest({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    for (const item of res.data.items) {
      if (item.track) {
        tracks.push({
          id:     item.track.id,
          name:   item.track.name,
          artist: item.track.artists[0]?.name || 'Bilinmiyor',
        });
      }
    }
    url = res.data.next;
  }
  return tracks;
}

/* ── Spotify playlist URL'den ID çıkar ── */
function extractPlaylistId(url) {
  const raw = String(url || '').trim();

  try {
    const parsed = new URL(raw);
    const match = parsed.pathname.match(/\/playlist\/([a-zA-Z0-9]+)/);
    if (match) return match[1];
  } catch {}

  const match = raw.match(/playlist\/([a-zA-Z0-9]+)/) || raw.match(/^([a-zA-Z0-9]{20,})$/);
  return match ? match[1] : null;
}

/* ── Top sanatçılar ── */
async function getTopArtists(accessToken, timeRange = 'medium_term') {
  const res = await spotifyRequest({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/top/artists',
    headers: { Authorization: `Bearer ${accessToken}` },
    params:  { limit: 10, time_range: timeRange },
  });
  return res.data.items.map(a => ({
    id:     a.id || null,
    name:   a.name || 'Bilinmiyor',
    genres: Array.isArray(a.genres) ? a.genres.filter(Boolean) : [],
    image:  a.images?.[0]?.url || null,
  }));
}

/* ── Top şarkılar ── */
async function getTopTracks(accessToken, timeRange = 'medium_term') {
  const res = await spotifyRequest({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: { Authorization: `Bearer ${accessToken}` },
    params:  { limit: 10, time_range: timeRange },
  });
  return res.data.items.map(t => ({
    id:     t.id || null,
    name:   t.name || '',
    artist: t.artists[0]?.name || 'Bilinmiyor',
    image:  t.album?.images?.[0]?.url || null,
  }));
}

/* ── Müzik kişiliği ── */
async function getRecentTracks(accessToken) {
  const res = await spotifyRequest({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/player/recently-played',
    headers: { Authorization: `Bearer ${accessToken}` },
    params:  { limit: 50 },
  });

  return res.data.items
    .map(item => ({
      id:       item.track?.id || '',
      name:     item.track?.name || '',
      artist:   item.track?.artists?.[0]?.name || 'Bilinmiyor',
      playedAt: item.played_at,
    }))
    .filter(track => track.playedAt);
}

function getPersonality(genre = '') {
  const g = genre.toLowerCase();
  if (g.includes('pop'))        return { label: 'Pop Fenomeni',     emoji: '🌟' };
  if (g.includes('rock'))       return { label: 'Rock Efsanesi',    emoji: '🎸' };
  if (g.includes('hip hop') || g.includes('rap')) return { label: 'Ritim Ustası', emoji: '🎤' };
  if (g.includes('electronic') || g.includes('dance')) return { label: 'Beat Avcısı', emoji: '🎛️' };
  if (g.includes('indie') || g.includes('alternative')) return { label: 'Bağımsız Ruh', emoji: '🌿' };
  if (g.includes('jazz'))       return { label: 'Caz Romantik',     emoji: '🎷' };
  if (g.includes('r&b') || g.includes('soul')) return { label: 'Soul Gezgini', emoji: '💜' };
  if (g.includes('classical'))  return { label: 'Klasik Asil',      emoji: '🎻' };
  if (g.includes('metal'))      return { label: 'Metal Savaşçısı',  emoji: '🤘' };
  if (g.includes('folk'))       return { label: 'Doğa Şairi',       emoji: '🍃' };
  if (g.includes('turkish') || g.includes('türk')) return { label: 'Türkü Ustası', emoji: '🌙' };
  return { label: 'Müzik Kaşifi', emoji: '🧭' };
}

module.exports = {
  getAuthUrl,
  exchangeCode,
  refreshAccessToken,
  getUserProfile,
  getLikedTracks,
  getPlaylistCount,
  getPlaylistInfo,
  getPlaylistTracks,
  extractPlaylistId,
  getTopArtists,
  getTopTracks,
  getRecentTracks,
  getPersonality,
};
