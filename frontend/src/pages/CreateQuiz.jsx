import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  IcoHeadphones, IcoSpotify, IcoLink, IcoCheck,
  IcoMusic, IcoInfo, IcoPen, IcoSpin,
} from '../components/icons';

const SONG_GOAL = 80;

const QUESTIONS = [
  'Issız bir adaya hangi sanatçıyı götürürdün?',
  'Kişiliğini en iyi hangi şarkı anlatır?',
  'Asla sıkılmadan dinlediğin şarkı hangisi?',
  'Hayatının geri kalanında yalnızca bir albüm dinleyecek olsan hangisi olurdu?',
  'Hangi sanatçının konseri için dünyanın öbür ucuna giderdin?',
];

function isValidPersonalAnswer(value) {
  const text = String(value || '').trim();
  return text.length >= 2 && /[\p{L}\p{N}]/u.test(text);
}

function PersonalQuestionsModal({ answers, setAnswers, onClose }) {
  const answeredCount = answers.filter(isValidPersonalAnswer).length;
  const allAnswered = answeredCount === 5;

  return (
    <div className="cq-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cq-modal">
        <div className="cq-modal-header">
          <div className="cq-modal-title">
            Kişisel Sorular
            <span className="cq-modal-badge">{answeredCount}/5 yanıtlandı</span>
          </div>
          <button className="cq-modal-close" onClick={onClose}>x</button>
        </div>

        <div className="cq-modal-body">
          <div className="cq-modal-hint">
            <IcoInfo />
            Yalnızca kendi cevabını yazıyorsun. Sistem, arkadaşlarının seçebileceği
            alternatif seçenekleri otomatik oluşturacak.
          </div>

          {QUESTIONS.map((q, i) => (
            <div key={q} className="cq-q-card">
              <div className="cq-q-meta">
                <div className="cq-q-num">{i + 1}</div>
                <div className="cq-q-text">{q}</div>
                <div className={`cq-q-check ${isValidPersonalAnswer(answers[i]) ? 'done' : 'empty'}`}>
                  {isValidPersonalAnswer(answers[i]) && <IcoCheck size={12} />}
                </div>
              </div>
              <input
                className="cq-q-input"
                placeholder="Cevabın..."
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
              />
            </div>
          ))}
        </div>

        <div className="cq-modal-footer">
          <button className="cq-modal-save-btn" onClick={onClose}>
            {allAnswered
              ? <><IcoCheck size={14} /> Tamamlandı - Kapat</>
              : <>Kaydet ({answeredCount}/5)</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessOverlay({ shareUrl, quizSlug, visibility }) {
  const navigate            = useNavigate();
  const [copied, setCopied] = useState(false);
  const isPublic            = visibility === 'public';

  function copyLink() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="cq-success-overlay">
      <div className="cq-success-card">
        <div className="cq-success-icon"><IcoCheck size={30} /></div>
        <h2>Quiz Oluşturuldu! 🎉</h2>
        <p>
          {isPublic
            ? 'Quizin ana sayfada görünecek ve herkese açık olacak.'
            : 'Quizin gizli — yalnızca link ile erişilebilir.'}
        </p>

        {shareUrl && (
          <div style={{
            display: 'flex', gap: 8, marginBottom: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 10, padding: '8px 10px',
            alignItems: 'center',
          }}>
            <span style={{ flex: 1, fontSize: 11, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </span>
          </div>
        )}

        <button className="cq-success-share" onClick={copyLink} style={{ marginBottom: 10, width: '100%' }}>
          {copied ? '✓ Kopyalandı!' : 'Linki Kopyala'}
        </button>

        {quizSlug && (
          <button
            onClick={() => navigate(`/quiz/${quizSlug}`)}
            style={{
              width: '100%', padding: '10px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100, cursor: 'pointer',
              color: 'var(--text)', fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: 13,
              marginBottom: 8, transition: 'all .18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            Quizimi Gör →
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '10px',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--text2)',
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13,
          }}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
}

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [spConnected, setSpConnected] = useState(false);
  const [spUser, setSpUser] = useState(null);
  const [source, setSource] = useState('spotify');
  const [playlists, setPlaylists] = useState([]);
  const [plInput, setPlInput] = useState('');
  const [plLoading, setPlLoading] = useState(false);
  const [plError, setPlError] = useState('');
  const [answers, setAnswers] = useState(Array(5).fill(''));
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [shareUrl, setShareUrl]   = useState(null);
  const [quizSlug, setQuizSlug]   = useState(null);
  const [visibility, setVisibility] = useState('public');

  useEffect(() => {
    if (user === null) navigate('/');
  }, [user, navigate]);

  async function authHeaders() {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    if (!user) return;

    async function loadSpotifySession() {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/auth/spotify/session', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setSpConnected(!!data.connected);
        setSpUser(data.connected
          ? { name: data.name, songCount: data.songCount, playlists: data.playlists }
          : null);
        if (data.connected) {
          window.dispatchEvent(new Event('spotify-profile-updated'));
        }
      } catch {}
    }

    loadSpotifySession();
    if (params.get('spotify') || params.get('spotify_error')) {
      navigate('/create-quiz', { replace: true });
    }
  }, [user, params, navigate]);

  const songCount = source === 'spotify' && spConnected
    ? spUser?.songCount || 0
    : playlists.reduce((s, p) => s + p.count, 0);

  const pct = Math.min((songCount / SONG_GOAL) * 100, 100);
  const barState = pct < 40 ? 'red' : pct < 80 ? 'yellow' : 'green';
  const songColor = barState === 'red' ? 'var(--red)' : barState === 'yellow' ? 'var(--amber)' : 'var(--green)';
  const statusText = { red: 'Daha fazla şarkı gerekiyor', yellow: 'Neredeyse tamam!', green: 'Hazır' }[barState];
  const answeredCount = answers.filter(isValidPersonalAnswer).length;
  const allAnswered = answeredCount === 5;
  const enoughSongs = songCount >= SONG_GOAL;
  const canCreate = allAnswered && enoughSongs;

  async function connectSpotify() {
    try {
      const res = await fetch('/api/auth/spotify/start', {
        method: 'POST',
        headers: await authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Spotify bağlantısı başlatılamadı');
      window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    }
  }

  function disconnectSpotify() {
    setSpConnected(false);
    setSpUser(null);
  }

  async function addPlaylist() {
    if (!plInput.trim()) return;
    setPlLoading(true);
    setPlError('');
    try {
      const res = await fetch('/api/playlists/resolve', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ url: plInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Playlist yüklenemedi');
      const trackCount = Number(data.trackCount ?? data.count ?? data.songCount ?? 0);
      if (!trackCount) {
        throw new Error('Playlist adı bulundu ama okunabilir şarkı çekilemedi');
      }
      setPlaylists((prev) => {
        if (prev.some((pl) => pl.id === data.id)) return prev;
        return [...prev, { id: data.id, name: data.name, count: trackCount }];
      });
      setPlInput('');
    } catch (err) {
      setPlError(err.message || 'Playlist eklenemedi');
    } finally {
      setPlLoading(false);
    }
  }

  function removePlaylist(id) {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }

  async function createQuiz() {
    if (!canCreate || creating) return;
    setCreating(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
          source,
          spotifyConnected: spConnected,
          playlistIds: playlists.map((p) => p.id),
          personalAnswers: answers.map((answer) => answer.trim()),
          visibility,
          ownerName: user.displayName || user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quiz oluşturulamadı');
      setShareUrl(data.shareUrl);
      setQuizSlug(data.slug);
    } catch (err) {
      alert('Quiz oluşturulurken hata: ' + err.message);
    } finally {
      setCreating(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div
        className="cq-shell"
        style={shareUrl ? { filter: 'blur(2px)', pointerEvents: 'none', transition: 'filter .3s' } : {}}
      >
        <div className="cq-topbar">
          <div className="cq-topbar-icon"><IcoHeadphones /></div>
          <div className="cq-topbar-text">
            <h1>Müzik Quizini Oluştur</h1>
            <p>Arkadaşlarının müzik zevkini ne kadar iyi bildiğini test et</p>
          </div>
          <div className="cq-info-pills">
            <div className="cq-pill cq-pill-green">
              <IcoMusic style={{ width: 10, height: 10 }} /> 15 otomatik
            </div>
            <div className="cq-pill cq-pill-amber">5 kişisel</div>
          </div>
        </div>

        <div className="cq-grid">
          <div className="cq-card">
            <div className="cq-card-label">Veri Kaynağı</div>
            <div className="cq-source-opts">
              <div
                className={`cq-src-opt ${source === 'spotify' ? 'sel' : ''}`}
                onClick={() => setSource('spotify')}
              >
                <div className="cq-src-icon"><IcoSpotify /></div>
                <div className="cq-src-info">
                  <div className="cq-src-title">
                    {spConnected ? '✓ Spotify Bağlandı' : 'Spotify ile Bağlan'}
                  </div>
                  <div className="cq-src-desc">
                    {spConnected && spUser
                      ? `${spUser.songCount} şarkı · ${spUser.playlists} playlist`
                      : 'Beğenilen şarkılar ve dinleme geçmişi'}
                  </div>
                </div>
                <div className="cq-src-radio"><div className="cq-src-radio-dot" /></div>
              </div>

              <div
                className={`cq-src-opt ${source === 'playlist' ? 'sel' : ''}`}
                onClick={() => setSource('playlist')}
              >
                <div className="cq-src-icon"><IcoLink /></div>
                <div className="cq-src-info">
                  <div className="cq-src-title">Playlist Bağlantısı</div>
                  <div className="cq-src-desc">Herkese açık playlistleri manuel ekle</div>
                </div>
                <div className="cq-src-radio"><div className="cq-src-radio-dot" /></div>
              </div>
            </div>

            <div className={`cq-spotify-area ${source !== 'spotify' ? 'hidden' : ''}`}>
              {!spConnected ? (
                <button className="cq-sp-btn" onClick={connectSpotify}>
                  <IcoSpotify />
                  Spotify Hesabını Bağla
                </button>
              ) : (
                <>
                  <button className="cq-sp-btn connected" onClick={disconnectSpotify}>
                    <IcoCheck size={12} /> Spotify'a Bağlandı
                  </button>
                  {spUser && (
                    <div className="cq-sp-connected-info">
                      <div className="cq-sp-avatar">♪</div>
                      <div>
                        <div className="cq-sp-name">{spUser.name}</div>
                        <div className="cq-sp-sub">
                          {spUser.songCount} beğenilen şarkı · {spUser.playlists} playlist
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={`cq-pl-area ${source !== 'playlist' ? 'hidden' : ''}`}>
              <div className="cq-pl-input-row">
                <input
                  className="cq-pl-input"
                  placeholder="Spotify playlistlerini yapıştır"
                  value={plInput}
                  onChange={(e) => setPlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlaylist()}
                />
                <button
                  className="cq-pl-add-btn"
                  onClick={addPlaylist}
                  disabled={!plInput.trim() || plLoading}
                >
                  {plLoading ? '...' : 'Ekle'}
                </button>
              </div>
              {plError && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 7 }}>{plError}</div>}
              {playlists.length > 0 && (
                <div className="cq-chips">
                  {playlists.map((pl) => (
                    <div className="cq-chip" key={pl.id}>
                      <span className="cq-chip-name">{pl.name}</span>
                      <span className="cq-chip-count">{pl.count}</span>
                      <button className="cq-chip-rm" onClick={() => removePlaylist(pl.id)}>x</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="cq-card">
            <div className="cq-card-label">Durum</div>
            <div className="cq-prog-inner">
              <div className="cq-prog-songs">
                <div className="cq-prog-songs-num" style={{ color: songColor }}>
                  {songCount}
                </div>
                <div className="cq-prog-songs-meta">
                  <div className="cq-prog-songs-goal">/ {SONG_GOAL} şarkı</div>
                  <div className="cq-prog-songs-label">toplanan şarkılar</div>
                </div>
              </div>

              <div>
                <div className="cq-prog-track">
                  <div className={`cq-prog-fill ${barState}`} style={{ width: `${pct}%` }} />
                </div>
                <div className={`cq-prog-status ${barState}`} style={{ marginTop: 5 }}>
                  {statusText}
                </div>
              </div>

              <div className="cq-prog-divider" />

              <div className="cq-prog-q-row">
                <div className="cq-prog-q-label">Kişisel sorular {answeredCount}/5</div>
                <div className="cq-prog-q-dots">
                  {answers.map((a, i) => (
                    <div key={i} className={`cq-q-dot ${isValidPersonalAnswer(a) ? 'done' : ''}`}>
                      {isValidPersonalAnswer(a) && <IcoCheck size={9} />}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`cq-open-modal-btn ${allAnswered ? 'all-done' : ''}`}
                onClick={() => setModalOpen(true)}
              >
                <IcoPen />
                {allAnswered
                  ? 'Tüm sorular yanıtlandı'
                  : `Kişisel soruları doldur (${answeredCount}/5)`}
              </button>
            </div>
          </div>
        </div>

        <div className="cq-info-strip">
          <div className="cq-info-block">
            <div className="cq-info-block-num" style={{ color: 'var(--green)' }}>15</div>
            <div>
              <div className="cq-info-block-title">Otomatik sorular</div>
              <div className="cq-info-block-sub">Müzik verilerinden oluşturulur</div>
            </div>
          </div>
          <div className="cq-info-block">
            <div className="cq-info-block-num" style={{ color: 'var(--amber)' }}>5</div>
            <div>
              <div className="cq-info-block-title">Kişisel sorular</div>
              <div className="cq-info-block-sub">Yalnızca sen bilirsin</div>
            </div>
          </div>
          <div className="cq-info-block">
            <div className="cq-info-block-num">20</div>
            <div>
              <div className="cq-info-block-title">Toplam soru</div>
              <div className="cq-info-block-sub">Quizde toplamda</div>
            </div>
          </div>
        </div>

        <div className="cq-vis-row">
          <div
            className={`cq-vis-opt ${visibility === 'public' ? 'sel' : ''}`}
            onClick={() => setVisibility('public')}
          >
            <span className="cq-vis-icon">○</span>
            <div className="cq-vis-info">
              <div className="cq-vis-title">Herkese Açık</div>
              <div className="cq-vis-desc">Ana sayfada görünür</div>
            </div>
            <div className="cq-vis-radio"><div className="cq-vis-radio-dot" /></div>
          </div>
          <div
            className={`cq-vis-opt ${visibility === 'link_only' ? 'sel' : ''}`}
            onClick={() => setVisibility('link_only')}
          >
            <span className="cq-vis-icon">↗</span>
            <div className="cq-vis-info">
              <div className="cq-vis-title">Yalnızca Link ile</div>
              <div className="cq-vis-desc">Gizli, link ile erişilir</div>
            </div>
            <div className="cq-vis-radio"><div className="cq-vis-radio-dot" /></div>
          </div>
        </div>

        <div className="cq-bottom-bar">
          <div className="cq-req-chips">
            <div className={`cq-req-chip ${enoughSongs ? 'met' : 'unmet'}`}>
              {enoughSongs ? <IcoCheck size={11} /> : <span>○</span>}
              {enoughSongs ? `${songCount} şarkı` : `${songCount}/${SONG_GOAL} şarkı`}
            </div>
            <div className={`cq-req-chip ${allAnswered ? 'met' : 'unmet'}`}>
              {allAnswered ? <IcoCheck size={11} /> : <span>○</span>}
              {allAnswered ? '5/5 soru' : `${answeredCount}/5 soru`}
            </div>
          </div>
          <button
            className={`cq-cta-btn ${canCreate ? 'enabled' : 'disabled'}`}
            onClick={createQuiz}
            disabled={!canCreate || creating}
          >
            {creating ? <IcoSpin /> : <IcoMusic />}
            {creating ? 'Oluşturuluyor...' : 'Quiz Oluştur'}
          </button>
        </div>
      </div>

      {modalOpen && (
        <PersonalQuestionsModal
          answers={answers}
          setAnswers={setAnswers}
          onClose={() => setModalOpen(false)}
        />
      )}

      {shareUrl && (
        <SuccessOverlay shareUrl={shareUrl} quizSlug={quizSlug} visibility={visibility} />
      )}
    </>
  );
}
