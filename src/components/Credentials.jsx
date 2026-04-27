import { credBadges } from '../data';

export default function Credentials() {
  return (
    <section className="creds" id="creds">
      <div className="container">
        <div className="eyebrow eyebrow-teal fi">ผู้เชี่ยวชาญเบื้องหลัง</div>
        <div className="creds-layout">
          <div>
            <div className="cred-bio-name fi">Chaivoot Patipakorn</div>
            <div className="cred-bio-role fi">Pet Nutrition Coach · Choice-Based Dog Trainer</div>
            <p className="cred-bio-text fi">
              เริ่มสนใจโภชนาการสุนัขอย่างจริงจัง จากความกังวลที่เห็นสุนัขรอบตัวป่วยและแก่เร็วกว่าที่ควร
              จนได้รับใบรับรองจากสถาบันชั้นนำระดับโลก และนำองค์ความรู้มาออกแบบบริการสำหรับเจ้าของสุนัข
              ที่ใส่ใจสุขภาพน้องอย่างแท้จริง
            </p>
            <div className="cred-badges fi d1">
              {credBadges.map((b, i) => (
                <div className="cbadge" key={i}>
                  <div className="cbadge-icon">{b.icon}</div>
                  <div>
                    <div className="cbadge-title">{b.title}</div>
                    <div className="cbadge-sub">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cert-photos fi d2">
            <div className="cert-photo-card">
              <img src="/Screenshot 2569-04-08 at 16.45.03.png" alt="NAVC Certificate" />
              <div className="cert-photo-label">Pet Nutrition Coach — NAVC · North American Veterinary Community</div>
            </div>
            <div className="cert-photo-card">
              <img src="/recallers-certificate.png" alt="Recallers Certificate" />
              <div className="cert-photo-label">Recallers Alumni — Susan Garrett · IAABC · 25 CEU</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
