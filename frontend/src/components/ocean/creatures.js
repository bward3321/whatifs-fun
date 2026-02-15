import React from 'react';

const BaseFish = ({ stripes = false, elongated = false, opacity = 0.8 }) => {
  const rx = elongated ? 32 : 26;
  const ry = elongated ? 10 : 13;
  const cy = 22;
  return (
    <g fill={`rgba(255,255,255,${opacity})`}>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} />
      <path d={`M${40 + rx - 4} ${cy} L86 ${cy - 11} L86 ${cy + 11}Z`} />
      <circle cx="20" cy={cy - 3} r="2.5" fill="rgba(0,0,0,0.25)" />
      <circle cx="19.5" cy={cy - 3.5} r="1" fill="rgba(0,0,0,0.4)" />
      <path d={`M32 ${cy - ry + 1} Q40 ${cy - ry - 5} 48 ${cy - ry + 1}`} />
      <path d={`M30 ${cy + ry - 3} L22 ${cy + ry + 5} L34 ${cy + ry - 1}`} opacity="0.7" />
      {stripes && [30, 40, 50, 58].map(x => (
        <line key={x} x1={x} y1={cy - ry + 3} x2={x} y2={cy + ry - 3} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      ))}
    </g>
  );
};

export const CREATURE_SVGS = {
  seagull: (size) => (
    <svg width={size} height={size * 0.35} viewBox="0 0 120 42" fill="none">
      <path d="M4 36 Q28 6 60 22 Q92 6 116 36" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 22 L60 28 L64 22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  diver: (size) => (
    <svg width={size * 0.65} height={size} viewBox="0 0 52 80" fill="rgba(255,255,255,0.8)">
      <circle cx="26" cy="11" r="8" />
      <rect x="30" y="6" width="12" height="5" rx="2.5" opacity="0.5" />
      <rect x="18" y="19" width="16" height="26" rx="4" />
      <rect x="34" y="22" width="5" height="18" rx="2.5" opacity="0.6" />
      <line x1="18" y1="25" x2="6" y2="38" stroke="rgba(255,255,255,0.7)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="34" y1="25" x2="46" y2="38" stroke="rgba(255,255,255,0.7)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="22" y1="45" x2="16" y2="65" stroke="rgba(255,255,255,0.7)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="30" y1="45" x2="36" y2="65" stroke="rgba(255,255,255,0.7)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 65 L6 70 L18 68" opacity="0.6" />
      <path d="M36 65 L46 70 L34 68" opacity="0.6" />
    </svg>
  ),

  snorkeler: (size) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 90 45" fill="rgba(255,255,255,0.75)">
      <circle cx="18" cy="18" r="7" />
      <rect x="25" y="12" width="8" height="4" rx="2" opacity="0.5" />
      <line x1="33" y1="9" x2="33" y2="3" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      <ellipse cx="42" cy="22" rx="18" ry="8" />
      <line x1="55" y1="28" x2="65" y2="36" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="28" x2="58" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 36 L75 32 L68 40Z" opacity="0.5" />
      <path d="M58 38 L68 36 L60 42Z" opacity="0.5" />
    </svg>
  ),

  coral: (size) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M50 95 L50 55" />
      <path d="M50 55 L30 30" />
      <path d="M50 55 L70 28" />
      <path d="M50 68 L35 52" />
      <path d="M50 68 L68 50" />
      <path d="M30 30 L18 15" />
      <path d="M30 30 L38 12" />
      <path d="M70 28 L62 10" />
      <path d="M70 28 L82 14" />
      <path d="M35 52 L22 42" />
      <path d="M68 50 L80 40" />
      <circle cx="18" cy="15" r="3.5" fill="rgba(255,255,255,0.45)" />
      <circle cx="38" cy="12" r="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="62" cy="10" r="3.5" fill="rgba(255,255,255,0.45)" />
      <circle cx="82" cy="14" r="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="22" cy="42" r="2.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="80" cy="40" r="2.5" fill="rgba(255,255,255,0.35)" />
    </svg>
  ),

  stripedBass: (size) => (
    <svg width={size} height={size * 0.45} viewBox="0 0 100 45">
      <BaseFish stripes />
    </svg>
  ),

  clownfish: (size) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 60 42" fill="rgba(255,255,255,0.8)">
      <ellipse cx="28" cy="21" rx="22" ry="14" />
      <path d="M46 21 L58 12 L58 30Z" />
      <circle cx="14" cy="17" r="2.5" fill="rgba(0,0,0,0.25)" />
      <rect x="18" y="7" width="2.5" height="28" fill="rgba(255,255,255,0.15)" rx="1.25" />
      <rect x="30" y="9" width="2.5" height="24" fill="rgba(255,255,255,0.15)" rx="1.25" />
      <path d="M20 7 Q28 2 36 7" fill="rgba(255,255,255,0.7)" />
    </svg>
  ),

  barramundi: (size) => (
    <svg width={size} height={size * 0.4} viewBox="0 0 100 44">
      <BaseFish elongated />
    </svg>
  ),

  haddock: (size) => (
    <svg width={size} height={size * 0.45} viewBox="0 0 100 45">
      <BaseFish />
      <circle cx="28" cy="19" r="3.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),

  chainCatshark: (size) => (
    <svg width={size} height={size * 0.35} viewBox="0 0 140 49" fill="rgba(255,255,255,0.72)">
      <path d="M8 24 Q20 8 50 12 Q80 8 110 18 L130 24 L110 30 Q80 40 50 36 Q20 40 8 24Z" />
      <path d="M60 12 L65 2 L70 14" />
      <path d="M90 16 L92 8 L94 18" opacity="0.6" />
      <circle cx="22" cy="22" r="2.5" fill="rgba(0,0,0,0.25)" />
      <path d="M130 24 L140 18 L138 30Z" opacity="0.8" />
      <circle cx="35" cy="24" r="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="50" cy="24" r="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="65" cy="24" r="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="80" cy="24" r="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="95" cy="24" r="2" fill="rgba(255,255,255,0.12)" />
    </svg>
  ),

  kelp: (size) => (
    <svg width={size * 0.35} height={size} viewBox="0 0 35 100" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 98 Q10 80 20 65 Q28 50 15 35 Q8 22 18 8" />
      <path d="M14 70 Q4 62 8 50" opacity="0.5" />
      <path d="M22 50 Q32 42 28 32" opacity="0.5" />
      <path d="M16 30 Q6 24 10 14" opacity="0.4" />
      <circle cx="18" cy="5" r="4" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),

  monkfish: (size) => (
    <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="rgba(255,255,255,0.68)">
      <ellipse cx="40" cy="32" rx="30" ry="18" />
      <ellipse cx="40" cy="28" rx="35" ry="10" opacity="0.5" />
      <path d="M70 30 Q85 28 95 35 Q85 40 70 36" opacity="0.7" />
      <circle cx="28" cy="24" r="3.5" fill="rgba(0,0,0,0.2)" />
      <circle cx="52" cy="24" r="3" fill="rgba(0,0,0,0.2)" />
      <path d="M25 38 Q40 44 55 38" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
      <line x1="40" y1="14" x2="38" y2="4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      <circle cx="38" cy="3" r="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  ),

  deepSeaShrimp: (size) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 55 38" fill="rgba(255,255,255,0.65)">
      <path d="M8 20 Q12 8 25 6 Q38 4 45 12 Q50 18 48 25 Q42 32 30 34 Q18 36 10 28Z" />
      <line x1="25" y1="6" x2="15" y2="2" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      <line x1="25" y1="6" x2="20" y2="1" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      <circle cx="38" cy="14" r="1.5" fill="rgba(0,0,0,0.18)" />
      <path d="M15 28 Q12 34 8 36" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
      <path d="M20 30 Q18 35 14 37" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
    </svg>
  ),

  jellyfish: (size) => (
    <svg width={size * 0.7} height={size} viewBox="0 0 70 100" fill="rgba(255,255,255,0.55)">
      <path d="M10 40 Q10 10 35 10 Q60 10 60 40 Q50 48 35 45 Q20 48 10 40Z" />
      <path d="M15 42 Q20 58 18 78" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
      <path d="M25 44 Q28 62 22 88" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M35 45 Q35 68 32 98" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
      <path d="M45 44 Q42 62 48 88" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M55 42 Q50 58 52 78" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  giantSquid: (size) => (
    <svg width={size * 0.4} height={size} viewBox="0 0 60 150" fill="rgba(255,255,255,0.65)">
      <ellipse cx="30" cy="30" rx="18" ry="28" />
      <circle cx="22" cy="22" r="4" fill="rgba(0,0,0,0.18)" />
      <circle cx="38" cy="22" r="4" fill="rgba(0,0,0,0.18)" />
      <path d="M18 55 Q15 82 12 112 Q10 128 15 142" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
      <path d="M24 56 Q22 88 20 122 Q18 136 22 148" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      <path d="M30 58 Q30 92 28 128 Q27 140 30 150" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
      <path d="M36 56 Q38 88 40 122 Q42 136 38 148" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      <path d="M42 55 Q45 82 48 112 Q50 128 45 142" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
      <path d="M14 54 Q8 78 5 102" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
      <path d="M46 54 Q52 78 55 102" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  gulperEel: (size) => (
    <svg width={size} height={size * 0.4} viewBox="0 0 120 48" fill="rgba(255,255,255,0.65)">
      <path d="M5 18 Q15 5 35 10 Q55 5 65 18" />
      <path d="M5 30 Q15 43 35 38 Q55 43 65 30" />
      <line x1="5" y1="18" x2="5" y2="30" stroke="rgba(255,255,255,0.65)" strokeWidth="1" />
      <path d="M65 18 Q80 20 120 24 Q80 28 65 30" opacity="0.55" />
      <circle cx="25" cy="16" r="2" fill="rgba(0,0,0,0.18)" />
    </svg>
  ),

  seaCucumber: (size) => (
    <svg width={size} height={size * 0.35} viewBox="0 0 90 32" fill="rgba(255,255,255,0.6)">
      <path d="M10 16 Q10 4 30 6 Q60 2 80 10 Q92 16 80 22 Q60 30 30 26 Q10 28 10 16Z" />
      <circle cx="20" cy="13" r="1.5" fill="rgba(255,255,255,0.18)" />
      <circle cx="32" cy="11" r="1.5" fill="rgba(255,255,255,0.18)" />
      <circle cx="44" cy="12" r="1.5" fill="rgba(255,255,255,0.18)" />
      <circle cx="56" cy="13" r="1.5" fill="rgba(255,255,255,0.18)" />
      <circle cx="68" cy="14" r="1.5" fill="rgba(255,255,255,0.18)" />
    </svg>
  ),

  brittleStar: (size) => (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
      <circle cx="45" cy="45" r="8" fill="rgba(255,255,255,0.45)" />
      <path d="M45 37 Q48 20 42 5" />
      <path d="M52 41 Q65 30 82 25" />
      <path d="M52 49 Q68 55 80 68" />
      <path d="M45 53 Q42 70 48 85" />
      <path d="M38 49 Q22 55 10 68" />
      <path d="M38 41 Q25 30 8 25" />
    </svg>
  ),

  anglerfish: (size) => (
    <svg width={size} height={size * 0.8} viewBox="0 0 90 72" fill="rgba(255,255,255,0.65)">
      <ellipse cx="40" cy="40" rx="28" ry="24" />
      <path d="M12 32 L5 28 L8 36 L5 40 L12 38" opacity="0.75" />
      <path d="M60 32 Q72 34 78 40 Q72 46 60 48" opacity="0.55" />
      <circle cx="30" cy="34" r="5" fill="rgba(0,0,0,0.18)" />
      <circle cx="30" cy="33" r="2" fill="rgba(0,0,0,0.35)" />
      <path d="M15 30 Q5 15 20 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="5" r="4" fill="rgba(180,220,255,0.55)" className="angler-lure" />
      <path d="M14 44 L8 48 L14 46 L10 52 L16 48 L14 54 L18 48" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
    </svg>
  ),

  amphipod: (size) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 50 30" fill="rgba(255,255,255,0.55)">
      <path d="M5 15 Q8 6 18 5 Q28 4 38 8 Q46 12 45 18 Q42 24 32 26 Q22 28 12 24 Q5 22 5 15Z" />
      <line x1="12" y1="5" x2="5" y2="2" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <line x1="15" y1="5" x2="10" y2="1" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <circle cx="40" cy="12" r="1" fill="rgba(0,0,0,0.18)" />
      <line x1="15" y1="23" x2="12" y2="28" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      <line x1="20" y1="24" x2="17" y2="28" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      <line x1="25" y1="24" x2="22" y2="28" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      <line x1="30" y1="24" x2="27" y2="28" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      <line x1="35" y1="23" x2="32" y2="28" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
    </svg>
  ),

  snailfish: (size) => (
    <svg width={size} height={size * 0.4} viewBox="0 0 80 32" fill="rgba(255,255,255,0.6)">
      <path d="M8 16 Q12 4 30 6 Q50 4 65 10 Q78 14 76 18 Q72 24 55 26 Q35 28 18 24 Q8 22 8 16Z" />
      <circle cx="18" cy="14" r="2" fill="rgba(0,0,0,0.18)" />
      <path d="M55 12 Q62 8 68 12" fill="rgba(255,255,255,0.45)" opacity="0.6" />
    </svg>
  ),

  marianaSnailfish: (size) => (
    <svg width={size} height={size * 0.4} viewBox="0 0 80 32" fill="rgba(255,255,255,0.5)">
      <path d="M6 16 Q10 5 28 7 Q48 3 63 10 Q76 14 74 18 Q70 24 53 26 Q33 28 16 24 Q6 22 6 16Z" />
      <circle cx="16" cy="14" r="2" fill="rgba(0,0,0,0.12)" />
      <path d="M53 12 Q60 8 66 12" fill="rgba(255,255,255,0.35)" opacity="0.5" />
      <path d="M74 16 L80 14 L80 20 L74 18" opacity="0.35" />
    </svg>
  ),

  tinyAmphipod: (size) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 35 21" fill="rgba(255,255,255,0.45)">
      <path d="M4 10 Q6 4 14 4 Q22 3 28 7 Q33 10 32 14 Q28 18 20 19 Q12 20 6 16 Q3 14 4 10Z" />
      <line x1="10" y1="4" x2="6" y2="1" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
      <circle cx="28" cy="9" r="0.8" fill="rgba(0,0,0,0.15)" />
    </svg>
  ),

  everestOutline: (size) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 120 72" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M5 70 L25 38 L35 42 L55 12 L65 5 L75 15 L88 35 L95 32 L115 70" />
      <path d="M55 12 L65 5 L75 15" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="5" y1="70" x2="115" y2="70" opacity="0.15" strokeDasharray="4 6" />
    </svg>
  ),

  dolphin: (size) => (
    <svg width={size} height={size * 0.45} viewBox="0 0 110 50" fill="rgba(255,255,255,0.78)">
      <path d="M10 28 Q20 12 45 15 Q70 12 90 22 Q100 28 95 32 Q80 40 55 38 Q30 42 15 35 Q8 32 10 28Z" />
      <path d="M55 15 L58 5 L65 16" />
      <path d="M90 22 L108 16 L100 26" opacity="0.7" />
      <circle cx="22" cy="24" r="2" fill="rgba(0,0,0,0.22)" />
      <path d="M12 26 L5 22 L8 28" opacity="0.6" />
    </svg>
  ),

  seaTurtle: (size) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 90 63" fill="rgba(255,255,255,0.72)">
      <ellipse cx="45" cy="32" rx="28" ry="20" />
      <ellipse cx="45" cy="32" rx="22" ry="16" fill="rgba(255,255,255,0.12)" />
      <circle cx="22" cy="25" r="6" />
      <circle cx="16" cy="23" r="1.5" fill="rgba(0,0,0,0.22)" />
      <path d="M20 38 L8 48 L14 36" opacity="0.65" />
      <path d="M20 26 L6 18 L16 28" opacity="0.65" />
      <path d="M70 26 L82 18 L72 28" opacity="0.6" />
      <path d="M70 38 L84 46 L72 36" opacity="0.6" />
      <path d="M73 32 L88 34 L73 36" opacity="0.5" />
      <line x1="35" y1="20" x2="35" y2="44" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="45" y1="16" x2="45" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
    </svg>
  ),

  blueWhale: (size) => (
    <svg width={size} height={size * 0.3} viewBox="0 0 180 54" fill="rgba(255,255,255,0.7)">
      <path d="M8 28 Q15 10 50 14 Q90 8 130 18 Q160 24 170 28 Q160 34 130 38 Q90 46 50 40 Q15 44 8 28Z" />
      <circle cx="25" cy="24" r="2.5" fill="rgba(0,0,0,0.18)" />
      <path d="M168 28 L180 20 L180 36Z" opacity="0.65" />
      <path d="M70 14 L72 6 L78 16" opacity="0.5" />
      <line x1="14" y1="32" x2="45" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="16" y1="34" x2="42" y2="38" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
    </svg>
  ),

  mantaRay: (size) => (
    <svg width={size} height={size * 0.55} viewBox="0 0 120 66" fill="rgba(255,255,255,0.7)">
      <path d="M60 10 Q30 5 5 30 Q15 40 35 35 Q50 45 60 55 Q70 45 85 35 Q105 40 115 30 Q90 5 60 10Z" />
      <circle cx="48" cy="25" r="2" fill="rgba(0,0,0,0.16)" />
      <circle cx="72" cy="25" r="2" fill="rgba(0,0,0,0.16)" />
      <path d="M55 55 L52 65" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  hammerheadShark: (size) => (
    <svg width={size} height={size * 0.4} viewBox="0 0 120 48" fill="rgba(255,255,255,0.72)">
      <path d="M15 20 Q30 14 55 16 Q80 14 100 22 Q110 26 100 30 Q80 38 55 36 Q30 38 15 28Z" />
      <rect x="5" y="18" width="25" height="12" rx="6" opacity="0.8" />
      <circle cx="10" cy="22" r="1.5" fill="rgba(0,0,0,0.22)" />
      <circle cx="25" cy="22" r="1.5" fill="rgba(0,0,0,0.22)" />
      <path d="M65 16 L68 6 L72 18" />
      <path d="M100 24 L118 18 L116 32Z" opacity="0.65" />
    </svg>
  ),

  swordfish: (size) => (
    <svg width={size} height={size * 0.35} viewBox="0 0 130 45" fill="rgba(255,255,255,0.72)">
      <path d="M45 22 Q55 10 80 14 Q100 10 108 22 Q100 34 80 30 Q55 34 45 22Z" />
      <path d="M45 22 L5 20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="55" cy="19" r="2" fill="rgba(0,0,0,0.2)" />
      <path d="M75 14 L78 4 L82 16" />
      <path d="M106 22 L128 16 L126 30Z" opacity="0.6" />
    </svg>
  ),

  octopus: (size) => (
    <svg width={size * 0.8} height={size} viewBox="0 0 72 90" fill="rgba(255,255,255,0.62)">
      <ellipse cx="36" cy="25" rx="22" ry="20" />
      <circle cx="28" cy="20" r="4" fill="rgba(0,0,0,0.16)" />
      <circle cx="44" cy="20" r="4" fill="rgba(0,0,0,0.16)" />
      <path d="M16 42 Q10 58 8 75" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 44 Q18 62 14 82" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 45 Q28 65 24 88" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M42 45 Q44 65 48 88" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 44 Q54 62 58 82" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M56 42 Q62 58 64 75" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),

  lanternfish: (size) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 60 30" fill="rgba(255,255,255,0.6)">
      <ellipse cx="28" cy="15" rx="18" ry="10" />
      <path d="M44 15 L58 8 L58 22Z" opacity="0.7" />
      <circle cx="15" cy="12" r="2" fill="rgba(0,0,0,0.18)" />
      <circle cx="22" cy="18" r="1.5" fill="rgba(180,220,255,0.5)" className="angler-lure" />
      <circle cx="30" cy="20" r="1" fill="rgba(180,220,255,0.4)" className="angler-lure" />
      <path d="M20 5 Q28 2 36 5" fill="rgba(255,255,255,0.45)" />
    </svg>
  ),

  vampireSquid: (size) => (
    <svg width={size * 0.7} height={size} viewBox="0 0 56 80" fill="rgba(255,255,255,0.55)">
      <ellipse cx="28" cy="22" rx="16" ry="18" />
      <circle cx="20" cy="18" r="4" fill="rgba(0,0,0,0.16)" />
      <circle cx="36" cy="18" r="4" fill="rgba(0,0,0,0.16)" />
      <path d="M12 38 Q8 50 5 62 Q10 58 16 45 Q12 55 10 68 Q18 58 22 48 Q20 60 18 74 Q24 62 28 50 Q32 62 38 74 Q36 60 34 48 Q38 58 46 68 Q44 55 40 45 Q46 58 51 62 Q48 50 44 38" fill="rgba(255,255,255,0.4)" />
    </svg>
  ),

  fangtooth: (size) => (
    <svg width={size} height={size * 0.8} viewBox="0 0 70 56" fill="rgba(255,255,255,0.6)">
      <ellipse cx="35" cy="28" rx="24" ry="20" />
      <circle cx="25" cy="20" r="5" fill="rgba(0,0,0,0.18)" />
      <circle cx="25" cy="19" r="2" fill="rgba(0,0,0,0.32)" />
      <path d="M12 30 L8 36 L15 32 L10 40 L18 34 L14 42 L20 35" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
      <path d="M50 26 Q60 28 68 32 Q60 36 50 34" opacity="0.5" />
      <path d="M18 26 L14 22 L20 26 L16 20 L22 25" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" fill="none" />
    </svg>
  ),

  tripodFish: (size) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 70 84" fill="rgba(255,255,255,0.52)">
      <ellipse cx="35" cy="22" rx="18" ry="12" />
      <circle cx="24" cy="18" r="2.5" fill="rgba(0,0,0,0.16)" />
      <path d="M50 22 L65 16 L64 28Z" opacity="0.55" />
      <path d="M28 8 Q35 3 42 8" fill="rgba(255,255,255,0.42)" />
      <line x1="22" y1="34" x2="15" y2="82" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
      <line x1="35" y1="34" x2="35" y2="84" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
      <line x1="48" y1="34" x2="55" y2="82" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
    </svg>
  ),

  dumboOctopus: (size) => (
    <svg width={size} height={size * 0.9} viewBox="0 0 70 63" fill="rgba(255,255,255,0.55)">
      <ellipse cx="35" cy="25" rx="20" ry="18" />
      <ellipse cx="14" cy="18" rx="10" ry="6" transform="rotate(-20 14 18)" opacity="0.62" />
      <ellipse cx="56" cy="18" rx="10" ry="6" transform="rotate(20 56 18)" opacity="0.62" />
      <circle cx="28" cy="22" r="3" fill="rgba(0,0,0,0.14)" />
      <circle cx="42" cy="22" r="3" fill="rgba(0,0,0,0.14)" />
      <path d="M22 42 Q18 52 16 58" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M28 43 Q26 54 22 62" stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M35 44 Q35 55 35 63" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M42 43 Q44 54 48 62" stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M48 42 Q52 52 54 58" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
};
