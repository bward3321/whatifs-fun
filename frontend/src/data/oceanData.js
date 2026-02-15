export const DEPTH_BREAKPOINTS = [
  { scroll: 0.00, depth: 0 },
  { scroll: 0.10, depth: 0 },
  { scroll: 0.15, depth: 10 },
  { scroll: 0.24, depth: 50 },
  { scroll: 0.34, depth: 200 },
  { scroll: 0.43, depth: 1000 },
  { scroll: 0.53, depth: 2500 },
  { scroll: 0.62, depth: 4000 },
  { scroll: 0.72, depth: 6000 },
  { scroll: 0.80, depth: 8848 },
  { scroll: 0.88, depth: 10984 },
  { scroll: 1.00, depth: 10984 },
];

export const COLOR_STOPS = [
  { depth: 0, r: 30, g: 144, b: 210 },
  { depth: 50, r: 15, g: 110, b: 178 },
  { depth: 200, r: 5, g: 68, b: 130 },
  { depth: 500, r: 3, g: 38, b: 78 },
  { depth: 1000, r: 2, g: 18, b: 48 },
  { depth: 2500, r: 1, g: 8, b: 22 },
  { depth: 4000, r: 0, g: 4, b: 12 },
  { depth: 6000, r: 0, g: 2, b: 6 },
  { depth: 10984, r: 0, g: 0, b: 0 },
];

export function interpolateDepth(scrollProgress) {
  const bp = DEPTH_BREAKPOINTS;
  for (let i = 0; i < bp.length - 1; i++) {
    if (scrollProgress >= bp[i].scroll && scrollProgress <= bp[i + 1].scroll) {
      const range = bp[i + 1].scroll - bp[i].scroll;
      const t = range > 0 ? (scrollProgress - bp[i].scroll) / range : 0;
      return Math.round(bp[i].depth + t * (bp[i + 1].depth - bp[i].depth));
    }
  }
  return 10984;
}

