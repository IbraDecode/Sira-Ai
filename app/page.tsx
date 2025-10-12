"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (data.authenticated) {
          router.push("/dashboard");
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            SIRA AI
          </h1>
          <p className="text-xl text-gray-400">
            Multi-Agent Chat System by Ibra Decode
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
