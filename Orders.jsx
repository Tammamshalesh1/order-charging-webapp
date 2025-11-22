// Orders.jsx – صفحة عرض الطلبات الخاصة بالمستخدم

import React from "react";

export default function Orders({ orders, currentUser }) {
  if (!currentUser)
    return <div className="p-6 text-center">الرجاء تسجيل الدخول لعرض الطلبات.</div>;

  const myOrders = orders.filter((o) => o.userId === currentUser.id);

  if (!myOrders.length)
    return <div className="p-6 text-center">لا توجد طلبات بعد.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">طلباتي</h2>

        <div className="space-y-3">
          {myOrders.map((o) => (
            <div key={o.id} className="p-4 border rounded-lg">
              <div className="font-medium">
                #{o.id} — {o.product}
              </div>
              <div className="text-sm text-gray-600">
                الكمية: {o.quantity} × {o.unitPrice} ={" "}
                <strong>{o.total.toFixed(2)}</strong>
              </div>
              <div className="text-sm">الحالة: {o.status}</div>
              <div className="text-xs text-gray-500">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="text-xs">تفاصيل: {o.details}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
