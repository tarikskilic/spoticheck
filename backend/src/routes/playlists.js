const express = require('express');
const router = express.Router();
const spotify = require('../services/spotify');
const { requireAuth } = require('../middleware/auth');

router.post('/resolve', requireAuth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url gerekli' });

  const playlistId = spotify.extractPlaylistId(url);
  if (!playlistId) {
    return res.status(400).json({ error: 'Geçersiz Spotify playlist linki' });
  }

  try {
    const info = await spotify.getPlaylistInfo(playlistId);
    const tracks = await spotify.getPlaylistTracks(playlistId);
    const uniqueTrackCount = new Set(tracks.map((track) => track.id).filter(Boolean)).size;

    return res.json({
      ...info,
      trackCount: uniqueTrackCount || info.trackCount || 0,
      spotifyTrackCount: info.trackCount || 0,
    });
  } catch (err) {
    console.error('Playlist cozumleme hatasi:', err.message);
    return res.status(400).json({ error: 'Playlist bulunamadı veya gizli' });
  }
});

module.exports = router;
