import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

const LINE_OA_URL = import.meta.env.VITE_LINE_OA_URL ?? '';
const EJ_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EJ_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', dog: '', weight: '', age: '', phone: '', lineId: '', note: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const h = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.from('contacts').insert({
      name: f.name,
      dog: f.dog,
      weight: f.weight ? +f.weight : null,
      age: f.age ? +f.age : null,
      phone: f.phone,
      line_id: f.lineId,
      note: f.note,
    });
    setLoading(false);
    if (err) { setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'); return; }
    if (EJ_SERVICE && EJ_TEMPLATE && EJ_KEY) {
      emailjs.send(EJ_SERVICE, EJ_TEMPLATE, {
        owner_name: f.name,
        dog_name: f.dog,
        weight: f.weight || '—',
        age: f.age || '—',
        phone: f.phone || '—',
        line_id: f.lineId || '—',
        note: f.note || '—',
        to_email: 'chaivoot@gmail.com',
      }, EJ_KEY).catch(() => {});
    }
    setSent(true);
  };

  if (sent) return (
    <div className="success-state">
      <div className="success-icon">🐾</div>
      <div className="success-title">ได้รับข้อมูลแล้วครับ!</div>
      <div className="success-sub">
        จะติดต่อกลับภายใน 24 ชั่วโมง<br />
        เพื่อเริ่มออกแบบสูตรอาหารสำหรับ <strong>{f.dog || 'น้องหมา'}</strong> โดยเฉพาะ
      </div>
      {LINE_OA_URL && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '8px 0' }}>
          <a className="line-add-btn" href={LINE_OA_URL} target="_blank" rel="noopener noreferrer">
            <img src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png" alt="เพิ่มเพื่อน" height="36" />
          </a>
          <span style={{ fontSize: 14, color: '#06C755', fontWeight: 700 }}>Line ID: @dogevity</span>
        </div>
      )}
      <a className="webapp-link" href="/app">ทดลองคำนวณ RER / DER ของน้องหมา</a>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <div className="form-hdr-title">เริ่มต้นออกแบบสูตรอาหาร</div>
      <div className="form-hdr-sub">กรอกข้อมูลด้านล่าง — ประเมินเบื้องต้นฟรี ไม่มีค่าใช้จ่าย</div>

      {LINE_OA_URL && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <a className="line-add-btn" href={LINE_OA_URL} target="_blank" rel="noopener noreferrer">
            <img src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png" alt="เพิ่มเพื่อน Line OA" height="36" />
          </a>
          <span style={{ fontSize: 14, color: '#06C755', fontWeight: 700 }}>Line ID: @dogevity</span>
        </div>
      )}

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
        <div className="form-field">
          <label className="form-label">เบอร์โทรศัพท์</label>
          <input className="form-input" type="tel" value={f.phone} onChange={e => h('phone', e.target.value.replace(/\D/g, ''))} placeholder="0812345678" maxLength={10} />
        </div>
        <div className="form-field">
          <label className="form-label">Line ID</label>
          <input className="form-input" value={f.lineId} onChange={e => h('lineId', e.target.value)} placeholder="@yourlineid" />
        </div>
        <div className="form-field form-full">
          <label className="form-label">ข้อมูลเพิ่มเติม (ไม่บังคับ)</label>
          <textarea className="form-textarea form-input" value={f.note} onChange={e => h('note', e.target.value)} placeholder="สายพันธุ์, อาหารที่แพ้, โรคประจำตัว..." />
        </div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>⚠️ {error}</div>}

      <button className="form-submit" type="submit" disabled={loading}>
        {loading ? 'กำลังส่ง...' : 'รับสูตรอาหารฟรี →'}
      </button>
      <div className="form-note">ไม่มีค่าใช้จ่ายในการประเมินเบื้องต้น · ข้อมูลของคุณปลอดภัย 100%</div>
    </form>
  );
}
