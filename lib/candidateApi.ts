import api from "./authService";

export interface CandidateProfile {
  id: number;
  user_id: number;
  job_title: string | null;
  location: string | null;
  expected_pay: string | null;
  bio: string | null;
  resume_path: string | null;
  profile_views: number;
  profile_views_this_week: number;
  created_at: string;
  updated_at: string;
}

export interface CandidateStats {
  profile_views: number;
  profile_views_change: string;
  total_applications: number;
  pending_applications: number;
  available_jobs: number;
  unread_messages: number;
  total_messages: number;
}

export const candidateApi = {
  // Get candidate profile
  getProfile: async (): Promise<{ profile: CandidateProfile; stats?: CandidateStats }> => {
    const response = await api.get("/candidate/profile");
    return response.data;
  },

  // Update candidate profile
  updateProfile: async (data: {
    job_title?: string;
    location?: string;
    expected_pay?: string;
    bio?: string;
  }): Promise<{ message: string; profile: CandidateProfile }> => {
    const response = await api.put("/candidate/profile", data);
    return response.data;
  },

  // Upload resume
  uploadResume: async (file: File): Promise<{ message: string; resume_path: string; resume_url: string }> => {
    const formData = new FormData();
    formData.append("resume", file);
    const response = await api.post("/candidate/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete resume
  deleteResume: async (): Promise<{ message: string }> => {
    const response = await api.delete("/candidate/resume");
    return response.data;
  },
};