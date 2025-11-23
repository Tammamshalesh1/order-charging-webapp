import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Wallet from "./pages/Wallet";
import OrderForm from "./pages/OrderForm";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

const API = "https://order-charging-webap.onrender.com";

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

  async function login({ email, password }) {
    const r = await apiPost("/api/auth/login", { email, password });
    if (r.error) return { ok: false, error: r.error };

    localStorage.setItem("token", r.token);
    localStorage.setItem("me", JSON.stringify(r.user));

    setSession({ token: r.token, me: r.user });

    return { ok: true };
  }

  async function register({ email, password, name }) {
    const r = await apiPost("/api/auth/register", { email, password, name });
    if (r.error) return { ok: false, error: r.error };

    localStorage.setItem("token", r.token);
    localStorage.setItem("me", JSON.stringify(r.user));

    setSession({ token: r.token, me: r.user });

    return { ok: true };
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    setSession(null);
  }

  async function placeOrder(orderData) {
    return apiPost("/api/orders", orderData, token);
  }

  async function fetchMyOrders() {
    return apiGet("/api/orders/my", token);
  }

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

        <Route path="/wallet" element={<Wallet session={session} />} />

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

        <Route path="/products" element={<Products fetchProducts={fetchProducts} />} />

        <Route path="/orders" element={<Orders fetchMyOrders={fetchMyOrders} />} />

        <Route
          path="/admin"
          element={
            <Admin session={session} logout={logout} apiGet={apiGet} apiPost={apiPost} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
