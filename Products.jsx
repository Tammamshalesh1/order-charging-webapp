// Products.jsx – صفحة المنتجات + الأسعار

import React, { useState } from "react";

export default function Products({ onSelectProduct }) {
  const [search, setSearch] = useState("");

  const products = [
    { id: 1, name: "جواهر فري فاير", price: 1.0 },
    { id: 2, name: "شحن ببجي", price: 1.2 },
    { id: 3, name: "شحن MLBB", price: 0.9 },
    { id: 4, name: "شحن كلاش أوف كلانس", price: 2.0 },
    { id: 5, name: "شحن Roblox", price: 1.5 },
  ];

  const filtered = products.filter((p) =>
    search === "" ? true : p.name.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">المنتجات المتاحة</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج…"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">سعر الوحدة: {p.price}$</div>
              </div>
              <button
                onClick={() => onSelectProduct(p)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                اختيار
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
