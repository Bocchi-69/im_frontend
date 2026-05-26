import api from "./authService";

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  read_at: string | null;
  created_at: string;
  sender: {
    id: number;
    name: string;
    role: string;
  };
}

export interface Conversation {
  user: {
    id: number;
    name: string;
    role: string;
  };
  last_message: string;
  last_time: string;
  unread_count: number;
}

export const messageApi = {
  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  getMessages: async (userId: number): Promise<{ messages: Message[] }> => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (receiverId: number, message: string): Promise<{ message: Message }> => {
    const response = await api.post("/messages", {
      receiver_id: receiverId,
      message,
    });
    return response.data;
  },

  getUsers: async (): Promise<{ users: { id: number; name: string; role: string }[] }> => {
    const response = await api.get("/messages/users");
    return response.data;
  },
};