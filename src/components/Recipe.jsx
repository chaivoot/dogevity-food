import { useState } from 'react';
import { ingData, macros } from '../data';

export default function Recipe() {
  const [tab, setTab] = useState('เนื้อสัตว์');

  return (
    <section className="recipe" id="recipe">
      <div className="container">
        <div className="eyebrow eyebrow-teal fi">ตัวอย่างสูตรจริง</div>
        <h2 className="section-title fi">
          ส่วนผสมที่ใช้จริงทุกสัปดาห์<br />
          <span style={{ color: 'var(--teal)' }}>สำหรับ Sheltie น้ำหนัก 8 กก.</span>
        </h2>
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
            <div className="rv-sub">ประมาณการจากสูตรทั้งหมดต่อสัปดาห์ · อ้างอิง AAFCO</div>
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
              <div className="eb-label">พลังงานโดยประมาณ</div>
              <div className="eb-row">RER (พัก) <strong>344 kcal/วัน</strong></div>
              <div className="eb-row">DER (รวมกิจกรรม) <strong>530 kcal/วัน</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
