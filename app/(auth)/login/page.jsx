"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    const expectedPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;

    if (!expectedPassword) {
      setMessage("Password variable is not loading.");
      return;
    }

    if (password === expectedPassword) {
      document.cookie = "qs-auth=true; path=/; max-age=86400";
      setMessage("Access granted. Redirecting...");
      window.location.href = "/";
    } else {
      setMessage("Wrong password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold">Enter Access Code</h1>

        <input
          type="password"
          className="mb-3 w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          placeholder="Password"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded bg-black p-2 text-white"
        >
          Enter
        </button>

        {message ? (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        ) : null}
      </div>
    </div>
  );
}