import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import WaveBars from '../components/WaveBars';

function OwnerAvatar({ quiz, size = 64 }) {
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

function Leaderboard({ quizId, currentUserId, loading }) {
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!quizId || loading) return;
    setFetching(true);
    const q = query(
      collection(db, 'quizzes', quizId, 'scores'),
      orderBy('score', 'desc'),
      limit(10),
    );
    getDocs(q)
      .then((snap) => setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setFetching(false));
  }, [quizId, loading]);

  const rankClass = (i) => (i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '');
  const rankLabel = (i) => (i < 3 ? `#${i + 1}` : `#${i + 1}`);

  if (fetching || loading) return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 13 }}>
      Liderlik tablosu yükleniyor...
    </div>
  );

  if (entries.length === 0) return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 13 }}>
      Henüz skor yok. İlk sen ol!
    </div>
  );

  return (
    <div className="qp-lb">
      {entries.map((e, i) => (
        <div
          key={e.id}
          className={`qp-lb-row ${e.userId === currentUserId ? 'me' : ''}`}
        >
          <span className={`qp-lb-rank ${rankClass(i)}`}>{rankLabel(i)}</span>
          <span className="qp-lb-name">{e.userName || 'Kullanıcı'}</span>
          <span className="qp-lb-score">{e.score}/{e.total}</span>
          <span className="qp-lb-pct">
            {Math.round((e.score / e.total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function QuizPlay() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [step, setStep] = useState('preview');
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [questionIdx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const scoreRef = useRef(0);
  const [scoreDisp, setScoreDisp] = useState(0);
  const [copied, setCopied] = useState(false);

  async function authHeaders() {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    const q = query(
      collection(db, 'quizzes'),
      where('slug', '==', slug),
      limit(1),
    );
    getDocs(q)
      .then((snap) => {
        if (snap.empty) { setNotFound(true); return; }
        setQuiz({ id: snap.docs[0].id, ...snap.docs[0].data() });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function startQuiz() {
    if (!quiz) return;
    setLoadingQ(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/questions`, {
        headers: await authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sorular yüklenemedi');
      setQuestions(data);
      scoreRef.current = 0;
      setScoreDisp(0);
      setIdx(0);
      setSelected(null);
      setScoreSaved(false);
      setStep('playing');
    } catch (err) {
      alert(err.message || 'Sorular yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoadingQ(false);
    }
  }

  function handleAnswer(opt) {
    if (selected !== null) return;
    setSelected(opt);

    let newScore = scoreRef.current;
    if (opt.correct) {
      newScore++;
      scoreRef.current = newScore;
      setScoreDisp(newScore);
    }

    setTimeout(() => {
      const nextIdx = questionIdx + 1;
      if (nextIdx >= questions.length) {
        finishQuiz(newScore, questions.length);
      } else {
        setIdx(nextIdx);
        setSelected(null);
      }
    }, 900);
  }

  const finishQuiz = useCallback(async (finalScore, total) => {
    setStep('done');
    if (scoreSaved || !quiz || savingScore) return;
    setSavingScore(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/score`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ score: finalScore, total }),
      });
      if (!res.ok) throw new Error();
      setScoreSaved(true);
    } catch {
      setScoreSaved(true);
    } finally {
      setSavingScore(false);
    }
  }, [quiz, scoreSaved, savingScore]);

  function restart() {
    setStep('preview');
    setQuestions([]);
    setIdx(0);
    setSelected(null);
    scoreRef.current = 0;
    setScoreDisp(0);
    setScoreSaved(false);
  }

  function copyLink() {
    const url = quiz?.shareUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const color = quiz?.ownerColor || '#1DB954';
  const pct = questions.length ? (questionIdx / questions.length) * 100 : 0;
  const finalScore = scoreRef.current;
  const total = questions.length || 20;

  if (loading) return (
    <>
      <Navbar />
      <div className="qp-shell">
        <div style={{ color: 'var(--text3)', fontSize: 14, marginTop: 40 }}>Yükleniyor...</div>
      </div>
    </>
  );

  if (notFound) return (
    <>
      <Navbar />
      <div className="qp-shell">
        <div className="qp-container">
          <div className="qp-card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>
              Quiz Bulunamadı
            </div>
            <div style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>
              Bu quiz mevcut değil veya silinmiş olabilir.
            </div>
            <button className="qp-result-btn-pri" onClick={() => navigate('/')}>
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="qp-shell">
        <div className="qp-container">

          {/* Geri butonu — done ekranında zaten kendi butonları var */}
          {step !== 'done' && (
            <button
              onClick={() => step === 'playing' ? restart() : navigate('/')}
              style={{
                alignSelf: 'flex-start',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100,
                padding: '7px 16px',
                color: 'var(--text2)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all .18s',
                marginBottom: 4,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text2)'; }}
            >
              ← {step === 'playing' ? 'Quizden Çık' : 'Ana Sayfa'}
            </button>
          )}

          {step === 'preview' && (
            <div className="qp-card">
              <div className="qp-preview-owner">
                <OwnerAvatar quiz={quiz} size={64} />
                <div>
                  <div className="qp-preview-name">
                    {quiz.ownerName || 'Kullanıcı'}'nin Quizi
                  </div>
                  <div className="qp-preview-sub">
                    {quiz.genre && `${quiz.genre} · `}20 soru
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <WaveBars count={4} color={color} height={28} active />
                </div>
              </div>

              {quiz.tipSongs && quiz.tipSongs.length > 0 && (
                <div className="qp-preview-songs">
                  <div className="qp-preview-songs-hdr">İpucu şarkılar</div>
                  {quiz.tipSongs.map((s, i) => (
                    <div key={i} className="qp-preview-song">
                      <span className="qp-preview-song-num" style={{ color }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="qp-preview-song-name">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="qp-start-btn"
                onClick={startQuiz}
                disabled={loadingQ}
                style={{ background: color, boxShadow: `0 8px 32px ${color}44` }}
              >
                {loadingQ ? 'Yükleniyor...' : 'Quize Başla'}
              </button>
            </div>
          )}

          {step === 'playing' && questions.length > 0 && (
            <div className="qp-card">
              <div className="qp-prog-bar">
                <div className="qp-prog-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}88` }} />
              </div>
              <div className="qp-prog-meta">
                <span className="qp-prog-label">
                  Soru {questionIdx + 1} / {questions.length}
                </span>
                <span className="qp-prog-score" style={{ color }}>
                  Puan: {scoreDisp}
                </span>
              </div>

              <div className="qp-question">{questions[questionIdx].question}</div>

              <div className="qp-options">
                {questions[questionIdx].options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt.correct;
                  let cls = '';
                  if (selected) {
                    if (isSelected && isCorrect) cls = 'correct';
                    else if (isSelected) cls = 'wrong';
                    else if (isCorrect) cls = 'reveal';
                  }
                  return (
                    <button
                      key={i}
                      className={`qp-option ${cls}`}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!selected}
                    >
                      <span className="qp-option-ltr">
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'done' && (
            <>
              <div className="qp-card qp-result">
                <div className="qp-result-score">
                  {finalScore}/{total} Doğru
                </div>
                <div className="qp-result-msg">
                  {finalScore === total
                    ? 'Mükemmel! Onların zevkini çok iyi biliyorsun!'
                    : finalScore >= total / 2
                      ? 'Fena değil, müzik sezgin var!'
                      : 'Daha fazla dinle ve tekrar dene.'}
                </div>

                <div className="qp-share-row">
                  <input
                    className="qp-share-input"
                    readOnly
                    value={quiz.shareUrl || window.location.href}
                  />
                  <button className="qp-share-copy" onClick={copyLink}>
                    {copied ? 'Kopyalandı' : 'Linki Kopyala'}
                  </button>
                </div>

                <div className="qp-result-btns">
                  <button className="qp-result-btn-sec" onClick={restart}>
                    Tekrar Oyna
                  </button>
                  <button className="qp-result-btn-pri" onClick={() => navigate('/')}>
                    Keşfet
                  </button>
                </div>
              </div>

              <div className="qp-card">
                <div className="qp-lb-header">
                  <div className="qp-lb-title">Liderlik Tablosu</div>
                  <WaveBars count={3} color={color} height={16} active />
                </div>
                <Leaderboard
                  quizId={quiz.id}
                  currentUserId={user?.uid}
                  loading={!scoreSaved}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
