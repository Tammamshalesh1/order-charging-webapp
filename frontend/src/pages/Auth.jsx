import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Auth({ login, register, session }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  if (session) return <Navigate to="/" />;

  async function submit(e) {
    e.preventDefault();
    setError("");

    let r;
    if (mode === "login") {
      r = await login(form);
    } else {
      r = await register(form);
    }

    if (!r.ok) setError(r.error);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <input
            placeholder="الاسم"
            className="border w-full px-3 py-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          placeholder="البريد الإلكتروني"
          className="border w-full px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="كلمة المرور"
          type="password"
          className="border w-full px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <div className="text-red-600">{error}</div>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          type="submit"
        >
          {mode === "login" ? "دخول" : "تسجيل"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-blue-600"
      >
        {mode === "login" ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
      </button>
    </div>
  );
}
