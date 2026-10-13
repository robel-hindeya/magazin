export interface MagazinePage {
  pageNumber: number;
  type: 'cover' | 'creature' | 'story' | 'puzzle';
  title: string;
  subtitle?: string;
  content: string;
  characterImage?: string;
  creatureStats?: {
    name: string;
    species: string;
    bravery: number;
    magic: number;
    speed: number;
    specialPower: string;
    favoriteSnack: string;
    author: string;
    authorAge: number;
  };
  puzzleQuestion?: string;
  puzzleOptions?: string[];
  correctAnswer?: number;
  orbsReward?: number;
}

export interface MagazineIssue {
  id: string;
  issueNumber: number;
  title: string;
  theme: string;
  editionName: string;
  releaseDate: string;
  gradient: string;
  borderGradient: string;
  bannerColor: string;
  badge: {
    text: string;
    color: string;
  };
  sticker: {
    text: string;
    bg: string;
  };
  characterMain: {
    src: string;
    alt: string;
    name: string;
  };
  characterSecondary: {
    src: string;
    alt: string;
    name: string;
  };
  headlines: string[];
  authorSpotlight: {
    name: string;
    age: number;
    location: string;
    avatar: string;
  };
  defaultRotation: string;
  defaultTranslateY: string;
  pages: MagazinePage[];
}

