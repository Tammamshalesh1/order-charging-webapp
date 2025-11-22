import React, { useState } from "react";
import { apiPost } from "../api";

export default function OrderForm({ user, reload }) {
  const [product, setProduct] = useState("شحن الماس");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(1);

  async function createOrder(e) {
    e.preventDefault();

    const res = await apiPost("/orders/create", {
      userId: user.id,
      userEmail: user.email,
      product,
      details,
      quantity,
      price,
    });

    if (res.ok) {
      alert("تم إنشاء الطلب");
      reload();
      setDetails("");
      setQuantity(1);
    }
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="font-semibold text-lg mb-3">📝 إنشاء طلب شحن</h3>

      <form onSubmit={createOrder} className="space-y-2">

        <input
          className="border p-2 rounded w-full"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="المنتج"
        />

        <input
          className="border p-2 rounded w-full"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="تفاصيل الحساب"
        />

        <input
          type="number"
          className="border p-2 rounded w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="الكمية"
          min={1}
        />

        <input
          type="number"
          className="border p-2 rounded w-full"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="سعر الوحدة"
          min={1}
        />

        <button className="bg-emerald-600 text-white p-2 w-full rounded">
          إنشاء الطلب
        </button>
      </form>
    </div>
  );
}
