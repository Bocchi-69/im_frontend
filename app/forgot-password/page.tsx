"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">

      {/* ── Top bar ── */}
      <nav className="px-6 h-14 flex items-center border-b border-[#E5E3DC]">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity">
          Folio<span className="text-[#4A6CF7]">.</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {!success ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Forgot password?</h1>
                <p className="mt-1 text-sm text-[#888]">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-[#444]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#888]">
                Remember your password?{" "}
                <Link href="/login" className="text-[#4A6CF7] font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            // Success state
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">Check your email</h1>
              <p className="text-sm text-[#888] mb-6">
                We sent a reset link to <span className="font-medium text-[#1A1A1A]">{email}</span>.
                Check your inbox and follow the instructions.
              </p>
              <Link
                href="/login"
                className="text-sm font-medium text-[#4A6CF7] hover:underline"
              >
                Back to log in
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}