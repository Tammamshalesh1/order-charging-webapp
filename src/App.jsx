import React, { useEffect, useState } from "react";

// --- Helpers to interact with localStorage ---
const LS_KEYS = { USERS: "oc_users", ORDERS: "oc_orders", SESSION: "oc_session" };

function readJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize default admin if not exists
(function ensureAdmin() {
  const users = readJSON(LS_KEYS.USERS, []);
  if (!users.find((u) => u.email === "admin@site.local")) {
    users.push({
      id: "u_admin",
      email: "admin@site.local",
      password: "admin123",
      wallet: 0,
      name: "Administrator",
      isAdmin: true,
    });
    writeJSON(LS_KEYS.USERS, users);
  }
})();

export default function App() {
  const [users, setUsers] = useState(() => readJSON(LS_KEYS.USERS, []));
  const [orders, setOrders] = useState(() => readJSON(LS_KEYS.ORDERS, []));
  const [session, setSession] = useState(() => readJSON(LS_KEYS.SESSION, null));

  useEffect(() => writeJSON(LS_KEYS.USERS, users), [users]);
  useEffect(() => writeJSON(LS_KEYS.ORDERS, orders), [orders]);
  useEffect(() => writeJSON(LS_KEYS.SESSION, session), [session]);

  // ---------------- AUTH ----------------
  function register({ email, password, name }) {
    if (users.find((u) => u.email === email))
      return { ok: false, error: "الحساب موجود بالفعل" };

    const newUser = {
      id: "u_" + Date.now(),
      email,
      password,
      name: name || email.split("@")[0],
      wallet: 0,
      isAdmin: false,
    };

    setUsers([...users, newUser]);
    setSession({ userId: newUser.id });
    return { ok: true };
  }

  function login({ email, password }) {
    const u = users.find((x) => x.email === email && x.password === password);
    if (!u) return { ok: false, error: "بيانات الدخول خاطئة" };
    setSession({ userId: u.id });
    return { ok: true };
  }

  function logout() {
    setSession(null);
  }

  function getCurrentUser() {
    if (!session) return null;
    return users.find((u) => u.id === session.userId) || null;
  }

  // ---------------- WALLET ----------------
  function topUp(amount) {
    const user = getCurrentUser();
    if (!user) return { ok: false, error: "غير مسجل" };

    const

