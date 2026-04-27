export default function LineChart({ data, color = 'var(--teal)', targetWeight }) {
  const W = 600, H = 140, PAD = { t: 10, r: 20, b: 30, l: 40 };
  if (!data || data.length < 2) {
    return <div style={{ color: 'var(--text-light)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>ยังไม่มีข้อมูลเพียงพอ</div>;
  }
  const vals = data.map(d => d.weight);
  const min = Math.min(...vals) - 0.5, max = Math.max(...vals) + 0.5;
  const xS = (i) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const yS = (v) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const pts = data.map((d, i) => `${xS(i)},${yS(d.weight)}`).join(' ');
  const areaPath = `M${xS(0)},${H - PAD.b} ` + data.map((d, i) => `L${xS(i)},${yS(d.weight)}`).join(' ') + ` L${xS(data.length - 1)},${H - PAD.b} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = PAD.t + f * (H - PAD.t - PAD.b);
        const v = (max - f * (max - min)).toFixed(1);
        return (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="oklch(90% 0.02 210)" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} fontSize="9" fill="oklch(65% 0.03 210)" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {targetWeight && targetWeight >= min && targetWeight <= max && (
        <line x1={PAD.l} y1={yS(targetWeight)} x2={W - PAD.r} y2={yS(targetWeight)}
          stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="6,3" />
      )}
      <path d={areaPath} fill="url(#chartGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xS(i)} cy={yS(d.weight)} r={5} fill="white" stroke={color} strokeWidth="2.5" />
          <text x={xS(i)} y={yS(d.weight) - 10} fontSize="9" fill={color} textAnchor="middle" fontWeight="700">{d.weight}</text>
          <text x={xS(i)} y={H - PAD.b + 14} fontSize="9" fill="oklch(65% 0.03 210)" textAnchor="middle">{d.date.slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}
