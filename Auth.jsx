// Auth.jsx – التسجيل وتسجيل الدخول
import React, { useState } from "react";

export default function Auth({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setMode("login")}
        >
          تسجيل دخول
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "register" ? "bg-green-600 text-white" : "bg-gray-100"}`}
          onClick={() => setMode("register")}
        >
          إنشاء حساب
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <RegisterForm onRegister={onRegister} />
      )}
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    const res = onLogin({ email, password });
    if (!res.ok) alert(res.error);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-2 py-2"
      />

      <input
        required
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-2 py-2"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        دخول
      </button>
    </form>
  );
}

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    const res = onRegister({ email, password, name });
    if (!res.ok) alert(res.error);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        placeholder="الاسم"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-2 py-2"
      />

      <input
        required
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-2 py-2"
      />

      <input
        required
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-2 py-2"
      />

      <button className="w-full bg-green-600 text-white py-2 rounded">
        إنشاء الحساب
      </button>
    </form>
  );
}
