const DECOY_TRACKS = [
  { name: 'Simarik', artist: 'Tarkan' },
  { name: 'Gulumse', artist: 'Sezen Aksu' },
  { name: 'Bir Derdim Var', artist: 'Mor ve Otesi' },
  { name: 'Senden Daha Guzel', artist: 'Duman' },
  { name: 'Istanbul', artist: 'Pamela' },
  { name: 'Kac Kadeh Kirildi', artist: 'Muslum Gurses' },
  { name: 'Yalniz Cicek', artist: 'Aleyna Tilki' },
  { name: 'Ask Kirintilari', artist: 'Teoman' },
  { name: 'Bu Aksam', artist: 'Duman' },
  { name: 'Paramparca', artist: 'Teoman' },
  { name: 'Beni Kendinden Kurtar', artist: 'Perdenin Ardindakiler' },
  { name: 'Belki De', artist: 'Dedubluman' },
  { name: 'Seni Dert Etmeler', artist: 'Madrigal' },
  { name: 'Dunyadan Uzak', artist: 'Pinhani' },
  { name: 'Seni Severdim', artist: 'Manga' },
  { name: 'Yani', artist: 'Mabel Matiz' },
  { name: 'Rakkas', artist: 'Sezen Aksu' },
  { name: 'Kirmizi', artist: 'Hande Yener' },
  { name: 'Cambaz', artist: 'Mor ve Otesi' },
  { name: 'Kupa Kizi ve Sinek Valesi', artist: 'Teoman' },
  { name: 'Anlasana', artist: 'Haluk Levent' },
  { name: 'Islak Islak', artist: 'Cem Karaca' },
  { name: 'Olmasa Mektubun', artist: 'Yeni Turku' },
  { name: 'Resimdeki Gozyaslari', artist: 'Cem Karaca' },
  { name: 'Yolla', artist: 'Tarkan' },
  { name: 'Cevapsiz Sorular', artist: 'Manga' },
  { name: 'Sari Laleler', artist: 'MFO' },
  { name: 'Kendime Yalan Soyledim', artist: 'Seksendort' },
  { name: 'Sen Istanbul Kokardin', artist: 'Yalin' },
  { name: 'Shape of You', artist: 'Ed Sheeran' },
  { name: 'Blinding Lights', artist: 'The Weeknd' },
  { name: 'Dance Monkey', artist: 'Tones and I' },
  { name: 'Rockstar', artist: 'Post Malone' },
  { name: 'Sunflower', artist: 'Post Malone' },
  { name: 'Happier', artist: 'Marshmello' },
  { name: 'Bad Guy', artist: 'Billie Eilish' },
  { name: 'Old Town Road', artist: 'Lil Nas X' },
  { name: 'Someone You Loved', artist: 'Lewis Capaldi' },
  { name: 'Circles', artist: 'Post Malone' },
  { name: 'Watermelon Sugar', artist: 'Harry Styles' },
  { name: 'Dynamite', artist: 'BTS' },
  { name: 'Levitating', artist: 'Dua Lipa' },
  { name: 'Peaches', artist: 'Justin Bieber' },
  { name: 'Stay', artist: 'The Kid LAROI' },
  { name: 'Easy On Me', artist: 'Adele' },
  { name: 'Heat Waves', artist: 'Glass Animals' },
  { name: 'As It Was', artist: 'Harry Styles' },
  { name: 'About Damn Time', artist: 'Lizzo' },
  { name: 'Anti-Hero', artist: 'Taylor Swift' },
  { name: 'Unholy', artist: 'Sam Smith' },
  { name: 'Flowers', artist: 'Miley Cyrus' },
  { name: 'Cruel Summer', artist: 'Taylor Swift' },
  { name: 'Espresso', artist: 'Sabrina Carpenter' },
  { name: 'Die With A Smile', artist: 'Lady Gaga' },
  { name: 'APT.', artist: 'ROSE & Bruno Mars' },
  { name: 'Beautiful Things', artist: 'Benson Boone' },
  { name: 'Fortnight', artist: 'Taylor Swift' },
  { name: 'Lose Control', artist: 'Teddy Swims' },
  { name: 'HUMBLE.', artist: 'Kendrick Lamar' },
  { name: "God's Plan", artist: 'Drake' },
  { name: 'Redbone', artist: 'Childish Gambino' },
  { name: 'Strobe', artist: 'deadmau5' },
  { name: 'Smells Like Teen Spirit', artist: 'Nirvana' },
  { name: 'Bohemian Rhapsody', artist: 'Queen' },
  { name: 'Billie Jean', artist: 'Michael Jackson' },
  { name: 'Hotel California', artist: 'Eagles' },
  { name: 'Lose Yourself', artist: 'Eminem' },
  { name: 'Stairway to Heaven', artist: 'Led Zeppelin' },
];

