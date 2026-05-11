import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { usePublicQuizzes } from '../hooks/useQuizzes';
import Navbar from '../components/Navbar';
import WaveBars from '../components/WaveBars';
import VinylDisc from '../components/VinylDisc';
import AuthModal from '../components/AuthModal';

/* ─── Avatar ─── */
function Avatar({ quiz, size = 56 }) {
  const color = quiz.ownerColor || '#1DB954';
  const initials = (quiz.ownerName || '?').slice(0, 1).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(135deg, ${color}cc, ${color}55)`,
      border: `2px solid ${color}66`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-head)', fontWeight: 700,
      fontSize: size * 0.36, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ─── Quiz Card ─── */
function scoreTime(entry) {
  const value = entry.completedAt;
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  return new Date(value).getTime() || 0;
}

function compactLeaderboard(entries) {
  const grouped = new Map();

  for (const entry of entries) {
    const userKey = entry.userId || String(entry.userName || '').trim().toLowerCase();
    if (!userKey) continue;

    const score = Number(entry.score) || 0;
    const total = Number(entry.total) || 0;
    const pct = total > 0 ? score / total : 0;
    const time = scoreTime(entry);
    const existing = grouped.get(userKey);
    const attempts = (existing?.attempts || 0) + 1;
    const isBetter = !existing
      || pct > existing.pct
      || (pct === existing.pct && score > existing.score)
      || (pct === existing.pct && score === existing.score && time > existing.time);

    grouped.set(userKey, {
      ...(isBetter ? entry : existing),
      score: isBetter ? score : existing.score,
      total: isBetter ? total : existing.total,
      pct: isBetter ? pct : existing.pct,
      time: isBetter ? time : existing.time,
      attempts,
    });
  }

  return [...grouped.values()]
    .sort((a, b) => b.pct - a.pct || b.score - a.score || a.attempts - b.attempts || b.time - a.time)
    .slice(0, 10);
}

function ScoreboardModal({ quiz, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const color = quiz?.ownerColor || '#1DB954';

  useEffect(() => {
    if (!quiz?.id) return;
    setLoading(true);

    const scoreQuery = query(
      collection(db, 'quizzes', quiz.id, 'scores'),
      orderBy('completedAt', 'desc'),
      limit(100),
    );

    getDocs(scoreQuery)
      .then((snap) => setEntries(compactLeaderboard(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))))
      .finally(() => setLoading(false));
  }, [quiz?.id]);

  const rankClass = (i) => (i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '');

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,.72)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="qp-card"
        style={{
          width: 'min(520px, 100%)',
          maxHeight: '82vh',
          overflow: 'auto',
          boxShadow: `0 24px 80px ${color}22, 0 20px 80px rgba(0,0,0,.55)`,
        }}
      >
        <div className="qp-lb-header">
          <div>
            <div className="qp-lb-title">Liderlik Tablosu</div>
            <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>
              {quiz.ownerName || 'Kullanıcı'} quizi
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.06)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            x
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 13 }}>
            Liderlik tablosu yükleniyor...
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 13 }}>
            Henüz skor yok. İlk sen ol!
          </div>
        ) : (
          <div className="qp-lb">
            {entries.map((entry, i) => (
              <div key={entry.id} className="qp-lb-row">
                <span className={`qp-lb-rank ${rankClass(i)}`}>#{i + 1}</span>
                <span className="qp-lb-name">{entry.userName || 'Kullanıcı'}</span>
                <span className="qp-lb-score">{entry.score}/{entry.total}</span>
                <span className="qp-lb-pct">
                  {Math.round((entry.score / entry.total) * 100)}%
                </span>
                <span className="qp-lb-attempts">{entry.attempts} deneme</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizCard({ quiz, index, onAuthRequired, onHidden, onLeaderboard }) {
  const navigate              = useNavigate();
  const { user }              = useAuth();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const color = quiz.ownerColor || '#1DB954';
  const locked = !!quiz.locked;
  const currentName = (user?.displayName || user?.email || '').trim().toLowerCase();
  const currentHandle = currentName.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const isOwner = !!user && (
    quiz.ownerId === user.uid ||
    (quiz.ownerName || '').trim().toLowerCase() === currentName ||
    (quiz.ownerHandle || '').trim().toLowerCase() === currentHandle
  );
  const scoreColor =
    quiz.avgScore >= 70 ? '#1DB954' : quiz.avgScore >= 50 ? '#f0a500' : '#e05555';

  function handlePlay() {
    if (locked) return;
    if (!user) { onAuthRequired(quiz); return; }
    setClicked(true);
    navigate(`/quiz/${quiz.slug}`);
  }

  async function hideFromHome(e) {
    e.stopPropagation();
    if (!isOwner || busy) return;
    const ok = window.confirm('Bu quiz ana sayfadan kaldirilsin mi? Link calismaya devam eder.');
    if (!ok) return;

    setBusy(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/quizzes/${quiz.id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visibility: 'link_only' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quiz guncellenemedi');
      onHidden?.(quiz.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20,
        padding: '24px 20px 20px',
        cursor: locked ? 'default' : 'pointer',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered && !locked ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered && !locked
          ? `0 20px 60px ${color}22, 0 0 0 1px ${color}33, inset 0 1px 0 rgba(255,255,255,0.08)`
          : '0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* bg glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 30% 0%, ${color}10, transparent 60%)`,
        opacity: hovered && !locked ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
      }} />

      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Avatar quiz={quiz} size={52} />
          {hovered && !locked && (
            <div style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `2px solid ${color}`,
              animation: 'pulse-ring 1s ease-out infinite', pointerEvents: 'none',
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontWeight: 700,
            fontSize: 16, color: '#f0f0f0', letterSpacing: '-0.2px',
          }}>{quiz.ownerName || 'Kullanıcı'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim, #555)', marginTop: 1 }}>
            @{quiz.ownerHandle || quiz.slug}
          </div>
        </div>
        {isOwner ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color,
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1,
              }}
              title="Quiz ayarlari"
            >
              ...
            </button>
            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 38,
                  minWidth: 190,
                  padding: 6,
                  borderRadius: 12,
                  background: '#202020',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 14px 36px rgba(0,0,0,.45)',
                  zIndex: 20,
                }}
              >
                <button
                  onClick={hideFromHome}
                  disabled={busy}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: 9,
                    padding: '10px 12px',
                    background: 'transparent',
                    color: 'var(--text)',
                    cursor: busy ? 'wait' : 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {busy ? 'Kaldiriliyor...' : 'Ana sayfadan kaldir'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <WaveBars count={4} color={color} height={22} active={hovered && !locked} />
        )}
      </div>

      {locked && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 100, padding: '3px 10px',
          fontSize: 11, fontWeight: 700, color: '#777', marginBottom: 14,
        }}>
          Gizli quiz
        </div>
      )}

      {/* genre tag */}
      {quiz.genre && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${color}18`, border: `1px solid ${color}30`,
          borderRadius: 100, padding: '3px 10px',
          fontSize: 11, fontWeight: 600, color, marginBottom: 14, letterSpacing: '0.3px',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
          {quiz.genre}
        </div>
      )}

      {/* stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 10px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ fontSize: 10, color: '#555', marginBottom: 3, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Oynanma</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-head)', color: '#f0f0f0' }}>
            {(quiz.plays || 0).toLocaleString('tr-TR')}
          </div>
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 10px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ fontSize: 10, color: '#555', marginBottom: 3, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Ort. Puan</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-head)', color: scoreColor }}>
            {quiz.avgScore || 0}%
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={(e) => { e.stopPropagation(); handlePlay(); }}
        disabled={locked}
        style={{
          width: '100%', padding: '11px',
          background: locked ? 'rgba(255,255,255,0.035)' : hovered ? `linear-gradient(135deg, var(--green), #1DB95499)` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${!locked && hovered ? 'var(--green)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, cursor: locked ? 'not-allowed' : 'pointer',
          color: locked ? '#555' : hovered ? '#000' : 'var(--text)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.3px', transition: 'all 0.2s',
          transform: clicked ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        {clicked ? 'Başlıyor…' : '▶  Quize Gir'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLeaderboard?.(quiz);
        }}
        style={{
          width: '100%',
          padding: '10px',
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          cursor: 'pointer',
          color: 'var(--text2)',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.2px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${color}55`;
          e.currentTarget.style.color = color;
          e.currentTarget.style.background = `${color}12`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'var(--text2)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
        }}
      >
        Skor Tablosu
      </button>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero({ onCreateQuiz, onPlayRandom }) {
  return (
    <section style={{
      minHeight: '88vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '100px 24px 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* bg orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(29,185,84,.18) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -200, left: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(124,92,191,0.07) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -200, right: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(199,82,122,0.07) 0%, transparent 65%)',
        }} />
      </div>

      {/* floating vinyls */}
      <div style={{
        position: 'absolute', right: '8%', top: '20%',
        opacity: 0.18, animation: 'lp-float 6s ease-in-out infinite',
      }}>
        <VinylDisc size={220} spinning />
      </div>
      <div style={{
        position: 'absolute', left: '6%', bottom: '22%',
        opacity: 0.12,
        animation: 'lp-float 8s ease-in-out infinite', animationDelay: '2s',
      }}>
        <VinylDisc size={140} spinning />
      </div>

      {/* badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.25)',
        borderRadius: 100, padding: '6px 14px',
        fontSize: 12, fontWeight: 600, color: 'var(--green)',
        marginBottom: 28,
        animation: 'fade-up 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        letterSpacing: '0.4px',
      }}>
        🎵 Müzik Quiz Sosyal Oyunu
      </div>

      <h1 style={{
        fontFamily: 'var(--font-head)', fontWeight: 800,
        fontSize: 'clamp(36px, 6vw, 72px)',
        lineHeight: 1.08, letterSpacing: '-2px',
        maxWidth: 820, color: '#ffffff',
        animation: 'fade-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
      }}>
        Arkadaşının Müzik Zevkini<br />
        <span style={{ color: 'var(--green)' }}>Ne Kadar İyi Biliyorsun?</span>
      </h1>

      <p style={{
        color: '#888', fontSize: 'clamp(15px, 2vw, 19px)',
        maxWidth: 520, lineHeight: 1.65, marginTop: 20,
        animation: 'fade-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
      }}>
        Bir profil seç ve favori şarkılarını bulmaya çalış. Hızlı. Eğlenceli. Müzikli.
      </p>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36, justifyContent: 'center',
        animation: 'fade-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
      }}>
        <button
          onClick={onCreateQuiz}
          style={{
            padding: '15px 32px', background: 'var(--green)',
            border: 'none', borderRadius: 100, cursor: 'pointer',
            color: '#000', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 16,
            boxShadow: '0 8px 36px rgba(29,185,84,.55)', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
        >
          + Kendi Quizini Oluştur
        </button>
        <button
          onClick={onPlayRandom}
          style={{
            padding: '15px 32px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, cursor: 'pointer',
            color: 'var(--text)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          ▶ Rastgele Quiz Oyna
        </button>
      </div>

      {/* scroll hint */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: '#555', fontSize: 12, fontWeight: 500,
        animation: 'fade-up 0.7s ease 1.2s both', opacity: 0.6,
      }}>
        <span>Keşfetmek için kaydır</span>
        <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
      </div>
    </section>
  );
}

/* ─── Genres ─── */
const GENRES = ['All', 'Indie / Alt', 'Pop / Dance', 'Hip-Hop / Rap', 'Jazz / Soul', 'Electronic', 'R&B / Soul', 'Rock / Grunge', 'K-Pop'];

/* ─── Main Page ─── */
export default function LandingPage() {
  const { user }                      = useAuth();
  const navigate                      = useNavigate();
  const [filter, setFilter]           = useState('All');
  const [showAuth, setShowAuth]       = useState(false);
  const [pendingQuiz, setPendingQuiz] = useState(null);
  const [hiddenQuizIds, setHiddenQuizIds] = useState([]);
  const [scoreboardQuiz, setScoreboardQuiz] = useState(null);
  const { quizzes, loading, error }   = usePublicQuizzes(filter);
  const visibleQuizzes = useMemo(
    () => quizzes.filter((quiz) => !hiddenQuizIds.includes(quiz.id)),
    [quizzes, hiddenQuizIds],
  );

  /* Giriş sonrası bekleyen quize git */
  useEffect(() => {
    if (user && pendingQuiz) {
      navigate(`/quiz/${pendingQuiz.slug}`);
      setPendingQuiz(null);
    }
  }, [user, pendingQuiz, navigate]);

  function handleAuthRequired(quiz) {
    setPendingQuiz(quiz);
    setShowAuth(true);
  }

  const handleCreateQuiz = useCallback(() => {
    if (user) navigate('/create-quiz');
    else setShowAuth(true);
  }, [user, navigate]);

  const handlePlayRandom = useCallback(() => {
    const playable = visibleQuizzes.filter((quiz) => !quiz.locked && quiz.slug);
    if (playable.length > 0) {
      const random = playable[Math.floor(Math.random() * playable.length)];
      navigate(`/quiz/${random.slug}`);
    }
  }, [visibleQuizzes, navigate]);

  return (
    <>
      <Navbar />
      <Hero onCreateQuiz={handleCreateQuiz} onPlayRandom={handlePlayRandom} />

      {/* Discovery grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 120px' }}>
        {/* Section header */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: 16, marginBottom: 32,
        }}>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: 'var(--green)',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: 8, fontFamily: 'var(--font-head)',
            }}>
              Keşfet
            </div>
            <h2 style={{
              fontFamily: 'var(--font-head)', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 38px)', letterSpacing: '-1px', color: '#f0f0f0',
            }}>
              Birini Seç ve Meydan Oku
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WaveBars count={5} color="var(--green)" height={24} active />
            <span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>
              {visibleQuizzes.length} quiz aktif
            </span>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36, paddingBottom: 4 }}>
          {GENRES.map((g) => (
            <button key={g} onClick={() => setFilter(g)} style={{
              padding: '7px 14px',
              background: filter === g ? 'var(--green)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filter === g ? 'var(--green)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 100, cursor: 'pointer',
              color: filter === g ? '#000' : '#888',
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: filter === g ? 700 : 500,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              boxShadow: filter === g ? '0 4px 16px rgba(29,185,84,.44)' : 'none',
            }}>
              {g}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#555' }}>
            Quizler yükleniyor…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--red)' }}>
            Quizler yüklenirken hata oluştu.
          </div>
        )}

        {!loading && !error && visibleQuizzes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>
              Henüz quiz yok
            </div>
            <div style={{ color: '#888', marginBottom: 24 }}>İlk oluşturan sen ol!</div>
            <button onClick={handleCreateQuiz} style={{
              padding: '13px 28px', background: 'var(--green)',
              border: 'none', borderRadius: 100,
              cursor: 'pointer', color: '#000',
              fontWeight: 700, fontFamily: 'var(--font-body)', fontSize: 15,
            }}>
              + Kendi Quizini Oluştur
            </button>
          </div>
        )}

        {!loading && !error && visibleQuizzes.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {visibleQuizzes.map((quiz, i) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                index={i}
                onAuthRequired={handleAuthRequired}
                onHidden={(id) => setHiddenQuizIds((prev) => [...prev, id])}
                onLeaderboard={setScoreboardQuiz}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating CTA */}
      <button onClick={handleCreateQuiz} style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 200,
        padding: '14px 22px',
        background: 'linear-gradient(135deg, var(--green), #1DB95499)',
        border: 'none', borderRadius: 100, cursor: 'pointer',
        color: '#000', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 14,
        boxShadow: '0 8px 32px rgba(29,185,84,.55)',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(29,185,84,.66)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(29,185,84,.55)'; }}
      >
        <span style={{ fontSize: 16 }}>+</span>
        <span>Quiz Oluştur</span>
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {scoreboardQuiz && (
        <ScoreboardModal
          quiz={scoreboardQuiz}
          onClose={() => setScoreboardQuiz(null)}
        />
      )}
    </>
  );
}
