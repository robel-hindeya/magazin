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
    issueNumber: 60,
    title: "ANCIENT WONDERS! LALIBELA'S SECRETS",
    theme: 'Rock-Hewn Churches & Ancient Exploration',
    editionName: 'History & Exploration (Ages 7-10)',
    releaseDate: 'Issue 7-60',
    gradient: 'from-[#2e1808] via-[#4a2610] to-[#1a0c04]',
    borderGradient: 'from-amber-400 via-orange-400 to-yellow-300',
    bannerColor: 'bg-amber-500 text-slate-950',
    badge: {
      text: '★ HERITAGE SPOTLIGHT',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+75 ORBS & BADGE',
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
        subtitle: 'Selam Kids Magazine • Issue 7-60',
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
        subtitle: 'Solve the riddle to claim 75 Orbs!',
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
    issueNumber: 58,
    title: 'WILD HIGHLANDS! MEET THE BABOONS',
    theme: 'Simien Mountains National Park & Endemic Wildlife',
    editionName: 'Nature & Wildlife (Ages 7-10)',
    releaseDate: 'Issue 7-60',
    gradient: 'from-[#052e16] via-[#14532d] to-[#021f0f]',
    borderGradient: 'from-emerald-400 via-green-400 to-lime-300',
    bannerColor: 'bg-emerald-500 text-slate-950',
    badge: {
      text: '★ WILDLIFE HERO',
      color: 'bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+70 ORBS & BADGE',
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
        subtitle: 'Selam Kids Magazine • Issue 7-60',
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
        subtitle: 'Answer correctly to earn 70 Orbs!',
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
    releaseDate: 'Magazite 7-50',
    gradient: 'from-[#082f49] via-[#0369a1] to-[#021824]',
    borderGradient: 'from-cyan-400 via-sky-400 to-blue-300',
    bannerColor: 'bg-cyan-500 text-slate-950',
    badge: {
      text: '★ ACTIVE CHAMPIONS',
      color: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-black',
    },
    sticker: {
      text: '+65 ORBS & BADGE',
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
        subtitle: 'Selam Kids Magazine • Magazite 7-50',
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
        subtitle: 'Answer to claim 65 Glowing Orbs!',
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
    releaseDate: 'Magazita 7-10',
    gradient: 'from-[#3b0764] via-[#581c87] to-[#1e0533]',
    borderGradient: 'from-pink-400 via-fuchsia-400 to-rose-300',
    bannerColor: 'bg-pink-500 text-white',
    badge: {
      text: '★ CREATIVE MASTER',
      color: 'bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black',
    },
    sticker: {
      text: '+80 ORBS & BADGE',
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
        subtitle: 'Selam Kids Magazine • Magazita 7-10',
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
        subtitle: 'Complete to earn 80 Glowing Orbs!',
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
    releaseDate: 'Magazite 7-10',
    gradient: 'from-[#451a03] via-[#78350f] to-[#1c0a02]',
    borderGradient: 'from-amber-400 via-yellow-400 to-amber-200',
    bannerColor: 'bg-amber-500 text-slate-950',
    badge: {
      text: '★ ROYAL TREASURE',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+75 ORBS & BADGE',
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
        subtitle: 'Selam Kids Magazine • Magazite 7-10',
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
        subtitle: 'Solve to claim 75 Glowing Orbs!',
        content: 'Which famous Ethiopian Emperor built the magnificent primary stone castle inside Gondar’s Royal Enclosure in the 17th century?',
        puzzleQuestion: 'Who founded Gondar’s famous primary castle?',
        puzzleOptions: ['Emperor Fasilides', 'Emperor Menelik I', 'King Ezana', 'Emperor Tewodros II'],
        correctAnswer: 0,
        orbsReward: 75,
      },
    ],
  },
  {
    id: 'issue-45',
    issueNumber: 45,
    title: 'GALACTIC ODYSSEY & COSMIC COMETS',
    theme: 'Deep Space Stars & Supernova Beasts',
    editionName: 'Starlight Cyber Edition',
    releaseDate: 'Winter 2026',
    gradient: 'from-[#1e1035] via-[#3b1261] to-[#0f0728]',
    borderGradient: 'from-cyan-400 via-fuchsia-400 to-amber-300',
    bannerColor: 'bg-cyan-400 text-slate-950',
    badge: {
      text: '★ PREMIERE ISSUE',
      color: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-black',
    },
    sticker: {
      text: '+60 ORBS & BADGE',
      bg: 'bg-fuchsia-500 text-white shadow-fuchsia-500/50',
    },
    characterMain: {
      src: '/images/characters/sonic.png',
      alt: 'Sonic Cosmic Runner',
      name: 'Sonic Supersonic',
    },
    characterSecondary: {
      src: '/images/characters/scrat.png',
      alt: 'Scrat Cosmic Squirrel',
      name: 'Scrat Asteroid Seeker',
    },
    headlines: [
      'Sonic Breaks the Hyper-Drive Sound Barrier in Outer Space!',
      'Scrat Discovers the Legendary Golden Acorn Nebula!',
      'Young Author Showcase: 12 Stellar Poems from Orbit',
    ],
    authorSpotlight: {
      name: 'Amara K.',
      age: 11,
      location: 'Nairobi, Kenya',
      avatar: '/images/characters/sonic.png',
    },
    defaultRotation: '-rotate-3 md:-rotate-4',
    defaultTranslateY: 'translate-y-2 md:translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'GALACTIC ODYSSEY & COSMIC COMETS',
        subtitle: 'The Official Selam Kids Magazine • Issue #45',
        content: 'Zoom across dazzling star clusters where Sonic and Scrat leap across crystal asteroid belts to rescue starlight ink bottles!',
        characterImage: '/images/characters/sonic.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Supersonic Comet Hedgehog',
        subtitle: 'Authored by Young Creator Amara (Age 11)',
        content: 'Accelerating through the vacuum of space at light speed, Sonic leaves trails of neon glowing adjectives that illuminate the entire cosmos.',
        characterImage: '/images/characters/sonic.png',
        creatureStats: {
          name: 'Sonic the Nebula Dasher',
          species: 'Cosmic Hedgehog',
          bravery: 100,
          magic: 95,
          speed: 100,
          specialPower: 'Super Spin Dash Metaphor (shatters boring sentences into dazzling prose)',
          favoriteSnack: 'Chili Dogs Wrapped in Stardust Bread',
          author: 'Amara K.',
          authorAge: 11,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'Race to the Acorn Nebula',
        subtitle: 'A high-speed space comedy written by Amara K.',
        content: `When Scrat accidentally dropped his floating crystal acorn into an intergalactic warp pipe, Sonic knew what to do.

"Hold on tight, buddy!" Sonic yelled, curling into a roaring cyan streak of lightning. They zipped through planetary rings of sapphire dust, dodging gravity vortices and laughing into the solar wind. With one final spin jump, Sonic grabbed the acorn mid-orbit, and the entire galaxy burst into twinkling applause!`,
        characterImage: '/images/characters/scrat.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Cosmic Speed Word Warp & Orb Claim',
        subtitle: 'Solve the cosmic synonym to claim your 60 Glowing Orbs!',
        content: 'Which vivid word best captures Sonic blasting past shooting stars at lightning speed?',
        puzzleQuestion: 'Choose the most energetic adverb:',
        puzzleOptions: [
          'A) Slowly',
          'B) Breathlessly & Exhilaratingly',
          'C) Okay',
          'D) Casually',
        ],
        correctAnswer: 1,
        orbsReward: 60,
      },
    ],
  },
  {
    id: 'issue-44',
    issueNumber: 44,
    title: 'DRAGON SKIES & THE COSMIC PORTAL',
    theme: 'Dragon Galaxies & Astral Beasts',
    editionName: 'Special Starlight Edition',
    releaseDate: 'Autumn 2026',
    gradient: 'from-[#2e0854] via-[#4c1d95] to-[#1e1b4b]',
    borderGradient: 'from-amber-400 via-purple-400 to-cyan-400',
    bannerColor: 'bg-amber-400 text-slate-950',
    badge: {
      text: '★ NEW ISSUE',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+50 ORBS INSIDE!',
      bg: 'bg-rose-500 text-white shadow-rose-500/50',
    },
    characterMain: {
      src: '/images/characters/toothless.png',
      alt: 'Toothless Night Dragon',
      name: 'Shadow Dragon',
    },
    characterSecondary: {
      src: '/images/characters/pikachu.png',
      alt: 'Pikachu Spark Beast',
      name: 'Thunder Sprite',
    },
    headlines: [
      'Top 10 Wildest Creatures Authored by Kids This Month!',
      'The Shadow Beast Riddle: Can Your Adjectives Defeat It?',
      'Exclusive: Inside the Secret Starlight Library',
    ],
    authorSpotlight: {
      name: 'Leo M.',
      age: 9,
      location: 'London, UK',
      avatar: '/images/characters/pikachu.png',
    },
    defaultRotation: '-rotate-4 md:-rotate-5',
    defaultTranslateY: 'translate-y-3 md:translate-y-4',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'DRAGON SKIES & THE COSMIC PORTAL',
        subtitle: 'The Official Selam Kids Magazine • Issue #44',
        content: 'Dive into the mysterious northern constellations where Toothless and Thunder Sprite guard the ancient Word Tree from dark shadows.',
        characterImage: '/images/characters/toothless.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Astral Thunder-Dragon',
        subtitle: 'Discovered and authored by Young Author Leo (Age 9)',
        content: 'When the night sky fills with neon aurora clouds, this magnificent dragon glides through the cosmos collecting glowing punctuation marks to light up ancient storybooks.',
        characterImage: '/images/characters/toothless.png',
        creatureStats: {
          name: 'Toothless the Night Fury',
          species: 'Cosmic Sky Serpent',
          bravery: 98,
          magic: 96,
          speed: 99,
          specialPower: 'Plasma Word-Breath (turns dull nouns into vivid magical verbs)',
          favoriteSnack: 'Starfruit Pies & Crispy Lightning Seeds',
          author: 'Leo M.',
          authorAge: 9,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Boy Who Whispered to the Aurora Dragon',
        subtitle: 'Award-winning story from the Summer Creative Contest',
        content: `Once upon a midnight in the Whispering Heights, Maya discovered an emerald scroll wrapped in silver vines. 
        
"Don't read it out loud!" warned Pikachu, sparking with excitement. But Maya was brave. She cleared her throat and pronounced the ancient spell: "VIVIDUS ADJECTIVUS!"

Instantly, the clouds parted, and Toothless descended from the cosmic sky. His wings were woven from purple stardust. "Who dares awaken the Word Dragon?" his deep voice echoed, not with anger, but with pure delight. Together, they flew above Mount Whispers, painting whole galaxies with thrilling metaphors!`,
        characterImage: '/images/characters/pikachu.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'The Dragon Word Maze & Orb Claim',
        subtitle: 'Solve the riddle to claim your 50 Glowing Orbs!',
        content: 'Which vivid adjective best describes Toothless soaring through the midnight starry realm?',
        puzzleQuestion: 'Choose the most powerful descriptive word for the Dragon Sky:',
        puzzleOptions: [
          'A) Nice',
          'B) Luminescent & Majestic',
          'C) Okay',
          'D) Normal',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-43',
    issueNumber: 43,
    title: 'WHISPERING JUNGLE & STARLIGHT SAFARI',
    theme: 'Safari Magic & Secret Treehouses',
    editionName: 'Golden Best-Seller Issue',
    releaseDate: 'Summer 2026',
    gradient: 'from-[#064e3b] via-[#047857] to-[#0f172a]',
    borderGradient: 'from-yellow-400 via-emerald-300 to-amber-400',
    bannerColor: 'bg-emerald-400 text-slate-950',
    badge: {
      text: '★ MOST POPULAR',
      color: 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black',
    },
    sticker: {
      text: 'GOLD MEDAL AWARD',
      bg: 'bg-amber-400 text-slate-950 font-black shadow-amber-400/50',
    },
    characterMain: {
      src: '/images/characters/simba.png',
      alt: 'Simba the Brave Lion',
      name: 'Simba Safari King',
    },
    characterSecondary: {
      src: '/images/characters/stitch.png',
      alt: 'Stitch Blue Glider',
      name: 'Stitch Trickster',
    },
    headlines: [
      'Meet Iggy: The Fire-Breathing Giraffe with Polka-Dot Wings!',
      'Hilarious Comic Strip: Stitch vs The Word Gobbler',
      'Kid Author of the Month: Sofia (Age 8) and the Magic Mango',
    ],
    authorSpotlight: {
      name: 'Sofia R.',
      age: 8,
      location: 'Toronto, Canada',
      avatar: '/images/characters/stitch.png',
    },
    defaultRotation: 'rotate-2 md:rotate-3',
    defaultTranslateY: '-translate-y-2 md:-translate-y-3 scale-102 md:scale-105',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'WHISPERING JUNGLE & STARLIGHT SAFARI',
        subtitle: 'The Official Selam Kids Magazine • Issue #43',
        content: 'Journey deep into the canopy where Simba and Stitch explore glowing mushroom groves and uncover lost ancient scrolls.',
        characterImage: '/images/characters/simba.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: Iggy the Solar Lion',
        subtitle: 'Created by Sofia R. (Age 8)',
        content: 'Simba has found a magnificent golden mane that shines like the noon sun even in the darkest corners of the jungle.',
        characterImage: '/images/characters/simba.png',
        creatureStats: {
          name: 'Simba the Sun-Mane Lion',
          species: 'Solar Feline Beast',
          bravery: 100,
          magic: 92,
          speed: 94,
          specialPower: 'Roar of Inspiration (fills young writers with brilliant ideas)',
          favoriteSnack: 'Honey-dipped Safari Watermelons',
          author: 'Sofia R.',
          authorAge: 8,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Mischief in the Baobab Treehouse',
        subtitle: 'A hilarious jungle adventure written by classroom 4B',
        content: `Stitch had one job: keep the ancient ink pot safe until sunrise.
        
"Ih! Naughty ink!" Stitch giggled as the purple ink sprouted four tiny legs and began scampering across the treehouse branches. Simba leapt over the bamboo railings, his golden tail swishing like a banner.

"Stop that ink before it writes silly nonsense on the moon!" Simba yelled playfully. Together they tackled the mischievous puddle just in time to create a shimmering poem on a giant tropical palm leaf!`,
        characterImage: '/images/characters/stitch.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Jungle Word Quest & Orb Reward',
        subtitle: 'Match the wild safari synonym to claim 50 Orbs!',
        content: 'Which word means the same as "ferocious" but sounds like an adventurous wild beast?',
        puzzleQuestion: 'What is a strong synonym for "courageous"?',
        puzzleOptions: [
          'A) Timid',
          'B) Fearless & Valiant',
          'C) Sleepy',
          'D) Quiet',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-42',
    issueNumber: 42,
    title: 'OCEAN OF DREAMS & LUMINOUS REEFS',
    theme: 'Deep Sea Mysteries & Coral Kingdoms',
    editionName: 'Collector Marine Edition',
    releaseDate: 'Spring 2026',
    gradient: 'from-[#0c4a6e] via-[#0284c7] to-[#082f49]',
    borderGradient: 'from-cyan-400 via-pink-400 to-amber-300',
    bannerColor: 'bg-cyan-400 text-slate-950',
    badge: {
      text: '★ COLLECTOR’S PICK',
      color: 'bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 font-black',
    },
    sticker: {
      text: 'FREE PUZZLE LAB',
      bg: 'bg-purple-600 text-white shadow-purple-600/50',
    },
    characterMain: {
      src: '/images/characters/nemo.png',
      alt: 'Nemo Clownfish Explorer',
      name: 'Nemo Reef Guide',
    },
    characterSecondary: {
      src: '/images/characters/po-panda.png',
      alt: 'Po the Dragon Warrior Panda',
      name: 'Po Panda Master',
    },
    headlines: [
      'The Mystery of the Sunken Coral Library Revealed!',
      'Po Panda’s Kung Fu Word Dojo: Master Complex Sentences!',
      'Poetry Corner: Sparkling Rhymes from the Bioluminescent Abyss',
    ],
    authorSpotlight: {
      name: 'Kai T.',
      age: 10,
      location: 'Sydney, Australia',
      avatar: '/images/characters/nemo.png',
    },
    defaultRotation: 'rotate-4 md:rotate-5',
    defaultTranslateY: 'translate-y-2 md:translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'OCEAN OF DREAMS & LUMINOUS REEFS',
        subtitle: 'The Official Selam Kids Magazine • Issue #42',
        content: 'Plunge beneath shimmering waves where Nemo and Po Panda train in the underwater Kung Fu temple to protect the Great Storybook Coral.',
        characterImage: '/images/characters/nemo.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Aqua Kung-Fu Panda',
        subtitle: 'Invented by Kai T. (Age 10)',
        content: 'Po Panda has mastered the art of swimming through liquid sapphire, using water ripples to spell words in flowing calligraphy.',
        characterImage: '/images/characters/po-panda.png',
        creatureStats: {
          name: 'Po the Coral Guardian',
          species: 'Bioluminescent Giant Panda',
          bravery: 97,
          magic: 94,
          speed: 88,
          specialPower: 'Bubble Blast Metaphor (turns simple thoughts into poetic magic)',
          favoriteSnack: 'Steamed Kelp Dumplings with Sweet Star-Honey',
          author: 'Kai T.',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Great Coral Spelling Duel',
        subtitle: 'An underwater mystery written by Kai T.',
        content: `Far below the breaking waves, the Ink Octopus challenged Nemo to a spellbinding riddle contest.
        
"If you cannot spell 'magnificent' backwards, this pearl of wisdom is mine!" gurgled the Octopus. Nemo smiled bravely. He didn't have to do it alone — Po Panda arrived on a manta ray with his bamboo brush! 

With two swishes of water kung fu, Po wrote: "T-N-E-C-I-F-I-N-G-A-M!" The octopus blushed bright purple and handed over the crystal key to the underwater library. Selam Kids was safe once more!`,
        characterImage: '/images/characters/nemo.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Ocean Word Reef & Orb Claim',
        subtitle: 'Decode the oceanic riddle to claim 50 Glowing Orbs!',
        content: 'Which creative simile best paints a picture of a calm luminous reef?',
        puzzleQuestion: 'Pick the richest descriptive simile:',
        puzzleOptions: [
          'A) It was blue like blue stuff',
          'B) The reef glittered like a sunken chest of liquid diamonds',
          'C) Water is wet',
          'D) Fish swam around',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-41',
    issueNumber: 41,
    title: 'ENCHANTED TOY REALM & TIME GATES',
    theme: 'Toy Town Mysteries & Antique Clockworks',
    editionName: 'Heritage Adventure Edition',
    releaseDate: 'Spring 2026',
    gradient: 'from-[#3b122d] via-[#63133e] to-[#1c0817]',
    borderGradient: 'from-amber-300 via-rose-400 to-indigo-400',
    bannerColor: 'bg-amber-400 text-slate-950',
    badge: {
      text: '★ GOLDEN CLASSIC',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: 'KIDS CHOICE WINNER',
      bg: 'bg-emerald-500 text-white shadow-emerald-500/50',
    },
    characterMain: {
      src: '/images/characters/toy-story.png',
      alt: 'Woody Toy Sheriff',
      name: 'Sheriff Woody',
    },
    characterSecondary: {
      src: '/images/characters/minion.png',
      alt: 'Minion Explorer',
      name: 'Bob the Minion',
    },
    headlines: [
      'Sheriff Woody Solves the Mystery of the Whispering Toy Chest!',
      'Minion Bob’s Hilarious Word Inventions: What Does "Papaya" Mean?',
      'Kid Writers Club: Building Fantastical Realms with Everyday Toys',
    ],
    authorSpotlight: {
      name: 'Ethan & Mia',
      age: 7,
      location: 'Melbourne, Australia',
      avatar: '/images/characters/toy-story.png',
    },
    defaultRotation: 'rotate-3 md:rotate-4',
    defaultTranslateY: '-translate-y-2 md:-translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'ENCHANTED TOY REALM & TIME GATES',
        subtitle: 'The Official Selam Kids Magazine • Issue #41',
        content: 'Venture into the secret attic workshop where toy companions step into magical clockwork gears to unlock legendary bedtime tales.',
        characterImage: '/images/characters/toy-story.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Clockwork Guardian Sheriff',
        subtitle: 'Created by Ethan & Mia (Age 7)',
        content: 'With a golden badge that shines with loyalty, Woody leads nighttime expeditions across the playroom floor to keep children smiling.',
        characterImage: '/images/characters/toy-story.png',
        creatureStats: {
          name: 'Woody the Brave Sheriff',
          species: 'Loyal Guardian Toy',
          bravery: 99,
          magic: 89,
          speed: 85,
          specialPower: 'Lasso of Friendship (unites brave ideas into unforgettable stories)',
          favoriteSnack: 'Warm Milk and Golden Cinnamon Biscuits',
          author: 'Ethan & Mia',
          authorAge: 7,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Great Attic Clock Mystery',
        subtitle: 'A thrilling mystery from the Junior Writers Workshop',
        content: `Tik-tok, tik-tok! The grandfather clock in the attic wasn't ticking ordinary seconds — it was counting down to secret storytime!

"Reach for the sky!" Woody declared, adjusting his Stetson hat as Minion Bob bounced happily on a vintage jack-in-the-box. When they turned the brass key, out poured hundred-year-old fairy tales written in shimmering golden ink.`,
        characterImage: '/images/characters/minion.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Toyland Riddle & 50 Orbs Reward',
        subtitle: 'Solve the riddle to claim your Glowing Orbs!',
        content: 'What makes a story character truly memorable and cherished?',
        puzzleQuestion: 'What is the most powerful quality of a true storybook companion?',
        puzzleOptions: [
          'A) Loyalty & Big Heart',
          'B) Being bored',
          'C) Running away',
          'D) Not speaking',
        ],
        correctAnswer: 0,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-40',
    issueNumber: 40,
    title: 'SWAMP KINGDOM & GIANT TALES',
    theme: 'Enchanted Swamps & Friendly Ogres',
    editionName: 'Emerald Forest Edition',
    releaseDate: 'Winter 2025',
    gradient: 'from-[#14532d] via-[#166534] to-[#052e16]',
    borderGradient: 'from-emerald-400 via-lime-400 to-amber-300',
    bannerColor: 'bg-emerald-500 text-slate-950',
    badge: {
      text: '★ OGRE TALES',
      color: 'bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+50 ORBS & BADGE',
      bg: 'bg-emerald-600 text-white shadow-emerald-600/50',
    },
    characterMain: {
      src: '/images/characters/shrek.png',
      alt: 'Shrek Swamp Guardian',
      name: 'Shrek the Giant',
    },
    characterSecondary: {
      src: '/images/characters/stitch.png',
      alt: 'Stitch Blue Glider',
      name: 'Stitch Trickster',
    },
    headlines: [
      'Shrek Teaches Young Writers How Stories Have Layers Like Onions!',
      'The Mystery of the Whispering Mud Pool Unlocked!',
      'Swamp Creature Studio: Design Your Own Forest Beast',
    ],
    authorSpotlight: {
      name: 'Oliver B.',
      age: 10,
      location: 'Edinburgh, UK',
      avatar: '/images/characters/shrek.png',
    },
    defaultRotation: '-rotate-2 md:-rotate-3',
    defaultTranslateY: 'translate-y-2 md:translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'SWAMP KINGDOM & GIANT TALES',
        subtitle: 'The Official Selam Kids Magazine • Issue #40',
        content: 'Step beneath the mossy canopies where Shrek and Stitch guard ancient enchanted logs glowing with secret vocabulary words.',
        characterImage: '/images/characters/shrek.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Big Green Story Guardian',
        subtitle: 'Discovered by Oliver B. (Age 10)',
        content: 'With a roar of friendly laughter and deep swamp wisdom, Shrek protects wild ideas and inspires children to write with unshakeable confidence.',
        characterImage: '/images/characters/shrek.png',
        creatureStats: {
          name: 'Shrek the Green Guardian',
          species: 'Giant Swamp Beast',
          bravery: 100,
          magic: 91,
          speed: 84,
          specialPower: 'Onion-Layer Plot Twists (adds rich depth to every adventure)',
          favoriteSnack: 'Roasted Swamp Onions with Wild Honey',
          author: 'Oliver B.',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Great Mud Bubble Spell',
        subtitle: 'An enchanting forest comedy by Oliver B.',
        content: `Deep in the enchanted swamp, Stitch was experimenting with shimmering mud bubbles.
        
"Better out than in, I always say!" chucked Shrek as a giant bubble floated up to the treetops, sparkling with colorful emerald letters. When the bubble gently popped, glowing green words danced into the air, writing hilarious rhyming poems across the night sky!`,
        characterImage: '/images/characters/stitch.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Swamp Rhyme Riddle & 50 Orbs Reward',
        subtitle: 'Solve the riddle to claim your Glowing Orbs!',
        content: 'What gives a story its most exciting layer of depth?',
        puzzleQuestion: 'Which quality makes an adventure unforgettable?',
        puzzleOptions: [
          'A) Heart, humor, and surprise twists',
          'B) Having only one plain sentence',
          'C) Being completely silent',
          'D) No characters at all',
        ],
        correctAnswer: 0,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-39',
    issueNumber: 39,
    title: 'COSMIC MISCHIEF & STARLIGHT ISLANDS',
    theme: 'Interstellar Islands & Electric Pranks',
    editionName: 'Supernova Neon Edition',
    releaseDate: 'Autumn 2025',
    gradient: 'from-[#312e81] via-[#3730a3] to-[#1e1b4b]',
    borderGradient: 'from-indigo-400 via-purple-300 to-pink-400',
    bannerColor: 'bg-indigo-500 text-white',
    badge: {
      text: '★ COSMIC FAVORITE',
      color: 'bg-gradient-to-r from-indigo-400 to-purple-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+55 ORBS & SPARK',
      bg: 'bg-purple-600 text-white shadow-purple-600/50',
    },
    characterMain: {
      src: '/images/characters/stitch.png',
      alt: 'Stitch Blue Glider',
      name: 'Stitch Experiment 626',
    },
    characterSecondary: {
      src: '/images/characters/pikachu.png',
      alt: 'Pikachu Spark Beast',
      name: 'Pikachu Thunder Sprite',
    },
    headlines: [
      'Stitch and Pikachu Invent Electric Rhymes That Light Up Distant Moons!',
      'Top 5 Outer Space Creatures Authored by Kids',
      'The Neon Comet Challenge: Write with Electrifying Verbs',
    ],
    authorSpotlight: {
      name: 'Chloe L.',
      age: 9,
      location: 'Vancouver, Canada',
      avatar: '/images/characters/stitch.png',
    },
    defaultRotation: 'rotate-3 md:rotate-4',
    defaultTranslateY: '-translate-y-2 md:-translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'COSMIC MISCHIEF & STARLIGHT ISLANDS',
        subtitle: 'The Official Selam Kids Magazine • Issue #39',
        content: 'Glide through floating neon archipelagoes where Stitch and Pikachu team up to create the craziest space stories in the galaxy.',
        characterImage: '/images/characters/stitch.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Plasma Mischief Alien',
        subtitle: 'Created by Chloe L. (Age 9)',
        content: 'Four arms, super-sonic hearing, and an uncontrollable urge to doodle on star charts! Stitch turns ordinary words into rocket-fuel adventures.',
        characterImage: '/images/characters/stitch.png',
        creatureStats: {
          name: 'Stitch Experiment 626',
          species: 'Galactic Mischief Beast',
          bravery: 98,
          magic: 96,
          speed: 98,
          specialPower: 'Plasma Word Cannon (blasts away boring writing blocks)',
          favoriteSnack: 'Coconut Shaved Ice with Starlight Sprinkles',
          author: 'Chloe L.',
          authorAge: 9,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Island That Floated in Space',
        subtitle: 'A thrilling space-island tale by Chloe L.',
        content: `Pikachu flicked his lightning tail and launched a sparkling bolt right into the island’s central gravity crystal.
        
"Meega nala kweesta!" Stitch cheered, strapping on rocket skates. The entire tropical island took off like a flying surfboard, cruising through constellations while young aliens cheered and waved from passing spaceships!`,
        characterImage: '/images/characters/pikachu.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Cosmic Plasma Puzzle & 55 Orbs Reward',
        subtitle: 'Solve the riddle to claim your Glowing Orbs!',
        content: 'Which vivid word best describes a flying cosmic surfboard soaring through a glowing nebula?',
        puzzleQuestion: 'Choose the most thrilling action verb:',
        puzzleOptions: [
          'A) Glided majestically',
          'B) Dropped',
          'C) Slept',
          'D) Sat',
        ],
        correctAnswer: 0,
        orbsReward: 55,
      },
    ],
  },
  {
    id: 'issue-38',
    issueNumber: 38,
    title: 'POLAR LIGHTS & ARCTIC WONDERS',
    theme: 'Glacier Caverns & Aurora Borealis',
    editionName: 'Crystal Frost Edition',
    releaseDate: 'Summer 2025',
    gradient: 'from-[#134e4a] via-[#0f766e] to-[#042f2e]',
    borderGradient: 'from-teal-300 via-cyan-400 to-indigo-300',
    bannerColor: 'bg-teal-400 text-slate-950',
    badge: {
      text: '★ ARCTIC DISCOVERY',
      color: 'bg-gradient-to-r from-teal-400 to-cyan-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+50 ORBS & ICE STAR',
      bg: 'bg-teal-600 text-white shadow-teal-600/50',
    },
    characterMain: {
      src: '/images/characters/penguin.png',
      alt: 'Penguin Frost Navigator',
      name: 'Pip the Frost Penguin',
    },
    characterSecondary: {
      src: '/images/characters/cloud-guy.png',
      alt: 'Cloud Guy Sky Sprite',
      name: 'Cloud Guy Breezy',
    },
    headlines: [
      'Pip the Penguin Discovers the Frozen Aurora Scroll Beneath the Glacier!',
      'Cloud Guy Shares the Secret to Writing Fluffy, Float-Away Poems!',
      'Arctic Writers Guild: Frost-Breathing Creatures Authored by Kids',
    ],
    authorSpotlight: {
      name: 'Freja N.',
      age: 8,
      location: 'Stockholm, Sweden',
      avatar: '/images/characters/penguin.png',
    },
    defaultRotation: '-rotate-3 md:-rotate-4',
    defaultTranslateY: 'translate-y-2 md:translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'POLAR LIGHTS & ARCTIC WONDERS',
        subtitle: 'The Official Selam Kids Magazine • Issue #38',
        content: 'Slide across crystalline ice glaciers with Pip the Penguin and Cloud Guy as they discover glowing frozen ink caves.',
        characterImage: '/images/characters/penguin.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Crystal Glacier Penguin',
        subtitle: 'Created by Freja N. (Age 8)',
        content: 'Equipped with glowing frosted flippers and an unbreakable spirit, Pip glides across mirror-smooth glaciers delivering warm stories to arctic beasts.',
        characterImage: '/images/characters/penguin.png',
        creatureStats: {
          name: 'Pip the Frost Penguin',
          species: 'Glacier Fowl Beast',
          bravery: 97,
          magic: 93,
          speed: 96,
          specialPower: 'Belly-Slide Kinetic Metaphors (glides right into thrilling adventures)',
          favoriteSnack: 'Crisp Ice-Berries with Sweet Glacial Honey',
          author: 'Freja N.',
          authorAge: 8,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Day the Aurora Fell into the Snow',
        subtitle: 'A sparkling arctic mystery written by Freja N.',
        content: `A ribbon of emerald-green aurora light descended from the northern sky, landing gently on a snowy dune like a shimmering silk scarf.
        
"High five, little flipper guy!" laughed Cloud Guy, who was floating gently above the snowdrifts. Together with Pip, they followed the glowing footprints of light, unlocking the legendary crystal cave where lost bedtime stories stay safe forever!`,
        characterImage: '/images/characters/cloud-guy.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Glacial Aurora Riddle & 50 Orbs Reward',
        subtitle: 'Solve the riddle to claim your Glowing Orbs!',
        content: 'Which beautiful word best paints the shimmer of the northern aurora dancing across snowy peaks?',
        puzzleQuestion: 'Pick the richest descriptive adjective:',
        puzzleOptions: [
          'A) Luminous & Iridescent',
          'B) Cold',
          'C) Wet',
          'D) White',
        ],
        correctAnswer: 0,
        orbsReward: 50,
      },
    ],
  },
];

export function getAllMagazines(): MagazineIssue[] {
  return [...MAGAZINES].sort((a, b) => b.issueNumber - a.issueNumber);
}

export function getLatestMagazine(): MagazineIssue {
  const sorted = getAllMagazines();
  return sorted[0] || MAGAZINES[0];
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


