import Ring from '../components/Ring';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import { calcRER, calcDER, getAgeString, getBCSLabel, getBCSColor } from '../utils';
import { TARGET_WEIGHT } from '../data';

const macros = [
  { name: 'โปรตีน', pct: 42, color: 'oklch(55% 0.16 25)' },
  { name: 'คาร์โบ', pct: 30, color: 'oklch(55% 0.16 145)' },
  { name: 'ไขมัน', pct: 18, color: 'var(--gold)' },
  { name: 'แร่ธาตุ', pct: 10, color: 'var(--teal)' },
];

export default function PageDashboard({ dog, weights, health }) {
  const rer = calcRER(dog.weight);
  const der = calcDER(rer, dog.activityLevel, dog.neutered);
  const lastWeights = weights.slice(-8);
  const bcsColor = getBCSColor(dog.bcs);
  const upcoming = health.filter(h => h.status === 'soon');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Profile summary */}
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar">🐕</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{dog.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dog.breed} · {getAgeString(dog.birthYear, dog.birthMonth)}{dog.neutered ? ' · ✂️ ทำหมัน' : ''}
            </div>
          </div>
        </div>
        <div className="profile-stats">
          {[
            { label: 'น้ำหนัก', val: `${dog.weight} กก.`, color: 'var(--text)' },
            { label: 'BCS', val: `${dog.bcs}/9`, color: bcsColor },
            { label: 'สถานะ', val: getBCSLabel(dog.bcs), color: bcsColor },
          ].map((s, i) => (
            <div key={i} className="profile-stat-box">
              <div className="profile-stat-label">{s.label}</div>
              <div className="profile-stat-val" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        {upcoming.length > 0 && (
          <div className="profile-alert">
            ⚠️ <span><strong>{upcoming.length} รายการ</strong> ถึงกำหนดเร็วๆ นี้</span>
          </div>
        )}
      </div>

      {/* Energy metric cards */}
      <div className="grid-4">
        {[
          { label: 'RER', val: rer, unit: 'kcal/วัน', sub: 'Resting Energy', pct: 70, color: 'var(--teal)' },
          { label: 'DER', val: der, unit: 'kcal/วัน', sub: 'Daily Energy', pct: 85, color: 'var(--gold)' },
          { label: 'BCS', val: `${dog.bcs}`, unit: '/9', sub: getBCSLabel(dog.bcs), pct: (dog.bcs / 9) * 100, color: bcsColor },
          { label: 'น้ำหนัก', val: dog.weight, unit: 'กก.', sub: `เป้า ${TARGET_WEIGHT} กก.`, pct: Math.min(100, (dog.weight / TARGET_WEIGHT) * 80), color: 'oklch(56% 0.16 145)' },
        ].map((c, i) => (
          <div key={i} className="metric-card">
            <div className="card-title">{c.label}</div>
            <div style={{ position: 'relative', width: 80, height: 80, margin: '8px auto' }}>
              <Ring pct={c.pct} color={c.color} size={80} strokeW={8} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontSize: 8, color: 'var(--text-light)' }}>{c.unit}</div>
              </div>
            </div>
            <div className="card-sub" style={{ textAlign: 'center', fontSize: 11 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart row */}
      <div className="grid-2-1">
        <div className="wcard">
          <div className="section-hdr">
            <div className="section-hdr-title">📈 กราฟน้ำหนัก</div>
          </div>
          <LineChart data={lastWeights} color="var(--teal)" targetWeight={TARGET_WEIGHT} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--text-light)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--teal)" strokeWidth="2.5" /></svg>น้ำหนักจริง
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4,2" /></svg>เป้าหมาย
            </span>
          </div>
        </div>
        <div className="wcard">
          <div className="card-title" style={{ marginBottom: 12 }}>สัดส่วนสารอาหาร</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <DonutChart data={macros} size={140} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {macros.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: m.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, color: 'var(--text-mid)' }}>{m.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{m.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming health */}
      {upcoming.length > 0 && (
        <div className="wcard">
          <div className="section-hdr"><div className="section-hdr-title">⏰ ถึงกำหนดเร็วๆ นี้</div></div>
          {upcoming.map(h => (
            <div key={h.id} className="health-row">
              <div className="health-icon" style={{ background: 'var(--gold-light)' }}>💉</div>
              <div>
                <div className="health-title">{h.name}</div>
                <div className="health-date">ครั้งถัดไป: {h.nextDate}</div>
              </div>
              <div className="health-status"><span className="badge badge-gold">เร็วๆ นี้</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
