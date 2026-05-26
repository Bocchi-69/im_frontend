"use client";

import { useEffect, useRef, useState } from "react";
import { messageApi, Message, Conversation } from "@/lib/messageApi";
import { getEcho, disconnectEcho } from "@/lib/echo";

interface Props {
  currentUserId: number;
  currentUserRole: string;
}

export default function MessagesTab({ currentUserId, currentUserRole }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; role: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string; role: string }[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const accentColor = currentUserRole === "employer" ? "#E8742A" : "#4A6CF7";

  useEffect(() => {
    loadConversations();

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const echo = getEcho(token);
    echo.private(`chat.${currentUserId}`)
      .listen("NewMessage", (e: { message: Message }) => {
        // Update conversations
        setConversations(prev => {
          const existing = prev.find(c => c.user.id === e.message.sender_id);
          if (existing) {
            return prev.map(c =>
              c.user.id === e.message.sender_id
                ? { ...c, last_message: e.message.message, last_time: "Just now", unread_count: c.unread_count + 1 }
                : c
            );
          }
          return [{
            user: e.message.sender,
            last_message: e.message.message,
            last_time: "Just now",
            unread_count: 1,
          }, ...prev];
        });

        // If chat is open with this sender, add message
        setSelectedUser(prev => {
          if (prev?.id === e.message.sender_id) {
            setMessages(msgs => [...msgs, e.message]);
          }
          return prev;
        });
      });

    return () => {
      disconnectEcho();
    };
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const data = await messageApi.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const openConversation = async (user: { id: number; name: string; role: string }) => {
    setSelectedUser(user);
    setLoadingMessages(true);
    try {
      const data = await messageApi.getMessages(user.id);
      setMessages(data.messages);
      // Mark as read in conversations list
      setConversations(prev =>
        prev.map(c => c.user.id === user.id ? { ...c, unread_count: 0 } : c)
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    setSending(true);
    try {
      const data = await messageApi.sendMessage(selectedUser.id, newMessage.trim());
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");

      // Update conversations list
      setConversations(prev => {
        const existing = prev.find(c => c.user.id === selectedUser.id);
        if (existing) {
          return prev.map(c =>
            c.user.id === selectedUser.id
              ? { ...c, last_message: data.message.message, last_time: "Just now" }
              : c
          );
        }
        return [{
          user: selectedUser,
          last_message: data.message.message,
          last_time: "Just now",
          unread_count: 0,
        }, ...prev];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = async () => {
    setShowNewChat(true);
    try {
      const data = await messageApi.getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-[#E5E3DC] rounded-2xl overflow-hidden">

      {/* Sidebar - Conversations */}
      <div className={`w-full sm:w-72 border-r border-[#E5E3DC] flex flex-col ${selectedUser ? "hidden sm:flex" : "flex"}`}>
        <div className="px-4 py-4 border-b border-[#E5E3DC] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1A1A1A]">Messages</h2>
          <button
            onClick={handleNewChat}
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            + New
          </button>
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">New Conversation</h3>
                <button onClick={() => setShowNewChat(false)} className="text-[#888] hover:text-[#1A1A1A]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4A6CF7] mb-3"
              />
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {filteredUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { openConversation(u); setShowNewChat(false); setSearchUser(""); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F0EFE8] text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F0EFE8] text-xs font-semibold text-[#555] flex items-center justify-center flex-shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{u.name}</p>
                      <p className="text-xs text-[#888] capitalize">{u.role}</p>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-[#888] text-center py-4">No users found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: "transparent" }}></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm text-[#888]">No conversations yet.</p>
              <button onClick={handleNewChat} className="mt-2 text-xs hover:underline" style={{ color: accentColor }}>
                Start one →
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.user.id}
                onClick={() => openConversation(conv.user)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#FAFAF8] transition-colors border-b border-[#F0EFE8] ${selectedUser?.id === conv.user.id ? "bg-[#F0EFE8]" : ""}`}
              >
                <div className="w-9 h-9 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                  {getInitials(conv.user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{conv.user.name}</p>
                    <span className="text-xs text-[#AAA] ml-2 flex-shrink-0">{conv.last_time}</span>
                  </div>
                  <p className="text-xs text-[#888] truncate">{conv.last_message}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${selectedUser ? "flex" : "hidden sm:flex"}`}>
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-[#888]">Select a conversation to start chatting.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-[#E5E3DC] flex items-center gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="sm:hidden text-[#888] hover:text-[#1A1A1A]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{selectedUser.name}</p>
                <p className="text-xs text-[#888] capitalize">{selectedUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {loadingMessages ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: "transparent" }}></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-[#888]">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "text-white rounded-br-sm" : "bg-[#F0EFE8] text-[#1A1A1A] rounded-bl-sm"}`}
                        style={isMine ? { backgroundColor: accentColor } : {}}
                      >
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMine ? "text-white/70" : "text-[#888]"}`}>{msg.created_at}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="px-4 py-3 border-t border-[#E5E3DC] flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-[#CCCBC4] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 bg-white placeholder:text-[#BBB]"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}