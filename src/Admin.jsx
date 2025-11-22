import React, { useState } from "react";

export default function AdminApp({ users, orders, setUsers, setOrders, login, logout, currentUser }) {
  const [tab, setTab] = useState("dashboard");
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const isAdminLogged = currentUser && currentUser.isAdmin;

  if (!isAdminLogged) {
    return <AdminLogin onLogin={login} />;
  }

  const totalUsers = users.length;
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const totalAmount = orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2);

  function changeOrderStatus(id, status) {
    setOrders((s) => s.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function updateUserWallet(userId, amount) {
    setUsers((s) =>
      s.map((u) =>
        u.id === userId ? { ...u, wallet: Number((u.wallet + amount).toFixed(2)) } : u
      )
    );
  }

  function removeUser(userId) {
    if (!window.confirm("هل أنت متأكد من حذف المستخدم؟")) return;
    setUsers((s) => s.filter((u) => u.id !== userId));
    setOrders((s) => s.filter((o) => o.userId !== userId));
  }

  const filteredOrders = orders.filter(
    (o) => !filter || o.status === filter || o.userEmail.includes(filter)
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-4">لوحة التحكم</h3>
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === "dashboard" ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === "users" ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setTab("users")}
            >
              المستخدمون
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === "orders" ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setTab("orders")}
            >
              الطلبات
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === "wallets" ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setTab("wallets")}
            >
              المحافظ
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === "settings" ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setTab("settings")}
            >
              الإعدادات
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded bg-red-500 text-white mt-4"
              onClick={() => {
                logout();
                alert("تم تسجيل الخروج");
              }}
            >
              تسجيل خروج
            </button>
          </nav>
        </aside>

        <section className="md:col-span-3 bg-white rounded p-4 shadow">
          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">احصائيات سريعة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border rounded">
                  المستخدمون<br />
                  <strong>{totalUsers}</strong>
                </div>
                <div className="p-3 border rounded">
                  الطلبات<br />
                  <strong>{totalOrders}</strong>
                </div>
                <div className="p-3 border rounded">
                  قيد الانتظار<br />
                  <strong>{pending}</strong>
                </div>
                <div className="p-3 border rounded">
                  إجمالي المبالغ<br />
                  <strong>{totalAmount}</strong>
                </div>
              </div>

              <h3 className="mt-6 font-semibold">آخر الطلبات</h3>
              <div className="mt-2 space-y-2">
                {recentOrders.map((o) => (
                  <div key={o.id} className="border rounded p-2 flex justify-between">
                    <div>
                      <div className="text-sm">
                        #{o.id} — {o.product}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>
                        <strong>{o.total.toFixed(2)}</strong>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-400 rounded"
                          onClick={() => changeOrderStatus(o.id, "processing")}
                        >
                          قيد التنفيذ
                        </button>
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded"
                          onClick={() => changeOrderStatus(o.id, "done")}
                        >
                          مكتمل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">المستخدمون</h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {u.name} —{" "}
                        <span className="text-xs text-gray-500">{u.email}</span>
                      </div>
                      <div className="text-xs">
                        رصيد: {u.wallet.toFixed(2)} — {u.isAdmin ? "مشرف" : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-indigo-600 text-white rounded"
                        onClick={() => {
                          const add = Number(prompt("المبلغ المضاف", "10"));
                          if (!isNaN(add)) updateUserWallet(u.id, Number(add));
                        }}
                      >
                        شحن
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => removeUser(u.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">الطلبات</h2>
              <div className="mb-3 flex gap-2">
                <input
                  placeholder="ابحث حسب الايميل أو الحالة"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <button
                  className="px-3 py-1 bg-gray-100 rounded"
                  onClick={() => setFilter("")}
                >
                  مسح
                </button>
              </div>

              <div className="space-y-2">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">
                          #{o.id} — {o.product}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.userEmail} —{" "}
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                        <div className="text-xs">تفاصيل: {o.details}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          <strong>{o.total.toFixed(2)}</strong>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-2 py-1 bg-yellow-400 rounded"
                            onClick={() => changeOrderStatus(o.id, "processing")}
                          >
                            قيد التنفيذ
                          </button>
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded"
                            onClick={() => changeOrderStatus(o.id, "done")}
                          >
                            مكتمل
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={() => changeOrderStatus(o.id, "cancelled")}
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallets */}
          {tab === "wallets" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">المحافظ</h2>
              <p>إدارة المحافظ ستكون هنا (يمكنني إضافتها لك الآن إذا رغبت).</p>
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">الإعدادات</h2>
              <p>إعدادات الموقع — (أضيف لك تعديل الأسعار، العملات، المنتجات... إذا أردت).</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------------- LOGIN COMPONENT ----------------

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("admin@site.local");
  const [password, setPassword] = useState("admin123");

  function submit(e) {
    e.preventDefault();
    const r = onLogin({ email, password });
    if (!r.ok) alert(r.error);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={submit}
        className="p-6 bg-white shadow rounded w-full max-w-sm space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">دخول المشرف</h2>

        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="ايميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="px-4 py-2 bg-blue-600 text-white w-full rounded">
          دخول
        </button>
      </form>
    </div>
  );
}
