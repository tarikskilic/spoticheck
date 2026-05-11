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
  { name: 'Yalan', artist: 'Kurban' },
  { name: 'Sorma', artist: 'Kurban' },
  { name: 'Sert', artist: 'Kurban' },
  { name: 'Elleri Ellerime', artist: 'Kurban' },
  { name: 'Beni Bos Yere Yorma', artist: 'Gripin' },
  { name: 'Durma Yagmur Durma', artist: 'Gripin' },
  { name: 'Belki Ustumuzden Bir Kus Gecer', artist: 'Yuksek Sadakat' },
  { name: 'Kafile', artist: 'Yuksek Sadakat' },
  { name: 'Bu Akşam Ölürüm', artist: 'Murat Kekilli' },
  { name: 'Resimdeki Goz Yaslari', artist: 'Cem Karaca' },
  { name: 'Tamirci Ciragi', artist: 'Cem Karaca' },
  { name: 'Sevda Cicegi', artist: 'Mor ve Otesi' },
  { name: 'Bir Derdim Var', artist: 'Mor ve Otesi' },
  { name: 'Ah', artist: 'Duman' },
  { name: 'Her Seyi Yak', artist: 'Duman' },
  { name: 'Beni Yak', artist: 'Manga' },
  { name: 'Dursun Zaman', artist: 'Manga' },
  { name: 'Papatya', artist: 'Teoman' },
  { name: 'Gemiler', artist: 'Teoman' },
  { name: 'Bir', artist: 'Pentagram' },
  { name: 'Sonsuz', artist: 'Pentagram' },
  { name: 'Anatolia', artist: 'Pentagram' },
  { name: 'Kuzu Kuzu', artist: 'Tarkan' },
  { name: 'Kis Gunesi', artist: 'Tarkan' },
  { name: 'Firuze', artist: 'Sezen Aksu' },
  { name: 'Tukenecegiz', artist: 'Sezen Aksu' },
  { name: 'Antidepresan', artist: 'Mabel Matiz' },
  { name: 'Ask Yok Olmaktir', artist: 'Mabel Matiz' },
  { name: 'Sen Olsan Bari', artist: 'Aleyna Tilki' },
  { name: 'Sebastian', artist: 'Hande Yener' },
  { name: 'Donence', artist: 'Baris Manco' },
  { name: 'Gulpembe', artist: 'Baris Manco' },
  { name: 'Kara Toprak', artist: 'Asik Veysel' },
  { name: 'Mihriban', artist: 'Musa Eroglu' },
  { name: 'Nilüfer', artist: 'Müslüm Gürses' },
  { name: 'Affet', artist: 'Müslüm Gürses' },
  { name: 'Hatasiz Kul Olmaz', artist: 'Orhan Gencebay' },
  { name: 'Bir Teselli Ver', artist: 'Orhan Gencebay' },
  { name: 'Ben Yoruldum Hayat', artist: 'Mümin Sarikaya' },
  { name: 'Aya Benzer', artist: 'Mustafa Sandal' },
  { name: 'Araba', artist: 'Mustafa Sandal' },
  { name: 'Yanarim', artist: 'Sertab Erener' },
  { name: 'Everyway That I Can', artist: 'Sertab Erener' },
  { name: 'Vazgecmem', artist: 'Yildiz Tilbe' },
  { name: 'Delikanlim', artist: 'Yildiz Tilbe' },
  { name: 'Neyim Var Ki', artist: 'Ceza' },
  { name: 'Holocaust', artist: 'Ceza' },
  { name: 'Suspus', artist: 'Ceza' },
  { name: 'Alo', artist: 'Ezhel' },
  { name: 'Geceler', artist: 'Ezhel' },
  { name: 'AYA', artist: 'Ezhel' },
  { name: 'Ben Fero', artist: 'Ben Fero' },
  { name: 'Biladerim Icin', artist: 'Ben Fero' },
  { name: 'Baneva', artist: 'Baneva' },
  { name: 'Galiba', artist: 'Sagopa Kajmer' },
  { name: 'Bir Pesimistin Gozyaslari', artist: 'Sagopa Kajmer' },
  { name: 'Neyse', artist: 'Sansar Salvo' },
  { name: 'Lose Yourself', artist: 'Eminem' },
  { name: 'Stan', artist: 'Eminem' },
  { name: 'Without Me', artist: 'Eminem' },
  { name: 'SICKO MODE', artist: 'Travis Scott' },
  { name: 'goosebumps', artist: 'Travis Scott' },
  { name: 'Alright', artist: 'Kendrick Lamar' },
  { name: 'DNA.', artist: 'Kendrick Lamar' },
  { name: 'Hotline Bling', artist: 'Drake' },
  { name: 'One Dance', artist: 'Drake' },
  { name: 'Starboy', artist: 'The Weeknd' },
  { name: 'Save Your Tears', artist: 'The Weeknd' },
  { name: 'Uptown Funk', artist: 'Mark Ronson' },
  { name: 'Get Lucky', artist: 'Daft Punk' },
  { name: 'One More Time', artist: 'Daft Punk' },
  { name: 'Titanium', artist: 'David Guetta' },
  { name: 'Memories', artist: 'David Guetta' },
  { name: 'Animals', artist: 'Martin Garrix' },
  { name: 'Scared to Be Lonely', artist: 'Martin Garrix' },
  { name: 'Wake Me Up', artist: 'Avicii' },
  { name: 'Levels', artist: 'Avicii' },
  { name: 'Faded', artist: 'Alan Walker' },
  { name: 'Alone', artist: 'Alan Walker' },
  { name: 'Clarity', artist: 'Zedd' },
  { name: 'Rather Be', artist: 'Clean Bandit' },
  { name: 'So What', artist: 'Miles Davis' },
  { name: 'Blue in Green', artist: 'Miles Davis' },
  { name: 'Take Five', artist: 'Dave Brubeck' },
  { name: 'My Favorite Things', artist: 'John Coltrane' },
  { name: 'Giant Steps', artist: 'John Coltrane' },
  { name: 'Round Midnight', artist: 'Thelonious Monk' },
  { name: 'Feeling Good', artist: 'Nina Simone' },
  { name: 'My Funny Valentine', artist: 'Chet Baker' },
  { name: 'Autumn Leaves', artist: 'Cannonball Adderley' },
  { name: 'Strange Fruit', artist: 'Billie Holiday' },
  { name: 'Take the A Train', artist: 'Duke Ellington' },
  { name: 'What a Wonderful World', artist: 'Louis Armstrong' },
  { name: 'Enter Sandman', artist: 'Metallica' },
  { name: 'Nothing Else Matters', artist: 'Metallica' },
  { name: 'Master of Puppets', artist: 'Metallica' },
  { name: 'Paranoid', artist: 'Black Sabbath' },
  { name: 'Iron Man', artist: 'Black Sabbath' },
  { name: 'Fear of the Dark', artist: 'Iron Maiden' },
  { name: 'The Trooper', artist: 'Iron Maiden' },
  { name: 'Chop Suey!', artist: 'System Of A Down' },
  { name: 'Toxicity', artist: 'System Of A Down' },
  { name: 'Numb', artist: 'Linkin Park' },
  { name: 'In the End', artist: 'Linkin Park' },
  { name: 'Everlong', artist: 'Foo Fighters' },
  { name: 'Creep', artist: 'Radiohead' },
  { name: 'Karma Police', artist: 'Radiohead' },
  { name: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
  { name: '505', artist: 'Arctic Monkeys' },
  { name: 'The Less I Know The Better', artist: 'Tame Impala' },
  { name: 'Let It Happen', artist: 'Tame Impala' },
  { name: 'Sweater Weather', artist: 'The Neighbourhood' },
  { name: 'Somebody Else', artist: 'The 1975' },
  { name: 'R U Mine?', artist: 'Arctic Monkeys' },
];

