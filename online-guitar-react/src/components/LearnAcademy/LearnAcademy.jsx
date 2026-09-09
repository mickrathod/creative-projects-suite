import React, { useState, useEffect, useRef } from 'react';
import { CHORDS } from '../../audio/guitar-synth';

const LESSON_MODULES = [
  {
    id: 'chords-tum-mere-ho',
    icon: '🎸',
    title: 'Lesson 1: The 4 Magic Chords for "Tum Mere Ho"',
    subtitle: 'Master G Major, E Minor, C Major, and D Major'
  },
  {
    id: 'strumming-rhythm',
    icon: '⏳',
    title: 'Lesson 2: Anuv Jain Strumming Pattern & Rhythm',
    subtitle: 'Learn the acoustic fingerstyle down-up rhythm at 74 BPM'
  },
  {
    id: 'intro-riff',
    icon: '🎼',
    title: 'Lesson 3: Intro Fingerpicking Tab Breakdown',
    subtitle: 'Learn the iconic opening arpeggio note-by-note'
  },
  {
    id: 'song-progression',
    icon: '🎤',
    title: 'Lesson 4: Song Practice & Verse-Chorus Transitions',
    subtitle: 'Smooth chord switching while singing the lyrics'
  },
  {
    id: 'quiz-trainer',
    icon: '🏆',
    title: 'Lesson 5: Interactive Chord Quiz & Ear Trainer',
    subtitle: 'Test your chord recognition & ear memory'
  }
];

const CHORD_LESSONS_DATA = {
  'G major': {
    name: 'G Major (The Indie Anchor)',
    stringsToPlay: 'All 6 strings (Strum from String 6 down to 1)',
    difficulty: 'Beginner',
    fingeringGuide: [
      { finger: 'Middle (2)', string: '6 (Low E)', fret: 3, note: 'G2' },
      { finger: 'Index (1)', string: '5 (A string)', fret: 2, note: 'B2' },
      { finger: 'Open', string: '4 (D string)', fret: 0, note: 'D3' },
      { finger: 'Open', string: '3 (G string)', fret: 0, note: 'G3' },
      { finger: 'Open', string: '2 (B string)', fret: 0, note: 'B3' },
      { finger: 'Ring (3)', string: '1 (High E)', fret: 3, note: 'G4' }
    ],
    proTip: 'Keep your thumb resting on the back of the neck so your fingers arch high and do not accidentally mute the open middle strings.'
  },
  'E minor': {
    name: 'E Minor (The Emotional Soul)',
    stringsToPlay: 'All 6 strings',
    difficulty: 'Very Easy (Only 2 fingers!)',
    fingeringGuide: [
      { finger: 'Open', string: '6 (Low E)', fret: 0, note: 'E2' },
      { finger: 'Middle (2)', string: '5 (A string)', fret: 2, note: 'B2' },
      { finger: 'Ring (3)', string: '4 (D string)', fret: 2, note: 'E3' },
      { finger: 'Open', string: '3 (G string)', fret: 0, note: 'G3' },
      { finger: 'Open', string: '2 (B string)', fret: 0, note: 'B3' },
      { finger: 'Open', string: '1 (High E)', fret: 0, note: 'E4' }
    ],
    proTip: 'This is the easiest chord on guitar! Place your 2nd and 3rd fingers close to fret wire 2 for the cleanest tone with zero buzzing.'
  },
  'C major': {
    name: 'C Major (The Melodic Warmth)',
    stringsToPlay: 'Top 5 strings (Do NOT play String 6 Low E)',
    difficulty: 'Beginner-Intermediate',
    fingeringGuide: [
      { finger: 'Mute (X)', string: '6 (Low E)', fret: null, note: 'Mute' },
      { finger: 'Ring (3)', string: '5 (A string)', fret: 3, note: 'C3' },
      { finger: 'Middle (2)', string: '4 (D string)', fret: 2, note: 'E3' },
      { finger: 'Open', string: '3 (G string)', fret: 0, note: 'G3' },
      { finger: 'Index (1)', string: '2 (B string)', fret: 1, note: 'C4' },
      { finger: 'Open', string: '1 (High E)', fret: 0, note: 'E4' }
    ],
    proTip: 'Start your strum from string 5 (A string), because C is the root bass note. Lightly rest your thumb over the 6th string to mute it.'
  },
  'Cadd9': {
    name: 'Cadd9 (Anuv Jain\'s Signature Chord)',
    stringsToPlay: 'Top 5 strings',
    difficulty: 'Beginner (Modern Indie Acoustic)',
    fingeringGuide: [
      { finger: 'Mute (X)', string: '6 (Low E)', fret: null, note: 'Mute' },
      { finger: 'Middle (2)', string: '5 (A string)', fret: 3, note: 'C3' },
      { finger: 'Index (1)', string: '4 (D string)', fret: 2, note: 'E3' },
      { finger: 'Open', string: '3 (G string)', fret: 0, note: 'G3' },
      { finger: 'Ring (3)', string: '2 (B string)', fret: 3, note: 'D4' },
      { finger: 'Pinky (4)', string: '1 (High E)', fret: 3, note: 'G4' }
    ],
    proTip: 'Keep your Ring & Pinky locked on Fret 3 (strings 1 & 2) when switching between G major and Cadd9! You only have to move 2 fingers!'
  },
  'D major': {
    name: 'D Major (The Bright Resolution)',
    stringsToPlay: 'Bottom 4 strings (Start strumming from String 4 D string)',
    difficulty: 'Beginner',
    fingeringGuide: [
      { finger: 'Mute (X)', string: '6 (Low E)', fret: null, note: 'Mute' },
      { finger: 'Mute (X)', string: '5 (A string)', fret: null, note: 'Mute' },
      { finger: 'Open', string: '4 (D string)', fret: 0, note: 'D3' },
      { finger: 'Index (1)', string: '3 (G string)', fret: 2, note: 'A3' },
      { finger: 'Ring (3)', string: '2 (B string)', fret: 3, note: 'D4' },
      { finger: 'Middle (2)', string: '1 (High E)', fret: 2, note: 'F#4' }
    ],
    proTip: 'Fingers 1, 2, and 3 form a little triangle. Make sure your ring finger on the 2nd string doesn\'t touch the high 1st string.'
  }
};

