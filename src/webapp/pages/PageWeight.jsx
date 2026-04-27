import { useState } from 'react';
import LineChart from '../components/LineChart';
import { TARGET_WEIGHT } from '../data';

export default function PageWeight({ dog, setDog, weights, setWeights }) {
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const addWeight = () => {
    if (!newWeight) return;
    const updated = [...weights, { date: newDate, weight: +newWeight }].sort((a, b) => a.date.localeCompare(b.date));
    setWeights(updated);
    setDog({ ...dog, weight: +newWeight });
    setNewWeight('');
  };

  const sorted = [...weights].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="wcard">
        <div className="section-hdr"><div className="section-hdr-title">📈 กราฟน้ำหนักตามเวลา</div></div>
        <LineChart data={weights} color="var(--teal)" targetWeight={TARGET_WEIGHT} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--text-light)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--teal)" strokeWidth="2.5" /></svg>น้ำหนักจริง
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4,2" /></svg>เป้าหมาย {TARGET_WEIGHT} กก.
          </span>
        </div>
      </div>

      <div className="grid-2">
        <div className="wcard">
          <div className="section-hdr"><div className="section-hdr-title">➕ บันทึกน้ำหนักใหม่</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-field">
              <label className="form-label">วันที่</label>
              <input className="wb-input" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">น้ำหนัก (กก.)</label>
              <input className="wb-input" type="number" step="0.1" placeholder="0.0" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
            </div>
            <button className="wb-btn" onClick={addWeight}>บันทึก</button>
          </div>
        </div>

        <div className="wcard">
          <div className="section-hdr"><div className="section-hdr-title">ประวัติน้ำหนัก</div></div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {sorted.map((w, i) => {
              const prev = sorted[i + 1];
              const delta = prev ? (w.weight - prev.weight).toFixed(1) : null;
              const cls = delta === null ? 'neu' : delta > 0 ? 'pos' : delta < 0 ? 'neg' : 'neu';
              return (
                <div key={i} className="weight-entry">
                  <div className="weight-date">{w.date}</div>
                  <div className="weight-val">{w.weight} กก.</div>
                  {delta !== null && (
                    <div className={`weight-delta ${cls}`}>
                      {delta > 0 ? '▲' : '▼'} {Math.abs(delta)} กก.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
