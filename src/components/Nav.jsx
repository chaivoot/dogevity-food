import { useState, useEffect } from 'react';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a className="nav-logo" href="#">
        <img src="/dogevityfoodlogo-transparent.png" alt="Dogevity Food" />
      </a>
      <ul className="nav-links">
        <li><a href="#" onClick={e => { e.preventDefault(); scrollTo('problem'); }}>ปัญหา</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); scrollTo('solution'); }}>วิธีการ</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); scrollTo('recipe'); }}>สูตรอาหาร</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); scrollTo('creds'); }}>ประสบการณ์</a></li>
        <li><a href="/login">เข้าสู่ระบบ</a></li>
      </ul>
      <a className="nav-cta" href="#" onClick={e => { e.preventDefault(); scrollTo('cta'); }}>
        รับสูตรอาหารฟรี
      </a>
    </nav>
  );
}
