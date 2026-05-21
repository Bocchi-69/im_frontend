import api from "./authService";
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);
export interface EmployerProfile {
  id: number;
  user_id: number;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  location: string | null;
  about: string | null;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  location: string | null;
  expected_pay: string | null;
  bio: string | null;
  has_resume: boolean;
}

export const employerApi = {
  // Get employer profile
  getProfile: async (): Promise<{ profile: EmployerProfile }> => {
    const response = await api.get("/employer/profile");
    return response.data;
  },

  // Update employer profile
  updateProfile: async (data: {
    company_name?: string;
    industry?: string;
    company_size?: string;
    website?: string;
    location?: string;
    about?: string;
  }): Promise<{ message: string; profile: EmployerProfile }> => {
    const response = await api.put("/employer/profile", data);
    return response.data;
  },

  // Browse all candidates
  getCandidates: async (): Promise<{ candidates: Candidate[] }> => {
    const response = await api.get("/employer/candidates");
    return response.data;
  },
};