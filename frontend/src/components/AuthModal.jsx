import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IcoGoogle } from './icons';

export default function AuthModal({ onClose }) {
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode]           = useState('login'); // 'login' | 'register'
  const [displayName, setName]    = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" style={{ position: 'relative' }}>
        <button className="auth-close" onClick={onClose}>✕</button>

        <h2>{mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</h2>
        <p className="auth-sub">
          {mode === 'login'
            ? 'SpotiCheck\'e giriş yap'
            : 'Hemen ücretsiz hesap oluştur'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Ad Soyad</label>
              <input
                type="text"
                placeholder="Adın"
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}
          <div className="auth-field">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
            />
          </div>
          <div className="auth-field">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Lütfen bekleyin…' : mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="auth-divider">veya</div>

        <button className="auth-btn-google" onClick={handleGoogle} disabled={loading}>
          <IcoGoogle /> Google ile devam et
        </button>

        <div className="auth-toggle">
          {mode === 'login' ? 'Hesabın yok mu?' : 'Zaten üye misin?'}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Hesap Oluştur' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </div>
  );
}
