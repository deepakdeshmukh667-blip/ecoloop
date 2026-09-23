/**
 * Balanced Dataset & Feature Signatures for Real Waste Classification
 * 
 * Covers 7 balanced categories:
 * 1. Wet Waste (Organic, kitchen scraps, food leftovers, vegetable peels, compostable)
 * 2. Dry Waste (General recyclable, clean non-biodegradable discards)
 * 3. Plastic (PET bottles, polythene bags, packaging films, containers, milk packets)
 * 4. Paper (Cardboard cartons, newspapers, magazines, office papers, paper bags)
 * 5. Glass (Clear/amber/green bottles, jars, glassware)
 * 6. Metal (Aluminium cans, tin food cans, foil wraps, bottle caps)
 * 7. E-Waste (Electronic cords, batteries, PCBs, chargers, gadget parts)
 */

export interface WasteCategoryProfile {
  id: string;
  name: string;
  slug: 'wet' | 'dry' | 'plastic' | 'paper' | 'glass' | 'metal' | 'e-waste';
  parentBin: 'wet' | 'dry' | 'special';
  binName: string;
  binColor: string;
  description: string;
  examples: string[];
  sortingGuidelines: string;
  // Feature weights for computer vision classifier
  opticalProfile: {
    // HSV hue ranges characteristic of this category [minHue, maxHue] (0-360)
    hueRanges: [number, number][];
    // Expected saturation range [min, max] (0-1)
    saturationRange: [number, number];
    // Expected value/brightness range [min, max] (0-1)
    valueRange: [number, number];
    // Expected specular highlight reflection ratio (0-1)
    specularRatioRange: [number, number];
    // Expected surface texture roughness / edge density (0-1)
    textureRoughnessRange: [number, number];
    // Distinctive material markers
    metallicScore: number;
    organicScore: number;
    fibrousScore: number;
    syntheticPolymerScore: number;
    glassTransparencyScore: number;
    electronicCircuitScore: number;
  };
  // Prototypes for balanced classification distance metric
  prototypes: Array<{
    name: string;
    description: string;
    avgRgb: [number, number, number];
    avgHsv: [number, number, number]; // [0-360, 0-1, 0-1]
    specularRatio: number;
    edgeDensity: number;
  }>;
}

