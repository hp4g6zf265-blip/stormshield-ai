"use client";

import { useState } from "react";

export default function Home() {
  const [existingUser, setExistingUser] = useState("");

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingUser.trim()) {
      // Directs the browser straight to the dashboard using their historical handle!
      window.location.href = `/dashboard?user=${encodeURIComponent(existingUser.trim())}`;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-gray-200 rounded-3xl shadow-sm text-center">
        
        <div>
          <span className="text-4xl">🛡️</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3">StormShield AI</h1>
          <p className="text-sm text-gray-500 mt-2">Behavioral Telemetry & Verified Portfolio Architecture</p>
        </div>

        {/* FLOW A: NEW CANDIDATE ENTRY */}
        <div className="border border-blue-100 bg-blue-50/50 p-5 rounded-2xl space-y-3 text-left">
          <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider font-mono">New Candidates</h3>
          <p className="text-xs text-gray-600">Analyze your baseline capabilities vectors by answering our situational simulator questions.</p>
          <a 
            href="/quiz" 
            className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            Begin Diagnostic Quiz →
          </a>
        </div>

        <div className="relative flex py-2 items-center text-gray-300">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs font-mono font-bold uppercase tracking-widest text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* FLOW B: HISTORICAL ACTIVE SESSION BYPASS */}
        <div className="border border-gray-200 bg-gray-50/50 p-5 rounded-2xl text-left space-y-3">
          <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider font-mono">Returning Members</h3>
          <p className="text-xs text-gray-500">Already completed your assessment? Input your handle to skip the simulator and manage assets.</p>
          
          <form onSubmit={handleQuickLogin} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g., demo-student-1" 
              value={existingUser}
              onChange={(e) => setExistingUser(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
            <button 
              type="submit" 
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Restore State
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}