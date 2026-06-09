"use server";

import { createClient } from "@supabase/supabase-js";
import { TraitScores } from "./page";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Add userId as the second parameter, defaulting to your demo user
export async function saveQuizScores(scores: any, userId: string = "demo-student-1") {
  try {
    const { data, error } = await supabase
      .from("scores")
      .insert([
        {
          // 2. Change the hardcoded string to use our dynamic variable!
          user_id: userId, 
          leadership: scores.leadership || 0,
          empathy: scores.empathy || 0,
          problem_solving: scores.problem_solving || 0,
          adaptability: scores.adaptability || 0,
          collaboration: scores.collaboration || 0,
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Database entry insertion failed:", err);
    return { success: false, error: err };
  }
}