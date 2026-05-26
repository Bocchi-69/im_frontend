import api from "./authService";

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string | null;
  data: any | null;
  read_at: string | null;
  is_read: boolean;
  created_at: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<{ notifications: Notification[]; unread_count: number }> => {
    const response = await api.get("/notifications");
    return response.data;
  },

  markRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await api.put("/notifications/read-all");
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};

export const avatarApi = {
  upload: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post("/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (): Promise<void> => {
    await api.delete("/avatar");
  },
};