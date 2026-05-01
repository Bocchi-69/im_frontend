"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "My Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    id: "applications",
    label: "Applications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const APPLICATIONS = [
  { company: "Acme Corp", role: "Frontend Developer", status: "Viewed", date: "Apr 28", statusColor: "text-[#4A6CF7] bg-[#EEF0FF]" },
  { company: "Bright Labs", role: "React Engineer", status: "Shortlisted", date: "Apr 25", statusColor: "text-green-700 bg-green-50" },
  { company: "Nova Systems", role: "UI Engineer", status: "Pending", date: "Apr 20", statusColor: "text-[#888] bg-[#F0EFE8]" },
  { company: "Drift Co.", role: "Full Stack Dev", status: "Rejected", date: "Apr 15", statusColor: "text-red-500 bg-red-50" },
];

const MESSAGES = [
  { from: "Bright Labs HR", preview: "Hi Juan, we'd love to schedule a quick call...", time: "2h ago", unread: true },
  { from: "Acme Corp Recruiter", preview: "Thanks for applying! We reviewed your resume...", time: "1d ago", unread: false },
  { from: "Nova Systems", preview: "We noticed your profile and think you'd be...", time: "3d ago", unread: false },
];

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setResumeUploaded(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans">

      {/* ── Top Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-[#E5E3DC] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden p-2 rounded-lg hover:bg-[#F0EFE8] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link href="/" className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
            Folio<span className="text-[#4A6CF7]">.</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-[#F0EFE8] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4A6CF7] rounded-full" />
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold flex items-center justify-center">
            JD
          </div>
        </div>
      </header>

      <div className="flex pt-14 min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`fixed sm:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-[#E5E3DC] flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === item.id
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#666] hover:bg-[#F0EFE8] hover:text-[#1A1A1A]"
                }`}
              >
                {item.icon}
                {item.label}
                {item.id === "messages" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#4A6CF7]" />
                )}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-[#E5E3DC]">
            <Link
              href="/login"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#888] hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </Link>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 sm:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── Main Content ── */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Good morning, Juan 👋</h1>
              <p className="text-sm text-[#888] mb-8">Here's what's happening with your job search.</p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Profile Views", value: "124", change: "+12 this week" },
                  { label: "Applications", value: "4", change: "2 active" },
                  { label: "Shortlisted", value: "1", change: "Bright Labs" },
                  { label: "Messages", value: "3", change: "1 unread" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-[#E5E3DC] rounded-2xl p-4">
                    <p className="text-xs text-[#888] mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
                    <p className="text-xs text-[#4A6CF7] mt-0.5">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1A1A1A]">Recent Applications</h2>
                  <button onClick={() => setActiveTab("applications")} className="text-xs text-[#4A6CF7] hover:underline">View all</button>
                </div>
                <div className="flex flex-col gap-3">
                  {APPLICATIONS.slice(0, 3).map((a) => (
                    <div key={a.company} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{a.role}</p>
                        <p className="text-xs text-[#888]">{a.company} · {a.date}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.statusColor}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume status */}
              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-[#1A1A1A]">Resume Status</h2>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${resumeUploaded ? "text-green-700 bg-green-50" : "text-amber-600 bg-amber-50"}`}>
                    {resumeUploaded ? "Uploaded" : "Missing"}
                  </span>
                </div>
                <p className="text-xs text-[#888]">{resumeUploaded ? "Your resume is live and visible to employers." : "Upload your resume to start getting discovered by employers."}</p>
                {!resumeUploaded && (
                  <button onClick={() => setActiveTab("resume")} className="mt-3 text-xs font-medium text-[#4A6CF7] hover:underline">
                    Upload now →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">My Profile</h1>
              <p className="text-sm text-[#888] mb-8">This is what employers see when they view your profile.</p>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1A1A1A] text-white text-lg font-bold flex items-center justify-center">JD</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Juan dela Cruz</p>
                    <p className="text-xs text-[#888]">Frontend Developer · Cebu, PH</p>
                  </div>
                </div>

                {[
                  { label: "Full Name", placeholder: "Juan dela Cruz", type: "text" },
                  { label: "Email", placeholder: "juan@example.com", type: "email" },
                  { label: "Job Title", placeholder: "e.g. Frontend Developer", type: "text" },
                  { label: "Location", placeholder: "e.g. Cebu, Philippines", type: "text" },
                  { label: "Expected Pay (monthly)", placeholder: "e.g. ₱50,000", type: "text" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#444]">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="A short intro about yourself..."
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none"
                  />
                </div>

                <button className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {/* RESUME */}
          {activeTab === "resume" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Resume</h1>
              <p className="text-sm text-[#888] mb-8">Upload your resume to get discovered by employers.</p>

              {!resumeUploaded ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${dragging ? "border-[#4A6CF7] bg-[#EEF0FF]" : "border-[#CCCBC4] bg-white hover:border-[#999] hover:bg-[#FAFAF8]"}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EFE8] flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#1A1A1A]">Drag & drop your resume here</p>
                    <p className="text-xs text-[#888] mt-1">PDF or DOCX · Max 5MB</p>
                  </div>
                  <label className="cursor-pointer bg-[#1A1A1A] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#333] transition-colors">
                    Browse file
                    <input type="file" accept=".pdf,.docx" className="hidden" onChange={() => setResumeUploaded(true)} />
                  </label>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A6CF7" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">resume_juan.pdf</p>
                      <p className="text-xs text-[#888]">Uploaded · Apr 30, 2026</p>
                    </div>
                  </div>
                  <button onClick={() => setResumeUploaded(false)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              )}
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === "applications" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Applications</h1>
              <p className="text-sm text-[#888] mb-8">Track all the roles you've applied to.</p>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-4 px-5 py-3 border-b border-[#E5E3DC] text-xs font-medium text-[#888] uppercase tracking-wide">
                  <span>Role</span><span>Company</span><span>Date</span><span>Status</span>
                </div>
                {APPLICATIONS.map((a, i) => (
                  <div key={i} className={`grid sm:grid-cols-4 px-5 py-4 gap-1 sm:gap-0 items-start sm:items-center ${i !== APPLICATIONS.length - 1 ? "border-b border-[#F0EFE8]" : ""}`}>
                    <p className="text-sm font-medium text-[#1A1A1A]">{a.role}</p>
                    <p className="text-sm text-[#666]">{a.company}</p>
                    <p className="text-xs text-[#888]">{a.date}</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${a.statusColor}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Messages</h1>
              <p className="text-sm text-[#888] mb-8">Conversations from employers who reached out.</p>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl overflow-hidden flex flex-col">
                {MESSAGES.map((m, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#FAFAF8] transition-colors ${i !== MESSAGES.length - 1 ? "border-b border-[#F0EFE8]" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F0EFE8] text-[#555] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {m.from.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm ${m.unread ? "font-semibold text-[#1A1A1A]" : "font-medium text-[#444]"}`}>{m.from}</p>
                        <span className="text-xs text-[#AAA] flex-shrink-0 ml-2">{m.time}</span>
                      </div>
                      <p className="text-xs text-[#888] truncate">{m.preview}</p>
                    </div>
                    {m.unread && <span className="w-2 h-2 rounded-full bg-[#4A6CF7] flex-shrink-0 mt-1.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}