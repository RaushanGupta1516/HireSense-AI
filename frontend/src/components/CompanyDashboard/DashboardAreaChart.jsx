import React, { useState, useEffect, useRef } from "react";

const chartdata = [
  { date: "Dec 21", Impressions: 200, Applications: 150 },
  { date: "Dec 22", Impressions: 220, Applications: 180 },
  { date: "Dec 23", Impressions: 210, Applications: 170 },
  { date: "Dec 24", Impressions: 230, Applications: 190 },
  { date: "Dec 25", Impressions: 240, Applications: 200 },
  { date: "Dec 26", Impressions: 250, Applications: 210 },
  { date: "Dec 27", Impressions: 260, Applications: 220 },
];

const SERIES = [
  { key: "Impressions", color: "#6366F1", fillStart: "rgba(99,102,241,0.2)", fillEnd: "rgba(99,102,241,0)" },
  { key: "Applications", color: "#10B981", fillStart: "rgba(16,185,129,0.2)", fillEnd: "rgba(16,185,129,0)" },
];

function AreaChart({ data, animated }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [progress, setProgress] = useState(animated ? 0 : 1);

  const W = 560;
  const H = 220;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const allValues = data.flatMap((d) => SERIES.map((s) => d[s.key]));
  const maxVal = Math.max(...allValues) * 1.2;
  const minVal = 0;

  const xStep = chartW / (data.length - 1);
  const toX = (i) => padL + i * xStep;
  const toY = (v) => padT + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(minVal + ((maxVal - minVal) / yTicks) * i)
  );

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 1000;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [animated]);

  const getAnimY = (v) => {
    const rawY = toY(v);
    const baseY = toY(minVal);
    return baseY - (baseY - rawY) * progress;
  };

  const buildPath = (key) => {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${getAnimY(d[key])}`)
      .join(" ");
  };

  const buildArea = (key) => {
    const pts = data.map((d, i) => [toX(i), getAnimY(d[key])]);
    const baseY = padT + chartH;
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
    return `${line} L ${pts[pts.length - 1][0]} ${baseY} L ${pts[0][0]} ${baseY} Z`;
  };

  const handleMouseMove = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    const idx = Math.round((mouseX - padL) / xStep);
    if (idx >= 0 && idx < data.length) {
      setTooltip({ idx, x: toX(idx), data: data[idx] });
    }
  };

  return (
    <div className="relative w-full" onMouseLeave={() => setTooltip(null)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        style={{ overflow: "visible" }}
      >
        <defs>
          {SERIES.map((s) => (
            <linearGradient key={s.key} id={`grad-dark-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.fillStart} />
              <stop offset="100%" stopColor={s.fillEnd} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines — dark style */}
        {yTickValues.map((v, i) => {
          const y = toY(v);
          return (
            <g key={i}>
              <line
                x1={padL} y1={y} x2={W - padR} y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={9} fill="#4B5563">
                {v}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - padB + 18} textAnchor="middle" fontSize={9} fill="#4B5563">
            {d.date}
          </text>
        ))}

        {/* Area fills */}
        {SERIES.map((s) => (
          <path key={`area-${s.key}`} d={buildArea(s.key)} fill={`url(#grad-dark-${s.key})`} />
        ))}

        {/* Lines */}
        {SERIES.map((s) => (
          <path
            key={`line-${s.key}`}
            d={buildPath(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Hover line */}
        {tooltip && (
          <line
            x1={tooltip.x} y1={padT}
            x2={tooltip.x} y2={padT + chartH}
            stroke="#6366F1"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
        )}

        {/* Hover dots */}
        {tooltip &&
          SERIES.map((s) => (
            <circle
              key={s.key}
              cx={tooltip.x}
              cy={getAnimY(tooltip.data[s.key])}
              r={5}
              fill={s.color}
              stroke="#131720"
              strokeWidth={2}
            />
          ))}

        {/* Always-visible dots */}
        {SERIES.map((s) =>
          data.map((d, i) => (
            <circle
              key={`${s.key}-${i}`}
              cx={toX(i)}
              cy={getAnimY(d[s.key])}
              r={3}
              fill={s.color}
              stroke="#131720"
              strokeWidth={1.5}
              opacity={0.9}
            />
          ))
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 bg-[#1C2030] border border-white/10 rounded-xl shadow-2xl px-4 py-3 min-w-[140px] -translate-x-1/2"
          style={{ left: `${(tooltip.x / W) * 100}%`, top: "0" }}
        >
          <p className="text-xs font-semibold text-gray-400 mb-2">{tooltip.data.date}</p>
          {SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-gray-500">{s.key}</span>
              </div>
              <span className="text-xs font-bold text-white tabular-nums">{tooltip.data[s.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DashboardAreaChart = () => {
  const [animated, setAnimated] = useState(false);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const totalImpressions = chartdata.reduce((a, d) => a + d.Impressions, 0);
  const totalApplications = chartdata.reduce((a, d) => a + d.Applications, 0);
  const conversionRate = ((totalApplications / totalImpressions) * 100).toFixed(1);

  return (
    <div className="bg-[#131720] rounded-2xl border border-white/5 shadow-xl p-6 w-full">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Job Performance</h3>
          <p className="text-xs text-gray-500 mt-0.5">Impressions vs Applications over time</p>
        </div>

        {/* Range selector */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
          {["7d", "14d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                range === r
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── MINI STATS ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Impressions", value: totalImpressions.toLocaleString(), trend: "+12%", color: "text-indigo-400", dot: "bg-indigo-500" },
          { label: "Applications", value: totalApplications.toLocaleString(), trend: "+8%", color: "text-emerald-400", dot: "bg-emerald-500" },
          { label: "Conversion", value: `${conversionRate}%`, trend: "+2.1%", color: "text-violet-400", dot: "bg-violet-500" },
        ].map((s, i) => (
          <div key={i} className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
            </div>
            <p className={`text-xl font-bold ${s.color} tabular-nums`}>{s.value}</p>
            <p className="text-xs text-emerald-500 font-semibold mt-0.5">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* ── CHART ── */}
      <AreaChart data={chartdata} animated={animated} />

      {/* ── LEGEND ── */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs font-medium text-gray-500">{s.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAreaChart;