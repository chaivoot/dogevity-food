import { useState } from 'react';

const typeIcon = { vaccine: '💉', deworming: '🐛', checkup: '🏥', other: '📋' };
const typeBg = { vaccine: 'var(--teal-xlight)', deworming: 'oklch(92% 0.06 78)', checkup: 'oklch(92% 0.06 145)', other: 'var(--bg)' };
const statusLabel = { ok: 'ปกติ', soon: 'ใกล้ถึงกำหนด', overdue: 'เลยกำหนด' };
const statusBadge = { ok: 'badge-green', soon: 'badge-gold', overdue: 'badge-red' };

const EMPTY_FORM = { type: 'vaccine', name: '', date: '', nextDate: '', status: 'ok', note: '' };

function HealthForm({ value, onChange, onSave, onCancel, saveLabel }) {
  const h = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div className="wb-form-grid">
        <div className="form-field">
          <label className="form-label">ประเภท</label>
          <select className="wb-select" value={value.type} onChange={e => h('type', e.target.value)}>
            <option value="vaccine">วัคซีน</option>
            <option value="deworming">ถ่ายพยาธิ / กำจัดเห็บหมัด</option>
            <option value="checkup">ตรวจสุขภาพ</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">ชื่อ</label>
          <input className="wb-input" value={value.name} onChange={e => h('name', e.target.value)} placeholder="เช่น วัคซีนรวม DHPPiL" />
        </div>
        <div className="form-field">
          <label className="form-label">วันที่ฉีด / ทำ</label>
          <input className="wb-input" type="date" value={value.date} onChange={e => h('date', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">วันนัดครั้งถัดไป</label>
          <input className="wb-input" type="date" value={value.nextDate} onChange={e => h('nextDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">สถานะ</label>
          <select className="wb-select" value={value.status} onChange={e => h('status', e.target.value)}>
            <option value="ok">ปกติ</option>
            <option value="soon">ใกล้ถึงกำหนด</option>
            <option value="overdue">เลยกำหนด</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">หมายเหตุ</label>
          <input className="wb-input" value={value.note} onChange={e => h('note', e.target.value)} placeholder="ชื่อยา, คลินิก ฯลฯ" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="wb-btn" onClick={onSave}>{saveLabel}</button>
        <button className="wb-btn-outline" onClick={onCancel}>ยกเลิก</button>
      </div>
    </div>
  );
}

export default function PageHealth({ dog, updateDog }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const health = dog.health ?? [];

  const addRecord = () => {
    if (!form.name) return;
    updateDog({ health: [...health, { ...form, id: Date.now() }] });
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({ ...r });
    setShowForm(false);
  };

  const saveEdit = () => {
    if (!editForm.name) return;
    updateDog({ health: health.map(r => r.id === editId ? { ...editForm } : r) });
    setEditId(null);
    setEditForm(null);
  };

  const cancelEdit = () => { setEditId(null); setEditForm(null); };

  const deleteRecord = (id) => updateDog({ health: health.filter(r => r.id !== id) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="wcard">
        <div className="section-hdr">
          <div className="section-hdr-title">📋 ประวัติสุขภาพ & วัคซีน</div>
          <button className="wb-btn" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => { setShowForm(v => !v); cancelEdit(); }}>
            + เพิ่มรายการ
          </button>
        </div>

        {showForm && (
          <HealthForm
            value={form} onChange={setForm}
            onSave={addRecord} onCancel={() => setShowForm(false)}
            saveLabel="บันทึก"
          />
        )}

        {health.length === 0 && !showForm && (
          <div style={{ color: 'var(--text-light)', fontSize: 13, padding: '12px 0' }}>ยังไม่มีประวัติสุขภาพ กด "+ เพิ่มรายการ" เพื่อเริ่มต้น</div>
        )}

        {health.map(r => (
          <div key={r.id}>
            {editId === r.id ? (
              <HealthForm
                value={editForm} onChange={setEditForm}
                onSave={saveEdit} onCancel={cancelEdit}
                saveLabel="บันทึกการแก้ไข"
              />
            ) : (
              <div className="health-row">
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
                  <button onClick={() => startEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--teal)', padding: '2px 6px', borderRadius: 6 }}>✏️</button>
                  <button onClick={() => deleteRecord(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-light)', padding: '2px 6px', borderRadius: 6 }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
