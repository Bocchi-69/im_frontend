"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout, getMe } from "@/lib/authService";
import { candidateApi, CandidateProfile, CandidateStats } from "@/lib/candidateApi";
import { jobApi, JobPost } from "@/lib/jobApi";
import MessagesTab from "@/components/MessagesTab";
import NotificationDropdown from "@/components/NotificationDropdown";
import AvatarUpload from "@/components/AvatarUpload";

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
    id: "jobs",
    label: "Browse Jobs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "applications",
    label: "My Applications",
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

const MESSAGES = [
  { from: "Bright Labs HR", preview: "Hi, we'd love to schedule a quick call...", time: "2h ago", unread: true },
  { from: "Acme Corp Recruiter", preview: "Thanks for applying! We reviewed your resume...", time: "1d ago", unread: false },
  { from: "Nova Systems", preview: "We noticed your profile and think you'd be...", time: "3d ago", unread: false },
];

export default function CandidateDashboard() {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [stats, setStats] = useState<CandidateStats>({
    profile_views: 0,
    profile_views_change: "+0 this week",
    total_applications: 0,
    pending_applications: 0,
    available_jobs: 0,
    unread_messages: 0,
    total_messages: 0,
  });
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    job_title: "",
    location: "",
    expected_pay: "",
    bio: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userData = await getMe();
        setUser(userData.user);
        setAvatarUrl(userData.user.avatar_url || null);

        const profileData = await candidateApi.getProfile();
        setProfile(profileData.profile);
        if (profileData.stats) {
          setStats(profileData.stats);
        }

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

  useEffect(() => {
    if (activeTab === "jobs") {
      loadJobs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
  }, [activeTab]);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await jobApi.getCandidateJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const data = await jobApi.getMyApplications();
      setMyApplications(data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const result = await candidateApi.updateProfile(profileForm);
      setProfile(result.profile);
      setProfileMessage("Profile saved successfully!");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error: any) {
      setProfileMessage(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setResumeMessage("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeMessage("File size must be less than 5MB");
      return;
    }

    setUploadingResume(true);
    setResumeMessage("");

    try {
      const result = await candidateApi.uploadResume(file);
      setProfile((prev) => prev ? { ...prev, resume_path: result.resume_path } : null);
      setResumeMessage("Resume uploaded successfully!");
      setTimeout(() => setResumeMessage(""), 3000);
    } catch (error: any) {
      setResumeMessage(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    setUploadingResume(true);
    setResumeMessage("");

    try {
      await candidateApi.deleteResume();
      setProfile((prev) => prev ? { ...prev, resume_path: null } : null);
      setResumeMessage("Resume deleted successfully");
      setTimeout(() => setResumeMessage(""), 3000);
    } catch (error: any) {
      setResumeMessage(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setApplying(true);
    setApplyMessage("");

    try {
      await jobApi.applyToJob(selectedJob.id, coverLetter);
      setApplyMessage("Application submitted successfully!");
      setCoverLetter("");
      
      setJobs(prev => prev.map(job => 
        job.id === selectedJob.id ? { ...job, has_applied: true } : job
      ));
      
      setTimeout(() => {
        setApplyMessage("");
        setSelectedJob(null);
      }, 2000);
    } catch (error: any) {
      setApplyMessage(error.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

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
          <NotificationDropdown accentColor="#4A6CF7" />
            {avatarUrl ? (
              <img src={avatarUrl?.startsWith('http') ? avatarUrl : `http://localhost:8000${avatarUrl}`} alt={user?.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold flex items-center justify-center">
                {user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "JD"}
              </div>
            )}
        </div>
      </header>

      <div className="flex pt-14 min-h-screen">

        <aside className={`fixed sm:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-[#E5E3DC] flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); setSelectedJob(null); }}
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
                {item.id === "applications" && myApplications.length > 0 && (
                  <span className="ml-auto text-xs font-semibold bg-[#F0EFE8] text-[#555] px-1.5 py-0.5 rounded-full">
                    {myApplications.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
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

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 sm:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Good morning, {user?.name?.split(" ")[0] || "there"} 👋</h1>
              <p className="text-sm text-[#888] mb-8">Here's what's happening with your job search.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Profile Views", value: stats.profile_views.toString(), change: stats.profile_views_change },
                  { label: "Applications", value: stats.total_applications.toString(), change: `${stats.pending_applications} pending` },
                  { label: "Available Jobs", value: stats.available_jobs.toString(), change: "Browse now" },
                  { label: "Messages", value: stats.total_messages.toString(), change: `${stats.unread_messages} unread` },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-[#E5E3DC] rounded-2xl p-4">
                    <p className="text-xs text-[#888] mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
                    <p className="text-xs text-[#4A6CF7] mt-0.5">{s.change}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5 mb-6">
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

              <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Looking for your next opportunity?</p>
                  <p className="text-xs text-white/60 mt-0.5">Browse {jobs.length} open positions from top companies.</p>
                </div>
                <button onClick={() => setActiveTab("jobs")} className="bg-white text-[#1A1A1A] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#F0EFE8] transition-colors whitespace-nowrap">
                  Browse jobs
                </button>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">My Profile</h1>
              <p className="text-sm text-[#888] mb-8">This is what employers see when they view your profile.</p>

              <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E3DC] rounded-2xl p-6 flex flex-col gap-5">
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  name={user?.name || ""}
                  accentColor="#4A6CF7"
                  onUpdate={setAvatarUrl}
                />

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

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#888] bg-[#F5F4F0] cursor-not-allowed"
                  />
                </div>

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

                {profileMessage && (
                  <div className={`text-xs rounded-xl px-4 py-3 ${profileMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                    {profileMessage}
                  </div>
                )}

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

          {/* RESUME */}
          {activeTab === "resume" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Resume</h1>
              <p className="text-sm text-[#888] mb-8">Upload your resume to get discovered by employers.</p>

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

          {/* BROWSE JOBS TAB */}
          {activeTab === "jobs" && !selectedJob && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Browse Jobs</h1>
              <p className="text-sm text-[#888] mb-6">Find opportunities that match your skills and interests.</p>

              {loadingJobs ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#4A6CF7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-[#888]">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#888]">
                  <p>No job openings available at the moment. Check back soon!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-[#1A1A1A]">{job.title}</h3>
                          <p className="text-sm text-[#666] mt-1">{job.company?.name}</p>
                          <p className="text-xs text-[#888] mt-1">
                            {job.location} · {job.job_type} · {job.salary_range}
                          </p>
                        </div>
                        {job.has_applied ? (
                          <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="text-xs font-medium bg-[#4A6CF7] text-white px-4 py-2 rounded-lg hover:bg-[#3A5CE7] transition-colors"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-[#666] mb-3 line-clamp-2">{job.description}</p>
                      <p className="text-xs text-[#888]">Posted {job.posted_at} · {job.applications_count} applicants</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* JOB APPLICATION MODAL */}
          {activeTab === "jobs" && selectedJob && (
            <div>
              <button
                onClick={() => setSelectedJob(null)}
                className="flex items-center gap-2 text-sm text-[#888] hover:text-[#1A1A1A] mb-6"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to jobs
              </button>

              <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">{selectedJob.title}</h2>
                <p className="text-sm text-[#666] mb-1">{selectedJob.company?.name}</p>
                <p className="text-xs text-[#888] mb-6">
                  {selectedJob.location} · {selectedJob.job_type} · {selectedJob.salary_range}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">Description</h3>
                  <p className="text-sm text-[#666] whitespace-pre-line">{selectedJob.description}</p>
                </div>

                {selectedJob.requirements && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">Requirements</h3>
                    <p className="text-sm text-[#666] whitespace-pre-line">{selectedJob.requirements}</p>
                  </div>
                )}

                <form onSubmit={handleApply} className="border-t border-[#E5E3DC] pt-6">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Apply for this position</h3>
                  
                  <div className="mb-4">
                    <label className="text-xs font-medium text-[#444]">Cover Letter (Optional)</label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell the employer why you're a great fit for this role..."
                      className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none mt-1.5"
                    />
                  </div>

                  {applyMessage && (
                    <div className={`mb-4 text-xs rounded-xl px-4 py-3 ${applyMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                      {applyMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={applying || !profile?.resume_path}
                    className="w-full bg-[#4A6CF7] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#3A5CE7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? "Submitting..." : !profile?.resume_path ? "Upload resume first" : "Submit Application"}
                  </button>
                  
                  {!profile?.resume_path && (
                    <p className="text-xs text-[#888] text-center mt-2">
                      You need to <button onClick={() => setActiveTab("resume")} className="text-[#4A6CF7] hover:underline">upload your resume</button> before applying.
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* MY APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">My Applications</h1>
              <p className="text-sm text-[#888] mb-8">Track the status of your job applications.</p>

              {loadingApplications ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#4A6CF7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-[#888]">Loading applications...</p>
                </div>
              ) : myApplications.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#888]">
                  <p>You haven't applied to any jobs yet.</p>
                  <button onClick={() => setActiveTab("jobs")} className="mt-3 text-[#4A6CF7] hover:underline">Browse jobs →</button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myApplications.map((app) => (
                    <div key={app.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-[#1A1A1A]">{app.job.title}</h3>
                          <p className="text-sm text-[#666] mt-1">{app.job.company}</p>
                          <p className="text-xs text-[#888] mt-1">
                            {app.job.location} · {app.job.salary_range}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          app.status === 'shortlisted' ? 'bg-green-50 text-green-700' :
                          app.status === 'reviewed' ? 'bg-blue-50 text-blue-700' :
                          app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                          'bg-[#F0EFE8] text-[#555]'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      {app.cover_letter && (
                        <div className="bg-[#FAFAF8] rounded-xl p-3 mb-3">
                          <p className="text-xs font-medium text-[#444] mb-1">Your Cover Letter</p>
                          <p className="text-xs text-[#666] line-clamp-2">{app.cover_letter}</p>
                        </div>
                      )}
                      <p className="text-xs text-[#888]">Applied {app.applied_at}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Messages</h1>
              <p className="text-sm text-[#888] mb-4">Conversations from employers who reached out.</p>
              <MessagesTab currentUserId={user?.id} currentUserRole="candidate" />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}