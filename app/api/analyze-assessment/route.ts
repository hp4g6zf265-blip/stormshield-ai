import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { resumeSummary, scores } = await request.json();

    console.log("--- DEBUG START ---");
    console.log("1. Incoming Resume Summary:", resumeSummary);
    console.log("2. Incoming Scores:", scores);
    console.log("3. API Key Status:", process.env.GROQ_API_KEY ? "EXISTS (Starts with " + process.env.GROQ_API_KEY.substring(0, 7) + ")" : "MISSING/UNDEFINED 🛑");

    const scoreString = Object.entries(scores || {})
      .map(([trait, val]) => `${trait}: ${val} points`)
      .join(", ");

    let systemPrompt = "";
    let userPrompt = "";

    if (resumeSummary && resumeSummary.trim() !== "") {
      systemPrompt = `You are an advanced talent evaluation system. Write an executive evaluation comment (2-3 sentences max) detailing how the candidate's background aligns with these traits.`;
      userPrompt = `Candidate Profile: ${resumeSummary}\nScores: ${scoreString}`;
    } else {
      systemPrompt = `You are an advanced behavioral evaluator. Analyze the user's simulation scores and write a short behavioral signature summary (2-3 sentences max).`;
      userPrompt = `Scores: ${scoreString}`;
    }

    // Call Groq securely
    console.log("4. Dispatching request to Groq API...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    console.log("5. Groq Response Status Code:", response.status);

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Groq API Error Payload:", data);
      return NextResponse.json({ comments: "Groq rejected the request. Check terminal logs for the payload." });
    }

    console.log("6. Groq successfully returned choices!");
    const finalComments = data.choices?.[0]?.message?.content || "Evaluation completed.";
    console.log("--- DEBUG END ---");

    return NextResponse.json({ comments: finalComments });
  } catch (error) {
    console.error("💥 CRITICAL BACKEND CRASH:", error);
    return NextResponse.json({ error: "Failed to generate AI evaluation" }, { status: 500 });
  }
}