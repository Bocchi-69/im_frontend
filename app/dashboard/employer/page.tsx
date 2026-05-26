"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout, getMe } from "@/lib/authService";
import { employerApi, EmployerProfile, Candidate } from "@/lib/employerApi";
import { jobApi, JobPost, JobApplication } from "@/lib/jobApi";
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
    id: "jobs",
    label: "Job Posts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
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

const MESSAGES = [
  { to: "Maria Santos", preview: "Hi Maria, we'd love to schedule a quick call...", time: "1h ago", unread: true },
  { to: "Kevin Tan", preview: "Thanks for your interest! We reviewed your resume...", time: "2d ago", unread: false },
];

export default function EmployerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    website: "",
    location: "",
    about: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    job_type: "",
    salary_range: "",
    description: "",
    requirements: "",
  });
  const [savingJob, setSavingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [jobMessage, setJobMessage] = useState("");

  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortlisted, setShortlisted] = useState<number[]>([]);
  const [filterRole, setFilterRole] = useState("");

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
        
        const profileData = await employerApi.getProfile();
        setProfile(profileData.profile);

        setCompanyForm({
          company_name: profileData.profile.company_name || "",
          industry: profileData.profile.industry || "",
          company_size: profileData.profile.company_size || "",
          website: profileData.profile.website || "",
          location: profileData.profile.location || "",
          about: profileData.profile.about || "",
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
    if (activeTab === "browse" && candidates.length === 0) {
      const fetchCandidates = async () => {
        setLoadingCandidates(true);
        try {
          const data = await employerApi.getCandidates();
          setCandidates(data.candidates);
        } catch (error) {
          console.error("Failed to fetch candidates:", error);
        } finally {
          setLoadingCandidates(false);
        }
      };
      fetchCandidates();
    }
  }, [activeTab, candidates.length]);

  useEffect(() => {
    if (activeTab === "jobs") {
      loadJobs();
    }
  }, [activeTab]);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await jobApi.getEmployerJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoadingJobs(false);
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
      const result = await employerApi.updateProfile(companyForm);
      setProfile(result.profile);
      setProfileMessage("Profile saved successfully!");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error: any) {
      setProfileMessage(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);
    setJobMessage("");
    try {
      await jobApi.createJob(jobForm);
      setJobMessage("Job posted successfully!");
      setJobForm({ title: "", location: "", job_type: "", salary_range: "", description: "", requirements: "" });
      setShowJobForm(false);
      loadJobs();
      setTimeout(() => setJobMessage(""), 3000);
    } catch (error: any) {
      setJobMessage(error.response?.data?.message || "Failed to post job");
    } finally {
      setSavingJob(false);
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setSavingJob(true);
    setJobMessage("");
    try {
      await jobApi.updateJob(editingJob.id, jobForm);
      setJobMessage("Job updated successfully!");
      setEditingJob(null);
      setJobForm({ title: "", location: "", job_type: "", salary_range: "", description: "", requirements: "" });
      loadJobs();
      setTimeout(() => setJobMessage(""), 3000);
    } catch (error: any) {
      setJobMessage(error.response?.data?.message || "Failed to update job");
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;
    setDeletingJobId(jobId);
    try {
      await jobApi.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      if (selectedJob?.id === jobId) setSelectedJob(null);
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setDeletingJobId(null);
    }
  };

  const viewApplications = async (job: JobPost) => {
    setSelectedJob(job);
    setLoadingApplications(true);
    try {
      const data = await jobApi.getJobApplications(job.id);
      setApplications(data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const updateStatus = async (applicationId: number, status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected') => {
    try {
      await jobApi.updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleShortlist = (id: number) => {
    setShortlisted((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const filtered = candidates.filter(
    (c) =>
      filterRole === "" ||
      c.job_title?.toLowerCase().includes(filterRole.toLowerCase()) ||
      c.location?.toLowerCase().includes(filterRole.toLowerCase())
  );

  const shortlistedCandidates = candidates.filter((c) => shortlisted.includes(c.id));

  const getCompanyInitials = () => {
    if (companyForm.company_name) {
      return companyForm.company_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    }
    return user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "AC";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E8742A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <span className="hidden sm:inline-block text-xs font-medium bg-[#FFF4EE] text-[#E8742A] px-2 py-0.5 rounded-full">Employer</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationDropdown accentColor="#E8742A" />
          {avatarUrl ? (
            <img src={avatarUrl?.startsWith('http') ? avatarUrl : `http://localhost:8000${avatarUrl}`} alt={user?.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E8742A] text-white text-xs font-semibold flex items-center justify-center">
              {getCompanyInitials()}
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
                  activeTab === item.id ? "bg-[#1A1A1A] text-white" : "text-[#666] hover:bg-[#F0EFE8] hover:text-[#1A1A1A]"
                }`}
              >
                {item.icon}
                {item.label}
                {item.id === "messages" && <span className="ml-auto w-2 h-2 rounded-full bg-[#E8742A]" />}
                {item.id === "shortlisted" && shortlisted.length > 0 && (
                  <span className="ml-auto text-xs font-semibold bg-[#F0EFE8] text-[#555] px-1.5 py-0.5 rounded-full">{shortlisted.length}</span>
                )}
                {item.id === "jobs" && jobs.length > 0 && (
                  <span className="ml-auto text-xs font-semibold bg-[#F0EFE8] text-[#555] px-1.5 py-0.5 rounded-full">{jobs.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-[#E5E3DC]">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#888] hover:bg-red-50 hover:text-red-500 transition-all">
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
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Welcome, {companyForm.company_name || user?.name || "there"} 👋</h1>
              <p className="text-sm text-[#888] mb-8">Here's a snapshot of your hiring activity.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Resumes Viewed", value: candidates.length.toString(), change: `${candidates.filter(c => c.has_resume).length} with resume` },
                  { label: "Job Posts", value: jobs.length.toString(), change: "Active listings" },
                  { label: "Shortlisted", value: shortlisted.length.toString(), change: "Candidates saved" },
                  { label: "Applications", value: jobs.reduce((sum, job) => sum + job.applications_count, 0).toString(), change: "Total received" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-[#E5E3DC] rounded-2xl p-4">
                    <p className="text-xs text-[#888] mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
                    <p className="text-xs text-[#E8742A] mt-0.5">{s.change}</p>
                  </div>
                ))}
              </div>
              {jobs.length > 0 && (
                <div className="bg-white border border-[#E5E3DC] rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[#1A1A1A]">Recent Job Posts</h2>
                    <button onClick={() => setActiveTab("jobs")} className="text-xs text-[#4A6CF7] hover:underline">View all</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{job.title}</p>
                          <p className="text-xs text-[#888]">{job.applications_count} applications</p>
                        </div>
                        <button
                          onClick={() => { setActiveTab("jobs"); viewApplications(job); }}
                          className="text-xs font-medium text-[#4A6CF7] border border-[#CCCBC4] px-3 py-1 rounded-full hover:border-[#4A6CF7] transition-colors"
                        >
                          View applicants
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Ready to find your next hire?</p>
                  <p className="text-xs text-white/60 mt-0.5">Post a job or browse candidate resumes.</p>
                </div>
                <button onClick={() => setActiveTab("jobs")} className="bg-white text-[#1A1A1A] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#F0EFE8] transition-colors whitespace-nowrap">
                  Post a job
                </button>
              </div>
            </div>
          )}

          {/* JOB POSTS TAB */}
          {activeTab === "jobs" && !selectedJob && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Job Posts</h1>
                  <p className="text-sm text-[#888]">Manage your job listings and view applications.</p>
                </div>
                <button onClick={() => setShowJobForm(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                  + Post a Job
                </button>
              </div>

              {jobMessage && (
                <div className={`mb-4 text-xs rounded-xl px-4 py-3 ${jobMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                  {jobMessage}
                </div>
              )}

              {/* POST JOB MODAL */}
              {showJobForm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#1A1A1A]">Post a New Job</h2>
                      <button onClick={() => setShowJobForm(false)} className="text-[#888] hover:text-[#1A1A1A]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                    <form onSubmit={handlePostJob} className="flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-medium text-[#444]">Job Title *</label>
                        <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior Frontend Developer" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-[#444]">Location</label>
                          <input type="text" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. Cebu, Philippines" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#444]">Job Type</label>
                          <input type="text" value={jobForm.job_type} onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })} placeholder="e.g. Full-time" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Salary Range</label>
                        <input type="text" value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} placeholder="e.g. ₱60,000 - ₱80,000/month" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Description *</label>
                        <textarea required rows={4} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role, responsibilities, and what you're looking for..." className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none mt-1.5" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Requirements</label>
                        <textarea rows={3} value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} placeholder="List skills, experience, education requirements..." className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none mt-1.5" />
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowJobForm(false)} className="flex-1 border border-[#CCCBC4] text-[#666] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F0EFE8] transition-colors">Cancel</button>
                        <button type="submit" disabled={savingJob} className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50">{savingJob ? "Posting..." : "Post Job"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* EDIT JOB MODAL */}
              {editingJob && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#1A1A1A]">Edit Job Post</h2>
                      <button onClick={() => setEditingJob(null)} className="text-[#888] hover:text-[#1A1A1A]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                    <form onSubmit={handleEditJob} className="flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-medium text-[#444]">Job Title *</label>
                        <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-[#444]">Location</label>
                          <input type="text" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. Cebu, Philippines" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#444]">Job Type</label>
                          <input type="text" value={jobForm.job_type} onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })} placeholder="e.g. Full-time" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Salary Range</label>
                        <input type="text" value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} placeholder="e.g. ₱60,000 - ₱80,000/month" className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] mt-1.5" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Description *</label>
                        <textarea required rows={4} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none mt-1.5" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#444]">Requirements</label>
                        <textarea rows={3} value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none mt-1.5" />
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setEditingJob(null)} className="flex-1 border border-[#CCCBC4] text-[#666] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F0EFE8] transition-colors">Cancel</button>
                        <button type="submit" disabled={savingJob} className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50">{savingJob ? "Saving..." : "Save Changes"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {loadingJobs ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#E8742A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-[#888]">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#888]">
                  <p>No job posts yet. Click "Post a Job" to get started!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-[#1A1A1A]">{job.title}</h3>
                          <p className="text-xs text-[#888] mt-1">{job.location} · {job.job_type} · {job.salary_range}</p>
                        </div>
                        <span className="text-xs font-medium bg-[#F0EFE8] text-[#555] px-3 py-1 rounded-full">{job.applications_count} applicants</span>
                      </div>
                      <p className="text-sm text-[#666] mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <button onClick={() => viewApplications(job)} className="text-xs font-medium text-[#4A6CF7] hover:underline">View applications →</button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setJobForm({
                                title: job.title,
                                location: job.location || "",
                                job_type: job.job_type || "",
                                salary_range: job.salary_range || "",
                                description: job.description,
                                requirements: job.requirements || "",
                              });
                            }}
                            className="text-xs font-medium text-[#555] border border-[#CCCBC4] px-3 py-1.5 rounded-lg hover:border-[#999] hover:text-[#1A1A1A] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deletingJobId === job.id}
                            className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {deletingJobId === job.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* APPLICATION DETAILS VIEW */}
          {activeTab === "jobs" && selectedJob && (
            <div>
              <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-sm text-[#888] hover:text-[#1A1A1A] mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to jobs
              </button>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">{selectedJob.title}</h1>
                <p className="text-sm text-[#888]">{applications.length} applications</p>
              </div>
              {loadingApplications ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#E8742A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-[#888]">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#888]"><p>No applications yet for this job.</p></div>
              ) : (
                <div className="grid gap-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F0EFE8] text-sm font-semibold text-[#555] flex items-center justify-center">
                            {app.candidate.name.split(" ").map((w: string) => w[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A1A]">{app.candidate.name}</p>
                            <p className="text-xs text-[#888]">{app.candidate.job_title || "No job title"} · {app.candidate.location || "No location"}</p>
                          </div>
                        </div>
                        <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as any)} className="text-xs border border-[#CCCBC4] rounded-lg px-2 py-1 text-[#1A1A1A] outline-none">
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      {app.candidate.bio && <p className="text-sm text-[#666] mb-3">{app.candidate.bio}</p>}
                      {app.cover_letter && (
                        <div className="bg-[#FAFAF8] rounded-xl p-3 mb-3">
                          <p className="text-xs font-medium text-[#444] mb-1">Cover Letter</p>
                          <p className="text-xs text-[#666]">{app.cover_letter}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-[#888]">
                          <span>{app.candidate.expected_pay || "Pay not specified"}</span>
                          <span>Applied {app.applied_at}</span>
                        </div>
                        {app.candidate.resume_url && (
                          <a href={app.candidate.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-medium text-[#4A6CF7] hover:underline">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download Resume
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BROWSE TALENT */}
          {activeTab === "browse" && (
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Browse Talent</h1>
              <p className="text-sm text-[#888] mb-6">Find candidates that match your open roles.</p>
              <div className="relative mb-6 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" placeholder="Search by role or location..." value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full border border-[#CCCBC4] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white placeholder:text-[#BBB]" />
              </div>
              {loadingCandidates ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#E8742A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-[#888]">Loading candidates...</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((c) => (
                    <div key={c.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F0EFE8] text-sm font-semibold text-[#555] flex items-center justify-center">
                            {c.name.split(" ").map((w: string) => w[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A1A]">{c.name}</p>
                            <p className="text-xs text-[#888]">{c.job_title || "No job title"} · {c.location || "No location"}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.has_resume ? "bg-green-50 text-green-700" : "bg-[#F0EFE8] text-[#888]"}`}>
                          {c.has_resume ? "Has resume" : "No resume"}
                        </span>
                      </div>
                      {c.bio && <p className="text-xs text-[#666] line-clamp-2">{c.bio}</p>}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{c.expected_pay || "Pay not specified"}</p>
                        <div className="flex gap-2">
                          <button onClick={() => toggleShortlist(c.id)} className={`p-2 rounded-lg border transition-all ${shortlisted.includes(c.id) ? "border-red-200 bg-red-50 text-red-400" : "border-[#CCCBC4] text-[#AAA] hover:border-[#999]"}`} aria-label="Shortlist">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={shortlisted.includes(c.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          </button>
                          <button onClick={() => setActiveTab("messages")} className="text-xs font-medium bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#333] transition-colors">Message</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && !loadingCandidates && (
                    <p className="text-sm text-[#888] col-span-2 py-12 text-center">No candidates match your search.</p>
                  )}
                </div>
              )}
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
                  {shortlistedCandidates.map((c) => (
                    <div key={c.id} className="bg-white border border-[#E5E3DC] rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0EFE8] text-sm font-semibold text-[#555] flex items-center justify-center">
                          {c.name.split(" ").map((w: string) => w[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A]">{c.name}</p>
                          <p className="text-xs text-[#888]">{c.job_title || "No job title"} · {c.expected_pay || "Pay not specified"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveTab("messages")} className="text-xs font-medium bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#333] transition-colors">Message</button>
                        <button onClick={() => toggleShortlist(c.id)} className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Remove</button>
                      </div>
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
                <p className="text-sm text-[#888] mb-4">Your conversations with candidates.</p>
                <MessagesTab currentUserId={user?.id} currentUserRole="employer" />
              </div>
            )}

          {/* COMPANY PROFILE */}
          {activeTab === "company" && (
            <div className="max-w-xl">
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Company Profile</h1>
              <p className="text-sm text-[#888] mb-8">Candidates will see this when you reach out to them.</p>
              <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E3DC] rounded-2xl p-6 flex flex-col gap-5">
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  name={companyForm.company_name || user?.name || "Your Company"}
                  accentColor="#E8742A"
                  onUpdate={setAvatarUrl}
                />
                {[
                  { label: "Company Name", key: "company_name", placeholder: "e.g. Acme Corp", type: "text" },
                  { label: "Industry", key: "industry", placeholder: "e.g. Technology, Finance", type: "text" },
                  { label: "Company Size", key: "company_size", placeholder: "e.g. 10–50 employees", type: "text" },
                  { label: "Website", key: "website", placeholder: "https://acme.com", type: "url" },
                  { label: "Location", key: "location", placeholder: "e.g. Cebu, Philippines", type: "text" },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#444]">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={companyForm[field.key as keyof typeof companyForm]}
                      onChange={(e) => setCompanyForm({ ...companyForm, [field.key]: e.target.value })}
                      className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB]"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#444]">About</label>
                  <textarea rows={3} placeholder="What does your company do?" value={companyForm.about} onChange={(e) => setCompanyForm({ ...companyForm, about: e.target.value })} className="border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white transition-all placeholder:text-[#BBB] resize-none" />
                </div>
                {profileMessage && (
                  <div className={`text-xs rounded-xl px-4 py-3 ${profileMessage.includes("success") ? "bg-green-50 border border-green-200 text-green-600" : "bg-red-50 border border-red-200 text-red-600"}`}>{profileMessage}</div>
                )}
                <button type="submit" disabled={savingProfile} className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingProfile ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}