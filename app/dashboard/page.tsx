"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, isAuthenticated } from "@/lib/authService";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const redirectToRoleDashboard = async () => {
      try {
        const data = await getMe();
        router.replace(
          data.user.role === "candidate" 
            ? "/dashboard/candidate" 
            : "/dashboard/employer"
        );
      } catch (error) {
        router.replace("/login");
      }
    };

    redirectToRoleDashboard();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#4A6CF7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-[#888]">Loading...</p>
      </div>
    </div>
  );
}