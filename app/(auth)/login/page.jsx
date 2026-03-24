"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem("qs-auth", "true");
      window.location.href = "/";
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 border rounded-lg shadow">
        <h1 className="mb-4 text-lg font-semibold">Enter Access Code</h1>
        <input
          type="password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Enter
        </button>
      </div>
    </div>
  );
}