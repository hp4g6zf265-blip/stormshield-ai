"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsUploading(true);

      // Simulate a smart AI resume parsing delay
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      
      {/* Hero Header Section */}
      <div className="max-w-2xl text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Next-Gen Behavioral Analytics
        </div>
        <h1 className="text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          StormShield AI
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Resumes measure experience. We measure resilience. Upload your resume to begin.
        </p>
      </div>

      {/* Main Interactive Flow Card */}
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
        
        {!fileName ? (
          /* Step 1: Upload Box */
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-200 text-center">Step 1: Upload Resume</h3>
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-8 cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-900/40">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all mb-4">
                📄
              </div>
              <p className="text-sm font-medium text-slate-300">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-500 mt-1">PDF or DOCX up to 10MB</p>
            </label>
          </div>
        ) : (
          /* Step 2: Processing & Redirection */
          <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-slate-200">Step 2: Resume Received</h3>
            
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <span className="text-2xl">📄</span>
                <p className="text-sm font-medium text-slate-300 truncate">{fileName}</p>
              </div>
              <button 
                onClick={() => setFileName(null)} 
                className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1"
              >
                Clear
              </button>
            </div>

            {isUploading ? (
              <div className="py-4 space-y-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full"></div>
                </div>
                <p className="text-xs text-blue-400 font-mono tracking-wide animate-pulse">AI IS PARSING SKILLS & EXPERIENCE...</p>
              </div>
            ) : (
              <button
                onClick={() => router.push("/quiz")}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                Start Behavioral Quiz
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Keyframes for the processing animation */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}