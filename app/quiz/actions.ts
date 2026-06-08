"use server";

import { createClient } from "@supabase/supabase-js";
import { TraitScores } from "./page";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveQuizScores(finalScores: TraitScores, userId: string = "demo-student-1") {
  try {
    const { data, error } = await supabase
      .from("scores")
      .insert([
        {
          user_id: userId,
          leadership: finalScores.leadership,
          empathy: finalScores.empathy,
          problem_solving: finalScores.problemSolving, // map camelCase to snake_case
          adaptability: finalScores.adaptability,
          collaboration: finalScores.collaboration,
        },
      ])
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to save scores:", error);
    return { success: false, error };
  }
}