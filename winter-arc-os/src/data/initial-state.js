// Initial State & Data Templates tailored for:
// Height: 165 cm | Start Weight: 70 kg | Target Weight: 62 kg
// Focus: Lean Recomposition, Handstand Mastery, Skateboarding Progression

export const INITIAL_USER_PROFILE = {
  name: "Athlete",
  heightCm: 165,
  startWeightKg: 70.0,
  currentWeightKg: 70.0,
  targetWeightKg: 62.0,
  dailyCalorieTarget: 1800,
  dailyProteinTarget: 135,
  dailyWaterTargetMl: 3500,
  dailyStepsTarget: 9000,
  skateStance: "regular", // 'regular' or 'goofy'
  winterArcStartDate: new Date().toISOString().split('T')[0],
  winterArcTotalDays: 90
};

export const HANDSTAND_STAGES = [
  {
    id: 1,
    title: "Stage 1: Wrist Armor & Scapular Foundation",
    description: "Condition your wrists to handle 70kg of bodyweight and train scapular elevation.",
    image: "/exercises/wrist-armor.jpg",
    cues: [
      "First-knuckle push-ups on knees (3 sets of 10)",
      "Wrist rocks: palms down, fingers backward, rocks forward and sideways (2 mins)",
      "Scapular push-ups: push the floor away at the top, feeling shoulder blades spread"
    ],
    targetHoldSec: 30,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Stage 2: Hollow Body Alignment",
    description: "Eliminate the 'banana back'. The handstand is built on the floor first.",
    image: "/exercises/stage2-hollow.jpg",
    cues: [
      "Lie on back, press lumbar spine flat against the ground—zero daylight under lower back",
      "Extend arms overhead, point toes, lift shoulders and legs 4 inches off floor",
      "Goal: 3 sets of 30-40 second clean, steady holds without lower back lifting"
    ],
    targetHoldSec: 45,
    difficulty: "Novice"
  },
  {
    id: 3,
    title: "Stage 3: Chest-to-Wall Handstand",
    description: "The gold standard for proper straight-line handstand mechanics.",
    image: "/exercises/stage3-wall.jpg",
    cues: [
      "Walk feet up the wall while facing the wall (DO NOT kick back to wall)",
      "Get hands within 6-10 inches of the baseboard",
      "Elevate shoulders (push ears between shoulders), squeeze glutes and point toes",
      "Grip the floor hard with arched fingertips (the 'cambré' grip)"
    ],
    targetHoldSec: 40,
    difficulty: "Intermediate"
  },
  {
    id: 4,
    title: "Stage 4: Wall Taps & Fingertip Balance Float",
    description: "Learn how your fingers control balance before coming off the wall.",
    image: "/exercises/stage4-taps.jpg",
    cues: [
      "From chest-to-wall, lightly peel one foot away by pressing your fingertips into the floor",
      "Find the micro-balance float where both feet hover off the wall for 1-3 seconds",
      "Practice the 'cartwheel bail' to the side so you never panic when tipping over"
    ],
    targetHoldSec: 15,
    difficulty: "Advanced"
  },
  {
    id: 5,
    title: "Stage 5: Freestanding Kick-Up & Steady Hold",
    description: "Controlled kick-up, catching the line, and freestanding balance control.",
    image: "/exercises/stage5-freestanding.jpg",
    cues: [
      "Lock arms straight before kicking (never bend elbows on entry)",
      "Lead leg kicks up smoothly, trail leg follows like a compass needle",
      "Use fingertips like gas and brakes to micro-adjust balance",
      "Winter Arc Milestone: 10-second clean freestanding hold!"
    ],
    targetHoldSec: 10,
    difficulty: "Mastery"
  }
];

