import { problemCards } from '../data';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function Problem() {
  return (
    <section className="problem" id="problem">
      <div className="container">
        <div className="problem-layout">
          <div>
            <div className="eyebrow eyebrow-white fi">ทำไมต้องใส่ใจ?</div>
            <h2 className="section-title fi" style={{ color: '#fff' }}>
              น้องหมาในยุคนี้<br />
              <span style={{ color: 'oklch(78% 0.14 78)' }}>แก่เร็วกว่าที่ควร</span>
            </h2>
            <p className="section-sub fi" style={{ color: 'oklch(68% 0.04 210)' }}>
              อาหารสำเร็จรูปอาจทำหน้าที่พื้นฐานได้ แต่มันคือการผลิตแบบ Mass Production
              ที่ออกแบบสูตรกลางๆ เพื่อให้สุนัขทุกตัวกินได้
              ทำให้ขาดความจำเพาะเจาะจงกับปัญหาสุขภาพของสุนัขแต่ละตัว
            </p>
            <a
              className="btn-ghost fi"
              href="#"
              style={{ color: 'var(--teal-light)', marginTop: 24, display: 'inline-flex' }}
              onClick={e => { e.preventDefault(); scrollTo('solution'); }}
            >
              ดูทางออก →
            </a>
          </div>
          <div className="problem-cards fi d1">
            {problemCards.map((c, i) => (
              <div className="pcard" key={i}>
                <div className="pcard-icon">{c.icon}</div>
                <div>
                  <div className="pcard-title">{c.title}</div>
                  <div className="pcard-text">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
