import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from './auth';
import { useLocalState } from './utils';
import { INIT_DOG, INIT_WEIGHTS, INIT_HEALTH } from './data';
import PageDashboard from './pages/PageDashboard';
import PageProfile from './pages/PageProfile';
import PageRecipe from './pages/PageRecipe';
import PageWeight from './pages/PageWeight';
import PageHealth from './pages/PageHealth';
import './webapp.css';

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
};

export default function WebApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [dog, setDog] = useLocalState('dogevity_dog', INIT_DOG);
  const [weights, setWeights] = useLocalState('dogevity_weights', INIT_WEIGHTS);
  const [health, setHealth] = useLocalState('dogevity_health', INIT_HEALTH);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!getSession()) {
    navigate('/login', { replace: true });
    return null;
  }

  const logout = () => { clearSession(); navigate('/login', { replace: true }); };

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
              <div className="sb-dog-name">{dog.name}</div>
              <div className="sb-dog-sub">{dog.breed} · {dog.weight} กก.</div>
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
          <div className="topbar-badge">🐾 {dog.name}</div>
          <div className="topbar-btn" onClick={() => setPage('profile')} title="ตั้งค่า">⚙️</div>
        </div>
        <div className="wb-content">
          {page === 'dashboard' && <PageDashboard dog={dog} weights={weights} health={health} />}
          {page === 'profile' && <PageProfile dog={dog} setDog={setDog} />}
          {page === 'recipe' && <PageRecipe dog={dog} />}
          {page === 'weight' && <PageWeight dog={dog} setDog={setDog} weights={weights} setWeights={setWeights} />}
          {page === 'health' && <PageHealth health={health} setHealth={setHealth} />}
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
