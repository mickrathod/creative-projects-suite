import React, { useState } from 'react';

const ACADEMY_LESSONS = [
  {
    id: 'anatomy',
    icon: '🎹',
    title: 'Lesson 1: Anatomy & Finding Middle C',
    desc: 'Master the 2-black and 3-black key patterns'
  },
  {
    id: 'chords',
    icon: '🎼',
    title: 'Lesson 2: The 5 Essential Chords',
    desc: 'Learn C, G, Am, F, and Em with finger numbering'
  },
  {
    id: 'pop-formula',
    icon: '🪄',
    title: 'Lesson 3: The 4-Chord Magic Pop Formula',
    desc: 'Why 90% of Bollywood & Indie hits use I-V-vi-IV'
  },
  {
    id: 'two-hands',
    icon: '👐',
    title: 'Lesson 4: Left-Hand Rolling Arpeggios',
    desc: 'Techniques to accompany melodies with cinematic depth'
  },
  {
    id: 'quiz',
    icon: '🏆',
    title: 'Lesson 5: Interactive Ear Training Quiz',
    desc: 'Test your musical ear and note memory'
  }
];

const CHORD_LIBRARY = [
  {
    name: 'C Major',
    notes: ['C4 (60)', 'E4 (64)', 'G4 (67)'],
    midis: [60, 64, 67],
    fingers: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
    vibe: 'Bright, joyful, foundational root'
  },
  {
    name: 'G Major',
    notes: ['G3 (55)', 'B3 (59)', 'D4 (62)'],
    midis: [55, 59, 62],
    fingers: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
    vibe: 'Warm, uplifting, dominant resolution'
  },
  {
    name: 'A Minor (Am)',
    notes: ['A3 (57)', 'C4 (60)', 'E4 (64)'],
    midis: [57, 60, 64],
    fingers: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
    vibe: 'Soulful, emotional, indie classic'
  },
  {
    name: 'F Major',
    notes: ['F3 (53)', 'A3 (57)', 'C4 (60)'],
    midis: [53, 57, 60],
    fingers: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
    vibe: 'Expansive, passionate, anthemic'
  },
  {
    name: 'E Minor (Em)',
    notes: ['E3 (52)', 'G3 (55)', 'B3 (59)'],
    midis: [52, 55, 59],
    fingers: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
    vibe: 'Dramatic, haunting ("Tum Hi Ho" root)'
  }
];

