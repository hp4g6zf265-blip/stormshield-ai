"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeAndGo = async () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // 1. Send the text to our Groq API
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      
      const data = await response.json();
      
      // 2. Save the real summary into browser memory!
      if (data.analysis) {
        localStorage.setItem("resumeSummary", data.analysis);
      }
      
      // 3. Move to the quiz page
      router.push("/quiz");
    } catch (err) {
      console.error("Error parsing resume:", err);
      // Fallback so the user isn't stuck if the API fails
      localStorage.setItem("resumeSummary", "Technical professional profile.");
      router.push("/quiz");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      
      {/* Header */}
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          StormShield AI
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Resumes measure experience. We measure resilience. Choose your entry path below.
        </p>
      </div>

      {/* Two Layout Columns side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Left Column: Paste Resume */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-1">Option A: Contextual Baseline</h3>
            <p className="text-xs text-slate-400 mb-4">Paste your resume text to seed the AI evaluator with your background profile.</p>
            
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume summary, work history, or skills profile here..."
              className="w-full h-40 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>
          
          <button
            onClick={handleAnalyzeAndGo}
            disabled={isAnalyzing || !resumeText.trim()}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? "Processing with Llama 3..." : "Analyze Background & Start →"}
          </button>
        </div>

        {/* Right Column: Direct Quiz Fast Track */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col justify-between border-dashed">
          <div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">Option B: Clean Fast-Track</h3>
            <p className="text-xs text-slate-400 mb-4">Skip the background check entirely and let your scenario reactions form your score matrix raw.</p>
            
            <div className="h-40 border border-slate-800/60 rounded-xl flex items-center justify-center bg-slate-950/20 text-slate-600 text-sm italic">
              No context file will be generated
            </div>
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem("resumeSummary"); // clear old memory
              router.push("/quiz");
            }}
            className="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Skip Direct to Assessment →
          </button>
        </div>

      </div>
    </div>
  );
}