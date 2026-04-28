import Counter from './Counter';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <div className="hero-pill fi">🐾 Dog Meal Formulator · Home Cooked</div>
        <h1 className="fi d1">
          ให้น้องหมา<br />
          <span className="t">อยู่นานขึ้น</span><br />
          ด้วยอาหาร<span className="g">ที่ออกแบบ<br />เพื่อเขาโดยเฉพาะ</span>
        </h1>
        <p className="hero-sub fi d2">
          อาหารปรุงสุกที่คำนวณจาก RER, DER ตามหลัก AAFCO — ไม่ใช่แค่ไก่กับข้าว
          แต่คือโภชนาการที่แท้จริง สำหรับน้องหมาแต่ละตัวของคุณ
        </p>
        <div className="hero-ctas fi d3">
          <a className="btn-primary" href="/app">
            สร้างโปรไฟล์สุขภาพ และ เริ่มวิเคราะห์ฟรี
          </a>
          <a className="btn-ghost" href="#" onClick={e => { e.preventDefault(); scrollTo('solution'); }}>
            ดูวิธีการ →
          </a>
        </div>
        <div className="hero-stats fi">
          <div>
            <Counter prefix=">" target={20} />
            <div className="stat-label">วัตถุดิบที่คัดสรรและคำนวณ</div>
          </div>
          <div>
            <Counter target={100} suffix="%" />
            <div className="stat-label">ออกแบบเฉพาะน้องหมาของคุณ</div>
          </div>
          <div>
            <Counter target={52} suffix=" Weeks" />
            <div className="stat-label">ติดตามโภชนาการต่อเนื่อง</div>
          </div>
        </div>
      </div>
      <div className="hero-img-side fi d2">
        <div className="hero-img-circle">
          <img src="/sheltie-hero.jpg" alt="น้องหมา" />
        </div>
        <div className="hero-cert-float">
          <div className="hcf-icon">🎓</div>
          <div>
            <div className="hcf-title">Pet Nutrition Coach</div>
            <div className="hcf-sub">Certified by NAVC · 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}