export const HOME_WORKOUT_CIRCUIT = [
  {
    id: "ex-1",
    name: "Pike Push-ups",
    target: "Deltoids, Upper Chest, Triceps",
    sets: 3,
    reps: "8 - 10 reps",
    restSec: 60,
    synergy: "Direct Handstand Strength",
    image: "/exercises/pike-pushup.jpg",
    cues: "Hips high in V-shape, look between hands, lower head slightly in front of hands into a triangle, press up and push head through shoulders at top."
  },
  {
    id: "ex-2",
    name: "Classic / Diamond Push-ups",
    target: "Pectorals, Triceps, Anterior Delts",
    sets: 3,
    reps: "12 - 15 reps",
    restSec: 60,
    synergy: "Upper Body Mass & Aesthetics",
    image: "/exercises/pushup.jpg",
    cues: "Elbows at 45 degrees, body rigid as a plank, full range of motion touching chest to floor."
  },
  {
    id: "ex-3",
    name: "Doorframe / Table Inverted Rows",
    target: "Lats, Rhomboids, Rear Delts, Biceps",
    sets: 3,
    reps: "10 - 12 reps",
    restSec: 60,
    synergy: "Shoulder Posture & Pull Power",
    image: "/exercises/row.jpg",
    cues: "Grip a sturdy doorframe or under a stable table, keep core locked, pull chest towards hands with squeeze in shoulder blades."
  },
  {
    id: "ex-4",
    name: "Bodyweight Squats + Calf Raise",
    target: "Quads, Glutes, Calves, Ankle Tendons",
    sets: 3,
    reps: "15 - 20 reps",
    restSec: 45,
    synergy: "Skateboarding Pop & Ankle Armor",
    image: "/exercises/squat.jpg",
    cues: "Squat below parallel with chest tall, explode up onto the balls of your feet for a 1-second calf contraction at the peak."
  },
  {
    id: "ex-5",
    name: "Alternating Reverse Lunges",
    target: "Gluteus Medius, Hamstrings, Core",
    sets: 3,
    reps: "10 reps / leg",
    restSec: 45,
    synergy: "Single-Leg Skate Pushing Balance",
    image: "/exercises/lunge.jpg",
    cues: "Step back smoothly, keep front knee tracking over toes, maintain upright posture to build stability for pushing a skateboard."
  },
  {
    id: "ex-6",
    name: "Hollow Body Rock / Hold",
    target: "Rectus Abdominis, Transverse Core",
    sets: 3,
    reps: "25 - 30 seconds",
    restSec: 45,
    synergy: "Anti-Extension Core for Handstand",
    image: "/exercises/hollow-body.jpg",
    cues: "Lower back pressed firmly into floor, arms glued by ears, toes pointed forward. Do not let lower back arch."
  }
];

export const SKATE_SKILLS = [
  {
    id: "sk-1",
    level: 1,
    name: "Board Stance & Stationary Balance",
    description: "Find your natural front foot (Regular: Left forward, Goofy: Right forward) and balance comfortably while stationary.",
    image: "/exercises/skate-stance.jpg",
    unlocked: true,
    steps: [
      "Determine front foot: stand tall, lean forward until you naturally step out to catch yourself",
      "Place front foot over the front 4 bolts at roughly 30°–45° angle",
      "Place back foot across the rear truck bolts or tail",
      "Bend knees, lower center of mass, practice shifting weight from heel to toe"
    ]
  },
  {
    id: "sk-2",
    level: 2,
    name: "Controlled Pushing & Foot Braking",
    description: "Learn to glide forward smoothly and stop safely without jumping off the board.",
    image: "/exercises/skate.jpg",
    unlocked: true,
    steps: [
      "Turn front foot straight forward along the length of the board",
      "Keep 80% of your weight balanced on your front bent knee",
      "Swing back foot forward and push straight back against the ground like walking",
      "Foot brake: gently slide the sole of your pushing shoe along the concrete to slow down"
    ]
  },
  {
    id: "sk-3",
    level: 3,
    name: "Carving & Smooth Turning",
    description: "Transfer body weight across toe-side and heel-side edges to carve fluid lines.",
    image: "/exercises/skate-carve.jpg",
    unlocked: false,
    steps: [
      "Lean weight gently into toes to turn toe-side",
      "Shift weight onto heels to turn heel-side",
      "Use your shoulders and head direction to guide the trajectory of the board",
      "Practice figure-8 turns in an empty parking lot or quiet street"
    ]
  },
  {
    id: "sk-4",
    level: 4,
    name: "Kickturns (Frontside & Backside 90°)",
    description: "Lightly compress the tail to lift the front wheels and pivot sharply.",
    image: "/exercises/skate-kickturn.jpg",
    unlocked: false,
    steps: [
      "Place back foot on the pocket/tip of the tail",
      "Apply slight pressure on the tail for a fraction of a second to unweight the front wheels",
      "Lead with your shoulders and turn the front wheels 45° to 90°",
      "Drop front wheels smoothly back down and ride away"
    ]
  },
  {
    id: "sk-5",
    level: 5,
    name: "The Ollie (Groundwork to Rolling)",
    description: "The gateway trick to all skateboarding: snapping the tail and sliding the front foot up.",
    image: "/exercises/ollie.jpg",
    unlocked: false,
    steps: [
      "Practice stationary on grass or in a sidewalk crack first",
      "Back foot snaps the tail sharply down into the ground (the pop)",
      "Front foot rolls onto its outer edge and slides up towards the front bolts (the level-out)",
      "Tuck knees up in mid-air, absorb the landing with bent knees over bolts"
    ]
  }
];

export const INITIAL_DAILY_DATA = {
  date: new Date().toISOString().split('T')[0],
  completedProtocols: {
    handstand: false,
    workout: false,
    skate: false,
    nutrition: false
  },
  waterIntakeMl: 1250,
  proteinIntakeG: 65,
  caloriesConsumed: 1200,
  weightLoggedKg: 70.0,
  notes: "Started Winter Arc protocol. Focused on wrist prep and locked-in nutrition."
};
