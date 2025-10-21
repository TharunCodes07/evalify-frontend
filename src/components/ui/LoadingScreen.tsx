"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center justify-center">
      {/* Simplified background effects - no heavy animations */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40" />

      {/* Main content - faster animations */}
      <div className="relative z-10 text-center">
        <div className="mb-6">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Devlabs
          </h1>
          <p className="text-gray-400 font-medium">
            Project Management Platform
          </p>
        </div>

        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Loading your workspace...
          </h2>
          <p className="text-gray-400 text-sm">Please wait</p>
        </div>
      </div>
    </div>
  );
}
