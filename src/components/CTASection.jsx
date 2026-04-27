import ContactForm from './ContactForm';

export default function CTASection() {
  return (
    <section className="cta-section" id="cta">
      <div className="container">
        <div className="eyebrow eyebrow-white fi">เริ่มต้นวันนี้</div>
        <div className="cta-title fi">
          น้องหมาของคุณ<br />
          <span className="g">สมควรได้รับอาหารที่ดีที่สุด</span>
        </div>
        <p className="cta-sub fi">
          ออกแบบสูตรอาหารปรุงสุกเฉพาะบุคคล คำนวณ RER/DER ปรับตาม BCS
          เพื่ออายุขัยที่ยาวนานและสุขภาพที่แข็งแรง
        </p>
        <div className="form-card fi">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
