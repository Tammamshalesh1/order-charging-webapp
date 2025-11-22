// OrderForm.jsx – إنشاء طلب شحن جديد
import React, { useState } from "react";

export default function OrderForm({ onPlace }) {
  const [product, setProduct] = useState("جواهر فري فاير");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(1);

  function submit(e) {
    e.preventDefault();
    const res = onPlace({
      product,
      details,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
    });

    if (!res.ok) {
      alert(res.error);
      return;
    }

    alert("تم إنشاء الطلب بنجاح");
    setDetails("");
    setQuantity(1);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <div>اسم المنتج / اللعبة</div>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </label>

      <label className="block">
        <div>تفاصيل الحساب (مثال: ID – رقم اللاعب)</div>
        <input
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1 block">
          <div>الكمية</div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="flex-1 block">
          <div>سعر الوحدة</div>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>
      </div>

      <div>
        المجموع:
        <strong className="ml-2">
          {(Number(quantity) * Number(unitPrice)).toFixed(2)}
        </strong>
      </div>

      <button className="w-full bg-emerald-600 text-white py-2 rounded">
        إنشاء الطلب
      </button>
    </form>
  );
}
