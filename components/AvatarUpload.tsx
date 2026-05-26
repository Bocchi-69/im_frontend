"use client";

import { useRef, useState } from "react";
import { avatarApi } from "@/lib/notificationApi";

interface Props {
  currentAvatarUrl: string | null;
  name: string;
  accentColor: string;
  onUpdate: (url: string | null) => void;
}

export default function AvatarUpload({ currentAvatarUrl, name, accentColor, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) =>
    name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  const handleUpload = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setMessage("Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be less than 2MB.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const data = await avatarApi.upload(file);
      onUpdate(data.avatar_url);
      setMessage("Photo updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove your profile photo?")) return;
    setUploading(true);
    try {
      await avatarApi.delete();
      onUpdate(null);
      setMessage("Photo removed.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage("Failed to remove photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl?.startsWith('http') ? currentAvatarUrl : `http://localhost:8000${currentAvatarUrl}`}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-2xl text-white text-lg font-bold flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            {getInitials(name)}
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#1A1A1A]">{name}</p>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs hover:underline disabled:opacity-50"
            style={{ color: accentColor }}
          >
            {uploading ? "Uploading..." : "Change photo"}
          </button>
          {currentAvatarUrl && (
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="text-xs text-red-400 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        {message && (
          <p className={`text-xs mt-1 ${message.includes("success") || message.includes("updated") || message.includes("removed") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}