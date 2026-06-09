"use client"; // Must be at the very top of the file!
import { useState } from "react";

export default function ResumeUpload() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // 🔽 PASTED STEP 2 CODE GOES HERE 🔽
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
        console.log("Resume parsed successfully:", data.summary);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Upload Candidate Resume</h2>
      <input 
        type="file" 
        accept=".pdf,.txt" 
        onChange={handleFileUpload} // 🔗 This triggers the function
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {loading && <p className="text-blue-500">Parsing resume text with Groq...</p>}
      {summary && (
        <div className="mt-4 p-3 bg-gray-50 rounded border text-sm text-gray-700">
          <strong>Extracted Profile:</strong> {summary}
        </div>
      )}
    </div>
  );
}