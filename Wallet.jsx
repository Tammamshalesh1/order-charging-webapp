// Wallet.jsx – إدارة رصيد المستخدم
import React, { useState } from "react";

export default function Wallet({ user, onTopUp }) {
  const [amount, setAmount] = useState(10);

  function handleTopUp() {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      alert("أدخل مبلغًا صحيحًا");
      return;
    }

    onTopUp(num);
  }

  return (
    <div>
      <div className="mb-2">
        المستخدم: <strong>{user.name}</strong>
      </div>

      <div className="mb-3">
        الرصيد الحالي:
        <strong className="ml-2">{user.wallet.toFixed(2)}</strong>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-2 py-2 w-full"
        />

        <button
          onClick={handleTopUp}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          شحن
        </button>
      </div>
    </div>
  );
}
