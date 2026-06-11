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
    { tone: "gentle", text: "Noted. The clock started either way." },
    { tone: "gentle", text: "In and out, right? That was the deal you made with yourself." },
    { tone: "gentle", text: "A visit, not a residency. Keep it that way." },
    { tone: "gentle", text: "You have a few minutes of plausible deniability left. Use them wisely." },
    { tone: "gentle", text: "The tab is open. So is the question of why." },
    { tone: "snarky", text: "Ah, {site}. The official sponsor of '{goal}', surely." },
    { tone: "snarky", text: "{minutes} minutes in. The algorithm thanks you for your service." },
    { tone: "snarky", text: "Scrolling {site} again. Bold strategy for someone with goals." },
    { tone: "snarky", text: "You and {site}. Name a more productive duo. Oh wait." },
    { tone: "snarky", text: "Research, is it? On {site}? Sure. Write that down." },
    { tone: "snarky", text: "The feed will still be here tomorrow. '{goal}' might not wait as patiently." },
    { tone: "snarky", text: "Back so soon. {site} missed you terribly, I'm sure." },
    { tone: "snarky", text: "Quick scroll before the real work? Classic opening move." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes deep across all feeds today. And it's not even evening." },
    { tone: "snarky", text: "What are we hoping to find here that wasn't here an hour ago?" },
    { tone: "snarky", text: "'{goal}' is doing great, by the way. Oh wait, that requires you." },
    { tone: "snarky", text: "One small scroll for you, one giant leap away from '{goal}'." },
    { tone: "snarky", text: "Checking {site} is a hobby now? Interesting CV addition." },
    { tone: "snarky", text: "You unlocked your screen for this." },
    { tone: "snarky", text: "Five minutes, you said. Adorable." },
    { tone: "brutal", text: "Already? You sat down five minutes ago." },
    { tone: "brutal", text: "{site}. Again. The muscle memory is impressive, the judgment less so." },
    { tone: "brutal", text: "Imagine explaining to your future self that '{goal}' lost to this." },
    { tone: "brutal", text: "You typed that URL from muscle memory. Sit with that." },
    { tone: "brutal", text: "Even the algorithm is surprised to see you again this fast." },
    { tone: "brutal", text: "This is the third-best use of your time today, and the bar was low." },
    { tone: "brutal", text: "'{goal}' doesn't know you're cheating on it yet. I do." }
  ],
  t2: [
    { tone: "gentle", text: "{minutes} minutes now. Maybe a natural stopping point?" },
    { tone: "gentle", text: "This is the part where short break becomes long break. Your call." },
    { tone: "gentle", text: "A friendly nudge: {minutes} minutes on {site}, {totalSinkMinutes} on feeds today overall." },
    { tone: "gentle", text: "Whatever you came here for, you've found it by now." },
    { tone: "gentle", text: "Decent stopping point right here. Just saying." },
    { tone: "gentle", text: "{minutes} minutes. The next ones will look exactly like the last ones." },
    { tone: "gentle", text: "Whatever you're avoiding is still there. It's patient like that." },
    { tone: "gentle", text: "You've earned a break before. This stopped being one a while ago." },
    { tone: "snarky", text: "{minutes} minutes deep. Found anything life-changing yet, or just more of the same?" },
    { tone: "snarky", text: "That's {minutes} minutes of {site}. '{goal}' called, it's not angry, just disappointed." },
    { tone: "snarky", text: "Somewhere out there, someone with the same goals as you is actually working on them." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes of feeds today. The content was that good, was it?" },
    { tone: "snarky", text: "You could have written 500 words by now. Instead: this." },
    { tone: "snarky", text: "The dopamine is free. The {minutes} minutes were not." },
    { tone: "snarky", text: "Still here. The plan was '{goal}', if memory serves." },
    { tone: "snarky", text: "{minutes} minutes. The content isn't getting better, you're just getting comfortable." },
    { tone: "snarky", text: "Scroll, refresh, repeat. The workflow nobody asked you to optimise." },
    { tone: "snarky", text: "At {minutes} minutes, this is officially a meeting. With no agenda. And no outcome." },
    { tone: "snarky", text: "Fun fact: '{goal}' takes about as much daily effort as you're giving {site}." },
    { tone: "snarky", text: "Your screen time report is going to be a fun read this week." },
    { tone: "snarky", text: "Imagine billing a client for this hour. That's what you're doing, to yourself." },
    { tone: "snarky", text: "The posts are the same. The dopamine is smaller. The minutes are real." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes of feeds today. That's a deep work block. Just saying." },
    { tone: "snarky", text: "Somewhere in there you forgot what you opened this for. It happens. Leave." },
    { tone: "snarky", text: "You're not even enjoying this anymore. I can tell." },
    { tone: "snarky", text: "Twenty-ish minutes of {site}. Your future biography will skip this part." },
    { tone: "brutal", text: "{minutes} minutes. You know exactly what you're doing, and so do I." },
    { tone: "brutal", text: "This isn't a break anymore. This is the activity." },
    { tone: "brutal", text: "'{goal}'. Remember that one? It remembers you." },
    { tone: "brutal", text: "Half an hour of your one wild and precious life, going once, going twice." },
    { tone: "brutal", text: "{minutes} minutes. You'd judge anyone else for this. Go on, judge yourself." },
    { tone: "brutal", text: "This is what 'I don't have time' looks like from the inside." },
    { tone: "brutal", text: "The feed wins again. It always plays the long game, and you keep showing up." },
    { tone: "brutal", text: "'{goal}'? Never heard of it, apparently." }
  ],
  t3: [
    { tone: "gentle", text: "{minutes} minutes. Whatever this was, it's run its course. Time to surface." },
    { tone: "gentle", text: "Long session on {site}. Be kind to yourself and close the tab." },
    { tone: "gentle", text: "Today's feed total: {totalSinkMinutes} minutes. Just so you know." },
    { tone: "gentle", text: "{minutes} minutes. No judgment, just arithmetic. It's a lot." },
    { tone: "gentle", text: "Wherever this session was going, it arrived a while ago. Time to surface." },
    { tone: "gentle", text: "Close the tab, stretch, drink some water. Future you says thanks." },
    { tone: "snarky", text: "{minutes} minutes. At this point {site} should be paying you rent." },
    { tone: "snarky", text: "An hour-ish on {site}. Truly the cornerstone of '{goal}'." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes of scrolling today. That's a whole deep work block, gone." },
    { tone: "snarky", text: "The good news: you're consistent. The bad news: at this." },
    { tone: "snarky", text: "If scrolling paid invoices, you'd be set. It doesn't." },
    { tone: "snarky", text: "You've seen this content before. You'll see it again. Close the tab." },
    { tone: "snarky", text: "{minutes} minutes. You could've cooked a meal. Walked to the ocean. Instead: this." },
    { tone: "snarky", text: "At this point, {site} should list you as a dependency." },
    { tone: "snarky", text: "An entire podcast episode worth of scrolling. At least podcasts end." },
    { tone: "snarky", text: "{totalSinkMinutes} minutes on feeds today. Your goals would like a word, all of them." },
    { tone: "snarky", text: "The infinite scroll is winning the war of attrition. It has infinite. You don't." },
    { tone: "snarky", text: "If this session were a meeting, you'd have left it twice by now." },
    { tone: "snarky", text: "New content ran out 20 minutes ago. You're rewatching reruns." },
    { tone: "snarky", text: "This is no longer procrastination. It's a lifestyle choice." },
    { tone: "brutal", text: "{minutes} minutes. No notes. Actually, one note: stop." },
    { tone: "brutal", text: "This is no longer a habit. It's a hobby. An unpaid one." },
    { tone: "brutal", text: "'{goal}' will not happen by itself, and it definitely won't happen here." },
    { tone: "brutal", text: "{totalSinkMinutes} minutes of feeds today. Read that number again. Slowly." },
    { tone: "brutal", text: "The feed is infinite. Your time is not. One of you has to blink first." },
    { tone: "brutal", text: "{minutes} minutes. Say it out loud. Say it to '{goal}'." },
    { tone: "brutal", text: "You will remember nothing from this session. Nothing. It's already gone." },
    { tone: "brutal", text: "The feed doesn't love you back. It never did." },
    { tone: "brutal", text: "A full hour of your finite, non-refundable life. Spent here. On purpose." },
    { tone: "brutal", text: "Rock bottom has a timer now, and it reads {minutes} minutes." }
  ]
};

const JUDGY_PRAISE = [
  { text: "Look at you go, hustling away." },
  { text: "Chuck Norris got nothing on you." },
  { text: "Fuck mediocrity. This is the good stuff." },
  { text: "{minutes} minutes of actual work. Who even are you?" },
  { text: "The algorithm is starving today. Good. Let it." },
  { text: "Oh, we're being productive now? Showing off, are we." },
  { text: "Somewhere a feed is refreshing without you. It will survive. Barely." },
  { text: "Keep this up and '{goal}' might actually happen. Disgusting. Continue." },
  { text: "A wild focused professional appears. Rare footage." },
  { text: "This is suspiciously unlike you. I'm into it." },
  { text: "Doing the thing instead of talking about the thing. Revolutionary." },
  { text: "{minutes} minutes deep and zero scrolling. Witchcraft." },
  { text: "The deadline fears you today." },
  { text: "Procrastination called. You left it on read. Beautiful." },
  { text: "Real work detected. No notes. Carry on." },
  { text: "You're making the rest of us look bad. Don't stop." },
  { text: "'{goal}' is shaking. In a good way." },
  { text: "Another {minutes} minutes like this and you've earned being smug all evening." },
  { text: "The feeds are crying somewhere. Let them." },
  { text: "No judgment today. Annoyingly, you've earned it." },
  { text: "Tabs closed, head down, cooking. This is the version of you that finishes things." }
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
