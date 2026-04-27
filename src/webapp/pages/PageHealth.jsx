import { useState } from 'react';

const typeIcon = { vaccine: '💉', deworming: '🐛', checkup: '🏥', other: '📋' };
const typeBg = { vaccine: 'var(--teal-xlight)', deworming: 'oklch(92% 0.06 78)', checkup: 'oklch(92% 0.06 145)', other: 'var(--bg)' };
const statusLabel = { ok: 'ปกติ', soon: 'ใกล้ถึงกำหนด', overdue: 'เลยกำหนด' };
const statusBadge = { ok: 'badge-green', soon: 'badge-gold', overdue: 'badge-red' };

const EMPTY_FORM = { type: 'vaccine', name: '', date: '', nextDate: '', status: 'ok', note: '' };

export default function PageHealth({ health, setHealth }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const h = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addRecord = () => {
    if (!form.name) return;
    setHealth([...health, { ...form, id: Date.now() }]);
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const deleteRecord = (id) => setHealth(health.filter(r => r.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="wcard">
        <div className="section-hdr">
          <div className="section-hdr-title">📋 ประวัติสุขภาพ & วัคซีน</div>
          <button className="wb-btn" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => setShowForm(v => !v)}>
            + เพิ่มรายการ
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div className="wb-form-grid">
              <div className="form-field">
                <label className="form-label">ประเภท</label>
                <select className="wb-select" value={form.type} onChange={e => h('type', e.target.value)}>
                  <option value="vaccine">วัคซีน</option>
                  <option value="deworming">ถ่ายพยาธิ / กำจัดเห็บหมัด</option>
                  <option value="checkup">ตรวจสุขภาพ</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">ชื่อ</label>
                <input className="wb-input" value={form.name} onChange={e => h('name', e.target.value)} placeholder="เช่น วัคซีนรวม DHPPiL" />
              </div>
              <div className="form-field">
                <label className="form-label">วันที่ฉีด / ทำ</label>
                <input className="wb-input" type="date" value={form.date} onChange={e => h('date', e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">วันนัดครั้งถัดไป</label>
                <input className="wb-input" type="date" value={form.nextDate} onChange={e => h('nextDate', e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">สถานะ</label>
                <select className="wb-select" value={form.status} onChange={e => h('status', e.target.value)}>
                  <option value="ok">ปกติ</option>
                  <option value="soon">ใกล้ถึงกำหนด</option>
                  <option value="overdue">เลยกำหนด</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">หมายเหตุ</label>
                <input className="wb-input" value={form.note} onChange={e => h('note', e.target.value)} placeholder="ชื่อยา, คลินิก ฯลฯ" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="wb-btn" onClick={addRecord}>บันทึก</button>
              <button className="wb-btn-outline" onClick={() => setShowForm(false)}>ยกเลิก</button>
            </div>
          </div>
        )}

        {health.map(r => (
          <div key={r.id} className="health-row">
            <div className="health-icon" style={{ background: typeBg[r.type] || 'var(--bg)' }}>{typeIcon[r.type] || '📋'}</div>
            <div style={{ flex: 1 }}>
              <div className="health-title">{r.name}</div>
              <div className="health-date">
                {r.date && `ล่าสุด: ${r.date}`}
                {r.nextDate && ` · ครั้งถัดไป: ${r.nextDate}`}
                {r.note && ` · ${r.note}`}
              </div>
            </div>
            <div className="health-status" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`badge ${statusBadge[r.status] || 'badge-teal'}`}>{statusLabel[r.status] || r.status}</span>
              <button onClick={() => deleteRecord(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-light)', padding: '2px 6px', borderRadius: 6 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
