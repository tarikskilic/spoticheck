import { useEffect, useState } from 'react';

export function usePublicQuizzes(genreFilter = 'All') {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuizzes() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/quizzes/public');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Quizler yüklenemedi');

        let docs = Array.isArray(data) ? data : [];
        if (genreFilter !== 'All') {
          docs = docs.filter((d) => d.genre === genreFilter);
        }

        if (!cancelled) setQuizzes(docs);
      } catch (err) {
        if (!cancelled) {
          setError(null);
          setQuizzes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuizzes();
    return () => {
      cancelled = true;
    };
  }, [genreFilter]);

  return { quizzes, loading, error };
}
