"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveQuizScores } from "./actions";

const questions = [
  {
    id: 1,
    title: "Scenario 1",
    prompt: "Your teammate disappears before a project deadline. What do you do?",
    options: [
    {
      text: "Take over all the work",
      traits: { leadership: 3, adaptability: 2 },
    },
    {
        text: "Reorganize team roles",
        traits: { leadership: 2, collaboration: 3 },
    },
    {
        text: "Contact supervisor",
        traits: { problemSolving: 3, leadership: 2 },
      },
      {
        text: "Support team morale",
        traits: { empathy: 3, collaboration: 2 },
      }
    ],
  },
  {
    id: 2,
    title: "Scenario 2",
    prompt: "A client changes requirements at the last minute. What do you do?",
    options: [
     {
      text: "Accept changes immediately",
      traits: { adaptability: 3, problemSolving: 2 },
      },
      {
        text: "Negotiate scope",
        traits: { problemSolving: 3, leadership: 2 },
      },
      {
        text: "Escalate to manager",
        traits: { problemSolving: 3, leadership: 2 },
      },
      {
        text: "Replan timeline",
        traits: { adaptability: 3, problemSolving: 2 },
      }
    ],
  },
  {
    id: 3,
    title: "Scenario 3",
    prompt: "You notice a potential security vulnerability in the codebase. What do you do?",
    options: [
    {
      text: "Report it immediately",
      traits: { leadership: 2, problemSolving: 2 },
      },
      {
        text: "Investigate further",
        traits: { problemSolving : 3 },
      },
      {
        text: "Ignore it",
        traits: { problemSolving : 0},
      },
      {
        text: "Consult with senior developers",
        traits: { problemSolving: 3, leadership: 2 },
      }
    ],
  },
  {
    id: 4,
    title: "Scenario 4",
    prompt: "You are halfway through a project. Your manager suddenly moves the deadline from next week to tomorrow. What do you do?",
    options: [
  {
    text: "Prioritize critical tasks, cut non-essential parts, focus on delivering core output",
    traits: { leadership: 3, adaptability: 2, problemSolving: 2 },
  },
  {
    text: "Document the issue",
    traits: { problemSolving: 3, adaptability: 2 },
  },
  {
    text: "Escalate to manager",
    traits: { problemSolving: 2, leadership: 1 },
  },
  {
    text: "Work overtime to meet the new deadline",
    traits: { adaptability: 1, problemSolving: 1 },
  }
],
  },
  {
    id: 5,
    title: "Scenario 5",
    prompt: "During a meeting, your idea is criticized harshly by a senior colleague. What do you do?",
    options: [
      {
        text: "Argue back immediately to defend yourself",
       traits: { problemSolving: 0, adaptability: 0 },
      },
      {
        text: "Stay calm, take notes, and ask for feedback after the meeting",
        traits: { problemSolving: 3, adaptability : 2 },
      },
      {
        text: "Shut down, avoid contributing further",
        traits: { problemSolving: 2 },
      },
      {
        text: "Agree with the criticism without discussion",
        traits: { problemSolving: 2, adaptability: 1 },
      }
    ],
  },
  {
    id: 6,
    title: "Scenario 6",
    prompt: "You are assigned to a project that requires skills you are not proficient in. What do you do?",
    options: [
      {
        text: "Ask for help from colleagues",
      traits: { problemSolving: 3, adaptability: 3, collaboration: 2 },
      },
      {
        text: "Learn the necessary skills quickly through online resources",
        traits: { adaptability: 2 },
      },
      {
        text: "Request reassignment to a different project",
        traits: { problemSolving: 3, leadership: 2 },
      },
      {
        text: "Struggle through without seeking help",
        traits: { adaptability: 2, problemSolving: 1, collaboration: 0 },
      }
    ],
  },
];

// 1. Types & Helper Functions
export type TraitScores = {
  leadership: number;
  empathy: number;
  problemSolving: number;
  adaptability: number;
  collaboration: number;
};

