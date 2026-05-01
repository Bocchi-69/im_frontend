"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Read token and email from the URL query params
  // e.g. /reset-password?token=abc123&email=user@example.com
  useEffect(() => {
    setToken(searchParams.get("token") ?? "");
    setEmail(searchParams.get("email") ?? "");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-500 mb-4">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="text-sm text-[#4A6CF7] hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <>
      {!success ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Reset your password</h1>
            <p className="mt-1 text-sm text-[#888]">
              Enter a new password for <span className="font-medium text-[#1A1A1A]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#444]">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555] transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password_confirmation" className="text-sm font-medium text-[#444]">
                Confirm new password
              </label>
              <input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Repeat your new password"
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
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">Password reset!</h1>
          <p className="text-sm text-[#888]">Redirecting you to log in…</p>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <nav className="px-6 h-14 flex items-center border-b border-[#E5E3DC]">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity">
          Folio<span className="text-[#4A6CF7]">.</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Suspense fallback={<p className="text-sm text-[#888] text-center">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}