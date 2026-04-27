import { useState } from 'react';
import { calcRER, calcDER } from '../utils';
import { INGREDIENTS } from '../data';

const CATS = ['all', 'เนื้อสัตว์', 'เครื่องใน', 'คาร์โบ', 'ผัก', 'อาหารเสริม'];

export default function PageRecipe({ dog }) {
  const rer = calcRER(dog.weight);
  const der = calcDER(rer, dog.activityLevel, dog.neutered);
  const [activeTab, setActiveTab] = useState('all');
  const filtered = activeTab === 'all' ? INGREDIENTS : INGREDIENTS.filter(i => i.cat === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'RER (พลังงานพัก)', val: `${rer} kcal/วัน`, color: 'var(--teal)', sub: `70 × (${dog.weight})⁰·⁷⁵` },
          { label: 'DER (พลังงานรวมต่อวัน)', val: `${der} kcal/วัน`, color: 'var(--gold)', sub: `RER × factor${dog.neutered ? ' × 0.9 (ทำหมัน)' : ''}` },
          { label: 'สูตรอาหาร', val: 'อ้างอิง AAFCO', color: 'var(--green)', sub: `ออกแบบสำหรับ ${dog.name} โดยเฉพาะ` },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, minWidth: 200, background: 'var(--white)', borderRadius: 16, border: '1px solid var(--border)', padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 4 }}>{c.val}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="wcard">
        <div className="section-hdr">
          <div className="section-hdr-title">🍲 รายการวัตถุดิบต่อสัปดาห์</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>สำหรับ {dog.name} · {dog.weight} กก.</div>
        </div>
        <div className="wb-tabs">
          {CATS.map(c => (
            <button key={c} className={`tab-btn${activeTab === c ? ' active' : ''}`} onClick={() => setActiveTab(c)}>
              {c === 'all' ? 'ทั้งหมด' : c}
            </button>
          ))}
        </div>
        {filtered.map((ing, i) => (
          <div key={i} className="ing-row">
            <div className="ing-dot-color" style={{ background: ing.color }} />
            <div className="ing-name">{ing.name}</div>
            <div className="ing-cat">{ing.cat}</div>
            <div className="ing-bar-wrap"><div className="ing-bar" style={{ width: `${ing.pct}%`, background: ing.color }} /></div>
            <div className="ing-amount">{ing.amount}</div>
          </div>
        ))}
      </div>

      {dog.allergies && (
        <div style={{ background: 'oklch(94% 0.06 25)', border: '1px solid oklch(80% 0.14 25)', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: 'var(--red)' }}>
          ⚠️ <strong>แจ้งเตือน:</strong> น้องหมามีอาหารที่แพ้: <strong>{dog.allergies}</strong> — โปรดตรวจสอบก่อนปรุง
        </div>
      )}
    </div>
  );
}
