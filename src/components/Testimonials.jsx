import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <section className="testi">
      <div className="container">
        <div className="testi-header">
          <div className="eyebrow eyebrow-gold fi">รีวิวจากเจ้าของน้องหมา</div>
          <h2 className="section-title fi" style={{ textAlign: 'center' }}>
            ผลลัพธ์​ที่น่าสนใจ<br />
            <span style={{ color: 'var(--teal)' }}>หลังจากเปลี่ยนอาหาร</span>
          </h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className={`tcard fi d${i + 1}`} key={i}>
              <div className="tcard-stars">{'★'.repeat(t.stars)}</div>
              <div className="tcard-text">"{t.text}"</div>
              <div className="tcard-author">
                <div className="tcard-ava">🐕</div>
                <div>
                  <div className="tcard-name">{t.name}</div>
                  <div className="tcard-dog">{t.dog}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