export const MAGAZINES: MagazineIssue[] = [
  {
    id: 'ancient-wonders',
    issueNumber: 1,
    title: "ANCIENT WONDERS! LALIBELA'S SECRETS",
    theme: 'Rock-Hewn Churches & Ancient Exploration',
    editionName: 'History & Exploration (Ages 7-10)',
    releaseDate: 'Free Edition',
    gradient: 'from-[#2e1808] via-[#4a2610] to-[#1a0c04]',
    borderGradient: 'from-amber-400 via-orange-400 to-yellow-300',
    bannerColor: 'bg-amber-500 text-slate-950',
    badge: {
      text: '★ HERITAGE SPOTLIGHT',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+75 POINTS & BADGE',
      bg: 'bg-amber-500 text-slate-950 shadow-amber-500/50',
    },
    characterMain: {
      src: '/images/magazines/ancient-wonders-lalibela.jpg',
      alt: 'Ancient Wonders Lalibela',
      name: 'Lalibela Young Explorers',
    },
    characterSecondary: {
      src: '/images/characters/walia-ibex.png',
      alt: 'Walia Ibex Guide',
      name: 'Walia Guide',
    },
    headlines: [
      "Carved from Living Rock: The Mystery of Bete Giyorgis!",
      'Underground Secret Passageways Beneath the Mountain',
      'Kid Explorers: Learn Ancient Ge\'ez Numbers and Carvings',
    ],
    authorSpotlight: {
      name: 'Dawit & Selam',
      age: 9,
      location: 'Lalibela, Ethiopia',
      avatar: '/images/characters/walia-ibex.png',
    },
    defaultRotation: '-rotate-2 md:-rotate-3',
    defaultTranslateY: 'translate-y-1',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: "ANCIENT WONDERS! LALIBELA'S SECRETS",
        subtitle: 'Selam Kids Magazine • Issue #01',
        content: 'Step into the highlands of Lasta where eleven miraculous churches were carved deep into solid volcanic rock over 800 years ago!',
        characterImage: '/images/magazines/ancient-wonders-lalibela.jpg',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Explorer Dossier: The Rock-Hewn Master Builders',
        subtitle: 'Architectural Genius of Medieval Ethiopia',
        content: 'Unlike normal buildings made of stones stacked on top of each other, Lalibela\'s churches were carved downward straight out of the mountain bedrock without a single nail or mortar!',
        characterImage: '/images/characters/walia-ibex.png',
        creatureStats: {
          name: 'The Living Stone of Lalibela',
          species: 'Historical Wonder',
          bravery: 98,
          magic: 96,
          speed: 85,
          specialPower: 'Bedrock Carving Geometry (solves structural puzzles and ancient riddles)',
          favoriteSnack: 'Honey Wine Bread & Roasted Barley (Kolo)',
          author: 'Dawit & Selam',
          authorAge: 9,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Secret Sunlight of Bete Giyorgis',
        subtitle: 'An adventure quest by Dawit & Selam',
        content: `Holding their explorer lanterns, Dawit and Selam stepped into the cool stone trench leading to the Church of Saint George. The massive cross-shaped roof lay perfectly level with the surrounding ground.

"Look at the carvings on the upper windows," whispered Selam, pointing her compass toward the morning sun. As the golden rays hit the sandstone, a hidden reflection revealed an ancient inscription welcoming young travelers who seek wisdom!`,
        characterImage: '/images/magazines/ancient-wonders-lalibela.jpg',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Lalibela Cross Word Quest',
        subtitle: 'Solve the riddle to claim 75 Points!',
        content: 'What unique architectural shape is the world-famous church of Bete Giyorgis carved into when viewed from the sky?',
        puzzleQuestion: 'What shape is Bete Giyorgis carved in?',
        puzzleOptions: ['A Greek Cross shape', 'A round circle', 'A triangle', 'A hexagon'],
        correctAnswer: 0,
        orbsReward: 75,
      },
    ],
  },
  {
    id: 'wild-highlands',
    issueNumber: 2,
    title: 'WILD HIGHLANDS! MEET THE BABOONS',
    theme: 'Simien Mountains National Park & Endemic Wildlife',
    editionName: 'Nature & Wildlife (Ages 7-10)',
    releaseDate: 'Free Edition',
    gradient: 'from-[#052e16] via-[#14532d] to-[#021f0f]',
    borderGradient: 'from-emerald-400 via-green-400 to-lime-300',
    bannerColor: 'bg-emerald-500 text-slate-950',
    badge: {
      text: '★ WILDLIFE HERO',
      color: 'bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+70 POINTS & BADGE',
      bg: 'bg-emerald-500 text-slate-950 shadow-emerald-500/50',
    },
    characterMain: {
      src: '/images/magazines/wild-highlands-baboon.jpg',
      alt: 'Wild Highlands Baboon',
      name: 'Simien Gelada Baboon',
    },
    characterSecondary: {
      src: '/images/characters/gelada-baboon.png',
      alt: 'Gelada Companion',
      name: 'Gelada Guardian',
    },
    headlines: [
      'Meet the Golden-Maned Gelada: The Singing Highland Grass-Eaters!',
      'Climbing the Simien Escarpment with the Walia Ibex',
      'Highland Ecology: How Afroalpine Plants Survive Frost',
    ],
    authorSpotlight: {
      name: 'Tigist B.',
      age: 10,
      location: 'Debark, Simien Mountains',
      avatar: '/images/characters/gelada-baboon.png',
    },
    defaultRotation: 'rotate-2 md:rotate-3',
    defaultTranslateY: 'translate-y-2',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'WILD HIGHLANDS! MEET THE BABOONS',
        subtitle: 'Selam Kids Magazine • Issue #02',
        content: 'Climb above 3,000 meters into the clouds of the Simien Mountains to meet Ethiopia’s iconic Gelada baboons and their golden manes!',
        characterImage: '/images/magazines/wild-highlands-baboon.jpg',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Gelada (ጭላዳ)',
        subtitle: 'The World’s Only Grass-Grazing Monkey',
        content: 'Gelada baboons spend 90% of their day grazing fresh highland alpine grasses and chatting with over 30 distinct vocal sounds that mimic human speech!',
        characterImage: '/images/characters/gelada-baboon.png',
        creatureStats: {
          name: 'The Golden-Maned Gelada',
          species: 'Theropithecus gelada',
          bravery: 94,
          magic: 92,
          speed: 95,
          specialPower: 'Cliffside Echo Voice (communicates across steep mountain canyons)',
          favoriteSnack: 'Tender Alpine Fescue Grass & Wild Thyme',
          author: 'Tigist B.',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Sunset Guard of the Simien Cliffs',
        subtitle: 'A wildlife adventure by Tigist B.',
        content: `As twilight painted the jagged Simien peaks in violet and gold, a troupe of two hundred Geladas gathered near the cliff edge.

The troop leader let out a soft rhythmic call, signaling everyone to make their nightly descent down the vertical rock face where no highland predator could reach them. Tigist sketched the majestic silhouette against the mountain sunset, amazed by their fearless agility!`,
        characterImage: '/images/magazines/wild-highlands-baboon.jpg',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Highland Wildlife Quiz',
        subtitle: 'Answer correctly to earn 70 Points!',
        content: 'What unique food makes up almost the entire diet of the Ethiopian Gelada baboon?',
        puzzleQuestion: 'What do Geladas primarily eat?',
        puzzleOptions: ['Fresh highland grass', 'Fish from mountain streams', 'Tree nuts', 'Insects only'],
        correctAnswer: 0,
        orbsReward: 70,
      },
    ],
  },
  {
    id: 'get-active',
    issueNumber: 50,
    title: 'GET ACTIVE! PLAY WITH FRIENDS',
    theme: 'Traditional Ethiopian Games, Football & Teamwork',
    editionName: 'Sports & Adventure (Ages 7-10)',
    releaseDate: 'Magazine 7-50',
    gradient: 'from-[#082f49] via-[#0369a1] to-[#021824]',
    borderGradient: 'from-cyan-400 via-sky-400 to-blue-300',
    bannerColor: 'bg-cyan-500 text-slate-950',
    badge: {
      text: '★ ACTIVE CHAMPIONS',
      color: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-black',
    },
    sticker: {
      text: '+65 POINTS & BADGE',
      bg: 'bg-cyan-500 text-slate-950 shadow-cyan-500/50',
    },
    characterMain: {
      src: '/images/magazines/get-active-sports.jpg',
      alt: 'Get Active Sports',
      name: 'Young Athletes Squad',
    },
    characterSecondary: {
      src: '/images/characters/ethiopian-wolf.png',
      alt: 'Swift Wolf Coach',
      name: 'Coach Red Fox',
    },
    headlines: [
      'Learn Traditional Games: Genna, Kora, and Ukalukal!',
      'Soccer Skills 101: Passing, Agility & Sportsmanship',
      'Fuel for Champions: Healthy Ethiopian Snacks for High Energy',
    ],
    authorSpotlight: {
      name: 'Yonas & Team',
      age: 10,
      location: 'Addis Ababa, Ethiopia',
      avatar: '/images/characters/ethiopian-wolf.png',
    },
    defaultRotation: '-rotate-1 md:-rotate-2',
    defaultTranslateY: 'translate-y-0',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'GET ACTIVE! PLAY WITH FRIENDS',
        subtitle: 'Selam Kids Magazine • Magazine 7-50',
        content: 'Lace up your sneakers and head to the sunny grassy fields! Learn traditional active games that get your heart pumping and team spirit soaring!',
        characterImage: '/images/magazines/get-active-sports.jpg',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Sports Spotlight: The Ancient Game of Genna',
        subtitle: 'Traditional Ethiopian Field Hockey',
        content: 'Played for over a thousand years across Ethiopian villages during the holiday season, Genna uses curved wooden sticks and a handmade wooden ball called a "rur"!',
        characterImage: '/images/characters/ethiopian-wolf.png',
        creatureStats: {
          name: 'The Highland Running Squad',
          species: 'Youth Sports Champion',
          bravery: 97,
          magic: 88,
          speed: 99,
          specialPower: 'Endurance Dash (runs with boundless stamina across every playground)',
          favoriteSnack: 'Whole Grain Enjera & Roasted Chickpeas',
          author: 'Yonas & Team',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Great Grassfield Championship',
        subtitle: 'A fast-paced story by Yonas',
        content: `The afternoon sun shone brightly over the open green field as five friends gathered around a black-and-white soccer ball.

"Remember," smiled coach Yonas, "winning is great, but encouraging each other on every single pass is what makes our squad unstoppable!" With quick footwork, laughter, and brilliant teamwork, the afternoon flew by in joy!`,
        characterImage: '/images/magazines/get-active-sports.jpg',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Sports & Teamwork Quiz',
        subtitle: 'Answer to claim 65 Glowing Points!',
        content: 'What is the most important skill that turns a good sports player into a great teammate?',
        puzzleQuestion: 'What makes a great teammate?',
        puzzleOptions: ['Encouraging and passing to friends', 'Playing alone without passing', 'Never practicing', 'Giving up when trailing'],
        correctAnswer: 0,
        orbsReward: 65,
      },
    ],
  },
  {
    id: 'get-creative',
    issueNumber: 48,
    title: 'GET CREATIVE! MAKE A MESOB',
    theme: 'Traditional Ethiopian Crafts, Art & Weaving',
    editionName: 'Creativity & Arts (Ages 7-10)',
    releaseDate: 'Magazine 7-10',
    gradient: 'from-[#3b0764] via-[#581c87] to-[#1e0533]',
    borderGradient: 'from-pink-400 via-fuchsia-400 to-rose-300',
    bannerColor: 'bg-pink-500 text-white',
    badge: {
      text: '★ CREATIVE MASTER',
      color: 'bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black',
    },
    sticker: {
      text: '+80 POINTS & BADGE',
      bg: 'bg-pink-500 text-white shadow-pink-500/50',
    },
    characterMain: {
      src: '/images/magazines/get-creative-mesob.jpg',
      alt: 'Get Creative Arts and Crafts',
      name: 'Young Ethiopian Artisans',
    },
    characterSecondary: {
      src: '/images/characters/mountain-nyala.png',
      alt: 'Creative Nyala',
      name: 'Nyala Color Weaver',
    },
    headlines: [
      'Step-by-Step: How to Weave a Colorful Mini Mesob Basket!',
      'Sculpting Ancient Gondar Castles with Clay and Paper',
      'Color Harmonies: Red, Yellow, Green in Ethiopian Folk Art',
    ],
    authorSpotlight: {
      name: 'Liya M.',
      age: 9,
      location: 'Hawassa, Ethiopia',
      avatar: '/images/characters/mountain-nyala.png',
    },
    defaultRotation: 'rotate-1 md:rotate-2',
    defaultTranslateY: 'translate-y-1',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'GET CREATIVE! MAKE A MESOB',
        subtitle: 'Selam Kids Magazine • Magazine 7-10',
        content: 'Grab your scissors, colored paper, colored yarn, and glue! Discover the centuries-old art of weaving the iconic Ethiopian Mesob dining table!',
        characterImage: '/images/magazines/get-creative-mesob.jpg',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Artisan Workshop: The Architecture of the Mesob',
        subtitle: 'Geometric Elegance in Everyday Ethiopian Life',
        content: 'A Mesob is a magnificent handwoven basket table that holds injera and platters. It represents unity, hospitality, and communal dining where families share meals from a single center.',
        characterImage: '/images/characters/mountain-nyala.png',
        creatureStats: {
          name: 'The Master Mesob Weaver',
          species: 'Creative Artisan',
          bravery: 92,
          magic: 99,
          speed: 88,
          specialPower: 'Vibrant Pattern Weaving (transforms plain fibers into dazzling geometric art)',
          favoriteSnack: 'Sweet Tea with Cardamom & Fresh Sambusa',
          author: 'Liya M.',
          authorAge: 9,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Little Green and Gold Basket',
        subtitle: 'A craft adventure by Liya M.',
        content: `Sitting at the round wooden garden table, Liya, Meron, and Natnael laid out their supplies: bright spools of yellow thread, red ribbons, and cardboard cones.

"First, we wrap the base tightly," explained Liya, demonstrating the spiral stitch. By afternoon, each young artist had created a miniature Mesob topped with a pointed crown, ready to display on their desk!`,
        characterImage: '/images/magazines/get-creative-mesob.jpg',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Craft & Color Challenge',
        subtitle: 'Complete to earn 80 Glowing Points!',
        content: 'What traditional material is traditionally dyed and woven to make durable authentic Ethiopian Mesobs?',
        puzzleQuestion: 'What are traditional Mesobs made from?',
        puzzleOptions: ['Dried grass and straw fibers', 'Hard plastic sheets', 'Metal wires only', 'Glass beads'],
        correctAnswer: 0,
        orbsReward: 80,
      },
    ],
  },
  {
    id: 'royal-castle',
    issueNumber: 46,
    title: 'THE ROYAL CASTLE! GONDAR KINGS',
    theme: 'Fasil Ghebbi Castles & Medieval History',
    editionName: 'History & Exploration (Ages 7-10)',
    releaseDate: 'Magazine 7-10',
    gradient: 'from-[#451a03] via-[#78350f] to-[#1c0a02]',
    borderGradient: 'from-amber-400 via-yellow-400 to-amber-200',
    bannerColor: 'bg-amber-500 text-slate-950',
    badge: {
      text: '★ ROYAL TREASURE',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+75 POINTS & BADGE',
      bg: 'bg-amber-500 text-slate-950 shadow-amber-500/50',
    },
    characterMain: {
      src: '/images/magazines/royal-castle-gondar.jpg',
      alt: 'Royal Castle Gondar Kings',
      name: 'Royal Gondar Explorers',
    },
    characterSecondary: {
      src: '/images/characters/abyssinian-lion.png',
      alt: 'Abyssinian Royal Lion',
      name: 'Emperor Lion',
    },
    headlines: [
      'The Medieval Stone Fortress: Inside Emperor Fasilides’ Castle!',
      'Secret Watchtowers, Drawbridges, and Ancient Royal Baths',
      'Fun History Quest: Decode the Gondar King Royal Seals',
    ],
    authorSpotlight: {
      name: 'Kaleb & Bethel',
      age: 10,
      location: 'Gondar, Ethiopia',
      avatar: '/images/characters/abyssinian-lion.png',
    },
    defaultRotation: '-rotate-2 md:-rotate-3',
    defaultTranslateY: 'translate-y-2',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'THE ROYAL CASTLE! GONDAR KINGS',
        subtitle: 'Selam Kids Magazine • Magazine 7-10',
        content: 'Walk through the grand stone gates of Gondar, the Camelot of Africa! Explore fairy-tale castles, stone turrets, and medieval royal legends!',
        characterImage: '/images/magazines/royal-castle-gondar.jpg',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Historical Dossier: The Castle of Fasil Ghebbi',
        subtitle: 'UNESCO World Heritage City of Gondar',
        content: 'Founded in 1636 by Emperor Fasilides, the Royal Enclosure contains six stone castles, battlement walls, royal libraries, and banquet halls that have stood for centuries!',
        characterImage: '/images/characters/abyssinian-lion.png',
        creatureStats: {
          name: 'The Royal Sovereign of Gondar',
          species: 'Imperial Heritage',
          bravery: 100,
          magic: 94,
          speed: 86,
          specialPower: 'Fortress History Cipher (unlocks historical secrets and ancient stone archives)',
          favoriteSnack: 'Roasted Barley with Golden Honey',
          author: 'Kaleb & Bethel',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Mystery of the Castle Turret',
        subtitle: 'A historical mystery by Kaleb & Bethel',
        content: `Standing on the cobblestone walkway before the great stone tower, Kaleb and Bethel looked up at the crenellated walls.

"Legend says that Emperor Fasilides designed this tower so guards could see all the way to Lake Tana on a clear day," Kaleb explained. As they climbed the spiral staircase, a gentle breeze swept through the stone arch, carrying whispers of glorious history!`,
        characterImage: '/images/magazines/royal-castle-gondar.jpg',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Castle History Mystery',
        subtitle: 'Solve to claim 75 Glowing Points!',
        content: 'Which famous Ethiopian Emperor built the magnificent primary stone castle inside Gondar’s Royal Enclosure in the 17th century?',
        puzzleQuestion: 'Who founded Gondar’s famous primary castle?',
        puzzleOptions: ['Emperor Fasilides', 'Emperor Menelik I', 'King Ezana', 'Emperor Tewodros II'],
        correctAnswer: 0,
        orbsReward: 75,
      },
    ],
  },
];

export function getAllMagazines(): MagazineIssue[] {
  return [...MAGAZINES];
}

export function getLatestMagazine(): MagazineIssue {
  return MAGAZINES[0];
}

export function getEditionLabel(magazine?: MagazineIssue): string {
  if (!magazine) return 'LATEST EDITION';
  if (magazine.releaseDate) {
    const upper = magazine.releaseDate.toUpperCase();
    return upper.includes('EDITION') ? upper : `${upper} EDITION`;
  }
  if (magazine.editionName) {
    const upper = magazine.editionName.toUpperCase();
    return upper.includes('EDITION') ? upper : `${upper} EDITION`;
  }
  return 'LATEST EDITION';
}

export function getMagazineById(id: string): MagazineIssue | undefined {
  return MAGAZINES.find((m) => m.id === id || String(m.issueNumber) === id);
}


