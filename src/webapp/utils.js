export function calcRER(weight) {
  return Math.round(70 * Math.pow(weight, 0.75));
}

export function calcDER(rer, actLevel, neutered) {
  const factors = { low: 1.4, moderate: 1.6, high: 2.0 };
  let f = factors[actLevel] || 1.6;
  if (neutered) f *= 0.9;
  return Math.round(rer * f);
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
