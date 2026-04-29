import { useState, useEffect } from 'react';

function scrollTo(id, close) {
  close();
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { label: 'ปัญหา', id: 'problem' },
    { label: 'วิธีการ', id: 'solution' },
    { label: 'สูตรอาหาร', id: 'recipe' },
    { label: 'คำนวณแคล', id: 'calculator' },
    { label: 'ประสบการณ์', id: 'creds' },
  ];

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a className="nav-logo" href="#" onClick={close}>
          <img src="/dogevityfoodlogo-transparent.png" alt="Dogevity Food" />
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}><a href="#" onClick={e => { e.preventDefault(); scrollTo(l.id, close); }}>{l.label}</a></li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a className="nav-cta" href="/app">
            คำนวณแคลน้องหมา
          </a>
          {/* Hamburger button — mobile only */}
          <button className="nav-hamburger" onClick={() => setOpen(v => !v)} aria-label="เมนู">
            <span className={`ham-bar${open ? ' open' : ''}`} />
            <span className={`ham-bar${open ? ' open' : ''}`} />
            <span className={`ham-bar${open ? ' open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && <div className="nav-overlay" onClick={close} />}

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${open ? ' open' : ''}`}>
        {links.map(l => (
          <a key={l.id} className="nav-mobile-link" href="#"
            onClick={e => { e.preventDefault(); scrollTo(l.id, close); }}>
            {l.label}
          </a>
        ))}
        <a className="nav-mobile-cta" href="/app" onClick={close}>
          คำนวณแคลน้องหมา →
        </a>
      </div>
    </>
  );
}
