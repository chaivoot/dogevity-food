export const INIT_DOG = {
  name: '',
  breed: '',
  sex: 'male',
  birthYear: new Date().getFullYear() - 1,
  birthMonth: 1,
  weight: 0,
  height: 0,
  bcs: 5,
  activityLevel: 'neutered',
  neutered: false,
  allergies: '',
  currentFood: '',
  conditions: '',
  vaccines: '',
  note: '',
  targetWeight: 0,
};

export const INIT_WEIGHTS = [];
export const INIT_HEALTH = [];
export const INIT_RECIPE = [];

export const RECIPE_CATS = ['เนื้อสัตว์', 'เครื่องใน', 'คาร์โบ', 'ผัก', 'อาหารเสริม'];

export const RECIPE_CAT_COLORS = {
  'เนื้อสัตว์': 'oklch(55% 0.16 25)',
  'เครื่องใน': 'oklch(50% 0.15 330)',
  'คาร์โบ': 'oklch(42% 0.08 240)',
  'ผัก': 'oklch(58% 0.16 145)',
  'อาหารเสริม': 'oklch(62% 0.12 185)',
};
