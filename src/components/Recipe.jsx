import { useState } from 'react';
import { ingData, macros } from '../data';

export default function Recipe() {
  const [tab, setTab] = useState('เนื้อสัตว์');

  return (
    <section className="recipe" id="recipe">
      <div className="container">
        <div className="eyebrow eyebrow-teal fi">ตัวอย่างสูตรจริง</div>
        <h2 className="section-title fi">
          ส่วนผสมที่ใช้จริงต่อวัน<br />
          <span style={{ color: 'var(--teal)' }}>สำหรับ Sheltie น้ำหนัก 13 กก. · ทำหมันแล้ว</span>
        </h2>

        {/* Dog profile strip */}
        <div className="fi" style={{
          display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center',
          background: 'oklch(97% 0.03 185)', borderRadius: 14, padding: '12px 20px',
          marginBottom: 24, fontSize: 13, color: 'var(--text-mid)',
        }}>
          <span>🐕 <strong>Sheltie</strong> · เพศเมีย · ทำหมันแล้ว</span>
          <span>⚖️ <strong>13 กก.</strong></span>
          <span style={{ color: 'var(--teal)', fontWeight: 700 }}>RER <strong>490 kcal/วัน</strong></span>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>DER <strong>784 kcal/วัน</strong></span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-light)' }}>Adult Maintenance · AAFCO</span>
        </div>

        <div className="recipe-layout">
          <div>
            <div className="ingredient-tabs fi">
              {Object.keys(ingData).map(t => (
                <button
                  key={t}
                  className={`ing-tab${tab === t ? ' on' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="ing-list">
              {ingData[tab].map((ing, i) => (
                <div className="ing-row fi" key={i}>
                  <div className="ing-dot" style={{ background: ing.color }} />
                  <div className="ing-name">{ing.name}</div>
                  <div className="ing-bar-wrap">
                    <div className="ing-bar-fill" style={{ width: `${ing.pct}%`, background: ing.color }} />
                  </div>
                  <div className="ing-amount">{ing.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="recipe-visual fi d1">
            <div className="rv-title">สัดส่วนสารอาหารโดยรวม</div>
            <div className="rv-sub">อ้างอิง AAFCO · Adult Maintenance</div>
            <div className="macro-bars">
              {macros.map((m, i) => (
                <div className="mb-row" key={i}>
                  <div className="mb-hdr">
                    <span className="mb-name">{m.name}</span>
                    <span className="mb-pct">{m.pct}%</span>
                  </div>
                  <div className="mb-track">
                    <div className="mb-fill-bar" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="energy-box">
              <div className="eb-label">พลังงาน</div>
              <div className="eb-row">RER <span style={{ fontSize: 11, color: 'var(--text-light)' }}>(พลังงานขณะพัก)</span> <strong>490 kcal/วัน</strong></div>
              <div className="eb-row">DER <span style={{ fontSize: 11, color: 'var(--text-light)' }}>(รวมกิจกรรม · 1.6×)</span> <strong style={{ color: 'var(--gold)' }}>784 kcal/วัน</strong></div>
            </div>

            {/* Daily nutrition summary */}
            <div style={{
              marginTop: 14, borderRadius: 12, border: '1px solid var(--border)',
              overflow: 'hidden', fontSize: 12,
            }}>
              <div style={{ background: 'var(--teal)', color: '#fff', padding: '8px 14px', fontWeight: 700, fontSize: 13 }}>
                สรุปสารอาหารต่อวัน (ประมาณการ)
              </div>
              {[
                { label: 'โปรตีน', g: 67, kcal: 266, color: 'oklch(55% 0.16 25)', note: '34%' },
                { label: 'คาร์โบไฮเดรต', g: 78, kcal: 314, color: 'oklch(58% 0.16 145)', note: '40%' },
                { label: 'ไขมัน', g: 14, kcal: 125, color: 'oklch(68% 0.14 78)', note: '16%' },
                { label: 'ใยอาหาร & แร่ธาตุ', g: null, kcal: 78, color: 'var(--teal)', note: '10%' },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                  borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'var(--white)' : 'var(--bg)',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, color: 'var(--text-mid)', fontWeight: 600 }}>{r.label}</div>
                  <div style={{ color: 'var(--text-light)' }}>{r.note}</div>
                  {r.g && <div style={{ color: 'var(--text)', fontWeight: 700 }}>{r.g} ก.</div>}
                  <div style={{ color: 'var(--teal)', fontWeight: 700, minWidth: 60, textAlign: 'right' }}>{r.kcal} kcal</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', background: 'oklch(96% 0.04 185)', fontWeight: 700, borderTop: '2px solid var(--teal)' }}>
                <span>รวม</span>
                <span style={{ color: 'var(--teal)' }}>784 kcal/วัน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
