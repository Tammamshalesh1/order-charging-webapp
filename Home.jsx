// Home.jsx – الصفحة الرئيسية

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">منصّة شحن التطبيقات والألعاب</h1>
        <p className="text-gray-600 mb-6">
          منصة بسيطة وسريعة لشحن الألعاب والتطبيقات — تنفيذ الطلبات يتم يدويًا من قبل الإدارة.
        </p>

        <div className="space-y-3">
          <Link
            to="/products"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            قائمة المنتجات
          </Link>

          <Link
            to="/orders"
            className="block w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
          >
            طلباتي
          </Link>

          <Link
            to="/admin"
            className="block w-full bg-gray-800 text-white py-2 rounded hover:bg-black"
          >
            لوحة الإدارة
          </Link>
        </div>
      </div>
    </div>
  );
}
