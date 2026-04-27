import { solutionCards } from '../data';

export default function Solution() {
  return (
    <section className="solution" id="solution">
      <div className="container">
        <div className="solution-header">
          <div className="eyebrow eyebrow-teal fi">วิธีการของเรา</div>
          <h2 className="section-title fi" style={{ textAlign: 'center' }}>
            คำนวณ · ออกแบบ · ปรับ<br />
            <span style={{ color: 'var(--teal)' }}>อาหารที่เหมาะสำหรับน้องหมาของคุณ</span>
          </h2>
          <p className="section-sub fi" style={{ textAlign: 'center', margin: '0 auto' }}>
            ไม่ใช่การเดา แต่คือหลักวิทยาศาสตร์ที่คำนวณเพื่อน้องแต่ละตัว
          </p>
        </div>
        <div className="sol-cards">
          {solutionCards.map((c, i) => (
            <div className={`sol-card fi d${i + 1}`} key={i}>
              <div className="sol-num">{c.num}</div>
              <div className="sol-icon">{c.icon}</div>
              <div className="sol-title">{c.title}</div>
              <div className="sol-text">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
