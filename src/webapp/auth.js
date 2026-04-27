const USERS_KEY = 'dogevity_users';
const SESSION_KEY = 'dogevity_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}

export function registerUser(email, phone) {
  const users = getUsers();
  if (users.find(u => u.email === email.toLowerCase())) {
    return { ok: false, error: 'อีเมลนี้ลงทะเบียนแล้ว' };
  }
  users.push({ email: email.toLowerCase(), phone });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setSession(email.toLowerCase());
  return { ok: true };
}

export function loginUser(email, phone) {
  const users = getUsers();
  const user = users.find(u => u.email === email.toLowerCase() && u.phone === phone);
  if (!user) return { ok: false, error: 'อีเมลหรือเบอร์โทรไม่ถูกต้อง' };
  setSession(user.email);
  return { ok: true };
}

export function getSession() {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}

export function setSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