const PERSONAL_QUESTIONS = [
  'Issiz ada secimi hangisi?',
  'Kisiligini en iyi anlatan secim hangisi?',
  'Ne olursa olsun gecmeyecegi secim hangisi?',
  'Hayatinin geri kalaninda dinleyecegi secim hangisi?',
  'Dunyanin obur ucuna gitmeye deger secim hangisi?',
];

const TURKISH_ARTIST_DECOYS = [
  'Tarkan', 'Sezen Aksu', 'Duman', 'Teoman', 'Mabel Matiz', 'Madrigal',
  'Dedubluman', 'Pinhani', 'Mor ve Otesi', 'Manga', 'Cem Karaca',
  'Haluk Levent', 'Yalin', 'Hande Yener', 'MFO', 'Seksendort',
  'Yeni Turku', 'Muslum Gurses', 'Kahraman Deniz', 'Pikapta Raks',
  'Mavi Gri', 'Perdenin Ardindakiler', 'Ulas Yaman', 'Emre Fel',
  'Adamlar', 'Yuksek Sadakat', 'Athena', 'Model', 'Gripin', 'Berkay',
  'Pilli Bebek', 'Pamela', 'Aleyna Tilki',
];

const TURKISH_WORD_HINTS = [
  'aksam', 'anlasana', 'ask', 'ayrilik', 'bana', 'ben', 'beni', 'bir',
  'bu', 'cambaz', 'cevapsiz', 'cicek', 'cok', 'degil', 'deniz', 'dert',
  'duman', 'dunya', 'gece', 'gel', 'gibi', 'gonul', 'gozyaslari', 'gun',
  'guzel', 'hayat', 'icimde', 'ilac', 'islak', 'istanbul', 'kac', 'kader',
  'kalp', 'kendime', 'kim', 'kirmizi', 'kizi', 'kokardin', 'kupa',
  'laleler', 'mavi', 'mektubun', 'ol', 'olmasa', 'olmaz', 'olsun',
  'paramparca', 'rakkas', 'resimdeki', 'sabah', 'sana', 'sari', 'sen',
  'sende', 'senden', 'seni', 'sev', 'sever', 'severdim', 'sorular',
  'uzak', 'yalniz', 'yalan', 'yani', 'yara', 'yaralarima', 'yol',
  'yolla', 'yollar', 'zor',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ıÄ±]/g, 'i')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trackLabel(track) {
  return `${track.name} - ${track.artist}`;
}

function trackKey(track) {
  return `${normalizeText(track.name)}|${normalizeText(track.artist)}`;
}

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isValidOptionLabel(value) {
  const text = String(value || '').trim();
  return text.length >= 2 && /[\p{L}\p{N}]/u.test(text);
}

function isKnownTurkishArtist(artist) {
  const key = normalizeText(artist);
  return TURKISH_ARTIST_DECOYS.some((name) => normalizeText(name) === key);
}

