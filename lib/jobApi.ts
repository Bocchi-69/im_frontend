import api from "./authService";

export interface JobPost {
  id: number;
  title: string;
  location: string | null;
  job_type: string | null;
  salary_range: string | null;
  description: string;
  requirements: string | null;
  status: 'open' | 'closed';
  applications_count: number;
  posted_at?: string;
  company?: {
    name: string;
    industry: string | null;
    location: string | null;
  };
  has_applied?: boolean;
}

export interface JobApplication {
  id: number;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  cover_letter: string | null;
  applied_at: string;
  candidate: {
    id: number;
    name: string;
    email: string;
    job_title: string | null;
    location: string | null;
    expected_pay: string | null;
    bio: string | null;
    resume_path: string | null;
    resume_url: string | null;
  };
}

export const jobApi = {
  // ── Employer endpoints ──────────────────────────────────────────────────
  
  // Get all jobs posted by employer
  getEmployerJobs: async (): Promise<{ jobs: JobPost[] }> => {
    const response = await api.get("/employer/jobs");
    return response.data;
  },

  // Create a new job post
  createJob: async (data: {
    title: string;
    location?: string;
    job_type?: string;
    salary_range?: string;
    description: string;
    requirements?: string;
  }): Promise<{ message: string; job: JobPost }> => {
    const response = await api.post("/employer/jobs", data);
    return response.data;
  },

  // Update a job post
  updateJob: async (jobId: number, data: {
    title: string;
    location?: string;
    job_type?: string;
    salary_range?: string;
    description: string;
    requirements?: string;
  }): Promise<{ message: string; job: JobPost }> => {
    const response = await api.put(`/employer/jobs/${jobId}`, data);
    return response.data;
  },

  // Get applications for a specific job
  getJobApplications: async (jobId: number): Promise<{ job: JobPost; applications: JobApplication[] }> => {
    const response = await api.get(`/employer/jobs/${jobId}/applications`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (
    applicationId: number,
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  ): Promise<{ message: string }> => {
    const response = await api.put(`/employer/applications/${applicationId}`, { status });
    return response.data;
  },

  // Delete a job post
  deleteJob: async (jobId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  },

  // ── Candidate endpoints ──────────────────────────────────────────────────
  
  // Browse all open jobs
  getCandidateJobs: async (): Promise<{ jobs: JobPost[] }> => {
    const response = await api.get("/candidate/jobs");
    return response.data;
  },

  // Apply to a job
  applyToJob: async (jobId: number, coverLetter?: string): Promise<{ message: string }> => {
    const response = await api.post(`/candidate/jobs/${jobId}/apply`, {
      cover_letter: coverLetter,
    });
    return response.data;
  },

  // Get candidate's own applications
  getMyApplications: async (): Promise<{ applications: any[] }> => {
    const response = await api.get("/candidate/applications");
    return response.data;
  },
};