import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from './auth';
import { supabase } from '../lib/supabase';
import './webapp.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/app', { replace: true });
    });
  }, [navigate]);

  const validatePhone = (p) => /^\d{10}$/.test(p);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('กรุณากรอกอีเมล');
    if (!validatePhone(phone)) return setError('เบอร์โทรต้องเป็นตัวเลข 10 หลัก');
    setLoading(true);
    const result = tab === 'login'
      ? await loginUser(email, phone)
      : await registerUser(email, phone);
    setLoading(false);
    if (result.ok) navigate('/app', { replace: true });
    else setError(result.error);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/dogevityfoodlogo-transparent.png" alt="Dogevity Food" className="login-logo" />
        <div className="login-brand">Pet Nutrition Dashboard</div>

        <div className="login-tabs">
          <button className={`login-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
            เข้าสู่ระบบ
          </button>
          <button className={`login-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>
            สมัครสมาชิก
          </button>
        </div>

        <form onSubmit={submit}>
          {error && <div className="login-error">⚠️ {error}</div>}

          <div className="login-field">
            <label className="login-label">อีเมล</label>
            <input
              className="login-input" type="email" required
              placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">
              เบอร์โทรศัพท์ {tab === 'login' ? '(รหัสผ่าน)' : '(ใช้เป็นรหัสผ่าน)'}
            </label>
            <input
              className="login-input" type="tel" required
              placeholder="0812345678" maxLength={10}
              value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            />
            {tab === 'register' && (
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                ใส่เบอร์โทร 10 หลัก — จะใช้เป็นรหัสผ่านในการเข้าสู่ระบบ
              </div>
            )}
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'กำลังดำเนินการ...' : tab === 'login' ? 'เข้าสู่ระบบ →' : 'สมัครสมาชิก →'}
          </button>
        </form>

        <div className="login-hint">
          {tab === 'login'
            ? 'ยังไม่มีบัญชี? กด "สมัครสมาชิก" ด้านบน'
            : 'มีบัญชีแล้ว? กด "เข้าสู่ระบบ" ด้านบน'}
          <br />
          <span style={{ fontSize: 11 }}>© 2026 Dogevity Food · Chaivoot Patipakorn</span>
        </div>
      </div>
    </div>
  );
}