function hasTurkishSignal(track) {
  const raw = `${track?.name || ''} ${track?.artist || ''}`;
  if (/[çğıöşüÇĞİÖŞÜÃ§ÄŸÄ±Ã¶ÅŸÃ¼Ã‡ÄÄ°Ã–ÅÃœ]/.test(raw)) return true;
  if (isKnownTurkishArtist(track?.artist)) return true;

  const words = normalizeText(raw).split(' ');
  return TURKISH_WORD_HINTS.some((hint) => words.includes(hint));
}

function buildArtistProfiles(tracks) {
  const profiles = new Map();

  for (const track of tracks) {
    if (!track?.artist) continue;

    if (!profiles.has(track.artist)) {
      profiles.set(track.artist, { artist: track.artist, tracks: [], turkishVotes: 0 });
    }

    const profile = profiles.get(track.artist);
    profile.tracks.push(track);
    if (hasTurkishSignal(track)) profile.turkishVotes += 1;
  }

  return profiles;
}

function artistLooksTurkish(profile) {
  if (!profile || profile.tracks.length === 0) return false;
  return profile.turkishVotes / profile.tracks.length >= 0.5 || isKnownTurkishArtist(profile.artist);
}

function pickWrongArtists(track, tracks, count) {
  const profiles = buildArtistProfiles(tracks);
  const correctProfile = profiles.get(track.artist);
  const correctLooksTurkish = hasTurkishSignal(track) || artistLooksTurkish(correctProfile);

  const candidates = [...profiles.values()]
    .filter((profile) => profile.artist !== track.artist)
    .map((profile) => ({
      artist: profile.artist,
      sameLocale: artistLooksTurkish(profile) === correctLooksTurkish,
      songCount: profile.tracks.length,
    }));

  const sameLocale = candidates.filter((candidate) => candidate.sameLocale);
  const localeFallback = correctLooksTurkish
    ? TURKISH_ARTIST_DECOYS
        .filter((artist) => normalizeText(artist) !== normalizeText(track.artist))
        .map((artist) => ({ artist, sameLocale: true, songCount: 0 }))
    : [];

  const ordered = [
    ...pick(sameLocale, count),
    ...pick(localeFallback, count),
    ...pick(correctLooksTurkish ? [] : candidates.filter((candidate) => !candidate.sameLocale), count),
  ];

  return uniqueBy(ordered, candidate => normalizeText(candidate.artist))
    .slice(0, count)
    .map((candidate) => candidate.artist);
}

function pickDecoysForTrack(track, tracks, count) {
  const playlistKeys = new Set(tracks.map(trackKey));
  const targetLooksTurkish = hasTurkishSignal(track);
  const availableDecoys = DECOY_TRACKS.filter((decoy) => !playlistKeys.has(trackKey(decoy)));
  const matchingDecoys = availableDecoys.filter((decoy) => hasTurkishSignal(decoy) === targetLooksTurkish);
  const fallbackDecoys = targetLooksTurkish
    ? []
    : availableDecoys.filter((decoy) => hasTurkishSignal(decoy) !== targetLooksTurkish);

  return uniqueBy([
    ...pick(matchingDecoys, count),
    ...pick(fallbackDecoys, count),
  ], trackKey).slice(0, count);
}

function pickMissingSongQuestionTracks(tracks, count) {
  const uniqueTracks = uniqueBy(tracks, trackKey);
  const turkishTracks = uniqueTracks.filter(hasTurkishSignal);
  const foreignTracks = uniqueTracks.filter((track) => !hasTurkishSignal(track));
  const useTurkish = turkishTracks.length >= 3;
  const wrongPool = useTurkish ? turkishTracks : (foreignTracks.length >= 3 ? foreignTracks : uniqueTracks);

  const reference = wrongPool[0] || uniqueTracks[0];
  if (!reference) return null;

  const correct = pickDecoysForTrack(reference, tracks, 1)[0];
  const wrongs = pick(wrongPool, 3);
  if (!correct || wrongs.length < 3) return null;

  return { correct, wrongs };
}

