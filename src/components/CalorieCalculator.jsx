import { useState } from 'react';

function calcRER(weight) {
  return Math.round(70 * Math.pow(weight, 0.75));
}

const DER_FACTORS = {
  neutered:    { factor: 1.6, label: 'ทำหมันแล้ว' },
  intact:      { factor: 1.8, label: 'ยังไม่ทำหมัน' },
  obese_prone: { factor: 1.4, label: 'มีแนวโน้มอ้วนง่าย' },
  weight_loss: { factor: 1.0, label: 'อยู่ในช่วงลดน้ำหนัก' },
  light_work:  { factor: 2.0, label: 'ทำงานเบา / กิจกรรมปานกลาง' },
  heavy_work:  { factor: 5.0, label: 'ทำงานหนัก / กิจกรรมมาก' },
  puppy_young: { factor: 3.0, label: 'ลูกสุนัขอายุ ≤4 เดือน' },
  puppy_old:   { factor: 2.0, label: 'ลูกสุนัขอายุ >4 เดือน' },
  pregnancy:   { factor: 3.0, label: 'ตั้งท้อง >21 วัน' },
  lactation:   { factor: 6.0, label: 'ให้นมลูก' },
};

function calcDER(rer, actLevel) {
  const f = DER_FACTORS[actLevel]?.factor ?? 1.6;
  return Math.round(rer * f);
}

function getDERFactor(actLevel) {
  return DER_FACTORS[actLevel]?.factor ?? 1.6;
}

export default function CalorieCalculator() {
  const [weight, setWeight] = useState('');
  const [actLevel, setActLevel] = useState('neutered');

  const rer = weight ? calcRER(parseFloat(weight)) : null;
  const der = rer ? calcDER(rer, actLevel) : null;
  const factor = getDERFactor(actLevel);

  return (
    <section className="calorie-calc" id="calculator">
      <div className="container">
        <div className="eyebrow eyebrow-teal fi">คำนวณแคลน้องหมา</div>
        <h2 className="section-title fi">
          ระบบคำนวณ RER & DER<br />
          <span style={{ color: 'var(--teal)' }}>สำหรับน้องหมาของคุณ</span>
        </h2>

        <div className="calc-layout">
          {/* Input form */}
          <div className="calc-form">
            <div className="calc-field">
              <label className="calc-label">น้ำหนักน้องหมา (กิโลกรัม)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="calc-input"
                placeholder="เช่น 13"
                value={weight}
                onChange={e => setWeight(e.target.value)}
              />
            </div>

            <div className="calc-field">
              <label className="calc-label">สถานะของน้องหมา</label>
              <select
                className="calc-select"
                value={actLevel}
                onChange={e => setActLevel(e.target.value)}
              >
                <option value="neutered">ทำหมันแล้ว</option>
                <option value="intact">ยังไม่ทำหมัน</option>
                <option value="weight_loss">อยู่ในช่วงลดน้ำหนัก</option>
                <option value="obese_prone">มีแนวโน้มอ้วนง่าย</option>
                <option value="light_work">ทำงานเบา / กิจกรรมปานกลาง</option>
                <option value="heavy_work">ทำงานหนัก / กิจกรรมมาก</option>
                <option value="puppy_young">ลูกสุนัขอายุ ≤4 เดือน</option>
                <option value="puppy_old">ลูกสุนัขอายุ {'>'}4 เดือน</option>
                <option value="pregnancy">ตั้งท้อง {'>'}21 วัน</option>
                <option value="lactation">ให้นมลูก</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {rer !== null && (
            <div className="calc-results">
              <div className="result-card result-rer fi">
                <div className="result-label">RER</div>
                <div className="result-desc">พลังงานขณะพัก</div>
                <div className="result-value">
                  <span className="result-number">{rer}</span>
                  <span className="result-unit">kcal/วัน</span>
                </div>
                <div className="result-sub">พลังงานพื้นฐาน</div>
              </div>

              <div className="result-divider"></div>

              <div className="result-card result-der fi">
                <div className="result-label">DER</div>
                <div className="result-desc">พลังงานต่อวัน</div>
                <div className="result-value">
                  <span className="result-number">{der}</span>
                  <span className="result-unit">kcal/วัน</span>
                </div>
                <div className="result-sub">{factor}× RER</div>
              </div>
            </div>
          )}

          {rer === null && (
            <div className="calc-placeholder fi">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
              <div style={{ color: 'var(--text-light)', fontSize: 14 }}>
                ใส่น้ำหนักน้องหมาเพื่อคำนวณพลังงาน
              </div>
            </div>
          )}
        </div>

        <div className="calc-note">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>ℹ️ RER & DER คืออะไร?</div>
          <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>
            <div><strong>RER</strong> = Resting Energy Requirement คือพลังงานที่น้องหมาต้องการขณะพักผ่อน</div>
            <div><strong>DER</strong> = Daily Energy Requirement คือพลังงานรวมต่อวันโดยคำนึงถึงสถานะและกิจกรรม</div>
            <div style={{ marginTop: 6 }}>สูตรอาหารที่ถูกต้องต้องคำนวณจาก DER เพื่อให้น้องหมาได้สารอาหารที่เหมาะสมตามความต้องการจริง</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a className="btn-primary" href="/app">
            สร้างโปรไฟล์น้อง และตั้งโปรแกรมสูตรอาหารเฉพาะตัว
          </a>
        </div>
      </div>
    </section>
  );
}
