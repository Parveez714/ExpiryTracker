import React, { useMemo } from 'react';

// Layer 0 + Layer 1: Background image backdrop + deterministic constellation SVG
export function ConstellationBackground({ isDarkMode = false }) {

  const { stars, lines } = useMemo(() => {
    // Deterministic pseudo-random points (seeded)
    const points = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random generation
      const seed1 = Math.sin(i * 997.123) * 10000;
      const x = Math.floor((seed1 - Math.floor(seed1)) * 95) + 2.5;
      const seed2 = Math.cos(i * 613.841) * 10000;
      const y = Math.floor((seed2 - Math.floor(seed2)) * 95) + 2.5;
      const r = (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2);
      points.push({ x, y, r, id: i });
    }

    const lineList = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18) {
          lineList.push({
            x1: `${points[i].x}%`,
            y1: `${points[i].y}%`,
            x2: `${points[j].x}%`,
            y2: `${points[j].y}%`,
            key: `${i}-${j}`,
            opacity: Math.max(0.04, (18 - dist) / 18 * 0.22)
          });
        }
      }
    }
    return { stars: points, lines: lineList };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Layer 0: Backdrop canvas */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#1c1a17] via-[#141210] to-[#0d0c0a]'
            : 'bg-gradient-to-br from-[#FAF8F5] via-[#F6F2EA] to-[#EFEAE1]'
        }`}
      />

      {/* Layer 0.5: Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDarkMode
            ? `radial-gradient(#453e34 1px, transparent 1px)`
            : `radial-gradient(#D8D2BF 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0',
          opacity: isDarkMode ? 0.35 : 0.22
        }}
      />


      {/* Layer 1: Constellation SVG Network (Deterministic) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDarkMode ? '#F4F1EA' : '#1C1914'} stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0066CC" stopOpacity="0.18" />
          </linearGradient>
        </defs>




        {lines.map((l) => (
          <line
            key={l.key}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="url(#lineGrad)"
            strokeWidth="0.8"
            strokeOpacity={l.opacity}
          />
        ))}
        {stars.map((s) => (
          <g key={s.id}>
            <circle
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill={isDarkMode ? '#F4F1EA' : '#221F1B'}
              fillOpacity={s.r > 2 ? 0.25 : 0.16}
            />
            {s.r > 2 && (
              <circle
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r={s.r + 3}
                fill="#0066CC"
                fillOpacity="0.08"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}


