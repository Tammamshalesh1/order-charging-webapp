import React from "react";

export default function Wallet({ session }) {
  if (!session)
    return (
      <div className="p-6 text-red-600">يجب تسجيل الدخول لعرض رصيدك</div>
    );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">رصيدك الحالي</h2>

      <div className="p-4 border rounded text-lg bg-gray-100">
        {session.me.wallet} ليرة
      </div>

      <p className="mt-4 text-gray-600">
        لشحن رصيدك يرجى التواصل مع الإدارة عبر الواتساب.
      </p>
    </div>
  );
}
