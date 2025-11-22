import React, { useState } from "react";

export default function OrderForm({ session }) {
  const [form, setForm] = useState({
    productId: "",
    accountId: "",
    amount: "",
  });

  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch(
      `${import.meta.env.VITE_API}/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.token,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (data.ok) {
      setMsg("تم إرسال الطلب بنجاح");
      setForm({ productId: "", accountId: "", amount: "" });
    } else {
      setMsg(data.error || "حدث خطأ");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">إنشاء طلب شحن</h2>

      <form className="space-y-4" onSubmit={submit}>
        <input
          className="border w-full px-3 py-2 rounded"
          placeholder="معرف المنتج (Product ID)"
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
        />

        <input
          className="border w-full px-3 py-2 rounded"
          placeholder="معرف حسابك داخل اللعبة"
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        />

        <input
          className="border w-full px-3 py-2 rounded"
          placeholder="عدد الألماس"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          إرسال الطلب
        </button>
      </form>

      {msg && <div className="mt-4 text-center text-blue-700">{msg}</div>}
    </div>
  );
}