const PERSONAL_QUESTIONS = [
  '{owner} ıssız bir adaya yanında götüreceği seçim hangisi?',
  '{owner} kişiliğini en iyi anlatan seçim hangisi?',
  '{owner} ne olursa olsun sıkılmadan dinleyeceği seçim hangisi?',
  '{owner} hayatının geri kalanında dinleyeceği seçim hangisi?',
  '{owner} dünyanın öbür ucuna gitmeye değecek seçimi hangisi?',
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

const STYLE_ARTISTS = {
  rock: [
    'Duman', 'Teoman', 'Mor ve Otesi', 'Manga', 'Cem Karaca', 'Haluk Levent',
    'Pinhani', 'Seksendort', 'Yeni Turku', 'Pamela', 'Adamlar', 'Yuksek Sadakat',
    'Athena', 'Model', 'Gripin', 'Pilli Bebek', 'Nirvana', 'Queen', 'Eagles',
    'Led Zeppelin', 'Benson Boone', 'Teddy Swims', 'Kurban', 'Murat Kekilli',
    'Pentagram',
  ],
  pop: [
    'Tarkan', 'Sezen Aksu', 'Mabel Matiz', 'Hande Yener', 'Aleyna Tilki',
    'Yalin', 'Ed Sheeran', 'The Weeknd', 'Dua Lipa', 'Justin Bieber',
    'Harry Styles', 'Adele', 'Taylor Swift', 'Miley Cyrus', 'Sabrina Carpenter',
    'Lady Gaga', 'ROSE & Bruno Mars', 'BTS', 'Lizzo', 'Mustafa Sandal',
    'Sertab Erener', 'Yildiz Tilbe', 'Baris Manco', 'Mark Ronson',
  ],
  rap: [
    'Post Malone', 'Lil Nas X', 'The Kid LAROI', 'Kendrick Lamar', 'Drake',
    'Eminem', 'Childish Gambino', 'Ceza', 'Ezhel', 'Ben Fero', 'Baneva',
    'Sagopa Kajmer', 'Sansar Salvo', 'Travis Scott',
  ],
  electronic: ['Marshmello', 'deadmau5', 'Tones and I', 'Glass Animals', 'Daft Punk', 'David Guetta', 'Martin Garrix', 'Avicii', 'Alan Walker', 'Zedd', 'Clean Bandit'],
  jazz: ['Miles Davis', 'Dave Brubeck', 'John Coltrane', 'Thelonious Monk', 'Nina Simone', 'Chet Baker', 'Cannonball Adderley', 'Billie Holiday', 'Duke Ellington', 'Louis Armstrong'],
  arabesk: ['Muslum Gurses', 'Müslüm Gürses', 'Orhan Gencebay', 'Mümin Sarikaya'],
  folk: ['Asik Veysel', 'Musa Eroglu'],
  metal: ['Metallica', 'Black Sabbath', 'Iron Maiden', 'System Of A Down', 'Linkin Park'],
  alternative: ['Madrigal', 'Dedubluman', 'Perdenin Ardindakiler', 'Kahraman Deniz', 'Pikapta Raks', 'Mavi Gri', 'Emre Fel', 'Radiohead', 'Arctic Monkeys', 'Tame Impala', 'The Neighbourhood', 'The 1975', 'Foo Fighters'],
};

const STYLE_WORD_HINTS = {
  rock: ['rock', 'metal', 'gitar', 'derd', 'cambaz', 'islak', 'paramparca', 'hotel', 'bohemian', 'stairway'],
  pop: ['pop', 'dance', 'flowers', 'espresso', 'levitating', 'dynamite', 'peaches', 'yolla', 'rakkas'],
  rap: ['rap', 'hip hop', 'trap', 'rockstar', 'humble', 'lose yourself', 'god s plan'],
  electronic: ['electronic', 'edm', 'strobe', 'happier', 'heat waves', 'dance monkey'],
  jazz: ['jazz', 'blues', 'take five', 'blue in green', 'round midnight', 'autumn leaves', 'valentine'],
  arabesk: ['arabesk', 'kadeh', 'kirildi'],
  folk: ['turku', 'folk', 'kara toprak', 'mihriban'],
  metal: ['metal', 'paranoid', 'master of puppets', 'chop suey', 'toxicity'],
  alternative: ['indie', 'alternative', 'madrigal', 'dedubluman', 'pinhani', 'karma police', 'tame impala'],
};

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

function possessiveName(name) {
  const clean = String(name || '').trim() || 'Kullanıcı';
  const letters = clean.match(/\p{L}/gu) || [];
  const lastLetter = letters[letters.length - 1] || '';
  const lower = clean.toLocaleLowerCase('tr-TR');
  const vowels = lower.match(/[aeıioöuü]/g) || [];
  const lastVowel = vowels[vowels.length - 1] || 'ı';
  const suffixByVowel = {
    a: 'ın',
    ı: 'ın',
    o: 'un',
    u: 'un',
    e: 'in',
    i: 'in',
    ö: 'ün',
    ü: 'ün',
  };
  const suffix = suffixByVowel[lastVowel] || 'ın';
  const buffer = /[aeıioöuü]/i.test(lastLetter) ? 'n' : '';

  return `${clean}'${buffer}${suffix}`;
}

function ownerQuestion(template, ownerName) {
  return template.replace('{owner}', possessiveName(ownerName));
}

function smartTitleCase(value) {
  const smallWords = new Set(['ve', 'ile', 'of', 'the', 'a', 'an', 'to', 'on', 'in']);

  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .split(/(\s+|-|–|—|\/|\||&)/)
    .map((part, index) => {
      if (!part.trim() || /^(?:\s+|-|–|—|\/|\||&)$/.test(part)) return part;
      if (/^[A-ZÇĞİÖŞÜ0-9.]{2,5}$/.test(part)) return part;

      const lower = part.toLocaleLowerCase('tr-TR');
      if (index > 0 && smallWords.has(lower)) return lower;

      return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
    })
    .join('');
}

function splitAnswerPair(answer) {
  const text = String(answer || '').trim();
  const match = text.match(/^(.+?)\s*(-|–|—|\/|\|)\s*(.+)$/);
  if (!match) return null;

  return {
    first: match[1].trim(),
    separator: ` ${match[2]} `,
    second: match[3].trim(),
  };
}

function makeOptionPools(tracks) {
  const userTracks = uniqueBy(tracks, trackKey);
  const fallbackTracks = uniqueBy(DECOY_TRACKS, trackKey);
  const allTracks = uniqueBy([...userTracks, ...fallbackTracks], trackKey);
  const userArtists = uniqueBy(
    userTracks.map(t => t.artist).filter(isValidOptionLabel),
    artist => normalizeText(artist),
  );
  const userSongNames = uniqueBy(
    userTracks.map(t => t.name).filter(isValidOptionLabel),
    name => normalizeText(name),
  );
  const artists = uniqueBy(
    allTracks.map(t => t.artist).filter(isValidOptionLabel),
    artist => normalizeText(artist),
  );
  const songNames = uniqueBy(
    allTracks.map(t => t.name).filter(isValidOptionLabel),
    name => normalizeText(name),
  );

  return {
    userTracks,
    fallbackTracks,
    allTracks,
    userArtists,
    userSongNames,
    artists,
    songNames,
  };
}

function findByNormalized(values, value) {
  const key = normalizeText(value);
  return values.find(item => normalizeText(item) === key);
}

function findTrackByParts(tracks, song, artist) {
  const songKey = normalizeText(song);
  const artistKey = normalizeText(artist);
  return tracks.find(track => (
    normalizeText(track.name) === songKey &&
    normalizeText(track.artist) === artistKey
  ));
}

function formatPair(track, shape) {
  const separator = shape.separator || ' - ';
  if (shape.type === 'artistSong') return `${track.artist}${separator}${track.name}`;
  return `${track.name}${separator}${track.artist}`;
}

function formatUnknownPair(pair, type) {
  const first = smartTitleCase(pair.first);
  const second = smartTitleCase(pair.second);
  return type === 'artistSong'
    ? `${first}${pair.separator}${second}`
    : `${first}${pair.separator}${second}`;
}

function pickWrongTrack(answerKey, preferredTracks, fallbackTracks = []) {
  const preferred = uniqueBy(preferredTracks, trackKey)
    .filter(track => normalizeText(track.name) !== answerKey && trackKey(track) !== answerKey);
  const fallback = uniqueBy(fallbackTracks, trackKey)
    .filter(track => normalizeText(track.name) !== answerKey && trackKey(track) !== answerKey);

  return pick(preferred, 1)[0] || pick(fallback, 1)[0] || DECOY_TRACKS[0];
}

function detectAnswerShape(rawAnswer, pools) {
  const answer = String(rawAnswer || '').trim();
  const answerKey = normalizeText(answer);
  const pair = splitAnswerPair(answer);

  if (pair) {
    const firstAsSong = findByNormalized(pools.songNames, pair.first);
    const firstAsArtist = findByNormalized(pools.artists, pair.first);
    const secondAsSong = findByNormalized(pools.songNames, pair.second);
    const secondAsArtist = findByNormalized(pools.artists, pair.second);

    if (firstAsSong && secondAsArtist) {
      const track = findTrackByParts(pools.allTracks, firstAsSong, secondAsArtist);
      return {
        type: 'songArtist',
        separator: pair.separator,
        correctLabel: track ? formatPair(track, { type: 'songArtist', separator: pair.separator }) : `${firstAsSong}${pair.separator}${secondAsArtist}`,
        answerKey: track ? trackKey(track) : normalizeText(`${firstAsSong} ${secondAsArtist}`),
      };
    }

    if (firstAsArtist && secondAsSong) {
      const track = findTrackByParts(pools.allTracks, secondAsSong, firstAsArtist);
      return {
        type: 'artistSong',
        separator: pair.separator,
        correctLabel: track ? formatPair(track, { type: 'artistSong', separator: pair.separator }) : `${firstAsArtist}${pair.separator}${secondAsSong}`,
        answerKey: track ? trackKey(track) : normalizeText(`${secondAsSong} ${firstAsArtist}`),
      };
    }

    return {
      type: 'songArtist',
      separator: pair.separator,
      correctLabel: formatUnknownPair(pair, 'songArtist'),
      answerKey,
    };
  }

  const artist = findByNormalized(pools.artists, answer);
  if (artist) {
    return {
      type: 'artist',
      correctLabel: artist,
      answerKey: normalizeText(artist),
    };
  }

  const song = findByNormalized(pools.songNames, answer);
  if (song) {
    return {
      type: 'song',
      correctLabel: song,
      answerKey: normalizeText(song),
    };
  }

  return {
    type: 'song',
    correctLabel: smartTitleCase(answer),
    answerKey,
  };
}

function pickPersonalWrongOption(shape, pools) {
  if (shape.type === 'artist') {
    const userOthers = pools.userArtists.filter(artist => normalizeText(artist) !== shape.answerKey);
    const fallbackOthers = pools.artists.filter(artist => normalizeText(artist) !== shape.answerKey);
    return pick(userOthers, 1)[0] || pick(fallbackOthers, 1)[0] || pick(TURKISH_ARTIST_DECOYS, 1)[0] || 'Sezen Aksu';
  }

  if (shape.type === 'song') {
    const userOthers = pools.userSongNames.filter(name => normalizeText(name) !== shape.answerKey);
    const fallbackOthers = pools.songNames.filter(name => normalizeText(name) !== shape.answerKey);
    return pick(userOthers, 1)[0] || pick(fallbackOthers, 1)[0] || DECOY_TRACKS[0].name;
  }

  const wrongTrack = pickWrongTrack(shape.answerKey, pools.userTracks, pools.fallbackTracks);
  return formatPair(wrongTrack, shape);
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

function styleOfTrack(track) {
  const artistKey = normalizeText(track?.artist);
  const rawKey = normalizeText(`${track?.name || ''} ${track?.artist || ''}`);

  for (const [style, artists] of Object.entries(STYLE_ARTISTS)) {
    if (artists.some((artist) => normalizeText(artist) === artistKey)) {
      return style;
    }
  }

  for (const [style, hints] of Object.entries(STYLE_WORD_HINTS)) {
    if (hints.some((hint) => rawKey.includes(normalizeText(hint)))) {
      return style;
    }
  }

  if (hasTurkishSignal(track)) return 'turkish';
  return 'mixed';
}

function styleOfArtist(artist, tracks) {
  const artistTracks = tracks.filter((track) => normalizeText(track.artist) === normalizeText(artist));
  const styleCounts = new Map();

  for (const track of artistTracks.length ? artistTracks : [{ artist, name: '' }]) {
    const style = styleOfTrack(track);
    styleCounts.set(style, (styleCounts.get(style) || 0) + 1);
  }

  return [...styleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';
}

function pickTwoCloseOneDifferent(correct, candidates, styleFn, count = 3) {
  const correctStyle = styleFn(correct);
  const uniqueCandidates = uniqueBy(candidates, (candidate) => {
    if (typeof candidate === 'string') return normalizeText(candidate);
    return trackKey(candidate);
  });
  const close = uniqueCandidates.filter((candidate) => styleFn(candidate) === correctStyle);
  const different = uniqueCandidates.filter((candidate) => styleFn(candidate) !== correctStyle);
  const picked = uniqueBy([
    ...pick(close, Math.min(2, count)),
    ...pick(different, 1),
    ...pick(close, count),
    ...pick(different, count),
    ...pick(uniqueCandidates, count),
  ], (candidate) => (typeof candidate === 'string' ? normalizeText(candidate) : trackKey(candidate)));

  return picked.slice(0, count);
}

function buildStyleProfile(tracks) {
  const counts = new Map();

  for (const track of tracks) {
    const style = styleOfTrack(track);
    counts.set(style, (counts.get(style) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([style]) => style);
}

function buildDynamicExternalDecoyPool(tracks) {
  const playlistKeys = new Set(tracks.map(trackKey));
  const availableDecoys = DECOY_TRACKS.filter((decoy) => !playlistKeys.has(trackKey(decoy)));
  const profileStyles = buildStyleProfile(tracks);
  const profileMatched = profileStyles.flatMap((style) => (
    availableDecoys.filter((decoy) => styleOfTrack(decoy) === style)
  ));
  const profileAdjacent = availableDecoys.filter((decoy) => {
    const style = styleOfTrack(decoy);
    return style !== 'mixed' && style !== 'turkish';
  });

  return uniqueBy([
    ...profileMatched,
    ...profileAdjacent,
    ...availableDecoys,
  ], trackKey);
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

function pickWrongArtists(track, tracks, count, externalDecoyPool = DECOY_TRACKS) {
  const profiles = buildArtistProfiles(tracks);
  const correctProfile = profiles.get(track.artist);
  const correctLooksTurkish = hasTurkishSignal(track) || artistLooksTurkish(correctProfile);

  const playlistCandidates = [...profiles.values()]
    .filter((profile) => profile.artist !== track.artist)
    .map((profile) => profile.artist);

  const localeFallback = correctLooksTurkish
    ? TURKISH_ARTIST_DECOYS
        .filter((artist) => normalizeText(artist) !== normalizeText(track.artist))
    : [];
  const globalFallback = externalDecoyPool
    .map((decoy) => decoy.artist)
    .filter((artist) => normalizeText(artist) !== normalizeText(track.artist));

  const candidates = uniqueBy([
    ...playlistCandidates,
    ...localeFallback,
    ...globalFallback,
  ], artist => normalizeText(artist));
  const stylePick = pickTwoCloseOneDifferent(
    track.artist,
    candidates,
    (artist) => styleOfArtist(artist, tracks),
    count,
  );
  const localePick = correctLooksTurkish
    ? candidates.filter((artist) => isKnownTurkishArtist(artist) || hasTurkishSignal({ name: '', artist }))
    : [];

  return uniqueBy([
    ...stylePick,
    ...pick(localePick, count),
    ...pick(candidates, count),
  ], candidate => normalizeText(candidate))
    .slice(0, count)
    .map((candidate) => candidate);
}

function pickDecoysForTrack(track, tracks, count, externalDecoyPool = null) {
  const playlistKeys = new Set(tracks.map(trackKey));
  const availableDecoys = (externalDecoyPool || DECOY_TRACKS)
    .filter((decoy) => !playlistKeys.has(trackKey(decoy)));
  const stylePick = pickTwoCloseOneDifferent(track, availableDecoys, styleOfTrack, count);
  const targetLooksTurkish = hasTurkishSignal(track);
  const localePick = availableDecoys.filter((decoy) => hasTurkishSignal(decoy) === targetLooksTurkish);

  return uniqueBy([
    ...stylePick,
    ...pick(localePick, count),
    ...pick(availableDecoys, count),
  ], trackKey).slice(0, count);
}

function pickMissingSongQuestionTracks(tracks, count, externalDecoyPool) {
  const uniqueTracks = uniqueBy(tracks, trackKey);
  const reference = pick(uniqueTracks, 1)[0] || uniqueTracks[0];
  if (!reference) return null;

  const correct = pickDecoysForTrack(reference, tracks, 1, externalDecoyPool)[0];
  const wrongs = correct
    ? pickTwoCloseOneDifferent(correct, uniqueTracks, styleOfTrack, count)
    : [];
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
  const owner = possessiveName(ownerName);
  const externalDecoyPool = buildDynamicExternalDecoyPool(tracks);

  for (let i = 0; i < 5 && i < uniqueTracks.length; i++) {
    const correct = uniqueTracks[i];
    const wrongs = pickDecoysForTrack(correct, tracks, 3, externalDecoyPool);
    if (wrongs.length < 3) continue;

    const question = makeQuestion(`${owner} listesindeki şarkılardan hangisi?`, [
      { label: trackLabel(correct), correct: true },
      ...wrongs.map((wrong) => ({ label: trackLabel(wrong), correct: false })),
    ]);
    if (question) questions.push(question);
  }

  for (let i = 5; i < 13 && i < uniqueTracks.length; i++) {
    const track = uniqueTracks[i];
    const wrongArtists = pickWrongArtists(track, tracks, 3, externalDecoyPool);
    if (wrongArtists.length < 3) continue;

    const question = makeQuestion(`"${track.name}" kimin \u015fark\u0131s\u0131?`, [
      { label: track.artist, correct: true },
      ...wrongArtists.map((artist) => ({ label: artist, correct: false })),
    ]);
    if (question) questions.push(question);
  }

  for (let i = 0; i < 2; i++) {
    const missingQuestion = pickMissingSongQuestionTracks(shuffle(uniqueTracks), 3, externalDecoyPool);
    if (!missingQuestion) continue;
    const { correct, wrongs } = missingQuestion;

    const question = makeQuestion(`Hangisi ${owner} listesinde YOK?`, [
      { label: trackLabel(correct), correct: true },
      ...wrongs.map((wrong) => ({ label: trackLabel(wrong), correct: false })),
    ]);
    if (question) questions.push(question);
  }

  return shuffle(questions).slice(0, 15);
}

function generatePersonalQuestions(personalAnswers, tracks, ownerName) {
  const pools = makeOptionPools(tracks);

  return PERSONAL_QUESTIONS.map((fallbackQuestion, i) => {
    const rawAnswer = String(personalAnswers[i] || '').trim();
    const fallbackAnswer = pick(pools.songNames, 1)[0] || pools.songNames[0] || pools.artists[0] || DECOY_TRACKS[i].name;
    const sourceAnswer = isValidOptionLabel(rawAnswer)
      ? rawAnswer
      : fallbackAnswer;
    const shape = detectAnswerShape(sourceAnswer, pools);
    let wrong = pickPersonalWrongOption(shape, pools);

    if (!isValidOptionLabel(wrong) || normalizeText(wrong) === normalizeText(shape.correctLabel)) {
      wrong = shape.type === 'artist' ? 'Sezen Aksu' : 'Bir Derdim Var';
    }

    return {
      question: ownerQuestion(fallbackQuestion, ownerName),
      options: shuffle([
        { label: shape.correctLabel, correct: true },
        { label: wrong, correct: false },
      ]),
      type: 'personal',
    };
  });
}

module.exports = { generateAutoQuestions, generatePersonalQuestions, shuffle };
