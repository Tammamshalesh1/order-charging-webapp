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

    const updated = users.map((u) =>
      u.id === user.id ? { ...u, wallet: u.wallet + amount } : u
    );
    setUsers(updated);
    return { ok: true };
  }

  // ---------------- ORDERS ----------------
  function placeOrder({ product, details, quantity, unitPrice }) {
    const user = getCurrentUser();
    if (!user) return { ok: false, error: "غير مسجل" };

    const total = quantity * unitPrice;

    if (user.wallet < total) return { ok: false, error: "رصيد غير كاف" };

    const nextUsers = users.map((u) =>
      u.id === user.id ? { ...u, wallet: u.wallet - total } : u
    );
    setUsers(nextUsers);

    const newOrder = {
      id: "o_" + Date.now(),
      userId: user.id,
      userEmail: user.email,
      product,
      details,
      quantity,
      unitPrice,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    return { ok: true, order: newOrder };
  }

  function adminUpdateOrder(orderId, data) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...data } : o))
    );
  }

  const currentUser = getCurrentUser();

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">

        <Header currentUser={currentUser} logout={logout} login={login} register={register} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <WalletSection user={currentUser} topUp={topUp} />
          <OrderSection user={currentUser} placeOrder={placeOrder} orders={orders} />
        </div>

        {currentUser && currentUser.isAdmin && (
          <AdminPanel orders={orders} onUpdate={adminUpdateOrder} />
        )}
      </div>
    </div>
  );
}

// ---------------- REUSABLE COMPONENTS ----------------

function Header({ currentUser, logout, login, register }) {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-xl font-bold">منصة شحن التطبيقات والألعاب</h1>

      {currentUser ? (
        <div className="flex items-center gap-4">
          <span>مرحبًا، {currentUser.name}</span>
          <span>الرصيد: {currentUser.wallet.toFixed(2)}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            خروج
          </button>
        </div>
      ) : (
        <AuthPanel login={login} register={register} />
      )}
    </header>
  );
}

function AuthPanel({ login, register }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const fn = mode === "login" ? login : register;
    const res = fn({ email, password, name });
    if (!res.ok) alert(res.error);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {mode === "register" && (
        <input
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-1 rounded"
        />
      )}
      <input
        placeholder="البريد"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-1 rounded"
      />
      <input
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-1 rounded"
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        {mode === "login" ? "دخول" : "إنشاء"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="text-blue-600 underline"
      >
        {mode === "login" ? "إنشاء حساب" : "تسجيل دخول"}
      </button>
    </form>
  );
}

function WalletSection({ user, topUp }) {
  const [amount, setAmount] = useState(10);

  if (!user) return <div className="border rounded p-4">سجّل دخولك لاستخدام المحفظة.</div>;

  return (
    <div className="border rounded p-4">
      <h2 className="font-bold mb-2">المحفظة</h2>

      <div>الرصيد الحالي: {user.wallet.toFixed(2)}</div>

      <div className="mt-3 flex gap-2">
        <input
          type="number"
          className="border p-1 rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded"
          onClick={() => topUp(amount)}
        >
          شحن
        </button>
      </div>
    </div>
  );
}

function OrderSection({ user, placeOrder, orders }) {
  const [product, setProduct] = useState("شحن لعبة X");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(1);

  if (!user) return <div className="border rounded p-4">سجّل دخولك لإنشاء طلب.</div>;

  function submit(e) {
    e.preventDefault();
    const res = placeOrder({ product, details, quantity, unitPrice });
    if (!res.ok) alert(res.error);
    else alert("تم إنشاء الطلب");
  }

  return (
    <div className="border rounded p-4">
      <h2 className="font-bold mb-2">إنشاء طلب</h2>

      <form className="space-y-2" onSubmit={submit}>
        <input className="border p-1 rounded w-full" value={product} onChange={(e) => setProduct(e.target.value)} />
        <input className="border p-1 rounded w-full" value={details} onChange={(e) => setDetails(e.target.value)} />

        <div className="flex gap-2">
          <input type="number" className="border p-1 rounded w-full" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <input type="number" className="border p-1 rounded w-full" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          إرسال الطلب
        </button>
      </form>

      <h3 className="font-bold mt-4">طلباتي</h3>
      {orders.filter(o => o.userId === user.id).map(o => (
        <div key={o.id} className="border rounded p-2 mt-2">
          #{o.id} - {o.product} ({o.status})
        </div>
      ))}
    </div>
  );
}

function AdminPanel({ orders, onUpdate }) {
  return (
    <div className="border rounded p-4 mt-6">
      <h2 className="font-bold mb-2">لوحة التحكم (أدمن)</h2>

      {orders.map(o => (
        <div key={o.id} className="border rounded p-2 flex justify-between mt-2">
          <div>
            #{o.id} - {o.product} - {o.userEmail}
            <div className="text-sm">الحالة: {o.status}</div>
          </div>

          <div className="flex gap-2">
            <button className="px-2 py-1 bg-yellow-400 rounded" onClick={() => onUpdate(o.id, { status: "processing" })}>
              قيد التنفيذ
            </button>
            <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => onUpdate(o.id, { status: "done" })}>
              مكتمل
            </button>
            <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => onUpdate(o.id, { status: "cancelled" })}>
              إلغاء
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
