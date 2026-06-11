// Message pools. Placeholders: {minutes} {site} {goal} {totalSinkMinutes}
// Tiers: t1 = 0-10 min, t2 = 10-30 min, t3 = 30+ min.
// Tones: gentle | snarky | brutal. User tone includes everything up to that level:
//   gentle -> gentle only, snarky -> gentle + snarky, brutal -> all three.

const JUDGY_SNARK = {
  t1: [
    { tone: "gentle", text: "Just dropping in, or moving in? The timer is watching." },
    { tone: "gentle", text: "{minutes} minutes on {site}. Still recoverable." },
    { tone: "gentle", text: "Quick check, fine. Quick checks have a way of growing." },
    { tone: "gentle", text: "You opened {site} for a reason. Did you find it yet?" },
    { tone: "gentle", text: "Small detour noted. '{goal}' is still waiting where you left it." },
    { tone: "snarky", text: "Ah, {site}. The official sponsor of '{goal}', surely." },
    { tone: "snarky", text: "{minutes} minutes in. The algorithm thanks you for your service." },
    { tone: "snarky", text: "Scrolling {site} again. Bold strategy for someone with goals." },
    { tone: "snarky", text: "You and {site}. Name a more productive duo. Oh wait." },
    { tone: "snarky", text: "Research, is it? On {site}? Sure. Write that down." },
    { tone: "snarky", text: "The feed will still be here tomorrow. '{goal}' might not wait as patiently." },
    { tone: "brutal", text: "Already? You sat down five minutes ago." },
    { tone: "brutal", text: "{site}. Again. The muscle memory is impressive, the judgment less so." },
    { tone: "brutal", text: "Imagine explaining to your future self that '{goal}' lost to this." }
  ],
  t2: [
    { tone: "gentle", text: "{minutes} minutes now. Maybe a natural stopping point?" },
    { tone: "gentle", text: "This is the part where short break becomes long break. Your call." },
    { tone: "gentle", text: "A friendly nudge: {minutes} minutes on {site}, {totalSinkMinutes} on feeds today overall." },
    { tone: "gentle", text: "Whatever you came here for, you've found it by now." },
    { tone: "snarky", text: "{minutes} minutes deep. Found anything life-changing yet, or just more of the same?" },
    { tone: "snarky", text: "That's {minutes} minutes of {site}. '{goal}' called, it's not angry, just disappointed." },
    { tone: "snarky", text: "Somewhere out there, someone with the same goals as you is actually working on them." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes of feeds today. The content was that good, was it?" },
    { tone: "snarky", text: "You could have written 500 words by now. Instead: this." },
    { tone: "snarky", text: "The dopamine is free. The {minutes} minutes were not." },
    { tone: "snarky", text: "Still here. The plan was '{goal}', if memory serves." },
    { tone: "brutal", text: "{minutes} minutes. You know exactly what you're doing, and so do I." },
    { tone: "brutal", text: "This isn't a break anymore. This is the activity." },
    { tone: "brutal", text: "'{goal}'. Remember that one? It remembers you." },
    { tone: "brutal", text: "Half an hour of your one wild and precious life, going once, going twice." }
  ],
  t3: [
    { tone: "gentle", text: "{minutes} minutes. Whatever this was, it's run its course. Time to surface." },
    { tone: "gentle", text: "Long session on {site}. Be kind to yourself and close the tab." },
    { tone: "gentle", text: "Today's feed total: {totalSinkMinutes} minutes. Just so you know." },
    { tone: "snarky", text: "{minutes} minutes. At this point {site} should be paying you rent." },
    { tone: "snarky", text: "An hour-ish on {site}. Truly the cornerstone of '{goal}'." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes of scrolling today. That's a whole deep work block, gone." },
    { tone: "snarky", text: "The good news: you're consistent. The bad news: at this." },
    { tone: "snarky", text: "If scrolling paid invoices, you'd be set. It doesn't." },
    { tone: "snarky", text: "You've seen this content before. You'll see it again. Close the tab." },
    { tone: "brutal", text: "{minutes} minutes. No notes. Actually, one note: stop." },
    { tone: "brutal", text: "This is no longer a habit. It's a hobby. An unpaid one." },
    { tone: "brutal", text: "'{goal}' will not happen by itself, and it definitely won't happen here." },
    { tone: "brutal", text: "{totalSinkMinutes} minutes of feeds today. Read that number again. Slowly." },
    { tone: "brutal", text: "The feed is infinite. Your time is not. One of you has to blink first." }
  ]
};

const JUDGY_PRAISE = [
  { text: "Look at you, doing the actual thing." },
  { text: "{minutes} minutes of real work. This is how '{goal}' happens." },
  { text: "Good. Keep going, don't check anything." },
  { text: "This counts. The feed never did." },
  { text: "Quiet, focused, working. Rare and excellent." },
  { text: "Future you is nodding approvingly right now." },
  { text: "{minutes} minutes in. Momentum looks good on you." },
  { text: "This is the work that pays for everything else." },
  { text: "One word after another. That's the whole trick, and you're doing it." },
  { text: "'{goal}' is getting measurably closer. Carry on." },
  { text: "No judgment here today. Just respect." },
  { text: "You showed up. Most people don't. Keep at it." },
  { text: "Deep work in progress. Do not disturb, especially not yourself." },
  { text: "Steady {minutes} minutes. Finishing things looks like exactly this." },
  { text: "Whatever resistance said this morning, you're here anyway. Well done." }
];

const JUDGY_TONE_LEVELS = { gentle: 1, snarky: 2, brutal: 3 };

function judgyTierForMinutes(minutes) {
  if (minutes >= 30) return "t3";
  if (minutes >= 10) return "t2";
  return "t1";
}

function judgyFillTemplate(text, ctx) {
  return text
    .replaceAll("{minutes}", String(ctx.minutes))
    .replaceAll("{site}", ctx.site)
    .replaceAll("{goal}", ctx.goal || "")
    .replaceAll("{totalSinkMinutes}", String(ctx.totalSinkMinutes));
}

// Picks a message. ctx: {minutes, site, goal, totalSinkMinutes, tone, type, lastText}
function judgyPickMessage(ctx) {
  let pool;
  if (ctx.type === "virtue") {
    pool = JUDGY_PRAISE;
  } else {
    const tier = judgyTierForMinutes(ctx.minutes);
    const maxLevel = JUDGY_TONE_LEVELS[ctx.tone] || 2;
    pool = JUDGY_SNARK[tier].filter((m) => JUDGY_TONE_LEVELS[m.tone] <= maxLevel);
  }
  // Drop goal-templated messages when no goals are set.
  if (!ctx.goal) pool = pool.filter((m) => !m.text.includes("{goal}"));
  if (pool.length === 0) return "";
  let candidates = pool.filter((m) => m.text !== ctx.lastText);
  if (candidates.length === 0) candidates = pool;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return { raw: pick.text, filled: judgyFillTemplate(pick.text, ctx) };
}
