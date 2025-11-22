import React, { useState } from "react";
import { apiPost } from "../api";

export default function Wallet({ user, setUser }) {
  const [amount, setAmount] = useState(10);

  async function addBalance() {
    const res = await apiPost("/admin/wallet", {
      userId: user.id,
      amount,
    });
    if (res.ok) {
      setUser({ ...user, wallet: user.wallet + amount });
      alert("تم إضافة الرصيد للمستخدم");
    }
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="font-semibold text-lg">💰 رصيدك</h3>

      <p className="mt-2 text-xl font-bold">{user.wallet} ليرة</p>

      <div className="mt-3 flex gap-2">
        <input
          type="number"
          className="border p-2 rounded w-24"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={addBalance}
        >
          إضافة رصيد (خاصة بالادمن)
        </button>
      </div>
    </div>
  );
}
