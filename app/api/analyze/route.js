export async function POST(req) {
  try {
    const signals = await req.json();
    
    // 1. Sort the scores to find their absolute highest trait
    const traits = Object.entries(signals); // converts {leadership: 4, empathy: 0...} to arrays
    traits.sort((a, b) => b[1] - a[1]); // Sort highest to lowest
    
    const topTrait = traits[0][0];
    const topScore = traits[0][1];

    // 2. Find their lowest trait to give them a customized "growth area"
    const lowestTrait = traits[traits.length - 1][0];

    // 3. Map internal keys to beautiful display names
    const traitNames = {
      leadership: "👑 Leadership",
      collaboration: "🤝 Collaboration",
      problemSolving: "🧩 Problem Solving",
      adaptability: "🌱 Adaptability",
      empathy: "❤️ Empathy"
    };

    const topName = traitNames[topTrait] || "Professional Drive";
    const lowName = traitNames[lowestTrait] || "Secondary Skills";

    // 4. Generate custom-tailored analysis based on their specific top trait
    let summaryText = "";

    switch(topTrait) {
      case "problemSolving":
        summaryText = `**Summary**: You are a **Tactical Crisis Navigator**. With an exceptional Problem Solving score (${topScore}pts), you naturally cut through chaos, analyze structural bottlenecks, and deduce logical pathways forward where others stall.
        
**Superpowers**: Rapid triage, objective structural thinking, and high operational logic under pressure.
        
**Growth Opportunities**: Remember to communicate your thought process out loud. Your mind moves fast, meaning you risk leaving teammates behind if you don't slow down to sync up.`;
        break;

      case "leadership":
        summaryText = `**Summary**: You are an **Executive Strategy Anchor**. Your high Leadership score (${topScore}pts) indicates a natural instinct to take ownership of ambiguous situations, allocate shifting team responsibilities, and make definitive executive calls.
        
**Superpowers**: Strong accountability mapping, decisive vision, and operational alignment.
        
**Growth Opportunities**: Make sure to leave space for collaborative brainstorming. True leadership is knowing when to step back and listen before laying down the law.`;
        break;

      case "empathy":
        summaryText = `**Summary**: You are a **Human-Centric Culture Catalyst**. Your top score in Empathy (${topScore}pts) makes you an expert at psychological safety. You naturally protect team morale, read subtle group dynamics, and navigate interpersonal friction seamlessly.
        
**Superpowers**: Exceptional emotional intelligence (EQ), consensus building, and stakeholder relationship care.
        
**Growth Opportunities**: Don't let your desire for team harmony turn into people-pleasing. Sometimes, healthy professional friction is required to hit tough targets.`;
        break;

      case "adaptability":
        summaryText = `**Summary**: You are an **Agile Pivoter**. Your high Adaptability score (${topScore}pts) means you thrive in high-velocity, unstable environments. When market factors or project scopes shift overnight, you instantly re-calibrate without panic.
        
**Superpowers**: High change resilience, experimental mindset, and instant comfort with ambiguity.
        
**Growth Opportunities**: Ensure your speed doesn't trade off with long-term consistency. Deep execution sometimes requires sticking out a boring path.`;
        break;

      case "collaboration":
        summaryText = `**Summary**: You are a **High-Performance Synergy Architect**. Backed by a strong Collaboration score (${topScore}pts), you understand that complex corporate milestones are won through networks, not solo efforts. You break down silos effortlessly.
        
**Superpowers**: Cross-functional alignment, active delegation, and maximizing collective brainpower.
        
**Growth Opportunities**: Avoid design-by-committee standstills. Be ready to break ties and make independent individual contributions when deadlines loom.`;
        break;

      default:
        summaryText = `**Summary**: You are a **Balanced Generalist**. Your behavioral signals show a highly versatile profile capable of fluidly sliding between multiple team demands as needed.`;
    }

    // Append a custom dynamic line regarding their lowest score
    summaryText += `\n\n**Tailored Career Recommendation**: Your matrix strongly points towards roles that rely heavily on ${topName}. To maximize your trajectory, look for strategic projects where you can consciously practice integrating your ${lowName} skills.`;

    // 5. Artificial 1.8-second delay so it looks like a massive AI model is thinking!
    await new Promise(resolve => setTimeout(resolve, 1800));

    return Response.json({ analysis: summaryText });

  } catch (error) {
    console.error("Mock AI Error:", error);
    return Response.json({ error: "Failed to compile signals" }, { status: 500 });
  }
}