export const LearnAcademy = ({
  onStrumChord,
  onPluckFret,
  onSelectChordFingering,
  currentStrings
}) => {
  const [activeModule, setActiveModule] = useState('chords-tum-mere-ho');
  const [selectedChordLesson, setSelectedChordLesson] = useState('G major');
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0); // 0, 1, 2, 3
  const [isAutoTransitioning, setIsAutoTransitioning] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const metronomeRef = useRef(null);
  const transitionRef = useRef(null);

  // Stop timers on unmount
  useEffect(() => {
    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
      if (transitionRef.current) clearInterval(transitionRef.current);
    };
  }, []);

  // Metronome & Strum Rhythm Player (74 BPM = 810 ms per beat)
  const toggleMetronome = () => {
    if (isMetronomeActive) {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
      setIsMetronomeActive(false);
      setCurrentBeat(0);
    } else {
      setIsMetronomeActive(true);
      const beatMs = 60000 / 74; // 810ms
      let beat = 0;

      metronomeRef.current = setInterval(() => {
        beat = (beat + 1) % 4;
        setCurrentBeat(beat);

        // Acoustic beat cue sound
        if (beat === 0) {
          // Downbeat (Root bass string)
          onPluckFret(0, 3); // G2 bass
        } else if (beat === 2) {
          onPluckFret(3, 0); // Treble pluck
        }
      }, beatMs);
    }
  };

  // Auto progression practice loop: G -> Em -> C -> D
  const toggleProgressionPractice = () => {
    if (isAutoTransitioning) {
      if (transitionRef.current) clearInterval(transitionRef.current);
      setIsAutoTransitioning(false);
    } else {
      setIsAutoTransitioning(true);
      const progression = ['G major', 'E minor', 'C major', 'D major'];
      let step = 0;

      // Play first chord immediately
      setTransitionStep(0);
      onSelectChordFingering(progression[0]);
      onStrumChord(progression[0]);

      transitionRef.current = setInterval(() => {
        step = (step + 1) % progression.length;
        setTransitionStep(step);
        const nextChord = progression[step];
        onSelectChordFingering(nextChord);
        onStrumChord(nextChord);
      }, 3240); // 4 beats at 74 BPM
    }
  };

  // Arpeggiate (pluck each string of current chord individually)
  const arpeggiateCurrentChord = (chordName) => {
    const frets = CHORDS[chordName];
    if (!frets) return;

    onSelectChordFingering(chordName);
    frets.forEach((fret, sIdx) => {
      if (fret !== null) {
        setTimeout(() => {
          onPluckFret(sIdx, fret);
        }, sIdx * 180);
      }
    });
  };

  // Play Intro Riff slowly for learners
  const playSlowIntroRiff = () => {
    const tabs = [
      { string: 3, fret: 0, label: 'Thumb (G3)' },
      { string: 4, fret: 0, label: 'Index (B3)' },
      { string: 5, fret: 3, label: 'Ring (G4)' },
      { string: 4, fret: 0, label: 'Index (B3)' },
      { string: 3, fret: 2, label: 'Thumb (A3)' },
      { string: 4, fret: 1, label: 'Index (C4)' },
      { string: 5, fret: 0, label: 'Middle (E4)' },
      { string: 4, fret: 3, label: 'Ring (D4)' }
    ];

    tabs.forEach((tab, idx) => {
      setTimeout(() => {
        onPluckFret(tab.string, tab.fret);
      }, idx * 550);
    });
  };

  // Generate Quiz Question
  const startNewQuiz = () => {
    const questions = [
      {
        prompt: 'Which chord requires pressing only TWO fingers on Fret 2 (strings 4 and 5)?',
        options: ['E minor', 'G major', 'D major', 'C major'],
        correct: 'E minor',
        hint: 'It is the most emotional minor chord in Tum Mere Ho!'
      },
      {
        prompt: 'When playing C major or Cadd9, which string should you NEVER play or keep muted?',
        options: ['String 6 (Thick Low E)', 'String 1 (High E)', 'String 3 (G string)', 'String 2 (B string)'],
        correct: 'String 6 (Thick Low E)',
        hint: 'The root note of C is on String 5 (fret 3), so string 6 makes it sound muddy.'
      },
      {
        prompt: 'What chord does Anuv Jain use to create that iconic modern acoustic sparkle before the chorus?',
        options: ['Cadd9', 'F major', 'B minor', 'A minor'],
        correct: 'Cadd9',
        hint: 'It keeps fingers 3 and 4 anchored on the 3rd fret of strings 1 and 2!'
      },
      {
        prompt: 'What is the correct 4-chord verse progression for "Tum Mere Ho"?',
        options: ['G → Em → C → D', 'Am → F → C → G', 'D → A → Bm → G', 'Em → Bm → C → D'],
        correct: 'G → Em → C → D',
        hint: 'It starts on joyful G Major ("Tu aati hai toh aati hai bahaar...")!'
      }
    ];

    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setQuizQuestion(randomQ);
    setQuizFeedback(null);
  };

  const handleAnswerQuiz = (selectedOption) => {
    if (!quizQuestion) return;

    if (selectedOption === quizQuestion.correct) {
      setQuizFeedback({
        type: 'success',
        message: `🎉 Correct! ${quizQuestion.hint}`
      });
      setQuizScore((s) => s + 1);
      // Play triumphant G chord
      onStrumChord('G major');
    } else {
      setQuizFeedback({
        type: 'error',
        message: `❌ Not quite! The correct answer was "${quizQuestion.correct}". Hint: ${quizQuestion.hint}`
      });
    }
  };

  return (
    <div className="learn-academy-card">
      <div className="learn-academy-header">
        <div className="academy-title-group">
          <span className="academy-badge">🎓 INTERACTIVE GUITAR ACADEMY</span>
          <h2 className="academy-heading">Learn to Play "Tum Mere Ho" & Acoustic Guitar</h2>
          <p className="academy-subtext">
            Step-by-step masterclass: finger placement diagrams, rhythm trainer, chord transitions & quizzes!
          </p>
        </div>

        {/* Module Selector Pill Bar */}
        <div className="academy-module-nav">
          {LESSON_MODULES.map((m) => (
            <button
              key={m.id}
              className={`module-nav-btn ${activeModule === m.id ? 'active' : ''}`}
              onClick={() => setActiveModule(m.id)}
            >
              <span className="mod-icon">{m.icon}</span>
              <span className="mod-label">{m.title.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODULE 1: THE 4 CHORDS */}
      {activeModule === 'chords-tum-mere-ho' && (
        <div className="lesson-content-body">
          <div className="chord-tabs-bar">
            {Object.keys(CHORD_LESSONS_DATA).map((chordKey) => (
              <button
                key={chordKey}
                className={`chord-selector-pill ${selectedChordLesson === chordKey ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChordLesson(chordKey);
                  onSelectChordFingering(chordKey);
                }}
              >
                {chordKey.replace(' major', '').replace(' minor', 'm')}
              </button>
            ))}
          </div>

          {/* Current Chord Deep Dive Card */}
          {(() => {
            const data = CHORD_LESSONS_DATA[selectedChordLesson];
            return (
              <div className="chord-deepdive-grid">
                <div className="chord-info-left">
                  <div className="chord-tag-row">
                    <span className="chord-pill-name">{data.name}</span>
                    <span className="chord-pill-difficulty">Level: {data.difficulty}</span>
                  </div>

                  <p className="chord-strings-rule">
                    <strong>Strumming Range:</strong> {data.stringsToPlay}
                  </p>

                  <div className="finger-table-wrap">
                    <table className="finger-table">
                      <thead>
                        <tr>
                          <th>String</th>
                          <th>Fret</th>
                          <th>Finger to Use</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.fingeringGuide.map((row, idx) => (
                          <tr key={idx} className={row.fret === null ? 'muted-row' : ''}>
                            <td>String {row.string}</td>
                            <td>{row.fret !== null ? `Fret ${row.fret}` : '❌ Muted (X)'}</td>
                            <td><strong>{row.finger}</strong></td>
                            <td><code>{row.note}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pro-tip-box">
                    <span className="tip-bulb">💡 Pro-Tip:</span>
                    <span>{data.proTip}</span>
                  </div>

                  <div className="chord-action-buttons">
                    <button
                      className="btn-action-primary"
                      onClick={() => {
                        onSelectChordFingering(selectedChordLesson);
                        onStrumChord(selectedChordLesson);
                      }}
                    >
                      🔊 Strum {selectedChordLesson}
                    </button>
                    <button
                      className="btn-action-secondary"
                      onClick={() => arpeggiateCurrentChord(selectedChordLesson)}
                    >
                      🎶 Hear Each String Clean
                    </button>
                  </div>
                </div>

                {/* Visual Chord Diagram */}
                <div className="chord-diagram-panel">
                  <span className="diagram-title">FINGERBOARD POSITION</span>
                  <div className="mini-diagram-graphic">
                    <div className="diagram-nut">NUT (HEADSTOCK)</div>
                    <div className="diagram-grid">
                      {data.fingeringGuide.map((f, i) => (
                        <div key={i} className="diagram-string-col">
                          <span className="diag-str-num">Str {6 - i}</span>
                          <div className="diag-wire" />
                          <div className="diag-fret-pos">
                            {f.fret === null ? (
                              <span className="diag-mute">✕</span>
                            ) : f.fret === 0 ? (
                              <span className="diag-open">○</span>
                            ) : (
                              <span className="diag-dot" style={{ top: `${(f.fret - 1) * 38 + 12}px` }}>
                                {f.fret}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="diagram-caption">
                    Look up at the 12-Fret neck above! Golden dots light up where your fingers go.
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODULE 2: STRUMMING & RHYTHM */}
      {activeModule === 'strumming-rhythm' && (
        <div className="lesson-content-body">
          <div className="rhythm-lesson-header">
            <h3>The Iconic Acoustic Fingerstyle Strum (74 BPM)</h3>
            <p>
              Anuv Jain songs rely on a gentle, rolling pulse. Strum down with the thumb on the bass note, then brush up with the index finger!
            </p>
          </div>

          {/* Strum Rhythm Visualizer */}
          <div className="strum-pattern-visual-box">
            <div className="measure-label">1 MEASURE (4 BEATS)</div>
            <div className="beats-row">
              {[
                { beat: 1, arrow: '↓', type: 'THUMB BASS', desc: 'Root note' },
                { beat: 2, arrow: '↓ ↑', type: 'DOWN - UP', desc: 'Brush strings' },
                { beat: 3, arrow: '- ↑', type: 'REST - UP', desc: 'Syncopated air' },
                { beat: 4, arrow: '↓ -', type: 'DOWN STRUM', desc: 'Gentle release' }
              ].map((b, i) => (
                <div
                  key={i}
                  className={`beat-card ${currentBeat === i && isMetronomeActive ? 'active-beat' : ''}`}
                >
                  <span className="beat-num">Beat {b.beat}</span>
                  <div className="beat-arrow">{b.arrow}</div>
                  <span className="beat-type">{b.type}</span>
                  <span className="beat-desc">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metronome Controls */}
          <div className="metronome-trainer-controls">
            <button
              className={`btn-metronome ${isMetronomeActive ? 'running' : ''}`}
              onClick={toggleMetronome}
            >
              {isMetronomeActive ? '⏸️ STOP RHYTHM TRAINER' : '▶️ START 74 BPM RHYTHM TRAINER'}
            </button>
            <span className="trainer-note">
              Listen to the pulse and tap your foot in 4/4 time! Strum your guitar when Beat 1 lights up.
            </span>
          </div>
        </div>
      )}

      {/* MODULE 3: INTRO TAB BREAKDOWN */}
      {activeModule === 'intro-riff' && (
        <div className="lesson-content-body">
          <div className="intro-tab-guide">
            <h3>"Tum Mere Ho" Acoustic Opening Tab</h3>
            <p>
              This gentle fingerpicking hook establishes the song's emotional tone before the singing begins:
            </p>

            <div className="tab-table-box">
              <div className="tab-line">
                <span className="tab-string-name">1 (High E) : |-----------------------------------|</span>
                <span className="tab-string-name">2 (B String) : |---0-------0-------1-------3---|</span>
                <span className="tab-string-name">3 (G String) : |-------3-------2-------0-------|</span>
                <span className="tab-string-name">4 (D String) : |-0-------0-------------------|</span>
                <span className="tab-string-name">5 (A String) : |-----------------0-------0---|</span>
                <span className="tab-string-name">6 (Low E) : |-----------------------------------|</span>
              </div>
            </div>

            <div className="tab-instructions-grid">
              <div className="tab-step-card">
                <span className="step-badge">Phase 1</span>
                <h4>Root Pluck (G3 & B3)</h4>
                <p>Pluck open D (string 3) with your Thumb, followed by open B with your Index finger.</p>
              </div>
              <div className="tab-step-card">
                <span className="step-badge">Phase 2</span>
                <h4>Melodic Hammer (G4)</h4>
                <p>Press the 3rd fret on string 5 with your ring finger for the high acoustic chime.</p>
              </div>
              <div className="tab-step-card">
                <span className="step-badge">Phase 3</span>
                <h4>Transition Note (A3 to C4)</h4>
                <p>Slide down to 2nd fret on string 3 and 1st fret on string 4.</p>
              </div>
            </div>

            <div className="tab-player-controls">
              <button className="btn-action-primary" onClick={playSlowIntroRiff}>
                🎸 Play Intro Riff Slowly (Learn Note-by-Note)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: SONG PROGRESSION WALKTHROUGH */}
      {activeModule === 'song-progression' && (
        <div className="lesson-content-body">
          <div className="progression-guide">
            <h3>Verse 1 Chord Transitions & Timing</h3>
            <p>
              Practice shifting between chords seamlessly without stopping your strumming hand.
            </p>

            <div className="chords-flow-row">
              {[
                { chord: 'G major', lyrics: 'Tu aati hai toh aati hai bahaar...', beats: 4 },
                { chord: 'E minor', lyrics: 'Kahin tham si jaati hai yeh dharati...', beats: 4 },
                { chord: 'C major', lyrics: 'Main dekhta rahoon bas tera hi chehra...', beats: 4 },
                { chord: 'D major', lyrics: 'Kyun lagta hai mujhe ki tum mere ho...', beats: 4 }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`prog-step-card ${isAutoTransitioning && transitionStep === idx ? 'step-active' : ''}`}
                  onClick={() => {
                    onSelectChordFingering(item.chord);
                    onStrumChord(item.chord);
                  }}
                >
                  <div className="prog-chord-badge">{item.chord.replace(' major', '').replace(' minor', 'm')}</div>
                  <div className="prog-step-lyric">{item.lyrics}</div>
                  <div className="prog-beats">{item.beats} Beats (1 Bar)</div>
                </div>
              ))}
            </div>

            <div className="prog-trainer-controls">
              <button
                className={`btn-prog-trainer ${isAutoTransitioning ? 'running' : ''}`}
                onClick={toggleProgressionPractice}
              >
                {isAutoTransitioning ? '⏸️ STOP AUTO-PRACTICE' : '🔁 START CHORD TRANSITION LOOP'}
              </button>
              <span className="trainer-note">
                Auto-advances through the 4 chords every 4 beats so you can practice shifting fingers in real-time!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: INTERACTIVE QUIZ */}
      {activeModule === 'quiz-trainer' && (
        <div className="lesson-content-body">
          <div className="quiz-container">
            <div className="quiz-header-row">
              <div className="quiz-score-badge">🏆 Score: {quizScore} Points</div>
              <button className="btn-quiz-new" onClick={startNewQuiz}>
                {quizQuestion ? '🔄 Next Question' : '🚀 Start Ear & Chord Quiz'}
              </button>
            </div>

            {quizQuestion ? (
              <div className="quiz-card">
                <div className="quiz-prompt-text">{quizQuestion.prompt}</div>
                <div className="quiz-options-grid">
                  {quizQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      className="quiz-option-btn"
                      onClick={() => handleAnswerQuiz(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizFeedback && (
                  <div className={`quiz-feedback-box ${quizFeedback.type}`}>
                    {quizFeedback.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-welcome-screen">
                <h4>Ready to test what you learned?</h4>
                <p>
                  Click "Start Ear & Chord Quiz" to test your knowledge of guitar strings, fingerings, and Anuv Jain's chord transitions!
                </p>
                <button className="btn-action-primary" onClick={startNewQuiz}>
                  🚀 Start Quiz Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
