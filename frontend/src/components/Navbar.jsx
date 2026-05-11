import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSpotifyProfile } from '../hooks/useSpotifyProfile';
import WaveBars from './WaveBars';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const { profile: spProfile } = useSpotifyProfile();
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function handleCreateQuiz() {
    if (user) navigate('/create-quiz');
    else setShowAuth(true);
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const primaryButton = {
    padding: '11px 22px',
    background: 'var(--green)',
    border: 'none',
    borderRadius: 100,
    cursor: 'pointer',
    color: '#000',
    fontFamily: 'var(--font-body)',
    fontWeight: 800,
    fontSize: 14,
    boxShadow: '0 8px 24px rgba(29,185,84,.46)',
    transition: 'all 0.2s',
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 38px', height: 74,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,11,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <WaveBars count={3} color="var(--green)" height={26} active />
          <span style={{
            fontFamily: 'var(--font-head)', fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.5px',
          }}>
            Spoti<span style={{ color: 'var(--green)' }}>Check</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user ? (
            <>
              <button
                onClick={handleCreateQuiz}
                style={primaryButton}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                + Quiz Oluştur
              </button>

              {/* ── Müzik Profilim ── */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={() => spProfile ? navigate('/profile') : null}
                  style={{
                    padding: '9px 16px',
                    background: spProfile ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${spProfile ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 100, cursor: spProfile ? 'pointer' : 'not-allowed',
                    color: spProfile ? 'var(--green)' : 'var(--text3)',
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (spProfile) { e.currentTarget.style.background = 'rgba(29,185,84,0.18)'; e.currentTarget.style.transform = 'scale(1.04)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = spProfile ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  🎵 Müzik Profilim
                </button>
                {!spProfile && (
                  <span style={{
                    position: 'absolute', top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: 5, fontSize: 10, color: 'var(--text3)',
                    whiteSpace: 'nowrap', pointerEvents: 'none',
                  }}>
                    Spotify hesabı gerekli
                  </span>
                )}
              </div>

              <span
                style={{
                  maxWidth: 220,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'var(--text2)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
                title={user.displayName || user.email}
              >
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 100,
                  cursor: 'pointer',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '10px 16px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={primaryButton}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Giriş Yap
            </button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