export function getBackgroundColor(depth) {
  const stops = COLOR_STOPS;
  for (let i = 0; i < stops.length - 1; i++) {
    if (depth >= stops[i].depth && depth <= stops[i + 1].depth) {
      const range = stops[i + 1].depth - stops[i].depth;
      const t = range > 0 ? (depth - stops[i].depth) / range : 0;
      const r = Math.round(stops[i].r + t * (stops[i + 1].r - stops[i].r));
      const g = Math.round(stops[i].g + t * (stops[i + 1].g - stops[i].g));
      const b = Math.round(stops[i].b + t * (stops[i + 1].b - stops[i].b));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return 'rgb(0, 0, 0)';
}

export const SECTIONS = [
  {
    id: 'surface',
    type: 'title',
    depth: 0,
    depthLabel: null,
    minHeight: '400vh',
    stats: [
      'Average ocean depth: 3,688 meters',
      'Deepest point: 10,984 meters',
    ],
    comparison: 'If Mount Everest were dropped into the ocean, its peak would still be underwater.',
    creatures: [
      { creatureKey: 'seagull', name: 'SEAGULL', x: 22, y: 4, size: 55, fact: 'Seagulls can drink both fresh and salt water thanks to special glands above their eyes.' },
    ],
  },
  {
    id: 'swimming-depth',
    type: 'standard',
    depth: 10,
    depthLabel: '10 METERS DEEP',
    minHeight: '250vh',
    subtitle: 'Swimming Depth',
    stats: ['Most recreational divers never go below 18 meters.'],
    comparison: 'Pressure here is already double what you feel at the surface.',
    note: null,
    creatures: [
      { creatureKey: 'diver', name: 'HUMAN DIVER', x: 28, y: 12, size: 90, fact: 'Recreational scuba diving is limited to about 40 meters depth.' },
      { creatureKey: 'snorkeler', name: 'SNORKELER', x: 62, y: 8, size: 80, fact: 'Snorkelers typically stay within 1-2 meters of the surface.' },
    ],
    floatingStats: [],
  },
  {
    id: 'coral-reef',
    type: 'standard',
    depth: 50,
    depthLabel: '49 METERS DEEP',
    minHeight: '350vh',
    subtitle: null,
    stats: ['This is deeper than a 15-story building is tall.'],
    comparison: null,
    note: 'Sunlight still visible.',
    creatures: [
      { creatureKey: 'coral', name: 'CORAL REEF', x: 10, y: 8, size: 105, fact: 'Coral reefs support 25% of all marine species despite covering less than 1% of the ocean floor.' },
      { creatureKey: 'stripedBass', name: 'STRIPED BASS', x: 52, y: 12, size: 72, fact: 'Striped bass can live up to 30 years in the wild.' },
      { creatureKey: 'clownfish', name: 'CLOWN FISH', x: 76, y: 40, size: 42, fact: 'All clownfish are born male \u2014 some later turn female.' },
      { creatureKey: 'barramundi', name: 'BARRAMUNDI', x: 32, y: 52, size: 68, fact: 'Barramundi can thrive in both freshwater and saltwater.' },
    ],
    floatingStats: ['The ocean contains 99% of the Earth\u2019s living space.'],
  },
  {
    id: 'edge-of-sunlight',
    type: 'standard',
    depth: 200,
    depthLabel: '200 METERS DEEP',
    minHeight: '300vh',
    subtitle: 'Edge of Sunlight',
    stats: ['Only 1% of sunlight reaches here.'],
    comparison: 'Below this, the ocean begins to feel like space.',
    note: 'This is the end of the sunlight zone.',
    creatures: [
      { creatureKey: 'haddock', name: 'HADDOCK', x: 64, y: 12, size: 62, fact: 'Haddock can be identified by a dark blotch above its pectoral fin.' },
      { creatureKey: 'chainCatshark', name: 'CHAIN CATSHARK', x: 32, y: 35, size: 115, fact: 'Named for its chain-like pattern of dark markings.' },
      { creatureKey: 'kelp', name: 'KELP', x: 10, y: 48, size: 95, fact: 'Giant kelp can grow up to 60 cm per day.' },
    ],
    floatingStats: ['80% of the ocean remains unmapped.'],
  },
  {
    id: 'midnight-zone',
    type: 'standard',
    depth: 1000,
    depthLabel: '1,000 METERS DEEP',
    minHeight: '350vh',
    subtitle: 'The Midnight Zone',
    stats: ['Pressure here is 100 times surface pressure.'],
    comparison: "That's like having 50 elephants standing on you.",
    note: 'Temperature: Near freezing.',
    creatures: [
      { creatureKey: 'monkfish', name: 'MONKFISH', x: 22, y: 12, size: 92, fact: 'Monkfish use a fleshy growth on their head to lure prey.' },
      { creatureKey: 'deepSeaShrimp', name: 'DEEP-SEA SHRIMP', x: 70, y: 28, size: 52, fact: 'Some deep-sea shrimp produce bioluminescent flashes to confuse predators.' },
      { creatureKey: 'jellyfish', name: 'BIOLUMINESCENT JELLYFISH', x: 45, y: 48, size: 88, fact: 'Deep-sea jellyfish produce light through chemical reactions in their bodies.', glow: true },
    ],
    floatingStats: ['The average ocean temperature is 4\u00b0C.'],
  },
  {
    id: 'deep-ocean',
    type: 'standard',
    depth: 2500,
    depthLabel: '2,500 METERS DEEP',
    minHeight: '300vh',
    subtitle: null,
    stats: ['More humans have been to space than to this depth.'],
    comparison: 'The Empire State Building stacked 2.7 times.',
    note: null,
    creatures: [
      { creatureKey: 'giantSquid', name: 'GIANT SQUID', x: 28, y: 15, size: 145, fact: 'Giant squid can grow up to 13 meters long \u2014 the size of a school bus.' },
      { creatureKey: 'gulperEel', name: 'GULPER EEL', x: 62, y: 50, size: 105, fact: 'The gulper eel can swallow prey much larger than itself.' },
    ],
    floatingStats: ['50\u201380% of all life on Earth is found underwater.'],
  },
  {
    id: 'abyssal-plain',
    type: 'standard',
    depth: 4000,
    depthLabel: '4,000 METERS DEEP',
    minHeight: '350vh',
    subtitle: 'The Abyssal Plain',
    stats: ['This is the average depth of the ocean.'],
    comparison: 'If you dropped the Grand Canyon into the ocean, it would vanish.',
    note: 'Pressure: 400 times surface pressure.',
    creatures: [
      { creatureKey: 'seaCucumber', name: 'SEA CUCUMBER', x: 18, y: 15, size: 72, fact: 'Sea cucumbers breathe through their rear end.' },
      { creatureKey: 'brittleStar', name: 'BRITTLE STAR', x: 58, y: 32, size: 82, fact: 'Brittle stars can regenerate lost arms \u2014 sometimes growing a new body from one arm.' },
      { creatureKey: 'anglerfish', name: 'ANGLERFISH', x: 38, y: 56, size: 92, fact: 'The anglerfish lure is a modified spine tipped with bioluminescent bacteria.', glow: true },
    ],
    floatingStats: [],
  },
  {
    id: 'hadal-zone',
    type: 'standard',
    depth: 6000,
    depthLabel: '6,000 METERS DEEP',
    minHeight: '300vh',
    subtitle: 'The Hadal Zone',
    stats: ['95% of the ocean floor has never been explored.'],
    comparison: 'At this depth, steel submarines begin to fail.',
    note: null,
    creatures: [
      { creatureKey: 'amphipod', name: 'DEEP TRENCH AMPHIPOD', x: 28, y: 22, size: 52, fact: 'Hadal amphipods survive crushing pressure that would destroy most organisms.' },
      { creatureKey: 'snailfish', name: 'SNAILFISH', x: 60, y: 42, size: 62, fact: 'The deepest fish ever recorded was found at 8,178 meters.' },
    ],
    floatingStats: ['The deepest fish ever recorded was found at 8,178m.'],
  },
  {
    id: 'everest-depth',
    type: 'standard',
    depth: 8848,
    depthLabel: '8,848 METERS DEEP',
    minHeight: '250vh',
    subtitle: 'Mount Everest Depth',
    stats: ['Even here, the ocean continues deeper.'],
    comparison: 'This is how deep Mount Everest is tall.',
    note: null,
    creatures: [
      { creatureKey: 'everestOutline', name: 'MT. EVEREST OUTLINE', x: 30, y: 18, size: 140, fact: 'At 8,848 meters, Everest is the tallest mountain on Earth \u2014 yet it would fit inside the ocean.' },
    ],
    floatingStats: [],
  },
  {
    id: 'mariana-trench',
    type: 'standard',
    depth: 10984,
    depthLabel: '10,984 METERS DEEP',
    minHeight: '350vh',
    subtitle: 'The Mariana Trench',
    stats: ['Pressure here is over 1,000 times surface pressure.'],
    comparison: 'Imagine 100 jumbo jets stacked on your body.',
    note: 'The trench is so deep that if you dropped Everest inside, the summit would be over 2 kilometers underwater.',
    creatures: [
      { creatureKey: 'marianaSnailfish', name: 'MARIANA SNAILFISH', x: 32, y: 22, size: 62, fact: 'The Mariana snailfish thrives at depths that would crush most organisms.' },
      { creatureKey: 'tinyAmphipod', name: 'TINY AMPHIPODS', x: 62, y: 42, size: 35, fact: 'These tiny creatures feed on organic matter sinking from thousands of meters above.' },
    ],
    floatingStats: [],
  },
  {
    id: 'ending',
    type: 'ending',
    depth: 10984,
    depthLabel: null,
    minHeight: '200vh',
    creatures: [],
  },
];
