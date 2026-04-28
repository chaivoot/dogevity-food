export function calcRER(weight) {
  return Math.round(70 * Math.pow(weight, 0.75));
}

// DER factors per AAFCO guidelines
export const DER_FACTORS = {
  neutered:    { factor: 1.6, label: 'ทำหมันแล้ว' },
  intact:      { factor: 1.8, label: 'ยังไม่ทำหมัน' },
  obese_prone: { factor: 1.4, label: 'มีแนวโน้มอ้วนง่าย' },
  weight_loss: { factor: 1.0, label: 'อยู่ในช่วงลดน้ำหนัก' },
  light_work:  { factor: 2.0, label: 'ทำงานเบา / กิจกรรมปานกลาง' },
  heavy_work:  { factor: 5.0, label: 'ทำงานหนัก / กิจกรรมมาก (3–8×)' },
  puppy_young: { factor: 3.0, label: 'ลูกสุนัขอายุ ≤4 เดือน' },
  puppy_old:   { factor: 2.0, label: 'ลูกสุนัขอายุ >4 เดือน' },
  pregnancy:   { factor: 3.0, label: 'ตั้งท้อง >21 วัน' },
  lactation:   { factor: 6.0, label: 'ให้นมลูก (4–8×)' },
};

export function calcDER(rer, actLevel) {
  const f = DER_FACTORS[actLevel]?.factor ?? 1.6;
  return Math.round(rer * f);
}

export function getDERLabel(actLevel) {
  return DER_FACTORS[actLevel]?.label ?? actLevel;
}

export function getDERFactor(actLevel) {
  return DER_FACTORS[actLevel]?.factor ?? 1.6;
}

export function getAgeString(birthYear, birthMonth) {
  const now = new Date();
  const months = (now.getFullYear() - birthYear) * 12 + (now.getMonth() + 1 - birthMonth);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y > 0 ? `${y} ปี${m > 0 ? ' ' + m + ' เดือน' : ''}` : `${m} เดือน`;
}

export function getBCSLabel(bcs) {
  const labels = {
    1: 'ผอมมาก', 2: 'ผอม', 3: 'ผอมกว่าเกณฑ์',
    4: 'สมส่วน', 5: 'อุดมสมบูรณ์', 6: 'เกินเกณฑ์นิด',
    7: 'อ้วน', 8: 'อ้วนมาก', 9: 'อ้วนมากเกิน',
  };
  return labels[bcs] || '';
}

export function getBCSColor(bcs) {
  if (bcs <= 2) return 'var(--blue)';
  if (bcs === 3) return 'var(--teal)';
  if (bcs <= 5) return 'var(--green)';
  if (bcs <= 6) return 'var(--gold)';
  return 'var(--red)';
}
