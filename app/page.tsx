export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">
        StormShield AI
      </h1>

      <p className="mt-4 text-xl text-center max-w-xl">
        Resumes measure experience.
        We measure resilience.
      </p>

      <a
        href="/quiz"
        className="mt-8 rounded-lg bg-black px-6 py-3 text-white"
      >
        Start Assessment
      </a>
    </main>
  );
}