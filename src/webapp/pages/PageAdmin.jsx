import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RECIPE_CATS, RECIPE_CAT_COLORS } from '../data';
import { calcRER, calcDER, getDERFactor, DER_FACTORS, getBCSLabel, getBCSColor, getAgeString } from '../utils';

const EMPTY_ING = { name: '', cat: 'เนื้อสัตว์', amount: '', pct: 0 };

function RecipeEditor({ contactId, initialRecipe, onSaved }) {
  const [recipe, setRecipe] = useState(initialRecipe ?? []);
  const [addForm, setAddForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const removeIng = (i) => setRecipe(r => r.filter((_, idx) => idx !== i));
  const updateIng = (i, field, val) =>
    setRecipe(r => r.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'pct' ? +val : val, color: RECIPE_CAT_COLORS[field === 'cat' ? val : item.cat] } : item
    ));
  const addIng = () => {
    if (!addForm?.name || !addForm?.amount) return;
    setRecipe(r => [...r, { ...addForm, color: RECIPE_CAT_COLORS[addForm.cat] }]);
    setAddForm(null);
  };

  const save = async () => {
    setSaving(true);
    await supabase.from('contacts').update({ recipe }).eq('id', contactId);
    setSaving(false);
    setSaved(true);
    onSaved(recipe);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>🍲 สูตรอาหาร</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>✓ บันทึกแล้ว</span>}
          <button className="wb-btn" style={{ padding: '6px 14px', fontSize: 12 }} onClick={save} disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'บันทึกสูตร'}
          </button>
        </div>
      </div>

      {recipe.length === 0 && !addForm && (
        <div style={{ fontSize: 13, color: 'var(--text-light)', padding: '8px 0' }}>ยังไม่มีวัตถุดิบ</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: addForm ? 8 : 0 }}>
        {recipe.map((ing, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 10px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ing.color ?? RECIPE_CAT_COLORS[ing.cat], flexShrink: 0 }} />
            <input
              style={{ flex: 2, minWidth: 120, fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
              value={ing.name} onChange={e => updateIng(i, 'name', e.target.value)} placeholder="ชื่อวัตถุดิบ"
            />
            <select
              style={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 5px', background: 'var(--white)' }}
              value={ing.cat} onChange={e => updateIng(i, 'cat', e.target.value)}
            >
              {RECIPE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              style={{ width: 110, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
              value={ing.amount} onChange={e => updateIng(i, 'amount', e.target.value)} placeholder="ปริมาณ"
            />
            <input
              style={{ width: 54, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
              type="number" min="0" max="100" value={ing.pct} onChange={e => updateIng(i, 'pct', e.target.value)} placeholder="%"
            />
            <button onClick={() => removeIng(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 15, padding: '0 2px' }}>✕</button>
          </div>
        ))}
      </div>

      {addForm ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 10px', background: 'oklch(96% 0.04 185)', borderRadius: 8, border: '1px solid var(--teal)', flexWrap: 'wrap', marginBottom: 8 }}>
          <input
            style={{ flex: 2, minWidth: 120, fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
            value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="ชื่อวัตถุดิบ" autoFocus
          />
          <select
            style={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 5px', background: 'var(--white)' }}
            value={addForm.cat} onChange={e => setAddForm(f => ({ ...f, cat: e.target.value }))}
          >
            {RECIPE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            style={{ width: 110, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
            value={addForm.amount} onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} placeholder="ปริมาณ"
          />
          <input
            style={{ width: 54, fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '3px 7px', background: 'var(--white)' }}
            type="number" min="0" max="100" value={addForm.pct} onChange={e => setAddForm(f => ({ ...f, pct: +e.target.value }))} placeholder="%"
          />
          <button className="wb-btn" style={{ padding: '4px 12px', fontSize: 12 }} onClick={addIng}>เพิ่ม</button>
          <button className="wb-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setAddForm(null)}>ยกเลิก</button>
        </div>
      ) : (
        <button className="wb-btn-outline" style={{ padding: '6px 14px', fontSize: 12, marginTop: 4 }} onClick={() => setAddForm({ ...EMPTY_ING })}>
          + เพิ่มวัตถุดิบ
        </button>
      )}
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  const handleSaved = (contactId, recipe) => {
    setContacts(cs => cs.map(c => c.id === contactId ? { ...c, recipe } : c));
  };

  if (loading) return <div className="wcard" style={{ padding: 30, color: 'var(--text-light)', fontSize: 13 }}>กำลังโหลด...</div>;

  if (contacts.length === 0) return (
    <div className="wcard" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
      <div>ยังไม่มีการส่งฟอร์มสมัคร</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 4 }}>
        ทั้งหมด {contacts.length} รายการ
      </div>
      {contacts.map(c => {
        const isOpen = expanded === c.id;
        const hasRecipe = c.recipe?.length > 0;
        return (
          <div key={c.id} className="wcard" style={{ padding: '14px 18px' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : c.id)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name || '—'}</span>
                  <span style={{ fontSize: 13, color: 'var(--teal)', background: 'var(--teal-xlight)', padding: '2px 10px', borderRadius: 20 }}>
                    🐕 {c.dog || 'ไม่ระบุชื่อหมา'}
                  </span>
                  {hasRecipe && (
                    <span style={{ fontSize: 11, color: 'var(--teal)', background: 'var(--teal-light)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                      ✓ มีสูตรแล้ว {c.recipe.length} รายการ
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-light)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {c.weight && <span>น้ำหนัก: <strong>{c.weight} กก.</strong></span>}
                  {c.age && <span>อายุ: <strong>{c.age} ปี</strong></span>}
                  {c.bcs && <span>BCS: <strong>{c.bcs}/9</strong></span>}
                  {c.phone && <span onClick={e => e.stopPropagation()}>📞 <a href={`tel:${c.phone}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>{c.phone}</a></span>}
                  {c.line_id && <span style={{ color: '#06C755', fontWeight: 600 }}>💬 {c.line_id}</span>}
                </div>
                {c.current_food && (
                  <div style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>อาหารปัจจุบัน:</span> {c.current_food}
                  </div>
                )}
                {c.allergies && (
                  <div style={{ fontSize: 12, display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--red)', fontWeight: 600 }}>⚠️ แพ้:</span>
                    <span style={{ color: 'var(--red)' }}>{c.allergies}</span>
                  </div>
                )}
                {c.note && (
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2, padding: '6px 10px', background: 'var(--bg)', borderRadius: 6 }}>
                    {c.note}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                  {new Date(c.created_at).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>{isOpen ? '▲' : '▼ ใส่สูตร'}</div>
              </div>
            </div>

            {isOpen && (
              <RecipeEditor
                contactId={c.id}
                initialRecipe={c.recipe ?? []}
                onSaved={(recipe) => handleSaved(c.id, recipe)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addForm, setAddForm] = useState(null);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from('user_data').select('user_id, dogs');
      if (!error && data) setClients(data);
      setLoadingClients(false);
    }
    fetchClients();
  }, []);

  const selectedClient = clients.find(c => c.user_id === selectedUserId);
  const selectedDog = selectedClient?.dogs?.find(d => d.id === selectedDogId);

  const selectClient = (userId) => {
    setSelectedUserId(userId);
    const client = clients.find(c => c.user_id === userId);
    const firstDog = client?.dogs?.[0];
    setSelectedDogId(firstDog?.id ?? null);
    setRecipe(firstDog?.recipe ?? []);
    setAddForm(null);
    setSaved(false);
  };

  const selectDog = (dogId) => {
    setSelectedDogId(dogId);
    const dog = selectedClient?.dogs?.find(d => d.id === dogId);
    setRecipe(dog?.recipe ?? []);
    setAddForm(null);
    setSaved(false);
  };

  const saveRecipe = async () => {
    if (!selectedClient || !selectedDogId) return;
    setSaving(true);
    const updatedDogs = selectedClient.dogs.map(d =>
      d.id === selectedDogId ? { ...d, recipe } : d
    );
    await supabase.from('user_data')
      .update({ dogs: updatedDogs, updated_at: new Date().toISOString() })
      .eq('user_id', selectedUserId);
    setClients(cs => cs.map(c =>
      c.user_id === selectedUserId ? { ...c, dogs: updatedDogs } : c
    ));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeIng = (i) => setRecipe(r => r.filter((_, idx) => idx !== i));

  const updateIng = (i, field, val) =>
    setRecipe(r => r.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'pct' ? +val : val, color: RECIPE_CAT_COLORS[field === 'cat' ? val : item.cat] } : item
    ));

  const addIng = () => {
    if (!addForm?.name || !addForm?.amount) return;
    setRecipe(r => [...r, { ...addForm, color: RECIPE_CAT_COLORS[addForm.cat] }]);
    setAddForm(null);
  };

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%' }}>
      <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="wcard" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px', fontWeight: 700, fontSize: 13, borderBottom: '1px solid var(--border)' }}>
            🐕 ลูกค้า ({clients.length})
          </div>
          {loadingClients ? (
            <div style={{ padding: 20, color: 'var(--text-light)', fontSize: 13 }}>กำลังโหลด...</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-light)', fontSize: 13 }}>ยังไม่มีลูกค้า</div>
          ) : (
            clients.map(c => {
              const firstDog = c.dogs?.[0];
              return (
                <div
                  key={c.user_id}
                  onClick={() => selectClient(c.user_id)}
                  style={{
                    padding: '12px 18px', cursor: 'pointer', fontSize: 13,
                    borderBottom: '1px solid var(--border)',
                    background: selectedUserId === c.user_id ? 'var(--teal-light)' : 'transparent',
                    color: selectedUserId === c.user_id ? 'var(--teal)' : 'var(--text)',
                    fontWeight: selectedUserId === c.user_id ? 700 : 400,
                  }}
                >
                  <div>{firstDog?.name || '(ยังไม่ได้กรอกชื่อ)'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                    {c.dogs?.length > 1 ? `${c.dogs.length} ตัว` : firstDog?.breed || '—'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedClient?.dogs?.length > 1 && (
          <div className="wcard" style={{ padding: 0 }}>
            <div style={{ padding: '10px 14px', fontWeight: 700, fontSize: 12, borderBottom: '1px solid var(--border)', color: 'var(--text-light)' }}>
              เลือกหมา
            </div>
            {selectedClient.dogs.map(d => (
              <div
                key={d.id}
                onClick={() => selectDog(d.id)}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                  borderBottom: '1px solid var(--border)',
                  background: selectedDogId === d.id ? 'oklch(94% 0.05 185)' : 'transparent',
                  color: selectedDogId === d.id ? 'var(--teal)' : 'var(--text)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {d.photoUrl
                  ? <img src={d.photoUrl} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} alt={d.name} />
                  : <span>🐕</span>}
                {d.name || '(ไม่มีชื่อ)'}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {!selectedDog ? (
          <div className="wcard" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
            <div>เลือกลูกค้าจากรายการทางซ้าย</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Dog profile summary */}
            <div className="wcard" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {selectedDog.photoUrl
                  ? <img src={selectedDog.photoUrl} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt={selectedDog.name} />
                  : <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--teal-xlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🐕</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{selectedDog.name || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 8 }}>
                    {[selectedDog.breed, selectedDog.sex === 'female' ? 'เพศเมีย' : 'เพศผู้', selectedDog.neutered ? '✂️ ทำหมัน' : null, selectedDog.birthYear ? getAgeString(selectedDog.birthYear, selectedDog.birthMonth) : null].filter(Boolean).join(' · ')}
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13 }}>
                    {selectedDog.weight > 0 && (
                      <div><span style={{ color: 'var(--text-light)' }}>น้ำหนัก</span><br /><strong>{selectedDog.weight} กก.</strong></div>
                    )}
                    {selectedDog.bcs > 0 && (() => {
                      const rer = calcRER(selectedDog.weight);
                      const der = calcDER(rer, selectedDog.activityLevel);
                      return <>
                        <div><span style={{ color: 'var(--text-light)' }}>BCS</span><br /><strong style={{ color: getBCSColor(selectedDog.bcs) }}>{selectedDog.bcs}/9 — {getBCSLabel(selectedDog.bcs)}</strong></div>
                        <div><span style={{ color: 'var(--text-light)' }}>RER</span><br /><strong>{rer} kcal</strong></div>
                        <div><span style={{ color: 'var(--text-light)' }}>DER</span><br /><strong style={{ color: 'var(--gold)' }}>{der} kcal/วัน</strong></div>
                      </>;
                    })()}
                  </div>
                  {selectedDog.activityLevel && (
                    <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6 }}>
                      กิจกรรม: <strong style={{ color: 'var(--text)' }}>{DER_FACTORS[selectedDog.activityLevel]?.label ?? selectedDog.activityLevel}</strong>
                      <span style={{ marginLeft: 6 }}>({getDERFactor(selectedDog.activityLevel)}× RER)</span>
                    </div>
                  )}
                  {selectedDog.currentFood && (
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      <span style={{ color: 'var(--text-light)' }}>อาหารปัจจุบัน:</span> {selectedDog.currentFood}
                    </div>
                  )}
                  {selectedDog.allergies && (
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      <span style={{ color: 'var(--red)', fontWeight: 700 }}>⚠️ แพ้:</span> <span style={{ color: 'var(--red)' }}>{selectedDog.allergies}</span>
                    </div>
                  )}
                  {selectedDog.conditions && (
                    <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-light)' }}>
                      <span style={{ fontWeight: 600 }}>โรค/ยา:</span> {selectedDog.conditions}
                    </div>
                  )}
                  {selectedDog.note && (
                    <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-light)', padding: '4px 8px', background: 'var(--bg)', borderRadius: 6 }}>{selectedDog.note}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recipe editor */}
          <div className="wcard">
            <div className="section-hdr" style={{ marginBottom: 16 }}>
              <div className="section-hdr-title">
                🍲 สูตรอาหารของ {selectedDog.name || 'ลูกค้า'}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {saved && <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✓ บันทึกแล้ว</span>}
                <button className="wb-btn" onClick={saveRecipe} disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกสูตร'}
                </button>
              </div>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}

export default function PageAdmin() {
  const [tab, setTab] = useState('contacts');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
        {[
          { id: 'contacts', label: '📋 ฟอร์มสมัคร' },
          { id: 'clients', label: '🐕 ลูกค้า (web app)' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t.id ? '2px solid var(--teal)' : '2px solid transparent',
              color: tab === t.id ? 'var(--teal)' : 'var(--text-light)',
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'contacts' ? <ContactsTab /> : <ClientsTab />}
    </div>
  );
}