// Infers the shape of an answer option directly from your questions array
type Answer = typeof questions[number]["options"][number];

export function computeSignals(answers: Answer[]): TraitScores {
  const result: TraitScores = {
    leadership: 0,
    empathy: 0,
    problemSolving: 0,
    adaptability: 0,
    collaboration: 0,
  };

  answers.forEach((ans) => {
    if (!ans?.traits) return;

    Object.entries(ans.traits).forEach(([key, value]) => {
      // Ensuring the key exists on TraitScores before adding
      if (key in result) {
        result[key as keyof TraitScores] += value ?? 0;
      }
    });
  });

  return result;
}

// 2. Main Page Component
export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false); // New state to toggle results page
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const q = questions[current];
  const isLastQuestion = current === questions.length - 1;

  const handleOptionClick = async (option: Answer) => {
    const newAnswers = [...answers];
    newAnswers[current] = option;
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setCurrent((prev) => prev + 1);
    } else {
      const finalScores = computeSignals(newAnswers);
      const result = await saveQuizScores(finalScores);
      
      if (result.success) {
        setShowResults(true);
        router.refresh();
        // --- NEW: FETCH AI ANALYSIS ---
        setLoadingAi(true);
        try {
          const aiResponse = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalScores),
          });
          const aiData = await aiResponse.json();
          if (aiData.analysis) {
            setAiAnalysis(aiData.analysis);
          }
        } catch (err) {
          console.error("Could not fetch AI insights:", err);
        } finally {
          setLoadingAi(false);
        }
      } else {
        alert("Something went wrong saving your scores.");
      }
    }
  };

  const resetQuiz = () => {
    setAnswers([]);
    setCurrent(0);
    setShowResults(false);
  };

  // --- RESULTS SCREEN ---
  if (showResults) {
    const finalScores = computeSignals(answers);

    return (
      <main className="p-10 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2">🎉 Quiz Complete!</h1>
        <p className="text-gray-600 mb-8">Here is your professional trait breakdown based on your decisions:</p>

        <div className="bg-gray-50 border rounded-xl p-6 text-left shadow-sm mb-8 space-y-4">
          {Object.entries(finalScores).map(([trait, score]) => (
            <div key={trait} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
              <span className="capitalize font-semibold text-gray-700">{trait.replace(/([A-Z])/g, ' $1')}</span>
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                {score} pts
              </span>
            </div>
          ))}
        </div>
        {/* AI Insights Card */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-left shadow-sm">
          <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
            ✨ AI Talent Insights
          </h3>
          
          {loadingAi && (
            <div className="flex items-center gap-3 text-sm text-indigo-600 animate-pulse">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing your behavioral signatures...</span>
            </div>
          )}

          {!loadingAi && aiAnalysis && (
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {aiAnalysis}
            </div>
          )}

          {!loadingAi && !aiAnalysis && (
            <p className="text-xs text-gray-400 italic">Waiting for AI assessment...</p>
          )}
        </div>

        <button
          className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={resetQuiz}
        >
          Retake Quiz
        </button>
      </main>
    );
  }

  // --- QUIZ SCREEN ---
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-2">
        Question {current + 1} of {questions.length}
      </p>
      
      <h1 className="text-3xl font-bold">{q.title}</h1>
      <p className="mt-4 text-lg text-gray-700">{q.prompt}</p>

      <div className="mt-6 flex flex-col gap-3">
        {q.options.map((option, i) => (
          <button 
            key={i} 
            className="border p-3 rounded text-left transition hover:bg-gray-50 active:bg-gray-100"
            onClick={() => handleOptionClick(option)}   
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          className="border p-2 rounded disabled:opacity-50"
          onClick={() => setCurrent((prev) => prev - 1)}
          disabled={current === 0}
        >
          Previous
        </button>
        
        <button
          className="border p-2 rounded disabled:opacity-50"
          onClick={() => setCurrent((prev) => prev + 1)}
          disabled={isLastQuestion}
        >
          Next
        </button>
      </div>
    </main>
  );
}