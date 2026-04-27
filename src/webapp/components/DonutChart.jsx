export default function DonutChart({ data, size = 120 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.35, sw = size * 0.12;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  const slices = data.map(d => {
    const len = (d.pct / 100) * circ;
    const offset = circ - (cum / 100) * circ;
    cum += d.pct;
    return { ...d, len, offset };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={sw}
          strokeDasharray={`${s.len} ${circ - s.len}`}
          strokeDashoffset={s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}
