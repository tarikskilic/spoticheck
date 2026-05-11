import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSpotifyProfile() {
  const { user }              = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/auth/spotify/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!active) return;
        setProfile(data.connected ? data.profile : null);
      } catch {
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    window.addEventListener('spotify-profile-updated', loadProfile);

    return () => {
      active = false;
      window.removeEventListener('spotify-profile-updated', loadProfile);
    };
  }, [user]);

  return { profile, loading };
}
