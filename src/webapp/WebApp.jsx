import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUser, clearSession } from './auth';
import { INIT_DOG, INIT_WEIGHTS, INIT_HEALTH, INIT_RECIPE } from './data';
import PageDashboard from './pages/PageDashboard';
import PageProfile from './pages/PageProfile';
import PageRecipe from './pages/PageRecipe';
import PageWeight from './pages/PageWeight';
import PageHealth from './pages/PageHealth';
import PageAdmin from './pages/PageAdmin';
import './webapp.css';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? '';

const NAV = [
  { id: 'dashboard', icon: '🏠', label: 'Home' },
  { id: 'profile', icon: '🐕', label: 'โปรไฟล์' },
  { id: 'recipe', icon: '🍲', label: 'สูตรอาหาร' },
  { id: 'weight', icon: '⚖️', label: 'น้ำหนัก' },
  { id: 'health', icon: '💉', label: 'สุขภาพ' },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  profile: 'โปรไฟล์น้องหมา',
  recipe: 'สูตรอาหาร',
  weight: 'ติดตามน้ำหนัก',
  health: 'วัคซีน & สุขภาพ',
  admin: 'Admin Panel',
};

export default function WebApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dog, setDogState] = useState(INIT_DOG);
  const [weights, setWeightsState] = useState(INIT_WEIGHTS);
  const [health, setHealthState] = useState(INIT_HEALTH);
  const [recipe, setRecipeState] = useState(INIT_RECIPE);

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
          .from('user_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          if (data.dog) setDogState(data.dog);
          if (data.weights) setWeightsState(data.weights);
          if (data.health) setHealthState(data.health);
          if (data.recipe) setRecipeState(data.recipe);
        } else {
          await supabase.from('user_data').insert({
            user_id: user.id,
            dog: INIT_DOG,
            weights: INIT_WEIGHTS,
            health: INIT_HEALTH,
            recipe: INIT_RECIPE,
          });
        }
      } catch (err) {
        console.error('WebApp init error:', err);
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  // Redirect new users (no dog name) to profile page
  useEffect(() => {
    if (!loading && !dog.name) setPage('profile');
  }, [loading, dog.name]);

  const save = useCallback(async (col, val) => {
    if (!userId) return;
    await supabase.from('user_data')
      .update({ [col]: val, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  }, [userId]);

  const setDog = (v) => { setDogState(v); save('dog', v); };
  const setWeights = (v) => { setWeightsState(v); save('weights', v); };
  const setHealth = (v) => { setHealthState(v); save('health', v); };
  const setRecipe = (v) => { setRecipeState(v); save('recipe', v); };

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

  const isNew = !dog.name;

  return (
    <div className="webapp-root">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-header">
          <img src="/dogevityfoodlogo-transparent.png" className="sb-logo" alt="Dogevity" />
        </div>
        <div style={{ padding: '4px 0' }}>
          <div className="sb-dog-switcher" onClick={() => setPage('profile')}>
            <div className="sb-avatar">🐕</div>
            <div>
              <div className="sb-dog-name">{dog.name || 'ยังไม่ได้กรอกชื่อ'}</div>
              <div className="sb-dog-sub">{dog.breed || '—'}{dog.weight ? ` · ${dog.weight} กก.` : ''}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-light)' }}>▾</div>
          </div>
        </div>
        <div className="sb-nav">
          <div className="sb-section-label">เมนู</div>
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'profile', icon: '🐕', label: 'โปรไฟล์น้องหมา' },
            { id: 'recipe', icon: '🍲', label: 'สูตรอาหาร' },
            { id: 'weight', icon: '⚖️', label: 'น้ำหนัก' },
            { id: 'health', icon: '💉', label: 'วัคซีน & สุขภาพ' },
          ].map(n => (
            <div key={n.id} className={`sb-item${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
              <span className="sb-item-icon">{n.icon}</span>
              {n.label}
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
          <div className="topbar-badge">🐾 {dog.name || 'ยังไม่ได้กรอกข้อมูล'}</div>
          <div className="topbar-btn" onClick={() => setPage('profile')} title="ตั้งค่า">⚙️</div>
        </div>
        <div className="wb-content">
          {page === 'dashboard' && <PageDashboard dog={dog} weights={weights} health={health} />}
          {page === 'profile' && <PageProfile dog={dog} setDog={setDog} isNew={isNew} />}
          {page === 'recipe' && <PageRecipe dog={dog} recipe={recipe} />}
          {page === 'weight' && <PageWeight dog={dog} setDog={setDog} weights={weights} setWeights={setWeights} />}
          {page === 'health' && <PageHealth health={health} setHealth={setHealth} />}
          {page === 'admin' && isAdmin && <PageAdmin />}
        </div>
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
