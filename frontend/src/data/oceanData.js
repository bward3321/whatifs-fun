export const DEPTH_BREAKPOINTS = [
  { scroll: 0.00, depth: 0 },
  { scroll: 0.03, depth: 0 },
  { scroll: 0.10, depth: 10 },
  { scroll: 0.20, depth: 50 },
  { scroll: 0.30, depth: 200 },
  { scroll: 0.40, depth: 1000 },
  { scroll: 0.50, depth: 2500 },
  { scroll: 0.60, depth: 4000 },
  { scroll: 0.70, depth: 6000 },
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
    minHeight: '160vh',
    stats: [
      'Average ocean depth: 3,688 meters',
      'Deepest point: 10,984 meters',
    ],
    comparison: 'If Mount Everest were dropped into the ocean, its peak would still be underwater.',
    creatures: [
      { creatureKey: 'seagull', name: 'SEAGULL', x: 22, y: 4, size: 55, fact: 'Seagulls can drink both fresh and salt water thanks to special glands above their eyes.' },
      { creatureKey: 'dolphin', name: 'DOLPHIN', x: 58, y: 6, size: 78, fact: 'Dolphins sleep with one eye open and half their brain awake.' },
    ],
  },
  {
    id: 'swimming-depth',
    type: 'standard',
    depth: 10,
    depthLabel: '10 METERS DEEP',
    minHeight: '280vh',
    subtitle: 'Swimming Depth',
    stats: [
      'Most recreational divers never go below 18 meters.',
      'A blue whale\u2019s heart is the size of a small car.',
    ],
    comparison: 'Pressure here is already double what you feel at the surface.',
    note: null,
    creatures: [
      { creatureKey: 'diver', name: 'HUMAN DIVER', x: 25, y: 10, size: 90, fact: 'Recreational scuba diving is limited to about 40 meters depth.' },
      { creatureKey: 'snorkeler', name: 'SNORKELER', x: 60, y: 5, size: 80, fact: 'Snorkelers typically stay within 1-2 meters of the surface.' },
      { creatureKey: 'seaTurtle', name: 'SEA TURTLE', x: 75, y: 35, size: 88, fact: 'Sea turtles can hold their breath for up to 7 hours while sleeping.' },
      { creatureKey: 'blueWhale', name: 'BLUE WHALE', x: 15, y: 55, size: 160, fact: 'Blue whales are the largest animals to ever live on Earth \u2014 up to 30 meters long.' },
    ],
    floatingStats: ['The world\u2019s deepest swimming pool is 60 meters deep.'],
  },
  {
    id: 'coral-reef',
    type: 'standard',
    depth: 50,
    depthLabel: '49 METERS DEEP',
    minHeight: '400vh',
    subtitle: null,
    stats: [
      'This is deeper than a 15-story building is tall.',
      'Olympic diving pools are only 5 meters deep \u2014 10 times shallower than here.',
    ],
    comparison: null,
    note: 'Sunlight still visible.',
    creatures: [
      { creatureKey: 'coral', name: 'CORAL REEF', x: 8, y: 5, size: 105, fact: 'Coral reefs support 25% of all marine species despite covering less than 1% of the ocean floor.' },
      { creatureKey: 'stripedBass', name: 'STRIPED BASS', x: 50, y: 8, size: 72, fact: 'Striped bass can live up to 30 years in the wild.' },
      { creatureKey: 'clownfish', name: 'CLOWN FISH', x: 78, y: 32, size: 44, fact: 'All clownfish are born male \u2014 some later turn female.' },
      { creatureKey: 'barramundi', name: 'BARRAMUNDI', x: 30, y: 45, size: 68, fact: 'Barramundi can thrive in both freshwater and saltwater.' },
      { creatureKey: 'mantaRay', name: 'MANTA RAY', x: 52, y: 60, size: 105, fact: 'Manta rays have the largest brain-to-body ratio of any fish.' },
      { creatureKey: 'hammerheadShark', name: 'HAMMERHEAD SHARK', x: 12, y: 38, size: 95, fact: 'Hammerheads can detect electrical signals from prey hidden in sand.' },
    ],
    floatingStats: [
      'The ocean contains 99% of the Earth\u2019s living space.',
      'A group of jellyfish is called a \u201csmack.\u201d',
    ],
  },
  {
    id: 'edge-of-sunlight',
    type: 'standard',
    depth: 200,
    depthLabel: '200 METERS DEEP',
    minHeight: '350vh',
    subtitle: 'Edge of Sunlight',
    stats: [
      'Only 1% of sunlight reaches here.',
      'The Statue of Liberty (93m) would be fully submerged long before this.',
    ],
    comparison: 'Below this, the ocean begins to feel like space.',
    note: 'This is the end of the sunlight zone. Below here, photosynthesis is impossible.',
    creatures: [
      { creatureKey: 'haddock', name: 'HADDOCK', x: 62, y: 8, size: 65, fact: 'Haddock can be identified by a dark blotch above its pectoral fin.' },
      { creatureKey: 'chainCatshark', name: 'CHAIN CATSHARK', x: 28, y: 30, size: 115, fact: 'Named for its chain-like pattern of dark markings.' },
      { creatureKey: 'kelp', name: 'KELP', x: 8, y: 42, size: 100, fact: 'Giant kelp can grow up to 60 cm per day.' },
      { creatureKey: 'swordfish', name: 'SWORDFISH', x: 55, y: 50, size: 95, fact: 'Swordfish can swim at speeds up to 100 km/h \u2014 one of the fastest fish in the ocean.' },
      { creatureKey: 'octopus', name: 'OCTOPUS', x: 80, y: 35, size: 80, fact: 'Octopuses have three hearts, blue blood, and nine brains.' },
    ],
    floatingStats: [
      '80% of the ocean remains unmapped.',
      'We have better maps of Mars than of our own ocean floor.',
    ],
  },
  {
    id: 'midnight-zone',
    type: 'standard',
    depth: 1000,
    depthLabel: '1,000 METERS DEEP',
    minHeight: '400vh',
    subtitle: 'The Midnight Zone',
    stats: [
      'Pressure here is 100 times surface pressure.',
      'The Burj Khalifa (828m) would not even reach this depth.',
    ],
    comparison: "That's like having 50 elephants standing on you.",
    note: 'Temperature: Near freezing. No sunlight has ever reached here.',
    creatures: [
      { creatureKey: 'monkfish', name: 'MONKFISH', x: 20, y: 8, size: 92, fact: 'Monkfish use a fleshy growth on their head to lure prey.' },
      { creatureKey: 'deepSeaShrimp', name: 'DEEP-SEA SHRIMP', x: 72, y: 22, size: 55, fact: 'Some deep-sea shrimp produce bioluminescent flashes to confuse predators.' },
      { creatureKey: 'jellyfish', name: 'BIOLUMINESCENT JELLYFISH', x: 42, y: 42, size: 90, fact: 'Deep-sea jellyfish produce light through chemical reactions in their bodies.', glow: true },
      { creatureKey: 'lanternfish', name: 'LANTERNFISH', x: 68, y: 55, size: 55, fact: 'Lanternfish are the most abundant fish in the deep sea \u2014 billions of them migrate vertically every night.', glow: true },
      { creatureKey: 'vampireSquid', name: 'VAMPIRE SQUID', x: 15, y: 58, size: 75, fact: 'Despite its name, the vampire squid feeds on \u201cmarine snow\u201d \u2014 dead organic matter drifting from above.' },
    ],
    floatingStats: [
      'The average ocean temperature is 4\u00b0C.',
      '90% of all volcanic activity on Earth occurs in the ocean.',
    ],
  },
  {
    id: 'deep-ocean',
    type: 'standard',
    depth: 2500,
    depthLabel: '2,500 METERS DEEP',
    minHeight: '350vh',
    subtitle: null,
    stats: [
      'More humans have been to space than to this depth.',
      'The Titanic wreck lies at 3,800 meters \u2014 just 1,300 meters below this point.',
    ],
    comparison: 'The Empire State Building stacked 2.7 times would only just reach here.',
    note: null,
    creatures: [
      { creatureKey: 'giantSquid', name: 'GIANT SQUID', x: 25, y: 12, size: 150, fact: 'Giant squid can grow up to 13 meters long \u2014 the size of a school bus.' },
      { creatureKey: 'gulperEel', name: 'GULPER EEL', x: 62, y: 48, size: 110, fact: 'The gulper eel can swallow prey much larger than itself with its enormous mouth.' },
      { creatureKey: 'fangtooth', name: 'FANGTOOTH', x: 75, y: 22, size: 68, fact: 'The fangtooth has the largest teeth relative to body size of any fish in the ocean.' },
    ],
    floatingStats: [
      '50\u201380% of all life on Earth is found underwater.',
      'The ocean produces over 50% of the world\u2019s oxygen.',
    ],
  },
  {
    id: 'abyssal-plain',
    type: 'standard',
    depth: 4000,
    depthLabel: '4,000 METERS DEEP',
    minHeight: '400vh',
    subtitle: 'The Abyssal Plain',
    stats: [
      'This is the average depth of the ocean.',
      'It would take a heavy object about 1 hour to sink to this depth from the surface.',
    ],
    comparison: 'If you dropped the Grand Canyon into the ocean, it would vanish completely.',
    note: 'Pressure: 400 times surface pressure. A styrofoam cup here would be crushed to the size of a thimble.',
    creatures: [
      { creatureKey: 'seaCucumber', name: 'SEA CUCUMBER', x: 15, y: 10, size: 75, fact: 'Sea cucumbers breathe through their rear end.' },
      { creatureKey: 'brittleStar', name: 'BRITTLE STAR', x: 55, y: 28, size: 85, fact: 'Brittle stars can regenerate lost arms \u2014 sometimes growing a new body from one arm.' },
      { creatureKey: 'anglerfish', name: 'ANGLERFISH', x: 35, y: 50, size: 95, fact: 'The anglerfish lure is a modified spine tipped with bioluminescent bacteria.', glow: true },
      { creatureKey: 'tripodFish', name: 'TRIPOD FISH', x: 72, y: 8, size: 70, fact: 'Tripod fish prop themselves on elongated fins and face into the current, waiting for food to drift by.' },
      { creatureKey: 'dumboOctopus', name: 'DUMBO OCTOPUS', x: 78, y: 50, size: 72, fact: 'Named after Disney\u2019s Dumbo, this octopus flaps its ear-like fins to swim through the abyss.' },
    ],
    floatingStats: [
      'There are more artifacts in the ocean than in all the world\u2019s museums combined.',
    ],
  },
  {
    id: 'hadal-zone',
    type: 'standard',
    depth: 6000,
    depthLabel: '6,000 METERS DEEP',
    minHeight: '350vh',
    subtitle: 'The Hadal Zone',
    stats: [
      '95% of the ocean floor has never been explored.',
      'The deepest any human has scuba dived is only 332 meters \u2014 a tiny fraction of this depth.',
    ],
    comparison: 'At this depth, steel submarines begin to fail. The hull crumples like paper.',
    note: null,
    creatures: [
      { creatureKey: 'amphipod', name: 'DEEP TRENCH AMPHIPOD', x: 25, y: 18, size: 55, fact: 'Hadal amphipods survive crushing pressure that would destroy most organisms.' },
      { creatureKey: 'snailfish', name: 'SNAILFISH', x: 60, y: 38, size: 65, fact: 'The deepest fish ever recorded was found at 8,178 meters.' },
      { creatureKey: 'seaCucumber', name: 'HADAL SEA CUCUMBER', x: 42, y: 60, size: 60, fact: 'At extreme depths, sea cucumbers make up 90% of the biomass on the ocean floor.' },
    ],
    floatingStats: [
      'The deepest fish ever recorded was found at 8,178m.',
      'Sound travels 4.5 times faster in water than in air.',
    ],
  },
  {
    id: 'everest-depth',
    type: 'standard',
    depth: 8848,
    depthLabel: '8,848 METERS DEEP',
    minHeight: '280vh',
    subtitle: 'Mount Everest Depth',
    stats: [
      'Even here, the ocean continues deeper.',
      'Only 27 people have ever been deeper than 6,000 meters.',
    ],
    comparison: 'This is how deep Mount Everest is tall. If you placed the world\u2019s tallest mountain here, it would disappear.',
    note: 'The water pressure would crush you instantly \u2014 over 880 times atmospheric pressure.',
    creatures: [
      { creatureKey: 'everestOutline', name: 'MT. EVEREST OUTLINE', x: 28, y: 15, size: 145, fact: 'At 8,848 meters, Everest is the tallest mountain on Earth \u2014 yet it would fit inside the ocean.' },
    ],
    floatingStats: [],
  },
  {
    id: 'mariana-trench',
    type: 'standard',
    depth: 10984,
    depthLabel: '10,984 METERS DEEP',
    minHeight: '380vh',
    subtitle: 'The Mariana Trench',
    stats: [
      'Pressure here is over 1,000 times surface pressure.',
      'Only 3 people have ever visited the Challenger Deep: Jacques Piccard, Don Walsh, and James Cameron.',
    ],
    comparison: 'Imagine 100 jumbo jets stacked on your body. That is the weight of the water above you.',
    note: 'The trench is so deep that if you dropped Everest inside, the summit would be over 2 kilometers underwater.',
    creatures: [
      { creatureKey: 'marianaSnailfish', name: 'MARIANA SNAILFISH', x: 30, y: 18, size: 65, fact: 'The Mariana snailfish thrives at depths that would crush most organisms.' },
      { creatureKey: 'tinyAmphipod', name: 'TINY AMPHIPODS', x: 60, y: 38, size: 38, fact: 'These tiny creatures feed on organic matter sinking from thousands of meters above.' },
      { creatureKey: 'amphipod', name: 'SUPERGIANT AMPHIPOD', x: 45, y: 58, size: 48, fact: 'Supergiant amphipods at these depths can grow to 34 cm \u2014 30 times larger than their shallow-water cousins.' },
    ],
    floatingStats: [
      'If the ocean were drained, the Mariana Trench would still be the deepest scar on Earth\u2019s surface.',
      'Microplastics have been found even at the bottom of the Mariana Trench.',
    ],
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
