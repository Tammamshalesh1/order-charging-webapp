import React, { useEffect, useState } from "react";

export default function Orders({ session }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/orders`, {
      headers: { Authorization: session?.token },
    })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">طلباتي</h2>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border p-3 rounded bg-gray-100">
            <div>الطلب #: {o.id}</div>
            <div>المنتج: {o.productId}</div>
            <div>حساب اللعبة: {o.accountId}</div>
            <div>الكمية: {o.amount}</div>
            <div>الحالة: {o.status}</div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-gray-600">لا يوجد طلبات بعد</div>
        )}
      </div>
    </div>
  );
}
