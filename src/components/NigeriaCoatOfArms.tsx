import React from 'react';

interface NigeriaCoatOfArmsProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const NigeriaCoatOfArms: React.FC<NigeriaCoatOfArmsProps> = ({
  className = '',
  width = 120,
  height = 120
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={width}
      height={height}
      className={`nigeria-coat-of-arms ${className}`}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>
        <linearGradient id="red-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#cc1100" />
        </linearGradient>
        <linearGradient id="green-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
      </defs>

      {/* --- BACKGROUND GREEN MOUND (PASTURE) --- */}
      <path
        d="M 60,310 C 130,290 270,290 340,310 C 350,330 350,340 340,340 C 270,330 130,330 60,340 C 50,340 50,330 60,310 Z"
        fill="url(#green-grad)"
        stroke="#065f46"
        strokeWidth="2"
      />

      {/* RURAL FLOWERS (Costus Spectabilis) on the pasture */}
      {/* Flower 1 (Left) */}
      <g transform="translate(100, 310) scale(0.6)">
        <circle cx="0" cy="0" r="10" fill="#f59e0b" />
        <circle cx="-12" cy="0" r="8" fill="#d97706" />
        <circle cx="12" cy="0" r="8" fill="#d97706" />
        <circle cx="0" cy="-12" r="8" fill="#d97706" />
        <circle cx="0" cy="12" r="8" fill="#d97706" />
      </g>
      {/* Flower 2 (Center-Left) */}
      <g transform="translate(140, 315) scale(0.5)">
        <circle cx="0" cy="0" r="10" fill="#f59e0b" />
        <circle cx="-12" cy="0" r="8" fill="#d97706" />
        <circle cx="12" cy="0" r="8" fill="#d97706" />
        <circle cx="0" cy="-12" r="8" fill="#d97706" />
        <circle cx="0" cy="12" r="8" fill="#d97706" />
      </g>
      {/* Flower 3 (Center-Right) */}
      <g transform="translate(260, 315) scale(0.5)">
        <circle cx="0" cy="0" r="10" fill="#f59e0b" />
        <circle cx="-12" cy="0" r="8" fill="#d97706" />
        <circle cx="12" cy="0" r="8" fill="#d97706" />
        <circle cx="0" cy="-12" r="8" fill="#d97706" />
        <circle cx="0" cy="12" r="8" fill="#d97706" />
      </g>
      {/* Flower 4 (Right) */}
      <g transform="translate(300, 310) scale(0.6)">
        <circle cx="0" cy="0" r="10" fill="#f59e0b" />
        <circle cx="-12" cy="0" r="8" fill="#d97706" />
        <circle cx="12" cy="0" r="8" fill="#d97706" />
        <circle cx="0" cy="-12" r="8" fill="#d97706" />
        <circle cx="0" cy="12" r="8" fill="#d97706" />
      </g>

      {/* --- CENTRAL BLACK SHIELD --- */}
      <g transform="translate(0, 30)">
        <path
          d="M 150,110 C 150,110 200,115 250,110 C 250,150 255,200 240,240 C 225,270 200,285 200,285 C 200,285 175,270 160,240 C 145,200 150,150 150,110 Z"
          fill="url(#shield-grad)"
          stroke="url(#gold-grad)"
          strokeWidth="3.5"
          filter="drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.5))"
        />

        {/* SILVER-WHITE PALL (Y-Shape Confluence representing River Niger & Benue) */}
        {/* Top-Left Branch */}
        <path
          d="M 160,112 C 172,130 185,150 190,165 L 210,165 C 215,150 228,130 240,112 L 225,112 C 212,130 205,142 200,152 C 195,142 188,130 175,112 Z"
          fill="#f3f4f6"
        />
        {/* Tail (Y confluence joining down) */}
        <path
          d="M 190,163 L 210,163 L 210,245 C 210,265 204,275 200,280 C 196,275 190,265 190,245 Z"
          fill="#f3f4f6"
        />
      </g>

      {/* --- LEFT HORSES / CHARGER (WHITE) --- */}
      {/* Rearing white horse on the left */}
      <g transform="translate(100, 190) scale(0.95)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5">
        {/* Body & Leg Paths */}
        <path d="M 0,0 C -15,-5 -30,-25 -25,-45 C -23,-50 -10,-55 -3,-50 C 5,-45 10,-35 15,-20 C 18, -10 10,0 0,0 Z" />
        {/* Rear Legs */}
        <path d="M -15, -10 C -20, 15 -25, 45 -25, 60 C -25,65 -20,70 -15,70 C -10,70 -8,60 -5,40 C 0,20 5,0 0,0 Z" />
        <path d="M -8, -5 C -15, 20 -15, 45 -12, 65 C -12,70 -7,73 -3,73 C 2,73 3,65 0,45 C -2,25 -3,10 -8,-5 Z" opacity="0.8" />
        {/* Front Rearing Legs */}
        <path d="M 10,-30 C 20,-45 28,-65 35,-70 C 40,-73 45,-70 43,-65 C 40,-55 30,-35 22,-20 Z" />
        <path d="M 5,-25 C 18,-38 28,-50 38,-53 C 43,-55 46,-50 43,-45 C 38,-35 28,-22 17,-12 Z" opacity="0.8" />
        {/* Neck and Head */}
        <path d="M -5,-42 C -5,-55 5,-75 2,-90 C 0,-95 -12,-98 -15,-92 C -18,-88 -15,-80 -18,-75 C -21,-72 -28,-75 -32,-70 C -35,-65 -30,-60 -25,-60 C -22,-50 -18,-45 -15,-40 Z" />
        {/* Mane (Styled in Gold) */}
        <path d="M -5,-50 Q 8,-65 0,-85 Q -8,-75 -5,-50 Z" fill="url(#gold-grad)" stroke="none" />
        {/* Tail (White/Gray) */}
        <path d="M -25,-30 C -40,-25 -50,-10 -55,10 C -55,20 -50,22 -48,15 C -45,0 -35,-15 -25,-22 Z" fill="#e2e8f0" stroke="none" />
      </g>

      {/* --- RIGHT HORSES / CHARGER (WHITE) --- */}
      {/* Rearing white horse on the right (Mirrored) */}
      <g transform="translate(300, 190) scale(-0.95, 0.95)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5">
        {/* Body & Leg Paths */}
        <path d="M 0,0 C -15,-5 -30,-25 -25,-45 C -23,-50 -10,-55 -3,-50 C 5,-45 10,-35 15,-20 C 18, -10 10,0 0,0 Z" />
        {/* Rear Legs */}
        <path d="M -15, -10 C -20, 15 -25, 45 -25, 60 C -25,65 -20,70 -15,70 C -10,70 -8,60 -5,40 C 0,20 5,0 0,0 Z" />
        <path d="M -8, -5 C -15, 20 -15, 45 -12, 65 C -12,70 -7,73 -3,73 C 2,73 3,65 0,45 C -2,25 -3,10 -8,-5 Z" opacity="0.8" />
        {/* Front Rearing Legs */}
        <path d="M 10,-30 C 20,-45 28,-65 35,-70 C 40,-73 45,-70 43,-65 C 40,-55 30,-35 22,-20 Z" />
        <path d="M 5,-25 C 18,-38 28,-50 38,-53 C 43,-55 46,-50 43,-45 C 38,-35 28,-22 17,-12 Z" opacity="0.8" />
        {/* Neck and Head */}
        <path d="M -5,-42 C -5,-55 5,-75 2,-90 C 0,-95 -12,-98 -15,-92 C -18,-88 -15,-80 -18,-75 C -21,-72 -28,-75 -32,-70 C -35,-65 -30,-60 -25,-60 C -22,-50 -18,-45 -15,-40 Z" />
        {/* Mane */}
        <path d="M -5,-50 Q 8,-65 0,-85 Q -8,-75 -5,-50 Z" fill="url(#gold-grad)" stroke="none" />
        {/* Tail */}
        <path d="M -25,-30 C -40,-25 -50,-10 -55,10 C -55,20 -50,22 -48,15 C -45,0 -35,-15 -25,-22 Z" fill="#e2e8f0" stroke="none" />
      </g>

      {/* --- CROWN WREATH (GREEN & WHITE) --- */}
      {/* Sits at the top of the shield, supporting the eagle */}
      <g transform="translate(162, 110)">
        <rect x="0" y="0" width="76" height="14" rx="4" fill="#047857" stroke="url(#gold-grad)" strokeWidth="1.5" />
        <path d="M 10,0 L 22,14 M 32,0 L 44,14 M 54,0 L 66,14" stroke="#ffffff" strokeWidth="4" />
      </g>

      {/* --- RED EAGLE (STRENGTH) --- */}
      {/* Standing proud at the top of the wreath */}
      <g transform="translate(200, 80)" fill="url(#red-grad)" stroke="#991b1b" strokeWidth="1">
        {/* Eagle wings spread */}
        <path d="M 0,0 C -25,-8 -50,-5 -65,15 C -65,15 -55,25 -40,15 C -30,8 -15,10 -10,22 C -5,25 -2,22 0,22 C 2,22 5,25 10,22 C 15,10 30,8 40,15 C 55,25 65,15 65,15 C 50,-5 25,-8 0,0 Z" />
        {/* Left feather details */}
        <path d="M -45,13 C -38,5 -30,5 -25,12 C -20,17 -30,22 -45,13 Z" opacity="0.65" fill="#ef4444" />
        {/* Right feather details */}
        <path d="M 45,13 C 38,5 30,5 25,12 C 20,17 30,22 45,13 Z" opacity="0.65" fill="#ef4444" />
        {/* Eagle Body and Tail */}
        <path d="M -15,15 C -15,15 -18,40 0,42 C 18,40 15,15 15,15 C 10,25 5,30 0,30 C -5,30 -10,25 -15,15 Z" />
        {/* Head and Beak */}
        <path d="M -10,-8 C -8,-25 8,-25 10,-8 C 10,-3 5,2 0,2 C -5,2 -10,-3 -10,-8 Z" />
        <path d="M -2,-16 C -2,-16 5,-28 12,-20 L 7,-12 Z" fill="url(#gold-grad)" stroke="none" />
      </g>

      {/* --- MOTTO BANNER / SCROLL --- */}
      {/* Scroll banner at the base reading "Unity and Faith, Peace and Progress" */}
      <g transform="translate(0, 310)">
        {/* Left ribbon tail */}
        <path d="M 50,30 L 75,10 L 75,40 L 50,30 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
        <path d="M 75,10 L 100,20 L 100,45 L 75,40 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
        {/* Right ribbon tail */}
        <path d="M 350,30 L 325,10 L 325,40 L 350,30 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
        <path d="M 325,10 L 300,20 L 300,45 L 325,40 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />

        {/* Central Scroll Banner */}
        <path
          d="M 90,20 C 130,5 270,5 310,20 C 310,20 315,45 305,45 C 265,30 135,30 95,45 C 85,45 90,20 90,20 Z"
          fill="url(#gold-grad)"
          stroke="#aa7c11"
          strokeWidth="2"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
        />

        {/* Banner folds shadow */}
        <path d="M 95,20 L 100,24 L 100,32 L 95,33 Z" fill="#b45309" opacity="0.5" />
        <path d="M 305,20 L 300,24 L 300,32 L 305,33 Z" fill="#b45309" opacity="0.5" />

        {/* Motto Text */}
        <text
          x="200"
          y="31"
          fontFamily="Georgia, serif"
          fontSize="9.5"
          fontWeight="bold"
          fill="#1e293b"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          UNITY AND FAITH, PEACE AND PROGRESS
        </text>
      </g>
    </svg>
  );
};
