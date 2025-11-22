import React, { useState } from "react";
import { apiPost } from "../api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const res = await apiPost("/auth/register", { name, email, password });
    if (!res.ok) return alert(res.error);
    onLogin({ id: res.userId, email, name, wallet: 0 });
  }

  async function handleLogin(e) {
    e.preventDefault();
    const res = await apiPost("/auth/login", { email, password });
    if (!res.ok) return alert(res.error);
    onLogin(res.user);
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "تسجيل دخول" : "إنشاء حساب"}
      </h2>

      <form onSubmit={mode === "login" ? handleLogin : handleRegister}>

        {mode === "register" && (
          <input
            placeholder="الاسم"
            className="border p-2 w-full mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          placeholder="البريد"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="كلمة المرور"
          type="password"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          {mode === "login" ? "دخول" : "تسجيل"}
        </button>
      </form>

      <button
        className="text-blue-600 mt-3"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "إنشاء حساب جديد"
          : "لديك حساب؟ تسجّل دخول"}
      </button>
    </div>
  );
}
