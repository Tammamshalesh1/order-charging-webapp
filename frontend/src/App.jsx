// مثال: دالة login => تتصل بالـ API
import { post, get } from './api';

async function login({ email, password }) {
  const r = await post('/api/auth/login', { email, password });
  if (r.error) return { ok: false, error: r.error };
  localStorage.setItem('token', r.token);
  // حفظ بيانات المستخدم محلياً
  localStorage.setItem('me', JSON.stringify(r.user));
  setSession({ token: r.token });
  // تحديث المستخدمين من backend إذا أردت
  return { ok: true };
}

// placeOrder => عبر API
async function placeOrder(orderData) {
  const token = session?.token || localStorage.getItem('token');
  const r = await post('/api/orders', orderData, token);
  if (r.error) return { ok: false, error: r.error };
  // تحديث واجهة
  fetchMyOrders();
  return { ok: true, order: r.order };
}
