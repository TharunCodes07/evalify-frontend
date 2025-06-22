"use client";

import { Loader2, Shield } from "lucide-react";
import "./loading-animations.css";

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40" />

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/5 rounded-full animate-pulse-slow animation-delay-2000" />
      </div>
      <div className="relative z-10 text-center animate-fadeInUp">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent animate-fadeInUp">
            Devlabs
          </h1>
          <p className="text-gray-400 font-medium animate-fadeInUp animation-delay-300">
            Project Management Platform
          </p>
        </div>

        <div className="mb-6 animate-fadeInUp animation-delay-600">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 mb-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        </div>

        <div className="animate-fadeInUp animation-delay-900">
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading your workspace...
          </h2>
          <p className="text-gray-400 text-sm">
            Please wait while we prepare everything for you
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2 animate-fadeInUp animation-delay-1200">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
