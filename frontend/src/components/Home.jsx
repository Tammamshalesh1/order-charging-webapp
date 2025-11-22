import React from "react";
import { Link } from "react-router-dom";

export default function Home({ session, logout }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">مرحباً بك في نظام شحن الألماس</h1>

      {!session ? (
        <>
          <p>لإجراء الطلبات يجب تسجيل الدخول</p>
          <Link
            to="/auth"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            تسجيل دخول / إنشاء حساب
          </Link>
        </>
      ) : (
        <>
          <p>مرحباً {session.me.name}</p>

          <div className="mt-4 space-y-3">
            <Link
              to="/order"
              className="block bg-green-600 text-white px-4 py-2 rounded"
            >
              إنشاء طلب شحن
            </Link>

            <Link
              to="/orders"
              className="block bg-blue-600 text-white px-4 py-2 rounded"
            >
              طلباتي
            </Link>

            <Link
              to="/wallet"
              className="block bg-purple-600 text-white px-4 py-2 rounded"
            >
              الرصيد
            </Link>

            {session.me.isAdmin && (
              <Link
                to="/admin"
                className="block bg-red-600 text-white px-4 py-2 rounded"
              >
                لوحة التحكم
              </Link>
            )}

            <button
              onClick={logout}
              className="block bg-gray-700 text-white px-4 py-2 rounded"
            >
              تسجيل خروج
            </button>
          </div>
        </>
      )}
    </div>
  );
}
