import { createClient } from "@supabase/supabase-js";

// Initialize Supabase using your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CRITICAL: This tells Next.js not to cache this page. 
// It forces it to grab fresh data from Supabase every time it's loaded/refreshed.
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  // Fetch the latest score row for our demo user
  const { data: scores, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", "demo-student-1")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !scores) {
    return (
      <main className="p-10 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-800">No Dashboard Data Yet</h1>
        <p className="text-gray-500 mt-2">Go ahead and complete the quiz to see your live analytics!</p>
      </main>
    );
  }

  // Map database snake_case fields into display data
  const traitsData = [
    { label: "👑 Leadership", value: scores.leadership },
    { label: "🤝 Collaboration", value: scores.collaboration },
    { label: "🧩 Problem Solving", value: scores.problem_solving },
    { label: "🌱 Adaptability", value: scores.adaptability },
    { label: "❤️ Empathy", value: scores.empathy },
  ];

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Talent Architecture</h1>
        <p className="text-gray-500 mt-1">Real-time growth metrics pulled from your recent scenario decisions.</p>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        {traitsData.map((trait) => {
          // Assuming max possible points per trait across 6 scenarios is around 18
          const percentage = Math.min((trait.value / 18) * 100, 100);

          return (
            <div key={trait.label} className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>{trait.label}</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                  {trait.value} pts
                </span>
              </div>
              
              {/* Outer Bar */}
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                {/* Inner Animated Filler Bar */}
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}