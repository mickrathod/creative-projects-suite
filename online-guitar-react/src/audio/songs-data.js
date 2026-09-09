/**
 * Interactive Song Book Data
 * Features Anuv Jain's acoustic masterpieces (Tum Mere Ho, Husn, Baarishein)
 * along with Bollywood acoustic anthems.
 */

export const SONGS = [
  {
    id: 'tum-mere-ho-anuv-jain',
    title: 'Tum Mere Ho',
    movie: 'Indie Acoustic Special',
    artist: 'Anuv Jain',
    tempoBpm: 74,
    strumPattern: '↓ - ↓ ↑ - ↑ ↓ - (Gentle Fingerstyle)',
    introTabs: [
      { string: 3, fret: 0, note: 'G3', label: 'Thumb' },
      { string: 4, fret: 0, note: 'B3', label: 'Index' },
      { string: 5, fret: 3, note: 'G4', label: 'Ring' },
      { string: 4, fret: 0, note: 'B3', label: 'Index' },
      { string: 3, fret: 2, note: 'A3', label: 'Thumb' },
      { string: 4, fret: 1, note: 'C4', label: 'Index' },
      { string: 5, fret: 0, note: 'E4', label: 'Middle' },
      { string: 4, fret: 3, note: 'D4', label: 'Ring' }
    ],
    lines: [
      { chord: 'G major', lyric: 'Tu aati hai toh aati hai bahaar...', durationMs: 3400 },
      { chord: 'E minor', lyric: 'Kahin tham si jaati hai yeh dharati saari...', durationMs: 3600 },
      { chord: 'C major', lyric: 'Main dekhta rahoon bas tera hi chehra...', durationMs: 3400 },
      { chord: 'D major', lyric: 'Kyun lagta hai mujhe ki tum mere ho...', durationMs: 3600 },
      { chord: 'G major', lyric: 'Haan tum mere ho...', durationMs: 2600 },
      { chord: 'E minor', lyric: 'Mere khwabon mein bhi bas tum rehte ho...', durationMs: 3400 },
      { chord: 'Cadd9', lyric: 'Do baatein toh karo, paas toh aao...', durationMs: 3200 },
      { chord: 'D major', lyric: 'Haan keh do na ki tum mere ho...', durationMs: 3400 },
      { chord: 'A minor', lyric: 'Yeh shaamein bhi dhalne lagi hain...', durationMs: 3000 },
      { chord: 'C major', lyric: 'Yeh raatein bhi kehne lagi hain...', durationMs: 3000 },
      { chord: 'D major', lyric: 'Kyun lagta hai mujhe ki...', durationMs: 2400 },
      { chord: 'G major', lyric: 'Tum mere ho... ❤️', durationMs: 4000 }
    ]
  },
  {
    id: 'husn-anuv-jain',
    title: 'Husn',
    movie: 'Indie Viral Acoustic',
    artist: 'Anuv Jain',
    tempoBpm: 76,
    strumPattern: '↓ - ↓ - ↑ ↓ ↑ -',
    introTabs: [
      { string: 4, fret: 1, note: 'C4' },
      { string: 3, fret: 0, note: 'G3' },
      { string: 4, fret: 3, note: 'D4' },
      { string: 5, fret: 0, note: 'E4' },
      { string: 4, fret: 1, note: 'C4' }
    ],
    lines: [
      { chord: 'C major', lyric: 'Dekho dekho kaisi baatein yahan ki...', durationMs: 3200 },
      { chord: 'A minor', lyric: 'Hone lagi hain, phisal na jaana kahin...', durationMs: 3400 },
      { chord: 'F major', lyric: 'Tu har lamha jaise mujhko behkaaye...', durationMs: 3200 },
      { chord: 'G major', lyric: 'Main toh yeh chahun ki tum mere ho...', durationMs: 3200 },
      { chord: 'C major', lyric: 'Par keh na paaoon kabhi...', durationMs: 2800 },
      { chord: 'A minor', lyric: 'Dekho dekho kaisa husn tera hai...', durationMs: 3200 },
      { chord: 'F major', lyric: 'Kahin na dekha maine aisa chehra hai...', durationMs: 3400 },
      { chord: 'G major', lyric: 'Kyun lagta hai mujhe ki tum mere ho...', durationMs: 3600 }
    ]
  },
  {
    id: 'baarishein-anuv-jain',
    title: 'Baarishein',
    movie: 'Acoustic Breakthrough',
    artist: 'Anuv Jain',
    tempoBpm: 72,
    strumPattern: '↓ - ↓ ↑ ↓ - ↓ ↑',
    introTabs: [
      { string: 3, fret: 2, note: 'A3' },
      { string: 4, fret: 0, note: 'B3' },
      { string: 4, fret: 1, note: 'C4' },
      { string: 4, fret: 3, note: 'D4' }
    ],
    lines: [
      { chord: 'C major', lyric: 'Hawaayein rang badal rahi hain...', durationMs: 3200 },
      { chord: 'A minor', lyric: 'Giraft mein meri dhoop dhal rahi hai...', durationMs: 3400 },
      { chord: 'F major', lyric: 'Guzre jo lamhein, yaad aate hain...', durationMs: 3200 },
      { chord: 'G major', lyric: 'Tum mere ho, bas mere hi...', durationMs: 3600 }
    ]
  },
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    movie: 'Aashiqui 2',
    artist: 'Mithoon & Arijit Singh',
    tempoBpm: 78,
    strumPattern: '↓ - ↓ ↑ - ↑ ↓ ↑',
    introTabs: [
      { string: 3, fret: 0, note: 'G3' },
      { string: 4, fret: 0, note: 'B3' },
      { string: 4, fret: 1, note: 'C4' },
      { string: 4, fret: 3, note: 'D4' },
      { string: 5, fret: 0, note: 'E4' },
      { string: 5, fret: 2, note: 'F#4' },
      { string: 5, fret: 3, note: 'G4' }
    ],
    lines: [
      { chord: 'E minor', lyric: 'Hum tere bin ab reh nahi sakte...', durationMs: 3200 },
      { chord: 'B minor', lyric: 'Tere bina kya wajood mera...', durationMs: 3200 },
      { chord: 'C major', lyric: 'Tujhse juda agar ho jaayenge...', durationMs: 3200 },
      { chord: 'D major', lyric: 'Toh khud se hi ho jaayenge judaa...', durationMs: 3400 },
      { chord: 'E minor', lyric: 'Kyunki tum hi ho, ab tum hi ho...', durationMs: 3000 },
      { chord: 'A minor', lyric: 'Zindagi ab tum hi ho...', durationMs: 3000 },
      { chord: 'D major', lyric: 'Chain bhi, mera dard bhi...', durationMs: 3000 },
      { chord: 'E minor', lyric: 'Meri aashiqui ab tum hi ho! ❤️', durationMs: 3600 }
    ]
  }
];