export const BALANCED_WASTE_DATASET: Record<string, WasteCategoryProfile> = {
  wet: {
    id: 'cat-wet',
    name: 'Wet Waste',
    slug: 'wet',
    parentBin: 'wet',
    binName: 'Green Compost Bin',
    binColor: '#10B981',
    description: 'Biodegradable kitchen and household waste: vegetable & fruit peels, food leftovers, coffee grounds, eggshells, and garden trims.',
    examples: ['Vegetable peels', 'Fruit rinds', 'Food scraps', 'Tea leaves', 'Coffee grounds', 'Egg shells', 'Cooked food leftovers', 'Plant clippings'],
    sortingGuidelines: 'Drain excess liquids. Do not wrap in plastic or polythene bags before depositing in the green bin.',
    opticalProfile: {
      hueRanges: [[20, 60], [60, 160], [15, 45]], // Browns, organic greens, peel yellows/oranges
      saturationRange: [0.15, 0.75],
      valueRange: [0.15, 0.75],
      specularRatioRange: [0.01, 0.12], // Low specularity (matte/moist, non-reflective)
      textureRoughnessRange: [0.35, 0.85], // High organic texture roughness
      metallicScore: 0.0,
      organicScore: 0.95,
      fibrousScore: 0.2,
      syntheticPolymerScore: 0.0,
      glassTransparencyScore: 0.0,
      electronicCircuitScore: 0.0,
    },
    prototypes: [
      { name: 'Vegetable Scraps', description: 'Carrot ends, potato skins, cabbage leaves', avgRgb: [102, 128, 68], avgHsv: [86, 0.47, 0.50], specularRatio: 0.04, edgeDensity: 0.55 },
      { name: 'Fruit Rinds', description: 'Banana peels, orange skins, melon rinds', avgRgb: [184, 138, 48], avgHsv: [40, 0.74, 0.72], specularRatio: 0.05, edgeDensity: 0.48 },
      { name: 'Coffee Grounds & Tea', description: 'Spent coffee grounds, brewed tea leaves', avgRgb: [68, 48, 32], avgHsv: [27, 0.53, 0.27], specularRatio: 0.02, edgeDensity: 0.65 },
      { name: 'Cooked Leftovers', description: 'Rice, dal, cooked vegetables', avgRgb: [160, 120, 75], avgHsv: [32, 0.53, 0.63], specularRatio: 0.07, edgeDensity: 0.42 },
      { name: 'Eggshells', description: 'Cracked white and brown eggshells', avgRgb: [210, 185, 160], avgHsv: [30, 0.24, 0.82], specularRatio: 0.06, edgeDensity: 0.58 },
    ],
  },

  dry: {
    id: 'cat-dry',
    name: 'Dry Waste',
    slug: 'dry',
    parentBin: 'dry',
    binName: 'Blue Recyclables Bin',
    binColor: '#0284C7',
    description: 'General recyclable, non-biodegradable, clean dry discards without food residue.',
    examples: ['Clean dry packaging', 'Composite cartons', 'Dry cardboard', 'Mixed recyclables', 'Clean containers'],
    sortingGuidelines: 'Rinse and dry all containers. Ensure zero wet food contamination before bin deposit.',
    opticalProfile: {
      hueRanges: [[0, 360]], // Broad spectrum
      saturationRange: [0.05, 0.80],
      valueRange: [0.25, 0.95],
      specularRatioRange: [0.05, 0.40],
      textureRoughnessRange: [0.20, 0.60],
      metallicScore: 0.2,
      organicScore: 0.05,
      fibrousScore: 0.4,
      syntheticPolymerScore: 0.4,
      glassTransparencyScore: 0.1,
      electronicCircuitScore: 0.0,
    },
    prototypes: [
      { name: 'Clean Dry Packaging', description: 'Mixed clean cardboard and packaging', avgRgb: [180, 175, 165], avgHsv: [40, 0.08, 0.71], specularRatio: 0.12, edgeDensity: 0.40 },
      { name: 'Dry Recyclables Assortment', description: 'Rinsed clean non-organic containers', avgRgb: [140, 160, 175], avgHsv: [205, 0.20, 0.69], specularRatio: 0.18, edgeDensity: 0.45 },
    ],
  },

  plastic: {
    id: 'cat-plastic',
    name: 'Plastic',
    slug: 'plastic',
    parentBin: 'dry',
    binName: 'Blue Recyclables Bin',
    binColor: '#0284C7',
    description: 'Rigid plastics, PET water and soda bottles, HDPE jugs, snack wrappers, and polythene carry bags.',
    examples: ['Water bottles (PET)', 'Soda bottles', 'Polythene carry bags', 'Snack wrappers', 'Milk pouches', 'Detergent containers', 'Plastic lids & caps'],
    sortingGuidelines: 'Flatten PET bottles to save bin space. Empty and rinse milk packets and oil pouches.',
    opticalProfile: {
      hueRanges: [[180, 240], [340, 360], [0, 25], [45, 65]], // Vivid synthetic dye hues (PET blues, vivid reds, bright yellow/white)
      saturationRange: [0.20, 0.95], // Synthetic vivid saturation
      valueRange: [0.30, 0.98],
      specularRatioRange: [0.15, 0.60], // High specular gloss & reflection highlights
      textureRoughnessRange: [0.10, 0.45], // Smooth polymer surface with sharp crease edges
      metallicScore: 0.05,
      organicScore: 0.0,
      fibrousScore: 0.0,
      syntheticPolymerScore: 0.95,
      glassTransparencyScore: 0.25,
      electronicCircuitScore: 0.0,
    },
    prototypes: [
      { name: 'Clear PET Bottle', description: 'Water/beverage plastic bottle with reflection glare', avgRgb: [175, 200, 215], avgHsv: [202, 0.19, 0.84], specularRatio: 0.35, edgeDensity: 0.32 },
      { name: 'Colored Snack Wrapper', description: 'Crinkled glossy multi-layer packaging film', avgRgb: [210, 60, 50], avgHsv: [4, 0.76, 0.82], specularRatio: 0.28, edgeDensity: 0.52 },
      { name: 'HDPE Milk Pouch / Jug', description: 'Opaque white or tinted rigid plastic container', avgRgb: [230, 232, 235], avgHsv: [216, 0.02, 0.92], specularRatio: 0.24, edgeDensity: 0.28 },
      { name: 'Polythene Carry Bag', description: 'Thin film grocery bag with wrinkles', avgRgb: [195, 205, 200], avgHsv: [150, 0.05, 0.80], specularRatio: 0.22, edgeDensity: 0.46 },
    ],
  },

  paper: {
    id: 'cat-paper',
    name: 'Paper & Cardboard',
    slug: 'paper',
    parentBin: 'dry',
    binName: 'Blue Recyclables Bin',
    binColor: '#0284C7',
    description: 'Corrugated cardboard boxes, brown delivery parcels, newspapers, magazines, office papers, and paper bags.',
    examples: ['Cardboard delivery boxes', 'Newspapers', 'Magazines', 'Office printer paper', 'Paper bags', 'Egg cartons', 'Clean envelopes'],
    sortingGuidelines: 'Flatten all cardboard boxes. Keep free of food grease (greasy pizza boxes belong in wet waste).',
    opticalProfile: {
      hueRanges: [[25, 48], [190, 230]], // Warm kraft cardboard tan/brown, or bleached/newsprint cool grey
      saturationRange: [0.05, 0.50], // Low to moderate saturation (matte natural cellulose)
      valueRange: [0.45, 0.95],
      specularRatioRange: [0.0, 0.06], // Very low specular reflectance (matte paper fiber)
      textureRoughnessRange: [0.15, 0.45], // Fibrous, planar matte texture with straight edges
      metallicScore: 0.0,
      organicScore: 0.20,
      fibrousScore: 0.95,
      syntheticPolymerScore: 0.05,
      glassTransparencyScore: 0.0,
      electronicCircuitScore: 0.0,
    },
    prototypes: [
      { name: 'Brown Kraft Cardboard', description: 'Corrugated parcel box surface', avgRgb: [190, 150, 105], avgHsv: [32, 0.45, 0.75], specularRatio: 0.02, edgeDensity: 0.25 },
      { name: 'Newspaper Print', description: 'Printed gray/white paper sheet with text lines', avgRgb: [215, 215, 212], avgHsv: [60, 0.01, 0.84], specularRatio: 0.01, edgeDensity: 0.42 },
      { name: 'Office Document', description: 'Clean white copier paper', avgRgb: [242, 243, 245], avgHsv: [220, 0.01, 0.96], specularRatio: 0.03, edgeDensity: 0.20 },
      { name: 'Paper Bag', description: 'Recycled brown grocery bag', avgRgb: [175, 140, 95], avgHsv: [34, 0.46, 0.69], specularRatio: 0.02, edgeDensity: 0.30 },
    ],
  },

  glass: {
    id: 'cat-glass',
    name: 'Glass',
    slug: 'glass',
    parentBin: 'dry',
    binName: 'Blue Recyclables Bin',
    binColor: '#0284C7',
    description: 'Clear, green, and amber glass bottles, condiment jars, and clean glassware.',
    examples: ['Clear glass bottles', 'Green beverage bottles', 'Amber medicine/beer bottles', 'Jam jars', 'Broken glassware (wrapped)'],
    sortingGuidelines: 'Remove metal or plastic caps. Wrap broken glass securely in paper before placing in bin to protect sanitation staff.',
    opticalProfile: {
      hueRanges: [[80, 150], [25, 45], [180, 220]], // Emerald green glass, amber brown glass, or clear refracted tint
      saturationRange: [0.05, 0.85],
      valueRange: [0.25, 0.95],
      specularRatioRange: [0.25, 0.75], // High refractive specular glints and caustics
      textureRoughnessRange: [0.08, 0.35], // Smooth glossy surface with sharp specular highlights
      metallicScore: 0.10,
      organicScore: 0.0,
      fibrousScore: 0.0,
      syntheticPolymerScore: 0.15,
      glassTransparencyScore: 0.95,
      electronicCircuitScore: 0.0,
    },
    prototypes: [
      { name: 'Clear Glass Jar', description: 'Transparent condiment jar with bright specular rims', avgRgb: [195, 210, 215], avgHsv: [195, 0.09, 0.84], specularRatio: 0.48, edgeDensity: 0.30 },
      { name: 'Green Glass Bottle', description: 'Dark emerald beverage bottle with refractive highlights', avgRgb: [45, 95, 60], avgHsv: [138, 0.53, 0.37], specularRatio: 0.42, edgeDensity: 0.35 },
      { name: 'Amber Glass Bottle', description: 'Brown amber pharmaceutical or beer bottle', avgRgb: [115, 65, 25], avgHsv: [27, 0.78, 0.45], specularRatio: 0.38, edgeDensity: 0.32 },
    ],
  },

  metal: {
    id: 'cat-metal',
    name: 'Metal',
    slug: 'metal',
    parentBin: 'dry',
    binName: 'Blue Recyclables Bin',
    binColor: '#0284C7',
    description: 'Aluminium beverage cans, tin food cans, metal bottle caps, foil packaging, and metal scrap.',
    examples: ['Aluminium beverage cans', 'Tin food cans', 'Aluminium foil wraps', 'Metal bottle crowns', 'Aerosol cans (empty)', 'Metal jar lids'],
    sortingGuidelines: 'Ensure aerosol cans are completely depressurized. Rinse food residue from tin cans.',
    opticalProfile: {
      hueRanges: [[0, 360]], // Silvery neutral or golden/bronze tin
      saturationRange: [0.0, 0.35], // Low chromatic saturation (silvery/metallic gray)
      valueRange: [0.40, 0.98], // High metallic reflectance
      specularRatioRange: [0.30, 0.80], // Very high specular metallic highlights
      textureRoughnessRange: [0.15, 0.40], // Concentric ridge patterns, cylindrical contours
      metallicScore: 0.95,
      organicScore: 0.0,
      fibrousScore: 0.0,
      syntheticPolymerScore: 0.05,
      glassTransparencyScore: 0.05,
      electronicCircuitScore: 0.05,
    },
    prototypes: [
      { name: 'Aluminium Soda Can', description: 'Cylindrical can with metallic sheen and lip rim', avgRgb: [185, 190, 195], avgHsv: [210, 0.05, 0.76], specularRatio: 0.55, edgeDensity: 0.38 },
      { name: 'Tin Food Can', description: 'Ribbed steel food tin with reflective surface', avgRgb: [170, 172, 175], avgHsv: [215, 0.03, 0.69], specularRatio: 0.48, edgeDensity: 0.45 },
      { name: 'Aluminium Foil Sheet', description: 'Crinkled highly reflective foil wrap', avgRgb: [210, 215, 220], avgHsv: [210, 0.05, 0.86], specularRatio: 0.65, edgeDensity: 0.60 },
    ],
  },

  'e-waste': {
    id: 'cat-special',
    name: 'E-Waste',
    slug: 'e-waste',
    parentBin: 'special',
    binName: 'Red Sealed Hazard Bag',
    binColor: '#EA580C',
    description: 'Electronic cords, mobile phone accessories, dry cell batteries, circuit boards (PCBs), and discarded small appliances.',
    examples: ['USB charging cables', 'Dry cell batteries (AA/AAA)', 'Circuit boards (PCBs)', 'Mobile chargers', 'Computer cables', 'Remote controls'],
    sortingGuidelines: 'Do not mix with wet or dry recyclables. Place in red sealed bag for specialized electronic recycling.',
    opticalProfile: {
      hueRanges: [[120, 160], [200, 240], [0, 40]], // PCB green, wire insulation blue/red, copper traces
      saturationRange: [0.20, 0.90],
      valueRange: [0.15, 0.85],
      specularRatioRange: [0.10, 0.45], // Metallic pins and glossy plastic housing
      textureRoughnessRange: [0.45, 0.90], // High frequency discrete components (chips, pins, wire coils)
      metallicScore: 0.50,
      organicScore: 0.0,
      fibrousScore: 0.0,
      syntheticPolymerScore: 0.40,
      glassTransparencyScore: 0.0,
      electronicCircuitScore: 0.95,
    },
    prototypes: [
      { name: 'Printed Circuit Board (PCB)', description: 'Green solder mask with copper tracks and IC chips', avgRgb: [35, 115, 65], avgHsv: [142, 0.70, 0.45], specularRatio: 0.22, edgeDensity: 0.75 },
      { name: 'USB Charging Cable', description: 'Coiled black/white insulated cord with metallic connector', avgRgb: [40, 42, 45], avgHsv: [220, 0.11, 0.18], specularRatio: 0.18, edgeDensity: 0.52 },
      { name: 'AA / AAA Dry Cell Battery', description: 'Cylindrical metal-jacket battery with positive terminal', avgRgb: [85, 90, 100], avgHsv: [220, 0.15, 0.39], specularRatio: 0.32, edgeDensity: 0.48 },
      { name: 'Power Adapter / Charger', description: 'Molded plastic charger brick with metal wall prongs', avgRgb: [220, 220, 225], avgHsv: [240, 0.02, 0.88], specularRatio: 0.25, edgeDensity: 0.35 },
    ],
  },
};
