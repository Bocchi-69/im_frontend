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
    id: "browse",
    label: "Browse Talent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
  {
    id: "company",
    label: "Company Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
];

const CANDIDATES = [
  { name: "Maria Santos", role: "UI/UX Designer", location: "Manila, PH", pay: "₱45,000/mo", skills: ["Figma", "Tailwind", "React"], available: true },
  { name: "Kevin Tan", role: "Backend Developer", location: "Cebu, PH", pay: "₱60,000/mo", skills: ["Laravel", "MySQL", "Docker"], available: true },
  { name: "Rina Cruz", role: "Data Analyst", location: "Remote", pay: "₱40,000/mo", skills: ["Python", "SQL", "Tableau"], available: false },
  { name: "Liam Reyes", role: "Mobile Developer", location: "Davao, PH", pay: "₱55,000/mo", skills: ["Flutter", "Firebase", "Dart"], available: true },
];

const SHORTLISTED = [
  { name: "Maria Santos", role: "UI/UX Designer", note: "Strong portfolio, schedule interview" },
  { name: "Kevin Tan", role: "Backend Developer", note: "Matches Laravel stack perfectly" },
];

const MESSAGES = [
  { to: "Maria Santos", preview: "Hi Maria, we'd love to schedule a quick call...", time: "1h ago", unread: true },
  { to: "Kevin Tan", preview: "Thanks for your interest! We reviewed your resume...", time: "2d ago", unread: false },
];

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortlisted, setShortlisted] = useState<string[]>(["Maria Santos", "Kevin Tan"]);
  const [filterRole, setFilterRole] = useState("");

  const toggleShortlist = (name: string) => {
    setShortlisted((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const filtered = CANDIDATES.filter(
    (c) =>
      filterRole === "" ||
      c.role.toLowerCase().includes(filterRole.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(filterRole.toLowerCase()))
  );

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
          <span className="hidden sm:inline-block text-xs font-medium bg-[#FFF4EE] text-[#E8742A] px-2 py-0.5 rounded-full">Employer</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-[#F0EFE8] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8742A] rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#E8742A] text-white text-xs font-semibold flex items-center justify-center">
            AC
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
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#E8742A]" />
                )}
                {item.id === "shortlisted" && shortlisted.length > 0 && (
                  <span className="ml-auto text-xs font-semibold bg-[#F0EFE8] text-[#555] px-1.5 py-0.5 rounded-full">
                    {shortlisted.length}
                  </span>
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

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 sm:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── Main Content ── */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Welcome, Acme Corp 👋</h1>
              <p className="text-sm text-[#888] mb-8">Here's a snapshot of your hiring activity.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Resumes Viewed", value: "28", change: "+6 this week" },
                  { label: "Shortlisted", value: shortlisted.length.toString(), change: "Candidates saved" },
                  { label: "Messages Sent", value: "5", change: "2 replies" },
                  { label: "Active Roles", value: "3", change: "Hiring now" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-[#E5E3DC] rounded-2xl p-4">
                    <p className="text-xs text-[#888] mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
                    <p className="text-xs text-[#E8742A] mt-0.5">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Shortlisted preview */}
              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1A1A1A]">Shortlisted Candidates</h2>
                  <button onClick={() => setActiveTab("shortlisted")} className="text-xs text-[#4A6CF7] hover:underline">View all</button>
                </div>
                <div className="flex flex-col gap-3">
                  {SHORTLISTED.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F0EFE8] text-xs font-semibold flex items-center justify-center text-[#555]">
                          {c.name.split(" ").map((w) => w[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{c.name}</p>
                          <p className="text-xs text-[#888]">{c.role}</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab("messages")} className="text-xs font-medium text-[#4A6CF7] border border-[#CCCBC4] px-3 py-1 rounded-full hover:border-[#4A6CF7] transition-colors">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browse CTA */}
              <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Ready to find your next hire?</p>
                  <p className="text-xs text-white/60 mt-0.5">Browse resumes from verified candidates.</p>
                </div>
                <button onClick={() => setActiveTab("browse")} className="bg-white text-[#1A1A1A] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#F0EFE8] transition-colors whitespace-nowrap">
                  Browse talent
                </button>
              </div>
            </div>
          )}

          {/* BROWSE TALENT */}
          {activeTab === "browse" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Browse Talent</h1>
              <p className="text-sm text-[#888] mb-6">Find candidates that match your open roles.</p>

              {/* Search/filter */}
              <div className="relative mb-6 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by role or skill..."
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full border border-[#CCCBC4] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white placeholder:text-[#BBB]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((c) => (
                  <div key={c.name} className="bg-white border border-[#E5E3DC] rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0EFE8] text-sm font-semibold text-[#555] flex items-center justify-center">
                          {c.name.split(" ").map((w) => w[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A]">{c.name}</p>
                          <p className="text-xs text-[#888]">{c.role} · {c.location}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.available ? "bg-green-50 text-green-700" : "bg-[#F0EFE8] text-[#888]"}`}>
                        {c.available ? "Available" : "Not available"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <span key={s} className="text-xs bg-[#F0EFE8] text-[#555] px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{c.pay}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleShortlist(c.name)}
                          className={`p-2 rounded-lg border transition-all ${shortlisted.includes(c.name) ? "border-red-200 bg-red-50 text-red-400" : "border-[#CCCBC4] text-[#AAA] hover:border-[#999]"}`}
                          aria-label="Shortlist"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={shortlisted.includes(c.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                        <button onClick={() => setActiveTab("messages")} className="text-xs font-medium bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#333] transition-colors">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-[#888] col-span-2 py-12 text-center">No candidates match your search.</p>
                )}
              </div>
            </div>
          )}

          {/* SHORTLISTED */}
          {activeTab === "shortlisted" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Shortlisted</h1>
              <p className="text-sm text-[#888] mb-8">Candidates you've saved for consideration.</p>

              {shortlisted.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#888]">
                  <p>No candidates shortlisted yet.</p>
                  <button onClick={() => setActiveTab("browse")} className="mt-3 text-[#4A6CF7] hover:underline">Browse talent →</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {CANDIDATES.filter((c) => shortlisted.includes(c.name)).map((c) => (
                    <div key={c.name} className="bg-white border border-[#E5E3DC] rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0EFE8] text-sm font-semibold text-[#555] flex items-center justify-center">
                          {c.name.split(" ").map((w) => w[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A]">{c.name}</p>
                          <p className="text-xs text-[#888]">{c.role} · {c.pay}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveTab("messages")} className="text-xs font-medium bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#333] transition-colors">
                          Message
                        </button>
                        <button onClick={() => toggleShortlist(c.name)} className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Messages</h1>
              <p className="text-sm text-[#888] mb-8">Your conversations with candidates.</p>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl overflow-hidden flex flex-col">
                {MESSAGES.map((m, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#FAFAF8] transition-colors ${i !== MESSAGES.length - 1 ? "border-b border-[#F0EFE8]" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFF4EE] text-[#E8742A] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {m.to.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm ${m.unread ? "font-semibold text-[#1A1A1A]" : "font-medium text-[#444]"}`}>{m.to}</p>
                        <span className="text-xs text-[#AAA] ml-2 flex-shrink-0">{m.time}</span>
                      </div>
                      <p className="text-xs text-[#888] truncate">{m.preview}</p>
                    </div>
                    {m.unread && <span className="w-2 h-2 rounded-full bg-[#E8742A] flex-shrink-0 mt-1.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COMPANY PROFILE */}
          {activeTab === "company" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Company Profile</h1>
              <p className="text-sm text-[#888] mb-8">Candidates will see this when you reach out to them.</p>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8742A] text-white text-lg font-bold flex items-center justify-center">AC</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Acme Corp</p>
                    <p className="text-xs text-[#888]">Tech Company · Cebu, PH</p>
                  </div>
                </div>

                {[
                  { label: "Company Name", placeholder: "Acme Corp", type: "text" },
                  { label: "Industry", placeholder: "e.g. Technology, Finance", type: "text" },
                  { label: "Company Size", placeholder: "e.g. 10–50 employees", type: "text" },
                  { label: "Website", placeholder: "https://acme.com", type: "url" },
                  { label: "Location", placeholder: "e.g. Cebu, Philippines", type: "text" },
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
                  <label className="text-xs font-medium text-[#444]">About</label>
                  <textarea
                    rows={3}
                    placeholder="What does your company do? What kind of talent are you looking for?"
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none"
                  />
                </div>

                <button className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}