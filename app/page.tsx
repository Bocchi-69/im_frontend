"use client";

import { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] font-sans">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#E5E3DC]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            Folio<span className="text-[#4A6CF7]">.</span>
          </span>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6 text-sm text-[#555]">
            <a href="#how" className="hover:text-[#1A1A1A] transition-colors font-bold">How It Works</a>
            <a href="#roles" className="hover:text-[#1A1A1A] transition-colors font-bold">For you</a>
            <a
              href="/login"
              className="border border-[#CCCBC4] text-[#1A1A1A] text-sm px-4 py-1.5 rounded-full hover:border-[#999] transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-[#1A1A1A] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#333] transition-colors"
            >
              Sign up
            </a>
          </div>

          {/* Mobile: auth buttons + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="/login"
              className="border border-[#CCCBC4] text-[#1A1A1A] text-xs px-3 py-1.5 rounded-full hover:border-[#999] transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-[#1A1A1A] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#333] transition-colors"
            >
              Sign up
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 p-2 rounded-lg hover:bg-[#F0EFE8] transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-[#E5E3DC] bg-[#FAFAF8] px-6 py-4 flex flex-col gap-4 text-sm text-[#555]">
            <a href="#how" onClick={() => setMenuOpen(false)} className="hover:text-[#1A1A1A] transition-colors">
              How it works
            </a>
            <a href="#roles" onClick={() => setMenuOpen(false)} className="hover:text-[#1A1A1A] transition-colors">
              For you
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] max-w-2xl mx-auto">
          Your resume<br />
          <span className="text-[#4A6CF7]">speaks first.</span>
        </h1>
        <p className="mt-5 text-lg text-[#666] max-w-xl mx-auto leading-relaxed">
          Upload your resume, set your expected pay, and let employers come to you —
          or browse verified talent ready to hire.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <a
            href="/signup"
            className="w-full sm:w-auto text-center bg-[#1A1A1A] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#333] transition-colors"
          >
            Join us now
          </a>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <div className="border-y border-[#E5E3DC] bg-white py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[#888]">
          {["2,400+ resumes uploaded", "Resume-first hiring", "No endless forms", "Expected pay visible to employers"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7] inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#4A6CF7] mb-3 text-center">
          How it works
        </h2>
        <p className="text-3xl font-bold text-center mb-14 tracking-tight">
          Three steps. That&apos;s it.
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Upload your resume",
              desc: "Drop your PDF or DOCX. We parse it and create your public profile automatically.",
            },
            {
              num: "02",
              title: "Set your terms",
              desc: "Add your expected pay range, availability, location preference, and job type.",
            },
            {
              num: "03",
              title: "Get discovered",
              desc: "Employers browse resumes directly. No middleman, no filtering by keywords.",
            },
          ].map((s) => (
            <div key={s.num} className="bg-white border border-[#E5E3DC] rounded-2xl p-7">
              <span className="text-4xl font-bold text-[#E8E7E0]">{s.num}</span>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-[#777] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For candidates & hirers ── */}
      <section id="roles" className="py-24 px-6 bg-white border-y border-[#E5E3DC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Built for both sides of the table
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Candidate */}
            <div className="rounded-2xl border border-[#E5E3DC] p-8">
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6CF7" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">For job seekers</h3>
              <ul className="space-y-2 text-sm text-[#666]">
                {[
                  "Upload once, visible to all employers",
                  "Set your own salary expectations",
                  "Control your availability status",
                  "No more filling out the same form 50 times",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#4A6CF7]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Hirer */}
            <div className="rounded-2xl border border-[#E5E3DC] p-8">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4EE] flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8742A" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">For employers</h3>
              <ul className="space-y-2 text-sm text-[#666]">
                {[
                  "Browse real resumes, not keyword-stuffed profiles",
                  "See salary expectations upfront",
                  "Filter by role, skills, and location",
                  "Reach out directly with no platform friction",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#E8742A]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E3DC] py-8 px-6 text-center text-xs text-[#AAA]">
        <p>© {new Date().getFullYear()} Folio. Made for people who lead with their work.</p>
      </footer>
    </main>
  );
}