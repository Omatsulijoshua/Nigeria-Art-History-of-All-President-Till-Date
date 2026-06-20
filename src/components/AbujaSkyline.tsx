import React from 'react';

interface AbujaSkylineProps {
  className?: string;
  opacity?: number;
}

export const AbujaSkyline: React.FC<AbujaSkylineProps> = ({
  className = '',
  opacity = 0.4
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      className={`abuja-skyline-svg ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: opacity,
        transition: 'opacity 1s ease'
      }}
    >
      <defs>
        {/* Soft atmospheric gradient */}
        <radialGradient id="sky-glow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#042f2e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="zuma-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="building-grad-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="gold-dome-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cca43b" />
          <stop offset="50%" stopColor="#ffdf7a" />
          <stop offset="100%" stopColor="#9a7116" />
        </linearGradient>

        <linearGradient id="green-dome-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>

      {/* 1. ATMOSPHERIC BACKGLOW */}
      <rect width="1200" height="600" fill="url(#sky-glow)" />

      {/* 2. ZUMA ROCK (BACKGROUND MONOLITH) */}
      <path
        d="M 680 500 
           C 720 380, 750 280, 800 270 
           C 840 260, 920 270, 960 300 
           C 1010 330, 1050 420, 1090 500 Z"
        fill="url(#zuma-grad)"
      />
      {/* Zuma Rock rock lines texture */}
      <path
        d="M 800 270 Q 820 340 830 500
           M 840 275 Q 860 360 870 500
           M 880 280 Q 900 370 910 500
           M 930 290 Q 940 380 945 500"
        stroke="#475569"
        strokeWidth="1.5"
        strokeOpacity="0.1"
        fill="none"
      />

      {/* 3. DISTANT ASSEMBLY & CITY SILHOUETTES */}
      <g fill="url(#building-grad-dark)">
        {/* Distant building blocks left */}
        <rect x="50" y="420" width="80" height="80" rx="2" />
        <rect x="110" y="440" width="70" height="60" rx="1" />
        <rect x="160" y="400" width="50" height="100" rx="3" />
        <rect x="230" y="430" width="90" height="70" rx="2" />

        {/* National Assembly Green Dome Building (Center-Right) */}
        <path d="M 520 500 L 520 400 L 640 400 L 640 500 Z" />
        <rect x="530" y="380" width="90" height="20" />
        {/* National Assembly Green Dome */}
        <path d="M 545 380 C 545 340, 605 340, 605 380 Z" fill="url(#green-dome-grad)" />
        {/* Dome spire */}
        <line x1="575" y1="340" x2="575" y2="320" stroke="#10b981" strokeWidth="2.5" />

        {/* Distant building blocks right */}
        <rect x="1000" y="430" width="60" height="70" rx="1" />
        <rect x="1040" y="410" width="80" height="90" rx="2" />
        <rect x="1100" y="450" width="50" height="50" rx="1" />
      </g>

      {/* 4. ABUJA NATIONAL MOSQUE (FOREGROUND MAIN BUILDING) */}
      <g transform="translate(180, 50)" fill="url(#building-grad-dark)">
        {/* Main Base Block */}
        <path d="M 80 450 L 80 320 L 320 320 L 320 450 Z" />
        
        {/* Arch Details (Slightly lighter dark color to make them visible) */}
        <g fill="#1e293b" opacity="0.4">
          <path d="M 120 450 C 120 400, 150 400, 150 450 Z" />
          <path d="M 185 450 C 185 390, 215 390, 215 450 Z" />
          <path d="M 250 450 C 250 400, 280 400, 280 450 Z" />
          {/* Windows row */}
          <rect x="100" y="340" width="30" height="15" rx="2" />
          <rect x="150" y="340" width="30" height="15" rx="2" />
          <rect x="220" y="340" width="30" height="15" rx="2" />
          <rect x="270" y="340" width="30" height="15" rx="2" />
        </g>

        {/* Center Golden Dome Base */}
        <rect x="135" y="300" width="130" height="20" fill="url(#building-grad-dark)" />
        <rect x="145" y="285" width="110" height="15" fill="#cca43b" opacity="0.3" />

        {/* Center Golden Dome */}
        <path
          d="M 145 285 C 145 190, 255 190, 255 285 Z"
          fill="url(#gold-dome-grad)"
          stroke="#cca43b"
          strokeWidth="1"
        />
        
        {/* Crescent Spire on Golden Dome */}
        <line x1="200" y1="190" x2="200" y2="160" stroke="#ffdf7a" strokeWidth="2.5" />
        <path d="M 197 160 A 6 6 0 1 1 203 160 A 4 4 0 1 0 197 160 Z" fill="#ffdf7a" />

        {/* Small Side Domes (Gold) */}
        <path d="M 95 320 C 95 295, 125 295, 125 320 Z" fill="url(#gold-dome-grad)" />
        <path d="M 275 320 C 275 295, 305 295, 305 320 Z" fill="url(#gold-dome-grad)" />

        {/* --- FOUR MINARETS --- */}
        {/* Minaret 1 (Far Left) */}
        <g transform="translate(30, 80)">
          <rect x="0" y="0" width="16" height="290" />
          {/* Balcony 1 */}
          <rect x="-4" y="200" width="24" height="6" rx="1" fill="#cca43b" />
          {/* Balcony 2 */}
          <rect x="-4" y="100" width="24" height="6" rx="1" fill="#cca43b" />
          {/* Minaret Cap */}
          <path d="M -2 0 L 8 -40 L 18 0 Z" fill="url(#green-dome-grad)" />
          {/* Golden Spire */}
          <line x1="8" y1="-40" x2="8" y2="-55" stroke="#ffdf7a" strokeWidth="1.5" />
        </g>

        {/* Minaret 2 (Inner Left) */}
        <g transform="translate(60, 110)">
          <rect x="0" y="0" width="14" height="260" />
          {/* Balcony */}
          <rect x="-3" y="150" width="20" height="5" rx="1" fill="#cca43b" />
          <rect x="-3" y="80" width="20" height="5" rx="1" fill="#cca43b" />
          {/* Cap */}
          <path d="M -2 0 L 7 -35 L 16 0 Z" fill="url(#green-dome-grad)" />
          <line x1="7" y1="-35" x2="7" y2="-48" stroke="#ffdf7a" strokeWidth="1.2" />
        </g>

        {/* Minaret 3 (Inner Right) */}
        <g transform="translate(325, 110)">
          <rect x="0" y="0" width="14" height="260" />
          {/* Balcony */}
          <rect x="-3" y="150" width="20" height="5" rx="1" fill="#cca43b" />
          <rect x="-3" y="80" width="20" height="5" rx="1" fill="#cca43b" />
          {/* Cap */}
          <path d="M -2 0 L 7 -35 L 16 0 Z" fill="url(#green-dome-grad)" />
          <line x1="7" y1="-35" x2="7" y2="-48" stroke="#ffdf7a" strokeWidth="1.2" />
        </g>

        {/* Minaret 4 (Far Right) */}
        <g transform="translate(355, 80)">
          <rect x="0" y="0" width="16" height="290" />
          {/* Balcony 1 */}
          <rect x="-4" y="200" width="24" height="6" rx="1" fill="#cca43b" />
          {/* Balcony 2 */}
          <rect x="-4" y="100" width="24" height="6" rx="1" fill="#cca43b" />
          {/* Cap */}
          <path d="M -2 0 L 8 -40 L 18 0 Z" fill="url(#green-dome-grad)" />
          <line x1="8" y1="-40" x2="8" y2="-55" stroke="#ffdf7a" strokeWidth="1.5" />
        </g>
      </g>

      {/* 5. DUST/LIGHT HIGHLIGHT GLOWS (AT BOTTOM EXTREME) */}
      <rect x="0" y="495" width="1200" height="105" fill="#020617" />
      <line x1="0" y1="495" x2="1200" y2="495" stroke="#047857" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
};
