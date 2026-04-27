// Mommam demo data — Shetland Sheepdog, born 17 May 2023
export const INIT_DOG = {
  name: 'มอมแมม',
  breed: 'Shetland Sheepdog',
  sex: 'female',
  birthYear: 2023,
  birthMonth: 5,
  weight: 13.4,
  height: 38,
  bcs: 5,
  activityLevel: 'moderate',
  neutered: true,
  allergies: '',
  currentFood: 'อาหารปรุงสุก Dogevity',
  conditions: '',
  vaccines: '',
  note: '',
};

export const INIT_WEIGHTS = [
  { date: '2025-09-01', weight: 14.8 },
  { date: '2025-10-01', weight: 14.5 },
  { date: '2025-11-01', weight: 14.2 },
  { date: '2025-12-01', weight: 14.0 },
  { date: '2026-01-01', weight: 13.8 },
  { date: '2026-02-01', weight: 13.6 },
  { date: '2026-03-01', weight: 13.5 },
  { date: '2026-04-01', weight: 13.4 },
];

export const INIT_HEALTH = [
  { id: 1, type: 'vaccine', name: 'วัคซีนรวม DHPPiL', date: '2025-12-10', nextDate: '2026-12-10', status: 'ok', note: 'Nobivac' },
  { id: 2, type: 'vaccine', name: 'วัคซีนพิษสุนัขบ้า', date: '2025-12-10', nextDate: '2026-12-10', status: 'ok', note: '' },
  { id: 3, type: 'deworming', name: 'ถ่ายพยาธิ / กำจัดเห็บหมัด', date: '2026-02-01', nextDate: '2026-05-01', status: 'soon', note: 'Nexgard Spectra' },
  { id: 4, type: 'checkup', name: 'ตรวจสุขภาพประจำปี', date: '2025-12-10', nextDate: '2026-12-10', status: 'ok', note: '' },
];

export const INGREDIENTS = [
  { name: 'ปลาแพงกาเซีย', cat: 'เนื้อสัตว์', amount: '1,000 ก./สัปดาห์', pct: 28, color: 'oklch(55% 0.16 25)' },
  { name: 'ปลาซาบะ', cat: 'เนื้อสัตว์', amount: '590 ก./สัปดาห์', pct: 16, color: 'oklch(62% 0.14 25)' },
  { name: 'หมูบด + เนื้อบด (ลีน)', cat: 'เนื้อสัตว์', amount: '500 ก./สัปดาห์', pct: 14, color: 'oklch(60% 0.12 15)' },
  { name: 'หอยแมลงภู่ + ไก่บด', cat: 'เนื้อสัตว์', amount: '630 ก./สัปดาห์', pct: 12, color: 'oklch(65% 0.14 30)' },
  { name: 'ตับ + กึ๋น + หัวใจไก่', cat: 'เครื่องใน', amount: '645 ก./สัปดาห์', pct: 10, color: 'oklch(50% 0.15 330)' },
  { name: 'ข้าวไรซ์เบอร์รี', cat: 'คาร์โบ', amount: '1,032 ก./สัปดาห์', pct: 18, color: 'oklch(42% 0.08 240)' },
  { name: 'ฟักทอง + บร็อคโคลี่ + ผัก', cat: 'ผัก', amount: '1,548 ก./สัปดาห์', pct: 14, color: 'oklch(58% 0.16 145)' },
  { name: 'ไข่ไก่ 10 ฟอง + เปลือกไข่', cat: 'อาหารเสริม', amount: '10 ฟอง', pct: 5, color: 'oklch(70% 0.14 78)' },
  { name: 'Kelp 150mcg + Triple Omega', cat: 'อาหารเสริม', amount: '20 + 5 เม็ด', pct: 3, color: 'oklch(62% 0.12 185)' },
];

export const TARGET_WEIGHT = 13.0;
