export default function GrowthLogo({ className = '', size = 120 }) {
  // Sample growth data points for the chart
  const dataPoints = [
    { x: 10, y: 60 },
    { x: 30, y: 50 },
    { x: 50, y: 40 },
    { x: 70, y: 25 },
    { x: 90, y: 15 },
  ];

  // Convert data points to SVG path
  const pathData = dataPoints.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={`grid-${y}`}
            x1="5"
            y1={y}
            x2="95"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Growth area fill */}
        <path
          d={`${pathData} L 90 100 L 10 100 Z`}
          fill="url(#growthGradient)"
        />

        {/* Growth line */}
        <path
          d={pathData}
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Trend arrow indicator - upward trending */}
        <g transform="translate(75, 20)">
          <path
            d="M 0 10 L 6 4 L 12 10 L 10 10 L 10 14 L 2 14 L 2 10 Z"
            fill="#22c55e"
          />
        </g>
      </svg>

      {/* Floating badge with growth indicator */}
      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
        ↑
      </div>
    </div>
  );
}

