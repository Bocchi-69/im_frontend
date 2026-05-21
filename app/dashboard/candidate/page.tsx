"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout, getMe } from "@/lib/authService";
import { candidateApi, CandidateProfile } from "@/lib/candidateApi";

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
  const router = useRouter();
  
  // ──────────────────────────────────────────────────────────────────────────
  // NEW: State for user data and profile data
  // ──────────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: State for profile form
  // ──────────────────────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    job_title: "",
    location: "",
    expected_pay: "",
    bio: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: State for resume upload
  // ──────────────────────────────────────────────────────────────────────────
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Load user data and profile on mount
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await getMe();
        setUser(userData.user);

        // Fetch profile data
        const profileData = await candidateApi.getProfile();
        setProfile(profileData.profile);

        // Populate form with existing profile data
        setProfileForm({
          job_title: profileData.profile.job_title || "",
          location: profileData.profile.location || "",
          expected_pay: profileData.profile.expected_pay || "",
          bio: profileData.profile.bio || "",
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Handle logout
  // ──────────────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Handle profile form submission
  // ──────────────────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const result = await candidateApi.updateProfile(profileForm);
      setProfile(result.profile);
      setProfileMessage("Profile saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error: any) {
      setProfileMessage(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Handle resume file upload
  // ──────────────────────────────────────────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setResumeMessage("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeMessage("File size must be less than 5MB");
      return;
    }

    setUploadingResume(true);
    setResumeMessage("");

    try {
      const result = await candidateApi.uploadResume(file);
      
      // Update profile with new resume path
      setProfile((prev) => prev ? { ...prev, resume_path: result.resume_path } : null);
      
      setResumeMessage("Resume uploaded successfully!");
      setTimeout(() => setResumeMessage(""), 3000);
    } catch (error: any) {
      setResumeMessage(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Handle resume deletion
  // ──────────────────────────────────────────────────────────────────────────
  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    setUploadingResume(true);
    setResumeMessage("");

    try {
      await candidateApi.deleteResume();
      
      // Update profile to remove resume path
      setProfile((prev) => prev ? { ...prev, resume_path: null } : null);
      
      setResumeMessage("Resume deleted successfully");
      setTimeout(() => setResumeMessage(""), 3000);
    } catch (error: any) {
      setResumeMessage(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setUploadingResume(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Handle drag and drop
  // ──────────────────────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Show loading spinner while fetching data
  // ──────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4A6CF7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#888]">Loading...</p>
        </div>
      </div>
    );
  }

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
          {/* Avatar - UPDATED to show user initials */}
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold flex items-center justify-center">
            {user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "JD"}
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
          {/* UPDATED: Changed Link to button with handleLogout */}
          <div className="px-3 py-4 border-t border-[#E5E3DC]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#888] hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 sm:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── Main Content ── */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* UPDATED: Show real user name */}
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Good morning, {user?.name?.split(" ")[0] || "there"} 👋</h1>
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

              {/* Resume status - UPDATED to show real resume status */}
              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-[#1A1A1A]">Resume Status</h2>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${profile?.resume_path ? "text-green-700 bg-green-50" : "text-amber-600 bg-amber-50"}`}>
                    {profile?.resume_path ? "Uploaded" : "Missing"}
                  </span>
                </div>
                <p className="text-xs text-[#888]">{profile?.resume_path ? "Your resume is live and visible to employers." : "Upload your resume to start getting discovered by employers."}</p>
                {!profile?.resume_path && (
                  <button onClick={() => setActiveTab("resume")} className="mt-3 text-xs font-medium text-[#4A6CF7] hover:underline">
                    Upload now →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PROFILE - UPDATED with real form handling */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">My Profile</h1>
              <p className="text-sm text-[#888] mb-8">This is what employers see when they view your profile.</p>

              <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E3DC] rounded-2xl p-6 flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1A1A1A] text-white text-lg font-bold flex items-center justify-center">
                    {user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "JD"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{user?.name}</p>
                    <p className="text-xs text-[#888]">{profileForm.job_title || "Add job title"} · {profileForm.location || "Add location"}</p>
                  </div>
                </div>

                {/* Full Name (read-only, from user account) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#888] bg-[#F5F4F0] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#AAA]">Name can only be changed in account settings</p>
                </div>

                {/* Email (read-only, from user account) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#888] bg-[#F5F4F0] cursor-not-allowed"
                  />
                </div>

                {/* Job Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={profileForm.job_title}
                    onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Cebu, Philippines"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                  />
                </div>

                {/* Expected Pay */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Expected Pay (monthly)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₱50,000"
                    value={profileForm.expected_pay}
                    onChange={(e) => setProfileForm({ ...profileForm, expected_pay: e.target.value })}
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                  />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="A short intro about yourself..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none"
                  />
                </div>

                {/* Success/Error message */}
                {profileMessage && (
                  <div className={`text-xs rounded-xl px-4 py-3 ${profileMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                    {profileMessage}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          )}

          {/* RESUME - UPDATED with real file upload */}
          {activeTab === "resume" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Resume</h1>
              <p className="text-sm text-[#888] mb-8">Upload your resume to get discovered by employers.</p>

              {/* Success/Error message */}
              {resumeMessage && (
                <div className={`mb-4 text-xs rounded-xl px-4 py-3 ${resumeMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                  {resumeMessage}
                </div>
              )}

              {!profile?.resume_path ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all ${uploadingResume ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${dragging ? "border-[#4A6CF7] bg-[#EEF0FF]" : "border-[#CCCBC4] bg-white hover:border-[#999] hover:bg-[#FAFAF8]"}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EFE8] flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#1A1A1A]">{uploadingResume ? "Uploading..." : "Drag & drop your resume here"}</p>
                    <p className="text-xs text-[#888] mt-1">PDF or DOCX · Max 5MB</p>
                  </div>
                  <label className={`bg-[#1A1A1A] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#333] transition-colors ${uploadingResume ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    Browse file
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={uploadingResume}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
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
                      <p className="text-sm font-medium text-[#1A1A1A]">{profile.resume_path.split('/').pop()}</p>
                      <p className="text-xs text-[#888]">Uploaded</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteResume}
                    disabled={uploadingResume}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    {uploadingResume ? "Deleting..." : "Remove"}
                  </button>
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