export const PianoAcademy = ({ onPlayMidis, onHighlightMidis }) => {
  const [activeLesson, setActiveLesson] = useState('anatomy');
  const [selectedChord, setSelectedChord] = useState(CHORD_LIBRARY[0]);

  // Quiz State
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const startNewQuiz = () => {
    const questions = [
      {
        prompt: 'Where is Middle C (C4) located on the piano keyboard?',
        options: [
          'Directly to the left of any group of 2 black keys',
          'Between the 3 black keys',
          'To the right of B',
          'Only on the far right of the keyboard'
        ],
        correct: 'Directly to the left of any group of 2 black keys',
        hint: 'Find the 2 black keys, and drop your left finger down onto the white key!'
      },
      {
        prompt: 'What are the 3 notes that make up the C Major chord?',
        options: ['C - E - G', 'C - D - E', 'C - F - A', 'C - D# - G'],
        correct: 'C - E - G',
        hint: 'Root (C), Major 3rd (E), and Perfect 5th (G).'
      },
      {
        prompt: 'Which chord forms the haunting opening of "Tum Hi Ho"?',
        options: ['E Minor (Em)', 'C Major', 'G Major', 'F Major'],
        correct: 'E Minor (Em)',
        hint: 'It begins in dark, emotional E minor!'
      },
      {
        prompt: 'What standard finger numbers are used for basic 3-note triads?',
        options: [
          '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
          '1 (Thumb) - 2 (Index) - 3 (Middle)',
          '2 (Index) - 3 (Middle) - 4 (Ring)',
          'Any random fingers'
        ],
        correct: '1 (Thumb) - 3 (Middle) - 5 (Pinky)',
        hint: 'Skipping fingers 2 and 4 leaves your hand relaxed and arched.'
      }
    ];

    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setQuizQuestion(randomQ);
    setQuizFeedback(null);
  };

  const handleAnswerQuiz = (option) => {
    if (!quizQuestion) return;
    if (option === quizQuestion.correct) {
      setQuizFeedback({
        type: 'success',
        message: `🎉 Correct! ${quizQuestion.hint}`
      });
      setQuizScore((s) => s + 1);
      onPlayMidis([60, 64, 67]); // Happy C major chord
    } else {
      setQuizFeedback({
        type: 'error',
        message: `❌ Not quite! The correct answer was "${quizQuestion.correct}". ${quizQuestion.hint}`
      });
    }
  };

  const playChord = (chord) => {
    onPlayMidis(chord.midis);
    onHighlightMidis(chord.midis);
  };

  const arpeggiateChord = (chord) => {
    chord.midis.forEach((midi, idx) => {
      setTimeout(() => {
        onPlayMidis([midi]);
        onHighlightMidis([midi]);
      }, idx * 240);
    });
  };

  return (
    <div className="piano-academy-panel">
      <div className="academy-header-strip">
        <div className="academy-brand-title">
          <span className="academy-pill">🎓 VIRTUOSOKEYS ACADEMY</span>
          <h3>Interactive Piano & Music Theory Masterclass</h3>
          <p>Learn keyboard anatomy, finger positions, chord formulas, and left-hand accompaniment.</p>
        </div>

        <div className="academy-nav-pills">
          {ACADEMY_LESSONS.map((les) => (
            <button
              key={les.id}
              className={`lesson-pill-btn ${activeLesson === les.id ? 'active' : ''}`}
              onClick={() => setActiveLesson(les.id)}
            >
              <span className="les-icon">{les.icon}</span>
              <span className="les-title">{les.title.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LESSON 1: ANATOMY */}
      {activeLesson === 'anatomy' && (
        <div className="lesson-body-card">
          <div className="lesson-hero-row">
            <div className="lesson-text-col">
              <h4>The Black & White Key Pattern (The Secret to Never Getting Lost)</h4>
              <p>
                Look at the piano keyboard: notice how the black keys are grouped in sets of <strong>2</strong> and <strong>3</strong> across the entire instrument.
              </p>
              <ul className="lesson-bullet-list">
                <li><strong>Middle C (C4)</strong> is ALWAYS the white key immediately to the left of the <strong>2 black keys</strong>.</li>
                <li>The 7 white keys cycle alphabetically: <code>C - D - E - F - G - A - B</code>.</li>
                <li>In Indian classical music (Sargam), these correspond to: <code>Sa - Re - Ga - Ma - Pa - Dha - Ni</code>.</li>
                <li>The black keys are <strong>accidentals</strong> (Sharps ♯ and Flats ♭). C# is a half-step above C.</li>
              </ul>

              <div className="lesson-action-row">
                <button
                  className="btn-action-gold"
                  onClick={() => {
                    onPlayMidis([60]);
                    onHighlightMidis([60]);
                  }}
                >
                  📍 Find & Hear Middle C (C4)
                </button>
                <button
                  className="btn-action-cyan"
                  onClick={() => {
                    const cScale = [60, 62, 64, 65, 67, 69, 71, 72];
                    cScale.forEach((note, i) => {
                      setTimeout(() => {
                        onPlayMidis([note]);
                        onHighlightMidis([note]);
                      }, i * 220);
                    });
                  }}
                >
                  🎶 Play C Major Scale (Sa Re Ga Ma Pa Dha Ni Sa)
                </button>
              </div>
            </div>

            <div className="lesson-visual-diagram">
              <div className="pattern-box">
                <span className="pattern-title">THE 2-BLACK KEY RULE</span>
                <div className="pattern-keys-graphic">
                  <div className="p-key white c-key">C (Root)</div>
                  <div className="p-key black c-sharp">C#</div>
                  <div className="p-key white d-key">D</div>
                  <div className="p-key black d-sharp">D#</div>
                  <div className="p-key white e-key">E</div>
                </div>
                <span className="pattern-caption">C is always on the left foot of the twin black keys!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LESSON 2: 5 ESSENTIAL CHORDS */}
      {activeLesson === 'chords' && (
        <div className="lesson-body-card">
          <div className="chords-selector-strip">
            {CHORD_LIBRARY.map((ch) => (
              <button
                key={ch.name}
                className={`chord-choice-btn ${selectedChord.name === ch.name ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChord(ch);
                  playChord(ch);
                }}
              >
                {ch.name}
              </button>
            ))}
          </div>

          <div className="chord-deep-dive-grid">
            <div className="chord-spec-card">
              <h4 className="chord-title-gold">{selectedChord.name}</h4>
              <p className="chord-vibe-text"><strong>Musical Character:</strong> {selectedChord.vibe}</p>

              <div className="chord-notes-table-wrap">
                <table className="chord-notes-table">
                  <thead>
                    <tr>
                      <th>Triad Note</th>
                      <th>Pitch & Octave</th>
                      <th>Standard Hand Finger</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Root</td>
                      <td><code>{selectedChord.notes[0]}</code></td>
                      <td><strong>1 (Thumb)</strong></td>
                    </tr>
                    <tr>
                      <td>3rd</td>
                      <td><code>{selectedChord.notes[1]}</code></td>
                      <td><strong>3 (Middle)</strong></td>
                    </tr>
                    <tr>
                      <td>5th</td>
                      <td><code>{selectedChord.notes[2]}</code></td>
                      <td><strong>5 (Pinky)</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="lesson-action-row">
                <button className="btn-action-gold" onClick={() => playChord(selectedChord)}>
                  🔊 Strum {selectedChord.name}
                </button>
                <button className="btn-action-cyan" onClick={() => arpeggiateChord(selectedChord)}>
                  🎵 Hear Each Note (Arpeggio)
                </button>
              </div>
            </div>

            <div className="chord-hand-posture">
              <span className="posture-title">PIANO HAND POSTURE</span>
              <div className="posture-tip-box">
                <span className="tip-star">🖐️ Finger Numbers:</span>
                <p>
                  <strong>1</strong> = Thumb | <strong>2</strong> = Index | <strong>3</strong> = Middle | <strong>4</strong> = Ring | <strong>5</strong> = Pinky.
                </p>
                <p style={{ marginTop: '8px', color: '#cbd5e1' }}>
                  Keep your wrist level with the keyboard and imagine holding a gentle tennis ball in your palm!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LESSON 3: THE 4-CHORD POP FORMULA */}
      {activeLesson === 'pop-formula' && (
        <div className="lesson-body-card">
          <h4>The 4-Chord Formula That Built 1,000 Famous Songs</h4>
          <p>
            Almost every major song in modern history—from Bollywood anthems to Coldplay and Ed Sheeran—is built on the <strong>I - V - vi - IV</strong> progression:
          </p>

          <div className="progression-cards-row">
            {[
              { num: 'I', name: 'C Major', desc: 'Home / Resolution' },
              { num: 'V', name: 'G Major', desc: 'Uplifting Tension' },
              { num: 'vi', name: 'A Minor', desc: 'Emotional Depth' },
              { num: 'IV', name: 'F Major', desc: 'Passionate Lift' }
            ].map((p, idx) => (
              <div
                key={idx}
                className="prog-card"
                onClick={() => {
                  const ch = CHORD_LIBRARY.find((c) => c.name === p.name);
                  if (ch) playChord(ch);
                }}
              >
                <span className="prog-num">{p.num}</span>
                <h5>{p.name}</h5>
                <span className="prog-desc">{p.desc}</span>
              </div>
            ))}
          </div>

          <div className="lesson-action-row" style={{ marginTop: '16px' }}>
            <button
              className="btn-action-gold"
              onClick={() => {
                const prog = [
                  CHORD_LIBRARY[0], // C
                  CHORD_LIBRARY[1], // G
                  CHORD_LIBRARY[2], // Am
                  CHORD_LIBRARY[3]  // F
                ];
                prog.forEach((ch, i) => {
                  setTimeout(() => {
                    playChord(ch);
                  }, i * 1400);
                });
              }}
            >
              ▶️ Play The Hit Progression (C → G → Am → F)
            </button>
          </div>
        </div>
      )}

      {/* LESSON 4: LEFT-HAND ARPEGGIOS */}
      {activeLesson === 'two-hands' && (
        <div className="lesson-body-card">
          <h4>Left-Hand Rolling Arpeggio Technique (Root-5th-Octave)</h4>
          <p>
            Instead of simply pressing a heavy block chord in your left hand, concert pianists roll between the <strong>Root, 5th, and Octave</strong> to create an ocean of rich acoustic resonance:
          </p>

          <div className="arpeggio-demo-box">
            <div className="arp-step">
              <span className="step-label">Step 1</span>
              <h5>Root (Low Bass)</h5>
              <p>Play low C2 with your left Pinky (Finger 5)</p>
            </div>
            <div className="arp-step">
              <span className="step-label">Step 2</span>
              <h5>Fifth (Harmonic Bridge)</h5>
              <p>Play G2 with your Index finger (Finger 2)</p>
            </div>
            <div className="arp-step">
              <span className="step-label">Step 3</span>
              <h5>Octave (Upper Bell)</h5>
              <p>Play C3 with your Thumb (Finger 1)</p>
            </div>
          </div>

          <div className="lesson-action-row" style={{ marginTop: '16px' }}>
            <button
              className="btn-action-cyan"
              onClick={() => {
                const notes = [36, 43, 48, 43]; // C2, G2, C3, G2
                notes.forEach((midi, i) => {
                  setTimeout(() => {
                    onPlayMidis([midi]);
                    onHighlightMidis([midi]);
                  }, i * 350);
                });
              }}
            >
              🎹 Hear Left-Hand Arpeggio Roll
            </button>
          </div>
        </div>
      )}

      {/* LESSON 5: QUIZ */}
      {activeLesson === 'quiz' && (
        <div className="lesson-body-card">
          <div className="quiz-header-bar">
            <span className="quiz-score">🏆 Score: {quizScore} Points</span>
            <button className="btn-action-gold" onClick={startNewQuiz}>
              {quizQuestion ? '🔄 Next Question' : '🚀 Start Piano Quiz'}
            </button>
          </div>

          {quizQuestion ? (
            <div className="quiz-box">
              <h4 className="quiz-question-text">{quizQuestion.prompt}</h4>
              <div className="quiz-options-list">
                {quizQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    className="quiz-choice-btn"
                    onClick={() => handleAnswerQuiz(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizFeedback && (
                <div className={`quiz-result-msg ${quizFeedback.type}`}>
                  {quizFeedback.message}
                </div>
              )}
            </div>
          ) : (
            <div className="quiz-intro-box">
              <h4>Ready to test your piano skills?</h4>
              <p>Click "Start Piano Quiz" to test your knowledge of keys, chords, and music theory!</p>
              <button className="btn-action-gold" onClick={startNewQuiz}>
                🚀 Start Quiz Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
