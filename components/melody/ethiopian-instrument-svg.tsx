'use client';

import React from 'react';

interface InstrumentSvgProps {
  instrumentId: string;
  activeNoteIndex?: number | null;
  onPartClick?: (partName: string) => void;
  className?: string;
  isAnimated?: boolean;
}

export function EthiopianInstrumentSvg({
  instrumentId,
  activeNoteIndex = null,
  className = 'w-full h-auto max-h-[380px]',
  isAnimated = true,
}: InstrumentSvgProps) {
  // ---------------------------------------------------------------------------
  // 1. KRAR (ክራር): 6-string bowl lyre with wooden arms, crossbar, parchment hide
  // ---------------------------------------------------------------------------
  if (instrumentId === 'krar') {
    return (
      <svg
        viewBox="0 0 360 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 drop-shadow-xl`}
      >
        <defs>
          <radialGradient id="krarSkin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="65%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <linearGradient id="krarWood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="krarStringActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Resonator Bowl (Kereb - ከረብ) Base Shadow */}
        <ellipse cx="180" cy="335" rx="100" ry="65" fill="#451a03" opacity="0.4" />

        {/* Outer Wooden Bowl Rim */}
        <ellipse cx="180" cy="320" rx="98" ry="62" fill="url(#krarWood)" stroke="#5c2605" strokeWidth="4" />

        {/* Stretched Parchment Goatskin Membrane */}
        <ellipse cx="180" cy="318" rx="88" ry="54" fill="url(#krarSkin)" stroke="#b45309" strokeWidth="2" />

        {/* Parchment Stitching details */}
        <ellipse
          cx="180"
          cy="318"
          rx="82"
          ry="48"
          stroke="#92400e"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.6"
        />

        {/* Soundbox Soundhole */}
        <ellipse cx="180" cy="340" rx="10" ry="6" fill="#78350f" />

        {/* Wooden Bridge (Dildiy - ድልድይ) */}
        <rect x="135" y="315" width="90" height="9" rx="3" fill="#451a03" stroke="#260e04" strokeWidth="1.5" />

        {/* Left Wooden Side Arm */}
        <path
          d="M 115 305 Q 85 200 65 65 Q 75 62 85 64 Q 105 200 135 300 Z"
          fill="url(#krarWood)"
          stroke="#451a03"
          strokeWidth="2.5"
        />
        {/* Decorative Ethiopian Tibeb bands on left arm */}
        <rect x="76" y="140" width="18" height="6" fill="#dc2626" rx="1" />
        <rect x="75" y="148" width="18" height="6" fill="#facc15" rx="1" />
        <rect x="74" y="156" width="18" height="6" fill="#16a34a" rx="1" />

        {/* Right Wooden Side Arm */}
        <path
          d="M 245 305 Q 275 200 295 65 Q 285 62 275 64 Q 255 200 225 300 Z"
          fill="url(#krarWood)"
          stroke="#451a03"
          strokeWidth="2.5"
        />
        {/* Decorative Ethiopian Tibeb bands on right arm */}
        <rect x="266" y="140" width="18" height="6" fill="#dc2626" rx="1" />
        <rect x="267" y="148" width="18" height="6" fill="#facc15" rx="1" />
        <rect x="268" y="156" width="18" height="6" fill="#16a34a" rx="1" />

        {/* Top Crossbar (Wurch - ውርጭ) */}
        <rect
          x="50"
          y="50"
          width="260"
          height="22"
          rx="8"
          fill="url(#krarWood)"
          stroke="#451a03"
          strokeWidth="3"
        />

        {/* Traditional Tuning Pegs / Cloth Wraps (6 Pegs) */}
        {[85, 120, 155, 195, 230, 265].map((x, i) => (
          <g key={i}>
            <rect x={x - 4} y="38" width="8" height="14" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1" />
            <circle cx={x} cy="36" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <rect x={x - 5} y="55" width="10" height="12" rx="2" fill="#b91c1c" opacity="0.8" />
          </g>
        ))}

        {/* The 6 Resonant Strings (Kir - ኪር) */}
        {[
          { xTop: 85, xBot: 145, idx: 0, note: 'C4' },
          { xTop: 120, xBot: 158, idx: 1, note: 'D4' },
          { xTop: 155, xBot: 172, idx: 2, note: 'E4' },
          { xTop: 195, xBot: 188, idx: 3, note: 'G4' },
          { xTop: 230, xBot: 202, idx: 4, note: 'A4' },
          { xTop: 265, xBot: 215, idx: 5, note: 'C5' },
        ].map((str) => {
          const isActive = activeNoteIndex === str.idx;
          return (
            <g key={str.idx}>
              {/* Vibrant pluck glow when active */}
              {isActive && (
                <line
                  x1={str.xTop}
                  y1="68"
                  x2={str.xBot}
                  y2="315"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  opacity="0.75"
                  filter="url(#glowGold)"
                  className="animate-pulse"
                />
              )}
              {/* String line */}
              <line
                x1={str.xTop}
                y1="68"
                x2={str.xBot}
                y2="315"
                stroke={isActive ? '#ffffff' : '#fef08a'}
                strokeWidth={isActive ? '3.5' : '1.8'}
                strokeLinecap="round"
                className={`transition-all duration-100 ${isActive && isAnimated ? 'animate-bounce' : ''}`}
              />
              {/* String tail anchored to bottom */}
              <line
                x1={str.xBot}
                y1="315"
                x2={str.xBot + (str.xBot > 180 ? 4 : -4)}
                y2="345"
                stroke="#d97706"
                strokeWidth="1.2"
                opacity="0.7"
              />
            </g>
          );
        })}

        {/* Plectrum (Risha - ሪሻ) resting near bridge */}
        <polygon
          points="270,300 295,315 285,335"
          fill="#fafaf9"
          stroke="#78716c"
          strokeWidth="1.5"
          transform="rotate(-15 280 315)"
        />
        <circle cx="282" cy="316" r="2.5" fill="#ca8a04" />
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. MASENQO (ማሲንቆ): Diamond resonator, single horsehair string & arched bow
  // ---------------------------------------------------------------------------
  if (instrumentId === 'masenqo') {
    return (
      <svg
        viewBox="0 0 360 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 drop-shadow-xl`}
      >
        <defs>
          <linearGradient id="masenqoParchment" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="masenqoWood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Long Central Neck (Igr - እግር) */}
        <rect x="170" y="30" width="18" height="340" rx="4" fill="url(#masenqoWood)" stroke="#260e04" strokeWidth="2" />

        {/* Tuning Peg (Melewecha - መለውጫ) at the top */}
        <polygon points="179,35 155,50 179,55" fill="#b45309" stroke="#451a03" strokeWidth="1.5" />
        <circle cx="152" cy="50" r="7" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />

        {/* Diamond Resonator Shadow */}
        <polygon points="179,215 270,305 179,395 88,305" fill="#451a03" opacity="0.35" transform="translate(4, 6)" />

        {/* Diamond Resonator Wooden Frame */}
        <polygon points="179,210 272,305 179,400 86,305" fill="url(#masenqoWood)" stroke="#3b1302" strokeWidth="4" />

        {/* Stretched Goat Parchment Diamond Skin */}
        <polygon
          points="179,222 258,305 179,388 100,305"
          fill="url(#masenqoParchment)"
          stroke="#b45309"
          strokeWidth="2"
        />

        {/* Rawhide Cross Lacing */}
        <line x1="179" y1="222" x2="179" y2="388" stroke="#78350f" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
        <line x1="100" y1="305" x2="258" y2="305" stroke="#78350f" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />

        {/* Diamond Center Soundhole */}
        <circle cx="179" cy="305" r="7" fill="#451a03" />

        {/* Wooden Bridge */}
        <rect x="166" y="325" width="26" height="8" rx="2" fill="#451a03" stroke="#1c0901" strokeWidth="1" />

        {/* Single Horsehair String (Kir) */}
        {activeNoteIndex !== null && activeNoteIndex >= 0 && (
          <line
            x1="179"
            y1="50"
            x2="179"
            y2="380"
            stroke="#fbbf24"
            strokeWidth="8"
            opacity="0.8"
            className="animate-pulse"
          />
        )}
        <line
          x1="179"
          y1="50"
          x2="179"
          y2="380"
          stroke={activeNoteIndex !== null && activeNoteIndex >= 0 ? '#ffffff' : '#fef08a'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Azmari Fingernail Contact Points on Neck */}
        {[100, 135, 170, 205].map((y, idx) => (
          <circle
            key={idx}
            cx="179"
            cy={y}
            r={activeNoteIndex === idx + 1 ? '6' : '3.5'}
            fill={activeNoteIndex === idx + 1 ? '#ef4444' : '#fef08a'}
            stroke="#451a03"
            strokeWidth="1.5"
            className="transition-all"
          />
        ))}

        {/* Curved Bow (Deg - ደግ) */}
        <path
          d="M 60 190 Q 30 290 70 380"
          fill="none"
          stroke="url(#masenqoWood)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Bow Horsehair */}
        <line x1="60" y1="190" x2="70" y2="380" stroke="#fef3c7" strokeWidth="2.5" strokeDasharray="1 1" />
        <circle cx="60" cy="190" r="5" fill="#b45309" />
        <circle cx="70" cy="380" r="5" fill="#b45309" />
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. KEBERO (ከበሮ): Conical double-headed hand drum with Waramba leather lacing
  // ---------------------------------------------------------------------------
  if (instrumentId === 'kebero') {
    const isBassActive = activeNoteIndex === 0 || activeNoteIndex === 1;
    const isRimActive = activeNoteIndex === 3 || activeNoteIndex === 4;
    return (
      <svg
        viewBox="0 0 380 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 drop-shadow-xl`}
      >
        <defs>
          <linearGradient id="keberoWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5c2605" />
            <stop offset="35%" stopColor="#92400e" />
            <stop offset="65%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="keberoSkinWide" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="70%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>

        {/* Woven Shoulder Strap (Meqenat) */}
        <path
          d="M 120 120 C 60 70, 60 20, 190 20 C 310 20, 310 70, 260 120"
          fill="none"
          stroke="#dc2626"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 120 120 C 60 70, 60 20, 190 20 C 310 20, 310 70, 260 120"
          fill="none"
          stroke="#facc15"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="16 8"
        />

        {/* Conical Wooden Body (Wanza Wood) */}
        <polygon points="100,120 280,120 230,340 150,340" fill="url(#keberoWood)" stroke="#270e04" strokeWidth="4" />

        {/* Traditional Waramba Criss-Cross Leather Lacing */}
        {[
          { x1: 110, y1: 120, x2: 155, y2: 340 },
          { x1: 140, y1: 120, x2: 175, y2: 340 },
          { x1: 170, y1: 120, x2: 195, y2: 340 },
          { x1: 200, y1: 120, x2: 215, y2: 340 },
          { x1: 230, y1: 120, x2: 165, y2: 340 },
          { x1: 260, y1: 120, x2: 185, y2: 340 },
          { x1: 275, y1: 120, x2: 220, y2: 340 },
          { x1: 125, y1: 120, x2: 210, y2: 340 },
          { x1: 155, y1: 120, x2: 225, y2: 340 },
          { x1: 245, y1: 120, x2: 155, y2: 340 },
        ].map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#fef3c7"
            strokeWidth="2.5"
            opacity="0.85"
          />
        ))}

        {/* Central Lacing Belt Ring */}
        <ellipse cx="190" cy="225" rx="55" ry="12" fill="none" stroke="#78350f" strokeWidth="8" />
        <ellipse cx="190" cy="225" rx="55" ry="12" fill="none" stroke="#fde68a" strokeWidth="3" />

        {/* ========================================== */}
        {/* TOP WIDE HEAD: Abiye Kebero (Bass Head) */}
        {/* ========================================== */}
        <ellipse
          cx="190"
          cy="120"
          rx="90"
          ry="32"
          fill="url(#keberoSkinWide)"
          stroke={isBassActive ? '#ef4444' : '#78350f'}
          strokeWidth={isBassActive ? '6' : '3'}
          className={`transition-all duration-150 ${isBassActive ? 'scale-105' : ''}`}
        />
        {/* Bass hit shockwaves */}
        {isBassActive && (
          <ellipse
            cx="190"
            cy="120"
            rx="105"
            ry="40"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            className="animate-ping"
            opacity="0.8"
          />
        )}
        {/* Leather tuning rim collar */}
        <ellipse cx="190" cy="120" rx="88" ry="30" fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="190" y="125" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="900">
          አቢይ (BASS DUM)
        </text>

        {/* ========================================== */}
        {/* BOTTOM NARROW HEAD: Neus Kebero (Rim Snap) */}
        {/* ========================================== */}
        <ellipse
          cx="190"
          cy="340"
          rx="42"
          ry="15"
          fill="url(#keberoSkinWide)"
          stroke={isRimActive ? '#10b981' : '#78350f'}
          strokeWidth={isRimActive ? '5' : '2.5'}
          className="transition-all duration-150"
        />
        {/* Rim hit shockwaves */}
        {isRimActive && (
          <ellipse
            cx="190"
            cy="340"
            rx="52"
            ry="20"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            className="animate-ping"
            opacity="0.8"
          />
        )}
        <text x="190" y="344" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="900">
          ንዑስ (TAK)
        </text>
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. WASHINT (ዋሽንት): Highland bamboo cane flute with 4 tuned finger holes
  // ---------------------------------------------------------------------------
  if (instrumentId === 'washint') {
    return (
      <svg
        viewBox="0 0 360 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 drop-shadow-xl`}
      >
        <defs>
          <linearGradient id="washintBamboo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Flute Shadow */}
        <rect x="175" y="45" width="26" height="320" rx="12" fill="#451a03" opacity="0.3" transform="rotate(-8 180 200)" />

        {/* Golden Highland Bamboo Cane Tube */}
        <g transform="rotate(-8 180 200)">
          <rect
            x="167"
            y="40"
            width="26"
            height="320"
            rx="13"
            fill="url(#washintBamboo)"
            stroke="#78350f"
            strokeWidth="3"
          />

          {/* Natural Bamboo Segments / Nodes */}
          {[95, 160, 230, 300].map((y, idx) => (
            <g key={idx}>
              <ellipse cx="180" cy={y} rx="14" ry="3" fill="#78350f" />
              <ellipse cx="180" cy={y} rx="13" ry="1.5" fill="#fde68a" />
            </g>
          ))}

          {/* Beveled Mouthpiece (Af - አፍ) */}
          <ellipse cx="180" cy="42" rx="13" ry="4" fill="#451a03" stroke="#fde047" strokeWidth="1.5" />
          <ellipse cx="180" cy="43" rx="8" ry="2" fill="#000000" />

          {/* 4 Carved Oval Finger Holes (Qedada - ቀዳዳዎች) */}
          {[
            { y: 190, idx: 0, label: '1' },
            { y: 220, idx: 1, label: '2' },
            { y: 250, idx: 2, label: '3' },
            { y: 280, idx: 3, label: '4' },
          ].map((hole) => {
            const isCovered = activeNoteIndex !== null && activeNoteIndex <= hole.idx;
            return (
              <g key={hole.idx}>
                {/* Glow ring if note is active */}
                {activeNoteIndex === hole.idx && (
                  <circle cx="180" cy={hole.y} r="14" fill="#38bdf8" opacity="0.5" className="animate-ping" />
                )}
                <ellipse
                  cx="180"
                  cy={hole.y}
                  rx="6.5"
                  ry="9"
                  fill={isCovered ? '#451a03' : '#38bdf8'}
                  stroke="#78350f"
                  strokeWidth="2"
                  className="transition-colors duration-200"
                />
              </g>
            );
          })}

          {/* Decorative Fire-Etched Traditional Markings */}
          <line x1="168" y1="65" x2="192" y2="65" stroke="#78350f" strokeWidth="2" strokeDasharray="2 3" />
          <line x1="168" y1="120" x2="192" y2="120" stroke="#78350f" strokeWidth="2" strokeDasharray="2 3" />
          <line x1="168" y1="335" x2="192" y2="335" stroke="#78350f" strokeWidth="2" strokeDasharray="2 3" />
        </g>

        {/* Breath Stream Effect at Mouthpiece */}
        {activeNoteIndex !== null && activeNoteIndex >= 0 && (
          <path
            d="M 155 35 Q 140 10 120 15"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. BEGENA (በገና): Ancient 10-string box lyre (Harp of David) with buzzing bridge
  // ---------------------------------------------------------------------------
  if (instrumentId === 'begena') {
    return (
      <svg
        viewBox="0 0 380 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 drop-shadow-xl`}
      >
        <defs>
          <linearGradient id="begenaBox" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="begenaSkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="70%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Large Rectangular Wooden Soundbox (Sandoq - ሳንዱቅ) */}
        <rect x="90" y="270" width="200" height="120" rx="8" fill="url(#begenaBox)" stroke="#270e04" strokeWidth="4" />

        {/* Stretched Cowhide Parchment Front */}
        <rect x="100" y="280" width="180" height="100" rx="6" fill="url(#begenaSkin)" stroke="#92400e" strokeWidth="2" />

        {/* Soundholes on Parchment */}
        <circle cx="130" cy="300" r="7" fill="#451a03" />
        <circle cx="250" cy="300" r="7" fill="#451a03" />

        {/* Wide Wooden Bridge (Dildiy) with Buzzing Leather Pieces (Enqw - እንቁ) */}
        <rect x="115" y="340" width="150" height="12" rx="3" fill="#451a03" stroke="#1c0901" strokeWidth="2" />
        {/* Leather Buzzers (Enqw) */}
        {[125, 140, 155, 170, 185, 200, 215, 230, 245, 255].map((x, i) => (
          <circle key={i} cx={x} cy="342" r="3" fill="#b91c1c" />
        ))}

        {/* Two Tall Upright Arms */}
        <rect x="75" y="40" width="24" height="250" rx="6" fill="url(#begenaBox)" stroke="#270e04" strokeWidth="3" />
        <rect x="281" y="40" width="24" height="250" rx="6" fill="url(#begenaBox)" stroke="#270e04" strokeWidth="3" />

        {/* Wide Top Crossbar (Kenfir - ከንፈር) */}
        <rect x="55" y="30" width="270" height="26" rx="8" fill="url(#begenaBox)" stroke="#270e04" strokeWidth="4" />

        {/* 10 Wooden Tuning Pegs */}
        {[100, 118, 136, 154, 172, 190, 208, 226, 244, 262].map((x, i) => (
          <g key={i}>
            <rect x={x - 3} y="18" width="6" height="15" rx="2" fill="#d97706" stroke="#451a03" strokeWidth="1" />
            <circle cx={x} cy="16" r="4.5" fill="#f59e0b" stroke="#451a03" strokeWidth="1" />
          </g>
        ))}

        {/* 10 Thick Gut/Nylon Strings */}
        {[100, 118, 136, 154, 172, 190, 208, 226, 244, 262].map((x, i) => {
          const isActive = activeNoteIndex === i || (activeNoteIndex !== null && activeNoteIndex % 10 === i);
          return (
            <g key={i}>
              {isActive && (
                <line
                  x1={x}
                  y1="56"
                  x2={125 + i * 14.5}
                  y2="340"
                  stroke="#a855f7"
                  strokeWidth="7"
                  opacity="0.8"
                  className="animate-pulse"
                />
              )}
              <line
                x1={x}
                y1="56"
                x2={125 + i * 14.5}
                y2="340"
                stroke={isActive ? '#ffffff' : '#fef08a'}
                strokeWidth={isActive ? '3.5' : '2'}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. TSENATSIL (ጽናጽል): Sacred sistrum rattle with sliding metallic chime discs
  // ---------------------------------------------------------------------------
  if (instrumentId === 'tsenatsil') {
    const isShaking = activeNoteIndex !== null && activeNoteIndex >= 0;
    return (
      <svg
        viewBox="0 0 360 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-200 drop-shadow-xl ${
          isShaking && isAnimated ? 'animate-bounce' : ''
        }`}
      >
        <defs>
          <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="oliveWood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Carved Olivewood Handle (Erf - እርፍ) */}
        <rect x="168" y="260" width="24" height="120" rx="8" fill="url(#oliveWood)" stroke="#270e04" strokeWidth="2.5" />
        <ellipse cx="180" cy="380" rx="16" ry="7" fill="#92400e" stroke="#270e04" strokeWidth="2" />
        <circle cx="180" cy="310" r="5" fill="#facc15" />

        {/* Base Socket */}
        <polygon points="155,260 205,260 195,240 165,240" fill="url(#brassGrad)" stroke="#854d0e" strokeWidth="2" />

        {/* U-Shaped Arch Frame (Mekereb - መከረብ) */}
        <path
          d="M 115 240 L 115 130 C 115 60, 245 60, 245 130 L 245 240 Z"
          fill="none"
          stroke="url(#brassGrad)"
          strokeWidth="14"
          strokeLinejoin="round"
        />
        <path
          d="M 115 240 L 115 130 C 115 60, 245 60, 245 130 L 245 240 Z"
          fill="none"
          stroke="#713f12"
          strokeWidth="2"
        />

        {/* Crosswise Metal Rods */}
        <line x1="122" y1="110" x2="238" y2="110" stroke="#ca8a04" strokeWidth="4" />
        <line x1="122" y1="160" x2="238" y2="160" stroke="#ca8a04" strokeWidth="4" />
        <line x1="122" y1="210" x2="238" y2="210" stroke="#ca8a04" strokeWidth="4" />

        {/* Sliding Jingling Brass Discs (Qelbetat - ቀለበታት) */}
        {[
          // Top Rod Discs
          { cx: 145, cy: 110 },
          { cx: 165, cy: 110 },
          { cx: 195, cy: 110 },
          { cx: 215, cy: 110 },
          // Mid Rod Discs
          { cx: 140, cy: 160 },
          { cx: 160, cy: 160 },
          { cx: 180, cy: 160 },
          { cx: 200, cy: 160 },
          { cx: 220, cy: 160 },
          // Bot Rod Discs
          { cx: 145, cy: 210 },
          { cx: 170, cy: 210 },
          { cx: 190, cy: 210 },
          { cx: 215, cy: 210 },
        ].map((disc, idx) => (
          <ellipse
            key={idx}
            cx={disc.cx + (isShaking ? (idx % 2 === 0 ? 6 : -6) : 0)}
            cy={disc.cy}
            rx="5.5"
            ry="11"
            fill="url(#brassGrad)"
            stroke="#854d0e"
            strokeWidth="1.5"
            className="transition-transform duration-100"
          />
        ))}

        {/* Metallic chime twinkle sparkles */}
        {isShaking && (
          <>
            <text x="90" y="90" fill="#facc15" fontSize="22" className="animate-ping">
              ✨
            </text>
            <text x="250" y="85" fill="#facc15" fontSize="22" className="animate-ping">
              ✨
            </text>
            <text x="180" y="45" fill="#facc15" fontSize="22" className="animate-ping">
              🔔
            </text>
          </>
        )}
      </svg>
    );
  }

  // ---------------------------------------------------------------------------
  // 7. EMBILTA (እምቢልታ): Royal ceremonial long bamboo horn
  // ---------------------------------------------------------------------------
  return (
    <svg
      viewBox="0 0 360 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 drop-shadow-xl`}
    >
      <defs>
        <linearGradient id="embiltaBamboo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Long Tapering Bamboo Horn Tube */}
      <polygon
        points="174,40 186,40 205,370 155,370"
        fill="url(#embiltaBamboo)"
        stroke="#451a03"
        strokeWidth="3.5"
      />

      {/* Decorative Red, Yellow, Green Ethiopian Ribbons */}
      {[100, 170, 240, 310].map((y, idx) => (
        <g key={idx}>
          <rect x={168 - idx * 2} y={y} width={24 + idx * 4} height="6" fill="#dc2626" />
          <rect x={168 - idx * 2} y={y + 6} width={24 + idx * 4} height="6" fill="#facc15" />
          <rect x={168 - idx * 2} y={y + 12} width={24 + idx * 4} height="6" fill="#16a34a" />
        </g>
      ))}

      {/* Top Blowing Mouthpiece */}
      <ellipse cx="180" cy="40" rx="8" ry="3" fill="#451a03" stroke="#fef08a" strokeWidth="1.5" />
      <ellipse cx="180" cy="40" rx="5" ry="1.5" fill="#000000" />

      {/* Bottom Flared Horn Bell */}
      <ellipse cx="180" cy="370" rx="26" ry="10" fill="#451a03" stroke="#fef08a" strokeWidth="2" />
      <ellipse cx="180" cy="370" rx="21" ry="7" fill="#1e0b02" />

      {/* Royal Fanfare Sound Waves */}
      {activeNoteIndex !== null && activeNoteIndex >= 0 && (
        <>
          <path
            d="M 140 385 C 160 405, 200 405, 220 385"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-ping"
          />
          <text x="180" y="405" textAnchor="middle" fill="#f43f5e" fontSize="16" fontWeight="bold">
            📯 Fanfare!
          </text>
        </>
      )}
    </svg>
  );
}
