// Ethiopian Cultural Music Instruments & Materials Data
// ባህላዊ የሙዚቃ መሣሪያዎች - Comprehensive cultural data for Selam Kids Melody World

export interface InstrumentPart {
  name: string;
  amharic: string;
  description: string;
}

export interface InstrumentNote {
  note: string;
  name: string;
  freq: number;
  label: string;
}

export interface EthiopianInstrument {
  id: string;
  name: string;
  amharic: string;
  phonetic: string;
  category: 'strings' | 'percussion' | 'wind';
  categoryAmharic: string;
  tagline: string;
  description: string;
  heritageStory: string;
  traditionalMaterials: string[];
  howItIsPlayed: string;
  scaleName: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  parts: InstrumentPart[];
  notes: InstrumentNote[];
  funFacts: string[];
  audioMelodyTitle: string;
  audioMelodyDesc: string;
}

export const ETHIOPIAN_INSTRUMENTS: EthiopianInstrument[] = [
  {
    id: 'krar',
    name: 'Krar',
    amharic: 'ክራር',
    phonetic: 'kuh-RAR',
    category: 'strings',
    categoryAmharic: 'አውታር (ባለ 6 ክር)',
    tagline: 'The iconic 6-string bowl-lyre of Ethiopian melody & folk ballads',
    description:
      'The Krar is one of Ethiopia’s most celebrated musical instruments. It has a bowl-shaped soundbox covered with stretched animal parchment and six strings tuned to ancient pentatonic scales.',
    heritageStory:
      'The Krar has been played in Ethiopian highlands, valleys, and celebration gatherings for over a thousand years. Traditional bards and folk singers (Azmaris) use the Krar to tell stories, celebrate weddings, sing poetry, and perform timeless melodies in traditional scales like Tizita and Ambassel.',
    traditionalMaterials: [
      'Wanza (Cordia Africana) or olive wood for the bowl soundbox',
      'Sun-dried sheep or goat parchment for the drum resonator',
      'Cow horn plectrum (ሪሻ - Risha) for strumming',
      'Traditional gut or modern nylon and steel strings',
      'Solid wooden crossbar and side arms with tuning cloth/pegs',
    ],
    howItIsPlayed:
      'The musician holds the Krar against their chest or hip. They strum across the strings using a pointed horn plectrum (Risha) with one hand while muting unwanted strings with the fingers of the other hand, or pluck the strings individually with their bare fingertips for intimate ballads.',
    scaleName: 'Tizita Pentatonic (ትዝታ)',
    accentColor: 'from-amber-500 to-rose-600',
    bgGradient: 'from-amber-950/40 via-purple-950/50 to-slate-950',
    borderColor: 'border-amber-500/60',
    parts: [
      {
        name: 'Wurch (ውርጭ)',
        amharic: 'ውርጭ',
        description: 'The top crossbar and pegs where strings are tightened and tuned.',
      },
      {
        name: 'Dildiy (ድልድይ)',
        amharic: 'ድልድይ',
        description: 'The wooden bridge that elevates the strings above the parchment skin.',
      },
      {
        name: 'Kereb (ከረብ)',
        amharic: 'ከረብ',
        description: 'The hollow wooden bowl resonator covered with stretched animal hide.',
      },
      {
        name: 'Kir (ኪር / አውታር)',
        amharic: 'ኪር',
        description: 'The 5 or 6 resonant strings tuned to traditional Ethiopian pentatonic scales.',
      },
      {
        name: 'Risha (ሪሻ)',
        amharic: 'ሪሻ',
        description: 'A smooth plectrum carved from cattle horn used to strum the strings.',
      },
    ],
    notes: [
      { note: 'C4', name: 'Do', freq: 261.63, label: '1st String (C)' },
      { note: 'D4', name: 'Re', freq: 293.66, label: '2nd String (D)' },
      { note: 'E4', name: 'Mi', freq: 329.63, label: '3rd String (E)' },
      { note: 'G4', name: 'Sol', freq: 392.0, label: '4th String (G)' },
      { note: 'A4', name: 'La', freq: 440.0, label: '5th String (A)' },
      { note: 'C5', name: 'High Do', freq: 523.25, label: '6th String (High C)' },
    ],
    funFacts: [
      'The Krar is traditionally tuned to the Ethiopian "Kiñit" modes: Tizita, Bati, Ambassel, and Anchihoye!',
      'In modern times, musicians created an "Electric Krar" with pickups and wah-wah pedals that rocks Addis Ababa concert halls!',
      'Strumming all strings while muting specific notes with your left hand is a technique unique to Ethiopian lyre playing!',
    ],
    audioMelodyTitle: 'Tizita Nostalgia Melody (የክራር ትዝታ ዜማ)',
    audioMelodyDesc: 'Soulful acoustic Krar pluck sequence playing the authentic Ethiopian Tizita pentatonic scale.',
  },
  {
    id: 'masenqo',
    name: 'Masenqo',
    amharic: 'ማሲንቆ',
    phonetic: 'mah-sen-QO',
    category: 'strings',
    categoryAmharic: 'አውታር (ባለ 1 ክር ቫዮሊን)',
    tagline: 'The poetic diamond-shaped single-string fiddle of the Azmari bards',
    description:
      'The Masenqo is a diamond-shaped bowed lute made with goat parchment and a single horsehair string. Held upright, it produces vocal-like melodic slides and warbles.',
    heritageStory:
      'For centuries, the Masenqo has been the musical voice of the Ethiopian "Azmari" — lyrical poets and witty bards who improvise clever verses on the spot. It is played at royal banquets, village weddings, and cozy cultural clubs (Azmaribet) throughout Ethiopia.',
    traditionalMaterials: [
      'Four triangular pieces of wood joined into a diamond soundbox',
      'Raw, unshaved parchment goatskin stretched over both sides',
      'Single thick string made of coiled horsehair from a stallion tail',
      'Curved wooden bow (Deg) strung with coarse horsehair and tree rosin',
      'Tall central wooden neck (Igr) with a large tuning peg',
    ],
    howItIsPlayed:
      'The musician holds the Masenqo vertically on their lap. They draw the horsehair bow across the single string with their right hand, while lightly gliding the backs of their left-hand fingernails along the string to produce soaring, emotional pitch bends.',
    scaleName: 'Ambassel & Bati Modes (አምባሰልና ባቲ)',
    accentColor: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-950/40 via-amber-950/40 to-slate-950',
    borderColor: 'border-orange-500/60',
    parts: [
      {
        name: 'Kereb (ከረብ)',
        amharic: 'ከረብ',
        description: 'The diamond-shaped wooden box wrapped in taut goatskin.',
      },
      {
        name: 'Deg (ደግ)',
        amharic: 'ደግ',
        description: 'The arched wooden bow strung with horsehair used to caress the string.',
      },
      {
        name: 'Igr / Anget (አንገት)',
        amharic: 'አንገት',
        description: 'The tall wooden neck where the musician glides their fingernails.',
      },
      {
        name: 'Yetufert Kir (የፈረስ ፀጉር)',
        amharic: 'የፈረስ ጭራ',
        description: 'The single horsehair string that produces every single expressive note.',
      },
      {
        name: 'Melewecha (መለውጫ)',
        amharic: 'መለውጫ',
        description: 'The large wooden tuning peg at the crown of the neck.',
      },
    ],
    notes: [
      { note: 'D4', name: 'Root D', freq: 293.66, label: 'Open String' },
      { note: 'F4', name: 'Low F', freq: 349.23, label: '1st Fingernail Glide' },
      { note: 'G4', name: 'Mid G', freq: 392.0, label: '2nd Fingernail Glide' },
      { note: 'A4', name: 'High A', freq: 440.0, label: '3rd Fingernail Glide' },
      { note: 'C5', name: 'Peak C', freq: 523.25, label: 'High Slide' },
    ],
    funFacts: [
      'The Masenqo player does not press the string down to a fingerboard — they touch it with the back of their fingernails!',
      'Horsehair from male horses is preferred because it holds rosin better and produces a warmer sound!',
      'An Azmari can compose a customized poem in rhyme for anyone in the room while playing the Masenqo!',
    ],
    audioMelodyTitle: 'Azmari Folk Improvisation (የማሲንቆ አዝማሪ ዜማ)',
    audioMelodyDesc: 'Expressive bowed horsehair tone with sliding pitch bends and rich Ethiopian parchment harmonics.',
  },
  {
    id: 'kebero',
    name: 'Kebero',
    amharic: 'ከበሮ',
    phonetic: 'keh-beh-RO',
    category: 'percussion',
    categoryAmharic: 'የእጅ ከበሮ (መወዛወዣ)',
    tagline: 'The heartbeat of Ethiopian celebrations & electrifying Eskista dance',
    description:
      'The Kebero is a large conical, double-headed hand drum made from a hollowed tree trunk. It has a wide deep-toned bass head and a smaller sharp treble head linked by leather straps.',
    heritageStory:
      'The Kebero dates back over 1,500 years to ancient Aksum and the sacred liturgical chants of Saint Yared. Today, the Kebero is the vibrant rhythmic heartbeat of Ethiopian national holidays, weddings, church ceremonies, and the famous Eskista shoulder dance.',
    traditionalMaterials: [
      'Hollowed trunk of a single Wanza (Cordia) or acacia tree',
      'Wide bottom head made of thick bull / ox hide for thunderous bass',
      'Narrow top head made of fine calf or goat hide for snappy rim shots',
      'Interlaced leather thongs (Waramba) that tighten both drumheads',
      'Woven shoulder strap for dancing while playing',
    ],
    howItIsPlayed:
      'The player hangs the Kebero from their shoulder using a colorful strap. With their left hand, they strike the large head for a deep booming bass ("DUM"), and with their right hand, they slap the small head for a crisp, snappy rim hit ("TAK"), driving infectious dance beats.',
    scaleName: 'Polyrhythmic Eskista Beats (የእስክስታ ሪትም)',
    accentColor: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-950/40 via-teal-950/40 to-slate-950',
    borderColor: 'border-emerald-500/60',
    parts: [
      {
        name: 'Abiye Af (አቢይ ከበሮ)',
        amharic: 'አቢይ አፍ',
        description: 'The wide drum head that resonates with thunderous low bass vibrations.',
      },
      {
        name: 'Neus Af (ንዑስ ከበሮ)',
        amharic: 'ንዑስ አፍ',
        description: 'The narrow drum head that delivers bright, snappy rim slaps.',
      },
      {
        name: 'Wanza Gembo (የዋንዛ እንጨት)',
        amharic: 'የዋንዛ ግንድ',
        description: 'The hollowed conical wooden tree trunk body that acts as an acoustic chamber.',
      },
      {
        name: 'Waramba (ዋራምባ)',
        amharic: 'ዋራምባ',
        description: 'Strong rawhide lacing wound tightly around the drum to keep heads in tune.',
      },
    ],
    notes: [
      { note: 'Low Bass', name: 'DUM (ቦም)', freq: 55, label: 'Wide Bass Head' },
      { note: 'Deep Bass', name: 'DHUM (ዱም)', freq: 72, label: 'Deep Open Resonance' },
      { note: 'Mid Tap', name: 'TEK (ተክ)', freq: 175, label: 'Mid Muffled Slap' },
      { note: 'High Snap', name: 'TAK (ጠቅ)', freq: 320, label: 'Narrow Rim Snap' },
      { note: 'Fast Rim', name: 'TSH (ጭሽ)', freq: 450, label: 'Sharp Edge Tap' },
    ],
    funFacts: [
      'In traditional church ceremonies, large Kebero drums are played alongside metallic Tsenatsil rattles and prayer staffs (Meqwamiya)!',
      'The two different head sizes give the drummer two totally distinct musical voices in one single instrument!',
      'During Eskista dances, the Kebero tempo speeds up to guide dancers in lightning-fast shoulder shimmies!',
    ],
    audioMelodyTitle: 'Eskista Polyrhythm Beat (የእስክስታ ጭፈራ ከበሮ ሪትም)',
    audioMelodyDesc: 'Authentic Ethiopian double-headed drum groove with deep resonant bass pulses and syncopated rim snaps.',
  },
  {
    id: 'washint',
    name: 'Washint',
    amharic: 'ዋሽንት',
    phonetic: 'wah-SHINT',
    category: 'wind',
    categoryAmharic: 'ንፋስ (የቀርከሃ ዋሽንት)',
    tagline: 'The breathy, soulful highland bamboo flute of Ethiopian shepherds',
    description:
      'The Washint is an end-blown wooden flute crafted from highland cane or bamboo with four finger holes. It produces a warm, breathy, singing tone that can echo across wide valleys.',
    heritageStory:
      'Historically played by shepherds in the breathtaking Ethiopian mountain plateaus of Semien and Bale, the Washint comforted grazing cattle and carried news across hills. In modern Ethiopian music, virtuoso players combine vocal humming with flute blowing to create extraordinary dual harmonies.',
    traditionalMaterials: [
      'Selected highland bamboo cane or reed (Shenbeqo)',
      'Natural beeswax used to coat and seal the inner tube',
      'Carefully beveled blowing edge at the open top rim',
      'Four precisely spaced oval finger holes tuned to pentatonic modes',
      'Decorative fire-etched ring patterns celebrating nature',
    ],
    howItIsPlayed:
      'The musician holds the Washint at a slight tilt against their lips. By blowing a steady stream of air across the beveled rim while moving their fingers across the four holes, they produce fluid, vocal-like melodies enriched with vibrato and throat acoustics.',
    scaleName: 'Highland Shepherd Melody (የእረኛ ዜማ)',
    accentColor: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-950/40 via-blue-950/40 to-slate-950',
    borderColor: 'border-cyan-500/60',
    parts: [
      {
        name: 'Af (አፍ - Mouthpiece)',
        amharic: 'አፍ',
        description: 'The beveled rim where the player directs their breath to create sound.',
      },
      {
        name: 'Qedada (ቀዳዳዎች - 4 Finger Holes)',
        amharic: '4ቱ ቀዳዳዎች',
        description: 'Four oval holes that produce the five notes of the Ethiopian pentatonic scale.',
      },
      {
        name: 'Shenbeqo (ሸንበቆ - Bamboo Cane)',
        amharic: 'ሸንበቆ',
        description: 'The cured bamboo tube that acts as the acoustic resonating column.',
      },
    ],
    notes: [
      { note: 'E4', name: 'All Closed', freq: 329.63, label: 'Base Root Note' },
      { note: 'G4', name: '1 Hole Open', freq: 392.0, label: '1st Finger Lift' },
      { note: 'A4', name: '2 Holes Open', freq: 440.0, label: '2nd Finger Lift' },
      { note: 'B4', name: '3 Holes Open', freq: 493.88, label: '3rd Finger Lift' },
      { note: 'D5', name: 'All Open', freq: 587.33, label: 'Full Open High' },
      { note: 'E5', name: 'Overblow', freq: 659.25, label: 'Harmonic Octave' },
    ],
    funFacts: [
      'Master Washint players can blow the flute and hum into it at the same time to play two musical lines at once!',
      'With only 4 finger holes, a skilled player can produce more than 8 different notes by partially covering holes and varying their breath!',
      'Shepherds could identify each other across distant mountains by their unique personal Washint melodies!',
    ],
    audioMelodyTitle: 'Highland Mountain Shepherd Tune (የደጋ እረኛ ዋሽንት ዜማ)',
    audioMelodyDesc: 'Breathy, warm bamboo flute melodies with pastoral vibrato and soaring mountain overtones.',
  },
  {
    id: 'begena',
    name: 'Begena',
    amharic: 'በገና',
    phonetic: 'beh-geh-NAH',
    category: 'strings',
    categoryAmharic: 'ታላቅ አውታር (የዳዊት በገና)',
    tagline: 'The ancient 10-string box harp of David with meditative buzzing bass',
    description:
      'The Begena is an ancient, large 10-string box-lyre known as "The Harp of King David." It produces deep, meditative bass tones with a signature acoustic buzz created by leather pieces on the bridge.',
    heritageStory:
      'According to Ethiopian tradition, the Begena was brought to Ethiopia by Menelik I from the court of King Solomon. It has been preserved exclusively in Ethiopia for thousands of years. It is played primarily for spiritual meditation, contemplation, and moral poetry during fasting seasons.',
    traditionalMaterials: [
      'Large hollow rectangular wooden box carved from cedar or wanza wood',
      'Parchment cowhide stretched tightly over the soundbox',
      'Ten thick strings crafted from twisted ox gut or heavy nylon',
      'Two tall upright wooden arms joined by a massive crossbar',
      'Enqw (እንቁ): Small leather pieces inserted under the strings at the bridge that generate the famous buzzing snare sound',
    ],
    howItIsPlayed:
      'The musician sits on the floor with the tall Begena resting in front of them. Using the fingers of their left hand, they pluck the ten strings in slow, deliberate patterns, allowing the iconic buzzing overtones to linger peacefully in the air.',
    scaleName: 'Sacred Meditative Chant (መንፈሳዊ ዝማሬ)',
    accentColor: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-950/40 via-indigo-950/40 to-slate-950',
    borderColor: 'border-purple-500/60',
    parts: [
      {
        name: 'Kenfir (ከንፈር - Top Beam)',
        amharic: 'ከንፈር',
        description: 'The wide upper crossbar fitted with 10 wooden pegs (Wurch) for tuning.',
      },
      {
        name: 'Enqw (እንቁ - Leather Buzzers)',
        amharic: 'እንቁ',
        description: 'Small pieces of leather positioned on the bridge that buzz against strings.',
      },
      {
        name: 'Dildiy (ድልድይ - Bridge)',
        amharic: 'ድልድይ',
        description: 'The wide wooden bridge that transfers string vibrations into the soundbox.',
      },
      {
        name: 'Sandoq (ሳንዱቅ - Soundbox)',
        amharic: 'ሳንዱቅ',
        description: 'The massive hollow wooden chest covered with cowhide for deep bass.',
      },
    ],
    notes: [
      { note: 'F2', name: 'String 1', freq: 87.31, label: 'Deep Bass Drone' },
      { note: 'G2', name: 'String 2', freq: 98.0, label: 'Low Meditation' },
      { note: 'A2', name: 'String 3', freq: 110.0, label: 'Mid Drone' },
      { note: 'C3', name: 'String 4', freq: 130.81, label: 'Sacred Root' },
      { note: 'D3', name: 'String 5', freq: 146.83, label: 'Ascending Note' },
      { note: 'F3', name: 'String 6', freq: 174.61, label: 'Chant Pitch' },
    ],
    funFacts: [
      'The Begena is often called "The Harp of David" and is one of the oldest string instruments in continuous use in human history!',
      'The signature buzzing sound is completely acoustic — no electricity needed, just clever Ethiopian leather engineering!',
      'Out of the 10 strings, only six are plucked to play melodies; the other four serve as sacred resting rests and harmonic drones.',
    ],
    audioMelodyTitle: 'Ancient Meditative Begena Hymn (የበገና መንፈሳዊ ዜማ)',
    audioMelodyDesc: 'Deep, resonant buzzing bass harp notes with authentic acoustic snare vibrations and sacred tranquility.',
  },
  {
    id: 'tsenatsil',
    name: 'Tsenatsil',
    amharic: 'ጽናጽል',
    phonetic: 'tseh-nah-TSIL',
    category: 'percussion',
    categoryAmharic: 'የእጅ ጽናጽል (መቋሚያና ቃጭል)',
    tagline: 'The sacred metallic sistrum rattle with shimmering rhythmic chimes',
    description:
      'The Tsenatsil is an ancient Ethiopian metallic sistrum rattle. It consists of a U-shaped brass frame with horizontal rods holding jingling metal discs, mounted on a turned wooden handle.',
    heritageStory:
      'Originating in the Aksumite civilization, the Tsenatsil was adopted by Saint Yared in the 6th century as an indispensable part of Ethiopian sacred music. Held by deacons and cantors, it chimes in sync with prayer staffs to keep time for ceremonial chants and celebratory holiday dances.',
    traditionalMaterials: [
      'Cast brass, bronze, or silver U-shaped curved frame',
      'Polished wooden handle carved from highland olive wood',
      'Two or three crosswise metal wires / rods',
      'Dozens of small circular jingling metal discs that slide freely',
    ],
    howItIsPlayed:
      'The cantor holds the Tsenatsil upright by its wooden handle. With gentle wrist flicks and sweeping arcs, they shake the frame rhythmically, causing the metal discs to clash and chime in three-beat or four-beat time alongside the deep Kebero drum.',
    scaleName: 'Aksumite Ceremonial Cadence (የጽናጽል ቃጭል ሪትም)',
    accentColor: 'from-yellow-400 to-amber-500',
    bgGradient: 'from-yellow-950/40 via-amber-950/40 to-slate-950',
    borderColor: 'border-yellow-400/60',
    parts: [
      {
        name: 'Erf (እርፍ - Wooden Handle)',
        amharic: 'እርፍ',
        description: 'The carved wooden grip held in the palm of the cantor’s hand.',
      },
      {
        name: 'Mekereb (መከረብ - Metal Arch)',
        amharic: 'መከረብ',
        description: 'The U-shaped brass or silver frame that holds the cross rods.',
      },
      {
        name: 'Qelbetat (ቀለበታት - Metallic Discs)',
        amharic: 'ቀለበታት',
        description: 'The sliding metal discs that chime and shimmer when shaken.',
      },
    ],
    notes: [
      { note: 'Chime 1', name: 'Soft Shake', freq: 2800, label: 'Gentle Swing' },
      { note: 'Chime 2', name: 'Cadence Shake', freq: 4200, label: 'Rhythmic Stroke' },
      { note: 'Chime 3', name: 'Bright Clash', freq: 6500, label: 'Full Ringing Shake' },
      { note: 'Chime 4', name: 'Grand Accent', freq: 8800, label: 'Festive Shimmer' },
    ],
    funFacts: [
      'The Tsenatsil is identical in structure to the ancient Egyptian sistrum, making it one of the longest surviving instruments in history!',
      'When shaken, cantors follow complex geometric hand motions symbolizing the wings of angels!',
      'Kids love the bright, silvery jingling sound that can be heard even in massive open-air gatherings!',
    ],
    audioMelodyTitle: 'Ceremonial Sistrum Chime Cadence (የጽናጽል ዝማሬ ቅላጼ)',
    audioMelodyDesc: 'Bright, metallic shimmering brass discs chiming in crisp Ethiopian ceremonial syncopation.',
  },
  {
    id: 'embilta',
    name: 'Embilta',
    amharic: 'እምቢልታ',
    phonetic: 'ehm-BEEL-tah',
    category: 'wind',
    categoryAmharic: 'ንፋስ (የነገሥታት እምቢልታ)',
    tagline: 'The majestic royal bamboo horn played for historical ceremonies & kings',
    description:
      'The Embilta is a long, ceremonial bamboo horn without finger holes. Played in sets of three musicians who take turns blowing single notes, it creates a royal, hypnotic musical fanfare.',
    heritageStory:
      'For centuries, Embilta ensembles welcomed Ethiopian monarchs into imperial palaces, announced major historical declarations in Gondar and Shoa, and led harvest processions. The three distinct horns — named Shanqet, Dankan, and Hayt — weave together like a musical puzzle.',
    traditionalMaterials: [
      'Long thick highland bamboo cane, hollowed and cured',
      'Embossed leather sleeves and colorful wool thread bindings',
      'Beveled mouth opening at the top tip',
    ],
    howItIsPlayed:
      'Each player blows into their individual horn to produce one or two powerful harmonic pitches. By alternating their notes in quick succession (a technique called "hocketing"), the three players create an unbroken, majestic melody.',
    scaleName: 'Imperial Fanfare Hocket (የነገሥታት ደስታ)',
    accentColor: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-950/40 via-pink-950/40 to-slate-950',
    borderColor: 'border-rose-500/60',
    parts: [
      {
        name: 'Af (አፍ - Mouthpiece)',
        amharic: 'አፍ',
        description: 'The top beveled tip where the musician presses their lips.',
      },
      {
        name: 'Zaf Gembo (የቀርከሃ ግንድ)',
        amharic: 'የቀርከሃ ግንድ',
        description: 'The long bamboo body measuring up to one meter in length.',
      },
    ],
    notes: [
      { note: 'Hayt', name: 'High Hayt (ሃይት)', freq: 330.0, label: 'High Fanfare' },
      { note: 'Dankan', name: 'Mid Dankan (ዳንካን)', freq: 247.5, label: 'Middle Pitch' },
      { note: 'Shanqet', name: 'Low Shanqet (ሻንቄት)', freq: 165.0, label: 'Deep Royal Call' },
      { note: 'Octave', name: 'Overblow Call', freq: 495.0, label: 'Harmonic Burst' },
    ],
    funFacts: [
      'Because each Embilta horn only plays one primary note, musicians have to count rhythms perfectly together like a human synthesizer!',
      'Historical coronation processions in Gondar used Embilta fanfares to herald the arrival of Emperor Fasilides!',
      'The deep call of an Embilta can be heard over two miles away across highland valleys!',
    ],
    audioMelodyTitle: 'Royal Palace Fanfare (የጎንደር ነገሥታት እምቢልታ)',
    audioMelodyDesc: 'Resonant, triumphant bamboo horn calls weaving ancient royal ceremonial fanfare harmonies.',
  },
];
