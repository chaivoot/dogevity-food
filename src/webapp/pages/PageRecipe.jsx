import { useState } from 'react';
import { calcRER, calcDER, getDERFactor } from '../utils';

const CATS = ['all', 'เนื้อสัตว์', 'เครื่องใน', 'คาร์โบ', 'ผัก', 'อาหารเสริม'];

export default function PageRecipe({ dog, recipe }) {
  const rer = calcRER(dog.weight);
  const der = calcDER(rer, dog.activityLevel);
  const [activeTab, setActiveTab] = useState('all');
  const filtered = activeTab === 'all' ? recipe : recipe.filter(i => i.cat === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'RER (พลังงานพัก)', val: dog.weight ? `${rer} kcal/วัน` : '—', color: 'var(--teal)', sub: dog.weight ? `70 × (${dog.weight})⁰·⁷⁵` : 'กรอกน้ำหนักในโปรไฟล์ก่อน' },
          { label: 'DER (พลังงานรวมต่อวัน)', val: dog.weight ? `${der} kcal/วัน` : '—', color: 'var(--gold)', sub: dog.weight ? `RER × ${getDERFactor(dog.activityLevel)}` : '' },
          { label: 'สูตรอาหาร', val: 'อ้างอิง AAFCO', color: 'var(--green)', sub: dog.name ? `ออกแบบสำหรับ ${dog.name} โดยเฉพาะ` : 'รอโค้ชอัพเดทสูตร' },
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
          {dog.name && dog.weight ? (
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>สำหรับ {dog.name} · {dog.weight} กก.</div>
          ) : null}
        </div>

        {recipe.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍲</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>ยังไม่มีสูตรอาหาร</div>
            <div style={{ fontSize: 13 }}>โค้ชจะอัพเดทสูตรอาหารที่ออกแบบมาสำหรับน้องหมาของคุณโดยเฉพาะ</div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {dog.allergies && (
        <div style={{ background: 'oklch(94% 0.06 25)', border: '1px solid oklch(80% 0.14 25)', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: 'var(--red)' }}>
          ⚠️ <strong>แจ้งเตือน:</strong> น้องหมามีอาหารที่แพ้: <strong>{dog.allergies}</strong> — โปรดตรวจสอบก่อนปรุง
        </div>
      )}
    </div>
  );
}
