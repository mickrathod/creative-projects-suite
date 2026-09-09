/**
 * Interactive Song Book Data
 * Contains chords, lyrics, strumming patterns, and lead intro tabs.
 */

export const SONGS = [
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho / Tum Mere Ho',
    movie: 'Aashiqui 2 (Arijit Singh)',
    artist: 'Mithoon & Arijit Singh',
    tempoBpm: 78,
    strumPattern: '↓ - ↓ ↑ - ↑ ↓ ↑',
    introTabs: [
      { string: 3, fret: 0, note: 'G3', label: 'Intro' },
      { string: 4, fret: 0, note: 'B3', label: 'Lead' },
      { string: 4, fret: 1, note: 'C4', label: 'Lead' },
      { string: 4, fret: 3, note: 'D4', label: 'Lead' },
      { string: 5, fret: 0, note: 'E4', label: 'Lead' },
      { string: 5, fret: 2, note: 'F#4', label: 'Lead' },
      { string: 5, fret: 3, note: 'G4', label: 'Lead' },
      { string: 5, fret: 2, note: 'F#4', label: 'Lead' }
    ],
    lines: [
      { chord: 'E minor', lyric: 'Hum tere bin ab reh nahi sakte...', durationMs: 3200 },
      { chord: 'B minor', lyric: 'Tere bina kya wajood mera...', durationMs: 3200 },
      { chord: 'C major', lyric: 'Tujhse juda agar ho jaayenge...', durationMs: 3200 },
      { chord: 'D major', lyric: 'Toh khud se hi ho jaayenge judaa...', durationMs: 3400 },
      { chord: 'E minor', lyric: 'Kyunki tum hi ho...', durationMs: 2400 },
      { chord: 'A minor', lyric: 'Ab tum hi ho...', durationMs: 2400 },
      { chord: 'D major', lyric: 'Zindagi ab tum hi ho...', durationMs: 3200 },
      { chord: 'B minor', lyric: 'Chain bhi...', durationMs: 1800 },
      { chord: 'C major', lyric: 'Mera dard bhi...', durationMs: 2000 },
      { chord: 'D major', lyric: 'Meri aashiqui ab...', durationMs: 2400 },
      { chord: 'E minor', lyric: 'Tum hi ho! ❤️', durationMs: 3500 }
    ]
  },
  {
    id: 'channa-mereya',
    title: 'Channa Mereya',
    movie: 'Ae Dil Hai Mushkil',
    artist: 'Pritam & Arijit Singh',
    tempoBpm: 82,
    strumPattern: '↓ - ↓ ↑ ↓ - ↓ ↑',
    introTabs: [
      { string: 4, fret: 3, note: 'D4' },
      { string: 4, fret: 1, note: 'C4' },
      { string: 4, fret: 0, note: 'B3' },
      { string: 3, fret: 2, note: 'A3' },
      { string: 3, fret: 0, note: 'G3' }
    ],
    lines: [
      { chord: 'D major', lyric: 'Accha chalta hoon, duaon mein yaad rakhna...', durationMs: 3200 },
      { chord: 'A minor', lyric: 'Mere zikr ka zubaan pe swaad rakhna...', durationMs: 3200 },
      { chord: 'C major', lyric: 'Dil ke sandookon mein, mere acche kaam rakhna...', durationMs: 3200 },
      { chord: 'G major', lyric: 'Chithi taaron mein bhi, mera tu salaam rakhna...', durationMs: 3200 },
      { chord: 'D major', lyric: 'Andhera tera maine le liya...', durationMs: 2800 },
      { chord: 'C major', lyric: 'Mera ujla sitaara tere naam kiya...', durationMs: 2800 },
      { chord: 'G major', lyric: 'Channa mereya mereya, channa mereya mereya...', durationMs: 3600 }
    ]
  },
  {
    id: 'kal-ho-naa-ho',
    title: 'Kal Ho Naa Ho (Heartbeat)',
    movie: 'Kal Ho Naa Ho',
    artist: 'Shankar-Ehsaan-Loy & Sonu Nigam',
    tempoBpm: 80,
    strumPattern: '↓ - ↓ - ↓ ↑ ↓ ↑',
    introTabs: [
      { string: 5, fret: 0, note: 'E4' },
      { string: 5, fret: 1, note: 'F4' },
      { string: 5, fret: 3, note: 'G4' },
      { string: 5, fret: 0, note: 'E4' }
    ],
    lines: [
      { chord: 'C major', lyric: 'Har ghadi badal rahi hai roop zindagi...', durationMs: 3400 },
      { chord: 'A minor', lyric: 'Chhaanv hai kabhi, kabhi hai dhoop zindagi...', durationMs: 3400 },
      { chord: 'F major', lyric: 'Har pal yahaan, jee bhar jiyo...', durationMs: 3000 },
      { chord: 'G major', lyric: 'Jo hai samaa, kal ho naa ho...', durationMs: 3400 }
    ]
  },
  {
    id: 'pehla-nasha',
    title: 'Pehla Nasha',
    movie: 'Jo Jeeta Wohi Sikandar',
    artist: 'Jatin-Lalit & Udit Narayan',
    tempoBpm: 76,
    strumPattern: '↓ - ↓ ↑ - ↑ ↓ -',
    introTabs: [
      { string: 5, fret: 1, note: 'F4' },
      { string: 5, fret: 0, note: 'E4' },
      { string: 4, fret: 3, note: 'D4' },
      { string: 4, fret: 1, note: 'C4' }
    ],
    lines: [
      { chord: 'F major', lyric: 'Pehla nasha, pehla khumaar...', durationMs: 3200 },
      { chord: 'D minor', lyric: 'Naya pyaar hai, naya intezaar...', durationMs: 3200 },
      { chord: 'B major', lyric: 'Kar loon main kya apna haal...', durationMs: 3000 },
      { chord: 'C major', lyric: 'Aye dile beqaraar, mere dile beqaraar...', durationMs: 3400 }
    ]
  }
];
