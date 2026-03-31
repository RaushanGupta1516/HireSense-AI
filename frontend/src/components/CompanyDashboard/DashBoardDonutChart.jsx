import React, { useState, useEffect } from "react";

const departments = [
  { name: "Engineering", value: 80, color: "#6366F1" },
  { name: "Marketing", value: 57, color: "#8B5CF6" },
  { name: "Sales", value: 39, color: "#10B981" },
  { name: "Human Resources", value: 24, color: "#F59E0B" },
  { name: "Finance", value: 19, color: "#3B82F6" },
  { name: "Operations", value: 14, color: "#EC4899" },
];

// ── PURE SVG DONUT CHART ──
function DonutChart({ data, animated }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 80;
  const innerR = 52;
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 900;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [animated]);

  const slices = [];
  let cumulative = 0;

  data.forEach((item) => {
    const ratio = item.value / total;
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumulative + item.value * progress) / total) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const largeArc = ratio * progress > 0.5 ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    slices.push({ d, color: item.color, name: item.name, value: item.value, ratio });
    cumulative += item.value;
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.d}
            fill={slice.color}
            className="transition-all duration-200 hover:opacity-80 cursor-pointer"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}
          />
        ))}
        {/* Center circle — dark */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="#1C2030" />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-2xl font-bold text-white tabular-nums">{total}</p>
        <p className="text-xs text-gray-400 font-medium">Total Hires</p>
      </div>
    </div>
  );
}

const DashBoardDonutChart = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredDept, setHoveredDept] = useState(null);
  const total = departments.reduce((acc, d) => acc + d.value, 0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#131720] rounded-2xl border border-white/5 shadow-xl p-6 w-full">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">
            Hiring by Department
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Distribution of candidates across teams
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-indigo-400">Live</span>
        </div>
      </div>

      {/* ── CHART + LEGEND ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Donut */}
        <div className="shrink-0">
          <DonutChart data={departments} animated={animated} />
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {departments.map((dept, i) => {
            const pct = ((dept.value / total) * 100).toFixed(1);
            const isHovered = hoveredDept === dept.name;

            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredDept(dept.name)}
                onMouseLeave={() => setHoveredDept(null)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  isHovered ? "bg-white/5" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                <span className="text-sm text-gray-400 flex-1 font-medium truncate">{dept.name}</span>

                {/* Bar */}
                <div className="w-20 hidden sm:block">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: animated ? `${pct}%` : "0%", backgroundColor: dept.color }}
                    />
                  </div>
                </div>

                <span className="text-xs text-gray-500 hidden sm:block">{pct}%</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: dept.color }}>
                  {dept.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM STATS ── */}
      <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-3 gap-4">
        {[
          {
            label: "Top Department",
            value: [...departments].sort((a, b) => b.value - a.value)[0].name,
            color: "text-indigo-400",
          },
          {
            label: "Total Hires",
            value: total,
            color: "text-white",
          },
          {
            label: "Avg per Dept",
            value: Math.round(total / departments.length),
            color: "text-emerald-400",
          },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p className={`text-sm font-bold ${s.color} tabular-nums`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoardDonutChart;