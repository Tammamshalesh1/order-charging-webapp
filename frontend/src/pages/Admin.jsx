import React, { useEffect, useState } from "react";

export default function Admin({ session }) {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  async function loadData() {
    const o = await fetch(`${import.meta.env.VITE_API}/admin/orders`, {
      headers: { Authorization: session?.token },
    }).then((r) => r.json());

    const u = await fetch(`${import.meta.env.VITE_API}/admin/users`, {
      headers: { Authorization: session?.token },
    }).then((r) => r.json());

    setOrders(o.orders || []);
    setUsers(u.users || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function setStatus(id, status) {
    await fetch(`${import.meta.env.VITE_API}/admin/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.token,
      },
      body: JSON.stringify({ status }),
    });

    loadData();
  }

  async function addMoney(id) {
    const amount = prompt("ادخل مبلغ الرصيد:");
    if (!amount) return;

    await fetch(`${import.meta.env.VITE_API}/admin/user/${id}/wallet`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.token,
      },
      body: JSON.stringify({ amount }),
    });

    loadData();
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">لوحة التحكم</h2>

      <h3 className="text-xl mt-6 mb-2">الطلبات</h3>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border p-3 rounded bg-gray-100">
            <div>#{o.id} — {o.accountId}</div>
            <div>المنتج: {o.productId}</div>
            <div>الكمية: {o.amount}</div>
            <div>الحالة: {o.status}</div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStatus(o.id, "done")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                مكتمل
              </button>

              <button
                onClick={() => setStatus(o.id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                مرفوض
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl mt-6 mb-2">المستخدمين</h3>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="border p-3 rounded bg-gray-100">
            <div>#{u.id} — {u.name}</div>
            <div>البريد: {u.email}</div>
            <div>الرصيد: {u.wallet}</div>

            <button
              onClick={() => addMoney(u.id)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              إضافة رصيد
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
