import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUser, clearSession } from './auth';
import { newDogEntry } from './data';
import PageDashboard from './pages/PageDashboard';
import PageProfile from './pages/PageProfile';
import PageRecipe from './pages/PageRecipe';
import PageWeight from './pages/PageWeight';
import PageHealth from './pages/PageHealth';
import PageAdmin from './pages/PageAdmin';
import './webapp.css';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? '';

const ScaleIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="12" rx="3.5"/>
    <rect x="7.5" y="11" width="9" height="4" rx="1"/>
    <path d="M8 19v1.5M16 19v1.5"/>
  </svg>
);

const NAV = [
  { id: 'dashboard', icon: '🏠', label: 'Home' },
  { id: 'profile', icon: '🐕', label: 'โปรไฟล์' },
  { id: 'recipe', icon: '🍲', label: 'สูตรอาหาร' },
  { id: 'weight', icon: <ScaleIcon size={20} />, label: 'น้ำหนัก' },
  { id: 'health', icon: '💉', label: 'สุขภาพ' },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard', profile: 'โปรไฟล์น้องหมา',
  recipe: 'สูตรอาหาร', weight: 'ติดตามน้ำหนัก',
  health: 'วัคซีน & สุขภาพ', admin: 'Admin Panel',
};

export default function WebApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [activeDogId, setActiveDogId] = useState(null);
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerLineId, setOwnerLineId] = useState('');

  const dog = dogs.find(d => d.id === activeDogId) ?? dogs[0] ?? newDogEntry();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const user = await getUser();
        if (!user) { navigate('/login', { replace: true }); return; }
        setUserId(user.id);
        if (ADMIN_EMAIL && user.email === ADMIN_EMAIL) setIsAdmin(true);

        const { data } = await supabase
          .from('user_data').select('*').eq('user_id', user.id).single();

        if (data) {
          if (data.owner_phone) setOwnerPhone(data.owner_phone);
          if (data.owner_line_id) setOwnerLineId(data.owner_line_id);
          if (!data.email) {
            supabase.from('user_data').update({ email: user.email }).eq('user_id', user.id);
          }
          if (data.dogs && data.dogs.length > 0) {
            setDogs(data.dogs);
            setActiveDogId(data.dogs[0].id);
          } else {
            // Migrate from old single-dog schema
            const entry = { ...newDogEntry(), ...(data.dog ?? {}) };
            if (data.weights) entry.weights = data.weights;
            if (data.health) entry.health = data.health;
            if (data.recipe) entry.recipe = data.recipe;
            const migrated = [entry];
            setDogs(migrated);
            setActiveDogId(entry.id);
            await supabase.from('user_data')
              .update({ dogs: migrated, updated_at: new Date().toISOString() })
              .eq('user_id', user.id);
          }
        } else {
          const entry = newDogEntry();
          setDogs([entry]);
          setActiveDogId(entry.id);
          await supabase.from('user_data').insert({ user_id: user.id, email: user.email, dogs: [entry] });
        }
      } catch (err) {
        console.error('WebApp init error:', err);
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  useEffect(() => {
    if (!loading && !dog.name) setPage('profile');
  }, [loading, dog.name]);

  const saveDogs = useCallback(async (updatedDogs) => {
    if (!userId) return;
    await supabase.from('user_data')
      .update({ dogs: updatedDogs, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  }, [userId]);

  const updateDog = useCallback((fields) => {
    setDogs(prev => {
      const updated = prev.map(d =>
        d.id === (fields.id ?? activeDogId) ? { ...d, ...fields } : d
      );
      saveDogs(updated);
      return updated;
    });
  }, [activeDogId, saveDogs]);

  const addDog = () => {
    const entry = newDogEntry();
    setDogs(prev => {
      const updated = [...prev, entry];
      saveDogs(updated);
      return updated;
    });
    setActiveDogId(entry.id);
    setPage('profile');
  };

  const deleteDog = (id) => {
    setDogs(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter(d => d.id !== id);
      saveDogs(updated);
      if (activeDogId === id) setActiveDogId(updated[0].id);
      return updated;
    });
  };

  const uploadPhoto = async (dogId, file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const path = `${userId}/${dogId}.${ext}`;
    const { error } = await supabase.storage.from('dog-photos').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('dog-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  const updateOwner = useCallback(async ({ phone, lineId }) => {
    if (phone !== undefined) setOwnerPhone(phone);
    if (lineId !== undefined) setOwnerLineId(lineId);
    if (!userId) return;
    const update = {};
    if (phone !== undefined) update.owner_phone = phone;
    if (lineId !== undefined) update.owner_line_id = lineId;
    await supabase.from('user_data').update(update).eq('user_id', userId);
  }, [userId]);

  const logout = async () => { await clearSession(); navigate('/login', { replace: true }); };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🐾</div>
          <div style={{ color: 'var(--text-light)', fontSize: 14 }}>กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="webapp-root">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-header">
          <img src="/dogevityfoodlogo-transparent.png" className="sb-logo" alt="Dogevity" />
        </div>

        <div className="sb-nav" style={{ overflowY: 'auto' }}>
          {/* Dog switcher */}
          <div className="sb-section-label">น้องหมา</div>
          {dogs.map(d => (
            <div
              key={d.id}
              className={`sb-dog-item${d.id === activeDogId ? ' active' : ''}`}
              onClick={() => { setActiveDogId(d.id); setPage('dashboard'); }}
            >
              <div className="sb-avatar">
                {d.photoUrl
                  ? <img src={d.photoUrl} className="sb-avatar-img" alt={d.name} />
                  : '🐕'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sb-dog-name">{d.name || 'ยังไม่ได้กรอกชื่อ'}</div>
                <div className="sb-dog-sub">{d.breed || '—'}{d.weight ? ` · ${d.weight} กก.` : ''}</div>
              </div>
            </div>
          ))}
          <div className="sb-item" style={{ color: 'var(--teal)' }} onClick={addDog}>
            <span className="sb-item-icon">➕</span>เพิ่มน้องหมา
          </div>

          {/* Main menu */}
          <div className="sb-section-label" style={{ marginTop: 12 }}>เมนู</div>
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'profile', icon: '🐕', label: 'โปรไฟล์น้องหมา' },
            { id: 'recipe', icon: '🍲', label: 'สูตรอาหาร' },
            { id: 'weight', icon: <ScaleIcon />, label: 'น้ำหนัก' },
            { id: 'health', icon: '💉', label: 'วัคซีน & สุขภาพ' },
          ].map(n => (
            <div key={n.id} className={`sb-item${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
              <span className="sb-item-icon">{n.icon}</span>{n.label}
            </div>
          ))}

          {isAdmin && (
            <>
              <div className="sb-section-label" style={{ marginTop: 12 }}>Admin</div>
              <div className={`sb-item${page === 'admin' ? ' active' : ''}`} onClick={() => setPage('admin')}>
                <span className="sb-item-icon">🛠️</span>จัดการลูกค้า
              </div>
            </>
          )}

          <div className="sb-section-label" style={{ marginTop: 12 }}>ลิงก์</div>
          <div className="sb-item" onClick={() => navigate('/')}>
            <span className="sb-item-icon">🌐</span>DogevityFood.com
          </div>
          <div className="sb-item" onClick={logout}>
            <span className="sb-item-icon">🚪</span>ออกจากระบบ
          </div>
        </div>

        <div className="sb-footer">
          <div style={{ fontWeight: 700, color: 'var(--teal)', marginBottom: 2 }}>Dogevity Food</div>
          <div>Pet Nutrition · Powered by AAFCO</div>
          <div style={{ marginTop: 4, color: 'oklch(75% 0.08 185)', fontSize: 11 }}>
            Chaivoot Patipakorn<br />Pet Nutrition Coach · NAVC
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="wb-main">
        <div className="topbar">
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          <div className="topbar-badge">
            {dog.photoUrl
              ? <img src={dog.photoUrl} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', marginRight: 4 }} />
              : '🐾 '}
            {dog.name || 'ยังไม่ได้กรอกข้อมูล'}
          </div>
          <div className="topbar-btn" onClick={() => setPage('profile')} title="ตั้งค่า">⚙️</div>
        </div>
        <div className="wb-content">
          {page === 'dashboard' && <PageDashboard dog={dog} />}
          {page === 'profile' && (
            <PageProfile
              dog={dog} updateDog={updateDog}
              dogs={dogs} activeDogId={activeDogId} setActiveDogId={setActiveDogId}
              addDog={addDog} deleteDog={deleteDog}
              uploadPhoto={uploadPhoto} isNew={!dog.name}
              ownerPhone={ownerPhone} ownerLineId={ownerLineId} updateOwner={updateOwner}
            />
          )}
          {page === 'recipe' && <PageRecipe dog={dog} />}
          {page === 'weight' && <PageWeight dog={dog} updateDog={updateDog} />}
          {page === 'health' && <PageHealth dog={dog} updateDog={updateDog} />}
          {page === 'admin' && isAdmin && <PageAdmin />}
        </div>
        <div className="wb-footer-spacer" />
      </div>

      {/* BOTTOM NAV (mobile) */}
      <div className="bottom-nav">
        {NAV.map(n => (
          <div key={n.id} className={`bn-item${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
            <div className="bn-item-icon">{n.icon}</div>
            <div>{n.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
