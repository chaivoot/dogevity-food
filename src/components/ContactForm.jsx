import { useState } from 'react';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', dog: '', weight: '', age: '', email: '', note: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const h = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  if (sent) return (
    <div className="success-state">
      <div className="success-icon">🐾</div>
      <div className="success-title">ได้รับข้อมูลแล้วครับ!</div>
      <div className="success-sub">
        จะติดต่อกลับภายใน 24 ชั่วโมง<br />
        เพื่อเริ่มออกแบบสูตรอาหารสำหรับ <strong>{f.dog || 'น้องหมา'}</strong> โดยเฉพาะ
      </div>
      <a className="webapp-link" href="/app">ลองดู Web App →</a>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <div className="form-hdr-title">เริ่มต้นออกแบบสูตรอาหาร</div>
      <div className="form-hdr-sub">กรอกข้อมูลด้านล่าง — ประเมินเบื้องต้นฟรี ไม่มีค่าใช้จ่าย</div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">ชื่อเจ้าของ</label>
          <input className="form-input" required value={f.name} onChange={e => h('name', e.target.value)} placeholder="เช่น คุณนิ้ง" />
        </div>
        <div className="form-field">
          <label className="form-label">ชื่อน้องหมา</label>
          <input className="form-input" required value={f.dog} onChange={e => h('dog', e.target.value)} placeholder="เช่น มะม่วง" />
        </div>
        <div className="form-field">
          <label className="form-label">น้ำหนัก (กก.)</label>
          <input className="form-input" type="number" step="0.1" required value={f.weight} onChange={e => h('weight', e.target.value)} placeholder="0.0" />
        </div>
        <div className="form-field">
          <label className="form-label">อายุ (ปี)</label>
          <input className="form-input" type="number" step="0.5" required value={f.age} onChange={e => h('age', e.target.value)} placeholder="0" />
        </div>
        <div className="form-field form-full">
          <label className="form-label">อีเมล / Line ID</label>
          <input className="form-input" required value={f.email} onChange={e => h('email', e.target.value)} placeholder="เพื่อส่งสูตรอาหาร" />
        </div>
        <div className="form-field form-full">
          <label className="form-label">ข้อมูลเพิ่มเติม (ไม่บังคับ)</label>
          <textarea className="form-textarea form-input" value={f.note} onChange={e => h('note', e.target.value)} placeholder="สายพันธุ์, อาหารที่แพ้, โรคประจำตัว..." />
        </div>
      </div>
      <button className="form-submit" type="submit" disabled={loading}>
        {loading ? 'กำลังส่ง...' : 'รับสูตรอาหารฟรี →'}
      </button>
      <div className="form-note">ไม่มีค่าใช้จ่ายในการประเมินเบื้องต้น · ข้อมูลของคุณปลอดภัย 100%</div>
    </form>
  );
}
