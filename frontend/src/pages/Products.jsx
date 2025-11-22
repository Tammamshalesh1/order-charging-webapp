import React, { useEffect, useState } from "react";

export default function Products({ session }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/products`, {
      headers: { Authorization: session?.token },
    })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">المنتجات</h2>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border p-3 rounded bg-gray-100">
            <div>الاسم: {p.name}</div>
            <div>السعر: {p.price} ليرة</div>
            <div>الدايموند: {p.amount}</div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-gray-600">لا يوجد منتجات حالياً</div>
        )}
      </div>
    </div>
  );
}
