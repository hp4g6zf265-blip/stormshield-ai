import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`--- PARSE RESUME START ---`);
    console.log(`Received file: ${file.name} (${file.size} bytes)`);

    // 1. Convert the file into text
    // Note: For advanced PDFs, libraries like 'pdf-parse' are used. 
    // This reads the raw text array buffer directly for speed.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const rawText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, ""); 

    // Take a snippet of the text so we don't overflow the LLM context accidentally
    const textSnippet = rawText.slice(0, 4000);

    console.log("Dispatching text snippet to Groq for summarizing...");

    // 2. Ask Groq to extract the professional profile
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS resume parser. Extract and summarize the candidate's core professional background, skills, and experience into a clean, single-paragraph summary (3-4 sentences max). Do not include any introductory text or pleasantries.",
          },
          {
            role: "user",
            content: `Here is the raw resume data:\n\n${textSnippet}`,
          },
        ],
        temperature: 0.3, // Lower temperature means more accurate extraction
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Groq Parser Error:", data);
      return NextResponse.json({ error: "Groq failed to parse resume" }, { status: response.status });
    }

    const summary = data.choices?.[0]?.message?.content || "No summary generated.";
    console.log("Generated Summary:", summary);
    console.log(`--- PARSE RESUME END ---`);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("💥 RESUME PARSER CRASH:", error);
    return NextResponse.json({ error: "Internal parser error" }, { status: 500 });
  }
}