function makeQuestion(question, options) {
  const uniqueOptions = uniqueBy(options, option => normalizeText(option.label));
  if (uniqueOptions.length < options.length) return null;

  return {
    question,
    options: shuffle(uniqueOptions),
    type: 'auto',
  };
}

function generateAutoQuestions(tracks, ownerName) {
  const questions = [];
  const uniqueTracks = uniqueBy(shuffle(tracks), trackKey);

  for (let i = 0; i < 5 && i < uniqueTracks.length; i++) {
    const correct = uniqueTracks[i];
    const wrongs = pickDecoysForTrack(correct, tracks, 3);
    if (wrongs.length < 3) continue;

    const question = makeQuestion(`${ownerName} listesindeki \u015fark\u0131lardan hangisi?`, [
      { label: trackLabel(correct), correct: true },
      ...wrongs.map((wrong) => ({ label: trackLabel(wrong), correct: false })),
    ]);
    if (question) questions.push(question);
  }

  for (let i = 5; i < 13 && i < uniqueTracks.length; i++) {
    const track = uniqueTracks[i];
    const wrongArtists = pickWrongArtists(track, tracks, 3);
    if (wrongArtists.length < 3) continue;

    const question = makeQuestion(`"${track.name}" kimin \u015fark\u0131s\u0131?`, [
      { label: track.artist, correct: true },
      ...wrongArtists.map((artist) => ({ label: artist, correct: false })),
    ]);
    if (question) questions.push(question);
  }

  for (let i = 0; i < 2; i++) {
    const missingQuestion = pickMissingSongQuestionTracks(shuffle(uniqueTracks), 3);
    if (!missingQuestion) continue;
    const { correct, wrongs } = missingQuestion;

    const question = makeQuestion(`Hangisi ${ownerName} listesinde YOK?`, [
      { label: trackLabel(correct), correct: true },
      ...wrongs.map((wrong) => ({ label: trackLabel(wrong), correct: false })),
    ]);
    if (question) questions.push(question);
  }

  return shuffle(questions).slice(0, 15);
}

function generatePersonalQuestions(personalAnswers, tracks) {
  const artists = uniqueBy(
    tracks.map(t => t.artist).filter(isValidOptionLabel),
    artist => normalizeText(artist),
  );
  const songNames = uniqueBy(
    tracks.map(t => t.name).filter(isValidOptionLabel),
    name => normalizeText(name),
  );

  return PERSONAL_QUESTIONS.map((fallbackQuestion, i) => {
    const rawAnswer = String(personalAnswers[i] || '').trim();
    const answer = isValidOptionLabel(rawAnswer)
      ? rawAnswer
      : (pick(songNames, 1)[0] || songNames[0] || artists[0] || DECOY_TRACKS[i].name);
    const answerKey = normalizeText(answer);
    const isArtist = artists.some(artist => normalizeText(artist) === answerKey);
    const isSong = songNames.some(name => normalizeText(name) === answerKey);
    let wrong;
    let question = fallbackQuestion;

    if (isArtist) {
      const others = artists.filter(artist => normalizeText(artist) !== answerKey);
      wrong = pick(others, 1)[0] || pick(TURKISH_ARTIST_DECOYS, 1)[0];
    } else if (isSong) {
      const others = songNames.filter(name => normalizeText(name) !== answerKey);
      wrong = pick(others, 1)[0] || DECOY_TRACKS[i].name;
    } else {
      const others = songNames.filter(name => normalizeText(name) !== answerKey);
      wrong = pick(others, 1)[0] || DECOY_TRACKS[i].name;
    }

    if (!isValidOptionLabel(wrong) || normalizeText(wrong) === answerKey) {
      wrong = isArtist ? 'Sezen Aksu' : 'Bir Derdim Var';
    }

    return {
      question,
      options: shuffle([
        { label: answer, correct: true },
        { label: wrong, correct: false },
      ]),
      type: 'personal',
    };
  });
}

module.exports = { generateAutoQuestions, generatePersonalQuestions, shuffle };
