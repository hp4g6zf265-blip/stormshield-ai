"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  req_leadership: number;
  req_empathy: number;
  req_problem_solving: number;
  req_adaptability: number;
  req_collaboration: number;
}

export default function StudentDashboard() {
  const [userId, setUserId] = useState("demo-student-1");
  const [scores, setScores] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isEmployerView, setIsEmployerView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputUsername, setInputUsername] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const { data: scoreData } = await supabase
          .from("scores")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setScores(scoreData);

        const { data: jobData } = await supabase.from("jobs").select("*");
        setJobs((jobData as Job[]) || []);
      } catch (err) {
        console.error("Error reading telemetry matrices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [userId]);

  const calculateMatchPercentage = (job: Job) => {
    if (!scores) return 0;
    let totalVariance = 0;
    totalVariance += Math.abs((scores.leadership || 0) - job.req_leadership);
    totalVariance += Math.abs((scores.empathy || 0) - job.req_empathy);
    totalVariance += Math.abs((scores.problem_solving || 0) - job.req_problem_solving);
    totalVariance += Math.abs((scores.adaptability || 0) - job.req_adaptability);
    totalVariance += Math.abs((scores.collaboration || 0) - job.req_collaboration);

    const maxPossibleVariance = 50; 
    const score = ((maxPossibleVariance - totalVariance) / maxPossibleVariance) * 100;
    return Math.max(0, Math.round(score));
  };

  const handleApply = (id: string) => {
    setAppliedJobIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleUserSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUserId(inputUsername.trim());
      setInputUsername("");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-gray-500 bg-gray-50">
        🔄 Accessing Talent Architecture Databases...
      </div>
    );
  }

  const traitsData = scores ? [
    { label: "👑 Leadership", value: scores.leadership || 0 },
    { label: "🤝 Collaboration", value: scores.collaboration || 0 },
    { label: "🧩 Problem Solving", value: scores.problem_solving || 0 },
    { label: "🌱 Adaptability", value: scores.adaptability || 0 },
    { label: "❤️ Empathy", value: scores.empathy || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto mb-6 p-4 bg-slate-900 text-white border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔐</span>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono font-bold">Active User Identity Token</div>
            <div className="text-sm font-semibold text-blue-400 font-mono">{userId}</div>
          </div>
        </div>
        <form onSubmit={handleUserSwitch} className="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Register / Sign In unique handle..." 
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full sm:w-56 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap">
            Switch Profile
          </button>
        </form>
      </div>

      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Career OS Environment</h1>
          <p className="text-sm text-gray-500 mt-1">Cross-referencing telemetry insights with real-world openings.</p>
        </div>
        <button onClick={() => setIsEmployerView(!isEmployerView)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all text-blue-600 shadow-sm">
          {isEmployerView ? "👀 Show Candidate Dashboard" : "🏢 Switch to Employer Matrix"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {!scores ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm mt-12">
            <h2 className="text-2xl font-bold text-gray-800">Account Created Successfully</h2>
            <p className="text-sm text-gray-500 mt-2">Welcome, <span className="font-mono font-bold text-slate-900">{userId}</span>. No telemetry data found.</p>
            <a href="/" className="mt-6 inline-block w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all">Take Quiz</a>
          </div>
        ) : !isEmployerView ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Your Talent Architecture</h3>
                {traitsData.map((trait) => {
                  const percentage = Math.min((trait.value / 18) * 100, 100);
                  return (
                    <div key={trait.label} className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>{trait.label}</span>
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-mono">{trait.value} pts</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Your Job Applications ({appliedJobIds.size})</h3>
                <div className="space-y-2">
                  {jobs.filter(j => appliedJobIds.has(j.id)).map(j => (
                    <div key={j.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm">
                      <span className="font-semibold text-emerald-900 block">{j.title}</span>
                    </div>
                  ))}
                  {appliedJobIds.size === 0 && <p className="text-xs text-gray-400 italic">No applications logged yet.</p>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <input type="text" placeholder="🔍 Search available job descriptions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm shadow-sm" />
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const match = calculateMatchPercentage(job);
                  const applied = appliedJobIds.has(job.id);
                  return (
                    <div key={job.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                        <span className="text-xs font-semibold text-blue-600 block mb-1">{job.company}</span>
                        <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${match > 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          🎯 {match}% Compatibility Match
                        </span>
                      </div>
                      <button onClick={() => handleApply(job.id)} disabled={applied} className={`px-4 py-2 rounded-xl text-xs font-bold ${applied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-900 text-white'}`}>
                        {applied ? "✓ Applied" : "Easy Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Employer Pipeline</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider"><th className="p-4">Applicant ID</th><th className="p-4">Target Job</th><th className="p-4">Match Score</th></tr>
              </thead>
              <tbody className="text-sm">
                {jobs.filter(j => appliedJobIds.has(j.id)).map(job => (
                  <tr key={job.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-bold text-gray-700">{userId}</td>
                    <td className="p-4 font-semibold text-gray-900">{job.title}</td>
                    <td className="p-4 text-blue-600 font-bold">{calculateMatchPercentage(job)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}