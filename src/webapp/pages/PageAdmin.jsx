import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RECIPE_CATS, RECIPE_CAT_COLORS } from '../data';

const EMPTY_ING = { name: '', cat: 'เนื้อสัตว์', amount: '', pct: 0 };

export default function PageAdmin() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addForm, setAddForm] = useState(null);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from('user_data').select('user_id, dog, recipe');
      if (!error && data) setClients(data);
      setLoadingClients(false);
    }
    fetchClients();
  }, []);

  const selectClient = (c) => {
    setSelected(c);
    setRecipe(c.recipe ?? []);
    setAddForm(null);
    setSaved(false);
  };

  const saveRecipe = async () => {
    if (!selected) return;
    setSaving(true);
    await supabase.from('user_data')
      .update({ recipe, updated_at: new Date().toISOString() })
      .eq('user_id', selected.user_id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setClients(cs => cs.map(c => c.user_id === selected.user_id ? { ...c, recipe } : c));
  };

  const removeIng = (i) => setRecipe(r => r.filter((_, idx) => idx !== i));

  const updateIng = (i, field, val) =>
    setRecipe(r => r.map((item, idx) => idx === i ? { ...item, [field]: field === 'pct' ? +val : val, color: RECIPE_CAT_COLORS[item.cat] } : item));

  const addIng = () => {
    if (!addForm?.name || !addForm?.amount) return;
    setRecipe(r => [...r, { ...addForm, color: RECIPE_CAT_COLORS[addForm.cat] }]);
    setAddForm(null);
  };

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%' }}>
      {/* Client list */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div className="wcard" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px', fontWeight: 700, fontSize: 13, borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
            🐕 รายชื่อลูกค้า ({clients.length})
          </div>
          {loadingClients ? (
            <div style={{ padding: 20, color: 'var(--text-light)', fontSize: 13 }}>กำลังโหลด...</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-light)', fontSize: 13 }}>ยังไม่มีลูกค้า</div>
          ) : (
            clients.map(c => (
              <div
                key={c.user_id}
                onClick={() => selectClient(c)}
                style={{
                  padding: '12px 18px', cursor: 'pointer', fontSize: 13,
                  borderBottom: '1px solid var(--border)',
                  background: selected?.user_id === c.user_id ? 'var(--teal-light)' : 'transparent',
                  color: selected?.user_id === c.user_id ? 'var(--teal)' : 'var(--text)',
                  fontWeight: selected?.user_id === c.user_id ? 700 : 400,
                }}
              >
                <div>{c.dog?.name || '(ยังไม่ได้กรอกชื่อ)'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                  {c.dog?.breed || '—'}{c.dog?.weight ? ` · ${c.dog.weight} กก.` : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recipe editor */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!selected ? (
          <div className="wcard" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
            <div>เลือกลูกค้าจากรายการทางซ้าย</div>
          </div>
        ) : (
          <div className="wcard">
            <div className="section-hdr" style={{ marginBottom: 16 }}>
              <div className="section-hdr-title">
                🍲 สูตรอาหารของ {selected.dog?.name || 'ลูกค้า'}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {saved && <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✓ บันทึกแล้ว</span>}
                <button className="wb-btn" onClick={saveRecipe} disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกสูตร'}
                </button>
              </div>
            </div>

            {/* Ingredient rows */}
            {recipe.length === 0 ? (
              <div style={{ padding: '20px 0', color: 'var(--text-light)', fontSize: 13 }}>ยังไม่มีวัตถุดิบ — กด "เพิ่มวัตถุดิบ" ด้านล่าง</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {recipe.map((ing, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: ing.color ?? RECIPE_CAT_COLORS[ing.cat], flexShrink: 0 }} />
                    <input
                      style={{ flex: 2, minWidth: 0, fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                      value={ing.name} onChange={e => updateIng(i, 'name', e.target.value)} placeholder="ชื่อวัตถุดิบ"
                    />
                    <select
                      style={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 6px', background: 'var(--white)' }}
                      value={ing.cat} onChange={e => updateIng(i, 'cat', e.target.value)}
                    >
                      {RECIPE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      style={{ width: 120, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                      value={ing.amount} onChange={e => updateIng(i, 'amount', e.target.value)} placeholder="ปริมาณ"
                    />
                    <input
                      style={{ width: 60, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                      type="number" min="0" max="100" value={ing.pct} onChange={e => updateIng(i, 'pct', e.target.value)} placeholder="%"
                    />
                    <button onClick={() => removeIng(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 16, padding: '0 4px' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add ingredient form */}
            {addForm ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: 'oklch(96% 0.04 185)', borderRadius: 10, border: '1px solid var(--teal)', marginBottom: 12 }}>
                <input
                  style={{ flex: 2, minWidth: 0, fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                  value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="ชื่อวัตถุดิบ" autoFocus
                />
                <select
                  style={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 6px', background: 'var(--white)' }}
                  value={addForm.cat} onChange={e => setAddForm(f => ({ ...f, cat: e.target.value }))}
                >
                  {RECIPE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  style={{ width: 120, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                  value={addForm.amount} onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} placeholder="ปริมาณ"
                />
                <input
                  style={{ width: 60, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--white)' }}
                  type="number" min="0" max="100" value={addForm.pct} onChange={e => setAddForm(f => ({ ...f, pct: +e.target.value }))} placeholder="%"
                />
                <button className="wb-btn" onClick={addIng}>เพิ่ม</button>
                <button className="wb-btn-outline" onClick={() => setAddForm(null)}>ยกเลิก</button>
              </div>
            ) : (
              <button className="wb-btn-outline" onClick={() => setAddForm({ ...EMPTY_ING })}>+ เพิ่มวัตถุดิบ</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
