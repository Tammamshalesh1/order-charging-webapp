import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import Wallet from "./Wallet";
import OrderForm from "./OrderForm";
import Products from "./Products";
import Orders from "./Orders";
import Admin from "./Admin";

// رابط الباك-إند
const API = "https://order-charging-webap.onrender.com";

// دوال الطلبات
async function apiGet(path, token) {
  const res = await fetch(API + path, {
    headers: token ? { Authorization: "Bearer " + token } : {},
  });
  return res.json();
}

async function apiPost(path, data, token) {
  const res = await fetch(API + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("token");
    const me = localStorage.getItem("me");
    return token && me ? { token, me: JSON.parse(me) } : null;
  });

  const token = session?.token;

  // تسجيل الدخول
  async function login({ email, password }) {
    const r = await apiPost("/api/auth/login", { email, password });
    if (r.error) return { ok: false, error: r.error };

    localStorage.setItem("token", r.token);
    localStorage.setItem("me", JSON.stringify(r.user));

    setSession({ token: r.token, me: r.user });

    return { ok: true };
  }

  // تسجيل حساب جديد
  async function register({ email, password, name }) {
    const r = await apiPost("/api/auth/register", { email, password, name });
    if (r.error) return { ok: false, error: r.error };

    localStorage.setItem("token", r.token);
    localStorage.setItem("me", JSON.stringify(r.user));

    setSession({ token: r.token, me: r.user });

    return { ok: true };
  }

  // تسجيل الخروج
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    setSession(null);
  }

  // تنفيذ طلب شحن
  async function placeOrder(orderData) {
    const r = await apiPost("/api/orders", orderData, token);
    return r;
  }

  // جلب طلباتي
  async function fetchMyOrders() {
    const r = await apiGet("/api/orders/my", token);
    return r;
  }

  // جلب المنتجات
  async function fetchProducts() {
    return apiGet("/api/products");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home session={session} logout={logout} />} />

        <Route
          path="/auth"
          element={<Auth login={login} register={register} session={session} />}
        />

        <Route
          path="/wallet"
          element={<Wallet session={session} />}
        />

        <Route
          path="/order"
          element={
            <OrderForm
              session={session}
              placeOrder={placeOrder}
              fetchProducts={fetchProducts}
            />
          }
        />

        <Route
          path="/products"
          element={<Products fetchProducts={fetchProducts} />}
        />

        <Route
          path="/orders"
          element={<Orders fetchMyOrders={fetchMyOrders} />}
        />

        <Route
          path="/admin"
          element={
            <Admin
              session={session}
              logout={logout}
              apiGet={apiGet}
              apiPost={apiPost}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
