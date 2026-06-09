"use client";

import { useState } from "react";

export default function Home() {
  const [newHandle, setNewHandle] = useState("");
  const [existingUser, setExistingUser] = useState("");

  const handleNewCandidateStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return alert("Please claim a unique handle first!");
    
    // Sends them to the quiz, carrying their custom registration handle in the URL link!
    window.location.href = `/quiz?user=${encodeURIComponent(newHandle.trim().toLowerCase())}`;
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingUser.trim()) {
      window.location.href = `/dashboard?user=${encodeURIComponent(existingUser.trim().toLowerCase())}`;
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

        {/* FLOW A: REGISTER UNIQUE ID & START SIMULATOR */}
        <div className="border border-blue-100 bg-blue-50/50 p-5 rounded-2xl space-y-3 text-left">
          <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider font-mono">New Candidates</h3>
          <p className="text-xs text-gray-600">Claim your custom account identity handle to track your telemetry portfolio files across sessions.</p>
          
          <form onSubmit={handleNewCandidateStart} className="space-y-2">
            <input 
              type="text" 
              placeholder="Create your ID (e.g., ellen_codes)" 
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono shadow-sm"
            />
            <button 
              type="submit" 
              className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
            >
              Register Handle & Begin Quiz →
            </button>
          </form>
        </div>

        <div className="relative flex py-2 items-center text-gray-300">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs font-mono font-bold uppercase tracking-widest text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* FLOW B: HISTORICAL PASSKEY BYPASS LOGIN */}
        <div className="border border-gray-200 bg-gray-50/50 p-5 rounded-2xl text-left space-y-3">
          <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider font-mono">Returning Members</h3>
          <p className="text-xs text-gray-500">Already completed your assessment? Input your handle to skip the simulator and manage assets.</p>
          
          <form onSubmit={handleQuickLogin} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g., ellen_codes" 
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