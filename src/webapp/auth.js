import { supabase } from '../lib/supabase';

export async function registerUser(email, phone) {
  const { error } = await supabase.auth.signUp({ email, password: phone });
  if (error) {
    if (error.message.toLowerCase().includes('already registered')) return { ok: false, error: 'อีเมลนี้ลงทะเบียนแล้ว' };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function loginUser(email, phone) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: phone });
  if (error) return { ok: false, error: 'อีเมลหรือเบอร์โทรไม่ถูกต้อง' };
  return { ok: true };
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function clearSession() {
  await supabase.auth.signOut();
}
