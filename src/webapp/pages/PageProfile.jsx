import { useState } from 'react';
import { getBCSLabel, getBCSColor } from '../utils';

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export default function PageProfile({ dog, setDog, isNew }) {
  const [form, setForm] = useState(dog);
  const [saved, setSaved] = useState(false);
  const h = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => { setDog(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ maxWidth: 700 }}>
      {isNew && (
        <div style={{ background: 'oklch(94% 0.06 185)', border: '1px solid var(--teal)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 14, color: 'oklch(35% 0.12 185)' }}>
          👋 <strong>ยินดีต้อนรับ!</strong> กรุณากรอกข้อมูลน้องหมาของคุณก่อนเริ่มใช้งาน
        </div>
      )}
      <div className="wcard">
        <div className="form-section">
          <div className="form-section-title">ข้อมูลพื้นฐาน</div>
          <div className="wb-form-grid">
            <div className="form-field">
              <label className="form-label">ชื่อน้องหมา</label>
              <input className="wb-input" value={form.name} onChange={e => h('name', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">สายพันธุ์</label>
              <input className="wb-input" value={form.breed} onChange={e => h('breed', e.target.value)} placeholder="เช่น Sheltie, Golden" />
            </div>
            <div className="form-field">
              <label className="form-label">เพศ</label>
              <select className="wb-select" value={form.sex} onChange={e => h('sex', e.target.value)}>
                <option value="male">ผู้</option>
                <option value="female">เมีย</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">ทำหมัน</label>
              <select className="wb-select" value={String(form.neutered)} onChange={e => h('neutered', e.target.value === 'true')}>
                <option value="true">ใช่</option>
                <option value="false">ยังไม่ได้</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">ปีเกิด (ค.ศ.)</label>
              <input className="wb-input" type="number" value={form.birthYear} onChange={e => h('birthYear', +e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">เดือนเกิด</label>
              <select className="wb-select" value={form.birthMonth} onChange={e => h('birthMonth', +e.target.value)}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">ข้อมูลร่างกาย</div>
          <div className="wb-form-grid">
            <div className="form-field">
              <label className="form-label">น้ำหนัก (กก.)</label>
              <input className="wb-input" type="number" step="0.1" value={form.weight} onChange={e => h('weight', +e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">น้ำหนักเป้าหมาย (กก.)</label>
              <input className="wb-input" type="number" step="0.1" value={form.targetWeight || ''} onChange={e => h('targetWeight', +e.target.value)} placeholder="ปล่อยว่างถ้าไม่มีเป้าหมาย" />
            </div>
            <div className="form-field">
              <label className="form-label">ส่วนสูง (ซม.)</label>
              <input className="wb-input" type="number" step="1" value={form.height} onChange={e => h('height', +e.target.value)} />
            </div>
            <div className="form-field form-full">
              <label className="form-label">หมวดหมู่ AAFCO (ใช้คำนวณ DER)</label>
              <select className="wb-select" value={form.activityLevel} onChange={e => h('activityLevel', e.target.value)}>
                <optgroup label="สุนัขโตเต็มวัย (Maintenance)">
                  <option value="neutered">ทำหมันแล้ว — 1.6 × RER</option>
                  <option value="intact">ยังไม่ทำหมัน — 1.8 × RER</option>
                  <option value="obese_prone">มีแนวโน้มอ้วนง่าย — 1.4 × RER</option>
                  <option value="weight_loss">อยู่ในช่วงลดน้ำหนัก — 1.0 × RER</option>
                </optgroup>
                <optgroup label="สุนัขใช้งาน / มีกิจกรรม">
                  <option value="light_work">ทำงานเบา / กิจกรรมปานกลาง — 2.0 × RER</option>
                  <option value="heavy_work">ทำงานหนัก / กิจกรรมมาก — 5.0 × RER (3–8×)</option>
                </optgroup>
                <optgroup label="ช่วงการเจริญเติบโต">
                  <option value="puppy_young">ลูกสุนัขอายุ ≤4 เดือน — 3.0 × RER</option>
                  <option value="puppy_old">ลูกสุนัขอายุ &gt;4 เดือน — 2.0 × RER</option>
                </optgroup>
                <optgroup label="ตั้งท้องและให้นมลูก">
                  <option value="pregnancy">ตั้งท้อง &gt;21 วัน — 3.0 × RER</option>
                  <option value="lactation">ให้นมลูก — 6.0 × RER (4–8×)</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="form-label" style={{ marginBottom: 10 }}>BCS Score — 1 ผอมมาก · 5 สมส่วน · 9 อ้วนมากเกิน</div>
            <div className="bcs-grid">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} className={`bcs-btn${form.bcs === n ? ' selected' : ''}`}
                  onClick={() => h('bcs', n)}
                  style={form.bcs === n ? { background: getBCSColor(n), borderColor: getBCSColor(n) } : {}}>
                  {n}
                </button>
              ))}
            </div>
            <div className="bcs-labels">
              <span className="bcs-label">ผอมมาก</span>
              <span className="bcs-label">สมส่วน</span>
              <span className="bcs-label">อ้วนมากเกิน</span>
            </div>
            {form.bcs && <div style={{ marginTop: 8, fontSize: 13, color: getBCSColor(form.bcs), fontWeight: 600 }}>BCS {form.bcs}: {getBCSLabel(form.bcs)}</div>}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">ประวัติสุขภาพ</div>
          <div className="wb-form-grid">
            <div className="form-field form-full">
              <label className="form-label">อาหารที่แพ้ / ไม่กิน</label>
              <input className="wb-input" value={form.allergies} onChange={e => h('allergies', e.target.value)} placeholder="เช่น ไก่, กลูเตน — ถ้าไม่มีปล่อยว่าง" />
            </div>
            <div className="form-field form-full">
              <label className="form-label">อาหารปัจจุบัน</label>
              <input className="wb-input" value={form.currentFood} onChange={e => h('currentFood', e.target.value)} />
            </div>
            <div className="form-field form-full">
              <label className="form-label">โรคประจำตัว / ยาที่ทาน</label>
              <textarea className="wb-textarea wb-input" rows="3" value={form.conditions} onChange={e => h('conditions', e.target.value)} placeholder="ถ้าไม่มีปล่อยว่างได้" />
            </div>
            <div className="form-field form-full">
              <label className="form-label">หมายเหตุเพิ่มเติม</label>
              <textarea className="wb-textarea wb-input" rows="2" value={form.note} onChange={e => h('note', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="wb-btn" onClick={save}>บันทึกข้อมูล</button>
          <button className="wb-btn-outline" onClick={() => setForm(dog)}>ยกเลิก</button>
          {saved && <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✓ บันทึกแล้ว</span>}
        </div>
      </div>
    </div>
  );
}
