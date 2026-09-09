/**
 * VirtuosoKeys - Interactive Piano Song Library
 * Features Bollywood acoustic anthems, Indie hits, and cinematic masterworks
 * with multi-hand falling note timelines and synchronized lyrics.
 */

export const PIANO_SONGS = [
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    movie: 'Aashiqui 2',
    artist: 'Mithoon & Arijit Singh',
    tempoBpm: 78,
    difficulty: 'Beginner - Intermediate',
    tags: ['Bollywood Anthem', 'Romantic Ballad', 'Iconic Intro'],
    keySignature: 'E Minor',
    // Timeline events: timeMs, hand ('left' | 'right'), midi, durationMs, lyric (optional)
    notes: [
      // Intro motif
      { timeMs: 400, hand: 'left', midi: 40, durationMs: 1600, label: 'Em Bass' },
      { timeMs: 400, hand: 'right', midi: 64, durationMs: 380, label: 'E4' },
      { timeMs: 800, hand: 'right', midi: 63, durationMs: 380, label: 'D#4' },
      { timeMs: 1200, hand: 'right', midi: 64, durationMs: 380, label: 'E4' },
      { timeMs: 1600, hand: 'right', midi: 59, durationMs: 400, label: 'B3' },
      { timeMs: 2000, hand: 'right', midi: 60, durationMs: 400, label: 'C4' },
      { timeMs: 2400, hand: 'left', midi: 47, durationMs: 1600, label: 'Bm Bass' },
      { timeMs: 2400, hand: 'right', midi: 62, durationMs: 400, label: 'D4' },
      { timeMs: 2800, hand: 'right', midi: 64, durationMs: 400, label: 'E4' },
      { timeMs: 3200, hand: 'right', midi: 62, durationMs: 400, label: 'D4' },
      { timeMs: 3600, hand: 'right', midi: 60, durationMs: 400, label: 'C4' },
      { timeMs: 4000, hand: 'left', midi: 48, durationMs: 1600, label: 'C Bass' },
      { timeMs: 4000, hand: 'right', midi: 59, durationMs: 400, label: 'B3' },
      { timeMs: 4400, hand: 'right', midi: 57, durationMs: 400, label: 'A3' },
      { timeMs: 4800, hand: 'right', midi: 59, durationMs: 400, label: 'B3' },
      { timeMs: 5200, hand: 'right', midi: 60, durationMs: 400, label: 'C4' },
      { timeMs: 5600, hand: 'left', midi: 50, durationMs: 1600, label: 'D Bass' },
      { timeMs: 5600, hand: 'right', midi: 62, durationMs: 400, label: 'D4' },
      { timeMs: 6000, hand: 'right', midi: 64, durationMs: 400, label: 'E4' },
      { timeMs: 6400, hand: 'right', midi: 62, durationMs: 600, label: 'D4' },

      // Verse 1: "Hum tere bin ab reh nahi sakte..."
      { timeMs: 7400, hand: 'left', midi: 40, durationMs: 2800, label: 'Em' },
      { timeMs: 7400, hand: 'right', midi: 64, durationMs: 500, label: 'E4', lyric: 'Hum' },
      { timeMs: 8000, hand: 'right', midi: 64, durationMs: 500, label: 'E4', lyric: 'te-' },
      { timeMs: 8500, hand: 'right', midi: 65, durationMs: 500, label: 'F4', lyric: '-re' },
      { timeMs: 9000, hand: 'right', midi: 67, durationMs: 900, label: 'G4', lyric: 'bin' },

      { timeMs: 10400, hand: 'left', midi: 47, durationMs: 2800, label: 'Bm' },
      { timeMs: 10400, hand: 'right', midi: 65, durationMs: 500, label: 'F4', lyric: 'ab' },
      { timeMs: 11000, hand: 'right', midi: 64, durationMs: 500, label: 'E4', lyric: 'reh' },
      { timeMs: 11500, hand: 'right', midi: 62, durationMs: 500, label: 'D4', lyric: 'na-' },
      { timeMs: 12000, hand: 'right', midi: 60, durationMs: 900, label: 'C4', lyric: '-hi' },

      { timeMs: 13400, hand: 'left', midi: 48, durationMs: 2800, label: 'C' },
      { timeMs: 13400, hand: 'right', midi: 62, durationMs: 500, label: 'D4', lyric: 'sak-' },
      { timeMs: 14000, hand: 'right', midi: 64, durationMs: 1200, label: 'E4', lyric: '-te...' },

      { timeMs: 15600, hand: 'left', midi: 50, durationMs: 2800, label: 'D' },
      { timeMs: 15600, hand: 'right', midi: 62, durationMs: 500, label: 'D4', lyric: 'Te-' },
      { timeMs: 16200, hand: 'right', midi: 60, durationMs: 500, label: 'C4', lyric: '-re' },
      { timeMs: 16800, hand: 'right', midi: 59, durationMs: 600, label: 'B3', lyric: 'bi-' },
      { timeMs: 17400, hand: 'right', midi: 57, durationMs: 1200, label: 'A3', lyric: '-na' },

      { timeMs: 19000, hand: 'left', midi: 40, durationMs: 3200, label: 'Em' },
      { timeMs: 19000, hand: 'right', midi: 60, durationMs: 500, label: 'C4', lyric: 'kya' },
      { timeMs: 19600, hand: 'right', midi: 59, durationMs: 500, label: 'B3', lyric: 'wa-' },
      { timeMs: 20200, hand: 'right', midi: 57, durationMs: 600, label: 'A3', lyric: '-jood' },
      { timeMs: 20900, hand: 'right', midi: 55, durationMs: 1400, label: 'G3', lyric: 'me-' },
      { timeMs: 22400, hand: 'right', midi: 52, durationMs: 1800, label: 'E3', lyric: '-ra!' }
    ]
  },
  {
    id: 'tum-mere-ho-anuv-jain',
    title: 'Tum Mere Ho',
    movie: 'Indie Acoustic Special',
    artist: 'Anuv Jain',
    tempoBpm: 74,
    difficulty: 'Beginner',
    tags: ['Anuv Jain', 'Indie Acoustic', 'Gentle Melody'],
    keySignature: 'G Major',
    notes: [
      // Intro acoustic piano roll
      { timeMs: 400, hand: 'left', midi: 43, durationMs: 2200, label: 'G Bass' },
      { timeMs: 400, hand: 'right', midi: 67, durationMs: 450, label: 'G4' },
      { timeMs: 900, hand: 'right', midi: 71, durationMs: 450, label: 'B4' },
      { timeMs: 1400, hand: 'right', midi: 74, durationMs: 500, label: 'D5' },
      { timeMs: 1900, hand: 'right', midi: 71, durationMs: 450, label: 'B4' },

      { timeMs: 2600, hand: 'left', midi: 40, durationMs: 2200, label: 'Em Bass' },
      { timeMs: 2600, hand: 'right', midi: 69, durationMs: 450, label: 'A4' },
      { timeMs: 3100, hand: 'right', midi: 67, durationMs: 450, label: 'G4' },
      { timeMs: 3600, hand: 'right', midi: 64, durationMs: 500, label: 'E4' },
      { timeMs: 4100, hand: 'right', midi: 67, durationMs: 450, label: 'G4' },

      { timeMs: 4800, hand: 'left', midi: 48, durationMs: 2200, label: 'C Bass' },
      { timeMs: 4800, hand: 'right', midi: 67, durationMs: 450, label: 'G4' },
      { timeMs: 5300, hand: 'right', midi: 71, durationMs: 450, label: 'B4' },
      { timeMs: 5800, hand: 'right', midi: 72, durationMs: 500, label: 'C5' },
      { timeMs: 6300, hand: 'right', midi: 71, durationMs: 450, label: 'B4' },

      { timeMs: 7000, hand: 'left', midi: 50, durationMs: 2200, label: 'D Bass' },
      { timeMs: 7000, hand: 'right', midi: 69, durationMs: 450, label: 'A4' },
      { timeMs: 7500, hand: 'right', midi: 67, durationMs: 450, label: 'G4' },
      { timeMs: 8000, hand: 'right', midi: 66, durationMs: 500, label: 'F#4' },
      { timeMs: 8500, hand: 'right', midi: 67, durationMs: 800, label: 'G4' },

      // Lyric Phrase: "Tu aati hai toh aati hai bahaar..."
      { timeMs: 9600, hand: 'left', midi: 43, durationMs: 3200, label: 'G Major' },
      { timeMs: 9600, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: 'Tu' },
      { timeMs: 10200, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: 'aa-' },
      { timeMs: 10800, hand: 'right', midi: 71, durationMs: 600, label: 'B4', lyric: '-ti' },
      { timeMs: 11400, hand: 'right', midi: 71, durationMs: 600, label: 'B4', lyric: 'hai' },
      { timeMs: 12000, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: 'toh' },
      { timeMs: 12500, hand: 'right', midi: 67, durationMs: 1000, label: 'G4', lyric: 'ba-haar...' },

      // "Kahin tham si jaati hai yeh dharati..."
      { timeMs: 14000, hand: 'left', midi: 40, durationMs: 3200, label: 'E Minor' },
      { timeMs: 14000, hand: 'right', midi: 64, durationMs: 500, label: 'E4', lyric: 'Ka-' },
      { timeMs: 14600, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: '-hin' },
      { timeMs: 15200, hand: 'right', midi: 69, durationMs: 600, label: 'A4', lyric: 'tham' },
      { timeMs: 15800, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: 'si' },
      { timeMs: 16400, hand: 'right', midi: 64, durationMs: 1100, label: 'E4', lyric: 'jaa-ti...' },

      // "Kyun lagta hai mujhe ki tum mere ho..."
      { timeMs: 18000, hand: 'left', midi: 48, durationMs: 3000, label: 'C Major' },
      { timeMs: 18000, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: 'Kyun' },
      { timeMs: 18600, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: 'lag-' },
      { timeMs: 19200, hand: 'right', midi: 71, durationMs: 600, label: 'B4', lyric: '-ta' },
      { timeMs: 19800, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: 'hai' },

      { timeMs: 21000, hand: 'left', midi: 50, durationMs: 3000, label: 'D Major' },
      { timeMs: 21000, hand: 'right', midi: 67, durationMs: 600, label: 'G4', lyric: 'tum' },
      { timeMs: 21700, hand: 'right', midi: 66, durationMs: 600, label: 'F#4', lyric: 'me-' },
      { timeMs: 22400, hand: 'right', midi: 67, durationMs: 1400, label: 'G4', lyric: '-re' },
      { timeMs: 23900, hand: 'right', midi: 67, durationMs: 1800, label: 'G4', lyric: 'ho! ❤️' }
    ]
  },
  {
    id: 'kal-ho-naa-ho',
    title: 'Kal Ho Naa Ho (Theme)',
    movie: 'Kal Ho Naa Ho',
    artist: 'Shankar-Ehsaan-Loy & Sonu Nigam',
    tempoBpm: 76,
    difficulty: 'Beginner - Intermediate',
    tags: ['Bollywood Classic', 'Uplifting Melodic Theme'],
    keySignature: 'G Major',
    notes: [
      { timeMs: 400, hand: 'left', midi: 43, durationMs: 3200, label: 'G' },
      { timeMs: 400, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: 'Har' },
      { timeMs: 1000, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: 'gha-' },
      { timeMs: 1600, hand: 'right', midi: 71, durationMs: 600, label: 'B4', lyric: '-di' },
      { timeMs: 2300, hand: 'right', midi: 74, durationMs: 700, label: 'D5', lyric: 'ba-' },
      { timeMs: 3000, hand: 'right', midi: 72, durationMs: 600, label: 'C5', lyric: '-dal' },

      { timeMs: 4000, hand: 'left', midi: 40, durationMs: 3200, label: 'Em' },
      { timeMs: 4000, hand: 'right', midi: 71, durationMs: 500, label: 'B4', lyric: 'ra-' },
      { timeMs: 4600, hand: 'right', midi: 69, durationMs: 500, label: 'A4', lyric: '-hi' },
      { timeMs: 5200, hand: 'right', midi: 67, durationMs: 600, label: 'G4', lyric: 'hai' },
      { timeMs: 5900, hand: 'right', midi: 64, durationMs: 1000, label: 'E4', lyric: 'roop' },

      { timeMs: 7400, hand: 'left', midi: 48, durationMs: 3200, label: 'C' },
      { timeMs: 7400, hand: 'right', midi: 67, durationMs: 600, label: 'G4', lyric: 'zin-' },
      { timeMs: 8100, hand: 'right', midi: 69, durationMs: 600, label: 'A4', lyric: '-da-' },
      { timeMs: 8800, hand: 'right', midi: 67, durationMs: 1400, label: 'G4', lyric: '-gi...' },

      { timeMs: 10800, hand: 'left', midi: 50, durationMs: 3200, label: 'D' },
      { timeMs: 10800, hand: 'right', midi: 66, durationMs: 500, label: 'F#4', lyric: 'Chhaon' },
      { timeMs: 11400, hand: 'right', midi: 67, durationMs: 500, label: 'G4', lyric: 'hai' },
      { timeMs: 12000, hand: 'right', midi: 69, durationMs: 600, label: 'A4', lyric: 'ka-' },
      { timeMs: 12700, hand: 'right', midi: 71, durationMs: 600, label: 'B4', lyric: '-bhi' },
      { timeMs: 13400, hand: 'right', midi: 69, durationMs: 1200, label: 'A4', lyric: 'dhoop...' }
    ]
  },
  {
    id: 'interstellar-first-step',
    title: 'First Step (Interstellar)',
    movie: 'Interstellar Soundtrack',
    artist: 'Hans Zimmer',
    tempoBpm: 60,
    difficulty: 'Beginner',
    tags: ['Cinematic Soundtrack', 'Space Minimalist', 'Epic Crescendo'],
    keySignature: 'A Minor',
    notes: [
      { timeMs: 300, hand: 'left', midi: 33, durationMs: 3200, label: 'A1 Bass' },
      { timeMs: 300, hand: 'right', midi: 57, durationMs: 600, label: 'A3' },
      { timeMs: 1000, hand: 'right', midi: 64, durationMs: 600, label: 'E4' },
      { timeMs: 1700, hand: 'right', midi: 57, durationMs: 600, label: 'A3' },
      { timeMs: 2400, hand: 'right', midi: 65, durationMs: 800, label: 'F4' },

      { timeMs: 3500, hand: 'left', midi: 29, durationMs: 3200, label: 'F1 Bass' },
      { timeMs: 3500, hand: 'right', midi: 57, durationMs: 600, label: 'A3' },
      { timeMs: 4200, hand: 'right', midi: 64, durationMs: 600, label: 'E4' },
      { timeMs: 4900, hand: 'right', midi: 57, durationMs: 600, label: 'A3' },
      { timeMs: 5600, hand: 'right', midi: 65, durationMs: 800, label: 'F4' },

      { timeMs: 6700, hand: 'left', midi: 31, durationMs: 3200, label: 'G1 Bass' },
      { timeMs: 6700, hand: 'right', midi: 55, durationMs: 600, label: 'G3' },
      { timeMs: 7400, hand: 'right', midi: 64, durationMs: 600, label: 'E4' },
      { timeMs: 8100, hand: 'right', midi: 55, durationMs: 600, label: 'G3' },
      { timeMs: 8800, hand: 'right', midi: 67, durationMs: 900, label: 'G4' },

      { timeMs: 10000, hand: 'left', midi: 33, durationMs: 4000, label: 'A1 Bass' },
      { timeMs: 10000, hand: 'right', midi: 57, durationMs: 700, label: 'A3' },
      { timeMs: 10800, hand: 'right', midi: 64, durationMs: 700, label: 'E4' },
      { timeMs: 11600, hand: 'right', midi: 69, durationMs: 1500, label: 'A4' }
    ]
  },
  {
    id: 'fur-elise',
    title: 'Für Elise (Bagatelle No. 25)',
    movie: 'Classical Masterpiece',
    artist: 'Ludwig van Beethoven',
    tempoBpm: 120,
    difficulty: 'Intermediate',
    tags: ['Classical Milestone', 'Piano Essential'],
    keySignature: 'A Minor',
    notes: [
      { timeMs: 200, hand: 'right', midi: 76, durationMs: 220, label: 'E5' },
      { timeMs: 450, hand: 'right', midi: 75, durationMs: 220, label: 'D#5' },
      { timeMs: 700, hand: 'right', midi: 76, durationMs: 220, label: 'E5' },
      { timeMs: 950, hand: 'right', midi: 75, durationMs: 220, label: 'D#5' },
      { timeMs: 1200, hand: 'right', midi: 76, durationMs: 220, label: 'E5' },
      { timeMs: 1450, hand: 'right', midi: 71, durationMs: 220, label: 'B4' },
      { timeMs: 1700, hand: 'right', midi: 74, durationMs: 220, label: 'D5' },
      { timeMs: 1950, hand: 'right', midi: 72, durationMs: 220, label: 'C5' },
      { timeMs: 2200, hand: 'left', midi: 45, durationMs: 1200, label: 'A2' },
      { timeMs: 2200, hand: 'right', midi: 69, durationMs: 650, label: 'A4' },

      { timeMs: 3000, hand: 'left', midi: 48, durationMs: 1200, label: 'C3' },
      { timeMs: 3000, hand: 'right', midi: 60, durationMs: 220, label: 'C4' },
      { timeMs: 3250, hand: 'right', midi: 64, durationMs: 220, label: 'E4' },
      { timeMs: 3500, hand: 'right', midi: 69, durationMs: 220, label: 'A4' },
      { timeMs: 3750, hand: 'left', midi: 40, durationMs: 1200, label: 'E2' },
      { timeMs: 3750, hand: 'right', midi: 71, durationMs: 650, label: 'B4' }
    ]
  }
];
