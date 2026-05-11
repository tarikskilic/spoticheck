import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import WaveBars from '../components/WaveBars';

const COLORS = ['#7c5cbf', '#c7527a', '#d97d25', '#2a9db5', '#3a8f5c', '#b54a4a', '#6b7cc4', '#c45bb0'];
const RANGE_LABELS = {
  short_term: '4 hafta',
  medium_term: '6 ay',
  long_term: 'Uzun donem',
};

function strColor(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--r)',
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardLabel({ children }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--text3)',
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function RangeTabs({ value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: 4,
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.035)',
      flexShrink: 0,
    }}>
      {Object.entries(RANGE_LABELS).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '6px 10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: value === key ? '#000' : 'var(--text2)',
            background: value === key ? 'var(--green)' : 'transparent',
            transition: 'all .18s',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function RankRow({ rank, image, name, sub, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{
        fontFamily: 'var(--font-head)',
        fontWeight: 700,
        fontSize: 12,
        color: rank <= 3 ? color : 'var(--text3)',
        minWidth: 28,
        textAlign: 'right',
      }}>
        #{rank}
      </span>

      {image ? (
        <img src={image} alt={name} style={{
          width: 40,
          height: 40,
          borderRadius: sub ? 6 : '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: 40,
          height: 40,
          borderRadius: sub ? 6 : '50%',
          background: `${color}33`,
          border: `1px solid ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize: 16,
          flexShrink: 0,
        }}>
          ♪
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('medium_term');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    async function loadProfile() {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/auth/spotify/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.connected) setProfile(data.profile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, navigate]);

  const color = strColor(user?.displayName || user?.email || '');
  const initials = (user?.displayName || user?.email || '?').slice(0, 1).toUpperCase();
  const personality = profile?.personality || {};
  const mood = profile?.mood || {};
  const listeningTime = profile?.listeningTime || {};
  const songPersona = profile?.songPersona || {};
  const loyalArtists = profile?.loyalArtists || [];
  const tracksAreSpotifyTop = profile?.topTracksSource === 'spotify_top';
  const artistsAreSpotifyTop = profile?.topArtistsSource === 'spotify_top';
  const displayedArtists = profile?.topArtistsByRange?.[range] || profile?.topArtists || [];
  const displayedTracks = profile?.topTracksByRange?.[range] || profile?.topTracks || [];
  const likedTracks = profile?.likedTracks || (
    profile?.topTracksSource === 'liked_recent' ? profile?.topTracks || [] : []
  );

  async function refreshSpotifyProfile() {
    if (!user || refreshing) return;
    setRefreshing(true);
    try {
      const token = await user.getIdToken();

      /* Önce token yenilemeyi dene */
      const res  = await fetch('/api/auth/spotify/profile/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache:  'no-store',
      });
      const data = await res.json();

      /* Refresh token yoksa → direkt Spotify'a yönlendir (dialog yok) */
      if (res.status === 409 && data.needsReconnect) {
        const startRes = await fetch('/api/auth/spotify/start', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ returnTo: '/profile' }),
        });
        const startData = await startRes.json();
        if (!startRes.ok) throw new Error(startData.error || 'Spotify bağlantısı başlatılamadı');
        window.location.href = startData.url;
        return;
      }

      if (!res.ok) throw new Error(data.error || 'Spotify profili yenilenemedi');
      if (data.connected && data.profile) setProfile(data.profile);
    } catch (err) {
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 140, color: 'var(--text3)' }}>
          Yukleniyor...
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '140px 24px 0',
          gap: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24 }}>
            Muzik profilin yok
          </div>
          <div style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 360, lineHeight: 1.6 }}>
            Spotify hesabini baglayarak muzik istatistiklerini gor.
          </div>
          <button
            onClick={() => navigate('/create-quiz')}
            style={{
              padding: '12px 28px',
              background: 'var(--green)',
              border: 'none',
              borderRadius: 100,
              cursor: 'pointer',
              color: '#000',
              fontFamily: 'var(--font-body)',
              fontWeight: 800,
              fontSize: 14,
              boxShadow: '0 4px 20px rgba(29,185,84,.3)',
            }}
          >
            + Quiz Olustur ve Spotify Bagla
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '96px 16px 48px' }}>
        <Card style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.displayName || 'Spotify profil'}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${color}88`,
                boxShadow: `0 0 28px ${color}44`,
                flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: `radial-gradient(135deg, ${color}cc, ${color}44)`,
              border: `2px solid ${color}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
              fontSize: 28,
              color: '#fff',
              flexShrink: 0,
            }}>
              {initials}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24 }}>
              {user?.displayName || 'Kullanici'}
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>Spotify Bagli</span>
              <span>-</span>
              <span>{profile.displayName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={refreshSpotifyProfile}
              disabled={refreshing}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                border: '1px solid rgba(29,185,84,.24)',
                background: 'rgba(29,185,84,.1)',
                color: 'var(--green)',
                cursor: refreshing ? 'wait' : 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {refreshing ? 'Yenileniyor...' : 'Spotify Verilerini Yenile'}
            </button>
            <div style={{
              padding: '6px 14px',
              borderRadius: 100,
              background: 'var(--green-d)',
              border: '1px solid rgba(29,185,84,.2)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--green)',
            }}>
              ♪ {(profile.songCount || 0).toLocaleString('tr-TR')} sarki
            </div>
            <div style={{
              padding: '6px 14px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text2)',
            }}>
              {profile.playlistCount || 0} playlist
            </div>
          </div>
        </Card>

        {personality.label && (
          <Card style={{ marginBottom: 12, textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: 46, marginBottom: 10 }}>{personality.emoji || '♪'}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 26, color: 'var(--green)', marginBottom: 6 }}>
              {personality.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              {profile.dominantGenre ? `Baskin tur: ${profile.dominantGenre}` : 'Genis muzik zevki'}
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 12 }}>
          <Card>
            <CardLabel>Ruh Hali Analizi</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: 'rgba(29,185,84,.12)',
                border: '1px solid rgba(29,185,84,.24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green)',
                fontSize: 24,
              }}>
                ♪
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--green)' }}>
                  {mood.label || 'Karisik Mod'}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4, lineHeight: 1.45 }}>
                  {mood.tone || 'Farkli turler arasinda gezen genis bir zevk'}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardLabel>Dinleme Zamanı Profili</CardLabel>
            {listeningTime.total > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: 'rgba(245,158,11,.12)',
                  border: '1px solid rgba(245,158,11,.24)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--amber)', fontSize: 24, flexShrink: 0,
                }}>◷</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--amber)' }}>
                    {listeningTime.label}
                  </div>
                  <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4, lineHeight: 1.45 }}>
                    {listeningTime.tone}
                  </div>
                  {listeningTime.window && (
                    <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 8, fontWeight: 700 }}>
                      {listeningTime.window} · {listeningTime.total} dinleme
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.55 }}>
                  Bu veri için Spotify son dinlenenleri gerekiyor.
                  Profili yenileyerek aktif et.
                </div>
                <button
                  onClick={refreshSpotifyProfile}
                  disabled={refreshing}
                  style={{
                    padding: '8px 16px', borderRadius: 100,
                    border: '1px solid rgba(245,158,11,.3)',
                    background: 'rgba(245,158,11,.1)',
                    color: 'var(--amber)',
                    cursor: refreshing ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
                    alignSelf: 'flex-start',
                  }}
                >
                  {refreshing ? 'Yenileniyor…' : '↻ Spotify Verilerini Yenile'}
                </button>
              </div>
            )}
          </Card>

          <Card>
            <CardLabel>Sadik Oldugun Sanatcilar</CardLabel>
            {loyalArtists.length === 0 ? (
              <div style={{ color: 'var(--text3)', fontSize: 13 }}>Veri yok</div>
            ) : (
              loyalArtists.slice(0, 5).map((artist, i) => (
                <div key={artist.name || i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '9px 0',
                  borderBottom: i < Math.min(loyalArtists.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ minWidth: 0, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    #{i + 1} {artist.name}
                  </span>
                  <span style={{
                    color: 'var(--amber)',
                    background: 'rgba(245,158,11,.1)',
                    border: '1px solid rgba(245,158,11,.2)',
                    borderRadius: 999,
                    padding: '4px 9px',
                    fontSize: 11,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                  }}>
                    {artist.count ? `${artist.count} sarki` : 'one cikan'}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Card>
            <CardLabel>{artistsAreSpotifyTop ? 'En Cok Dinledigin Sanatcilar' : 'Begenilerinde One Cikan Sanatcilar'}</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WaveBars count={4} color="var(--green)" height={18} active />
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                  {artistsAreSpotifyTop ? RANGE_LABELS[range] : 'Begenilen sarkilardan'}
                </span>
              </div>
              {artistsAreSpotifyTop && <RangeTabs value={range} onChange={setRange} />}
            </div>
            {displayedArtists.length === 0 ? (
              <div style={{ color: 'var(--text3)', fontSize: 13 }}>Veri yok</div>
            ) : (
              displayedArtists.slice(0, 5).map((artist, i) => (
                <RankRow
                  key={artist.id || artist.name || i}
                  rank={i + 1}
                  image={artist.image}
                  name={artist.name}
                  color="var(--green)"
                />
              ))
            )}
          </Card>

          <Card>
            <CardLabel>{tracksAreSpotifyTop ? 'En Cok Dinledigin Sarkilar' : 'Son Begendigin Sarkilar'}</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WaveBars count={4} color="var(--amber)" height={18} active />
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                  {tracksAreSpotifyTop ? RANGE_LABELS[range] : 'Spotify begenilerinden'}
                </span>
              </div>
              {tracksAreSpotifyTop && <RangeTabs value={range} onChange={setRange} />}
            </div>
            {displayedTracks.length === 0 ? (
              <div style={{ color: 'var(--text3)', fontSize: 13 }}>Veri yok</div>
            ) : (
              displayedTracks.slice(0, 5).map((track, i) => (
                <RankRow
                  key={track.id || track.name || i}
                  rank={i + 1}
                  image={track.image}
                  name={track.name}
                  sub={track.artist}
                  color="var(--amber)"
                />
              ))
            )}
          </Card>
        </div>

        <Card style={{ marginBottom: 12 }}>
          <CardLabel>Son Begendigin Sarkilar</CardLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <WaveBars count={4} color="var(--amber)" height={18} active />
            <span style={{ fontSize: 11, color: 'var(--text2)' }}>
              Spotify begenilerinden
            </span>
          </div>
          {likedTracks.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: 13 }}>
              Profili yenileyince son begenilerin burada gorunecek.
            </div>
          ) : (
            likedTracks.slice(0, 5).map((track, i) => (
              <RankRow
                key={track.id || track.name || i}
                rank={i + 1}
                image={track.image}
                name={track.name}
                sub={track.artist}
                color="var(--amber)"
              />
            ))
          )}
        </Card>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text2)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 0',
            transition: 'color .18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; }}
        >
          ← Ana Sayfaya Don
        </button>
      </div>
    </>
  );
}
