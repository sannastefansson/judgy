// Judgy background service worker.
// Tracks time on the active tab's domain. Event-driven: every relevant event
// finalizes the current tracking span into storage and starts a new one.
// A 1-minute alarm checkpoints so totals stay fresh and survive SW shutdowns.

importScripts("defaults.js");

const HISTORY_DAYS = 7;

async function getState() {
  const stored = await chrome.storage.session.get("span");
  return stored.span || null; // {domain, start}
}

async function setState(span) {
  await chrome.storage.session.set({ span });
}

async function archiveIfNewDay(data) {
  const today = judgyToday();
  if (data.usage && data.usage.date && data.usage.date !== today) {
    const history = data.history || {};
    history[data.usage.date] = data.usage.domains;
    const dates = Object.keys(history).sort().reverse();
    for (const d of dates.slice(HISTORY_DAYS)) delete history[d];
    data.history = history;
    data.usage = { date: today, domains: {} };
  }
  if (!data.usage) data.usage = { date: today, domains: {} };
  return data;
}

async function addSeconds(domain, seconds) {
  if (!domain || seconds <= 0) return;
  const data = await archiveIfNewDay(
    await chrome.storage.local.get(["usage", "history"])
  );
  data.usage.domains[domain] = (data.usage.domains[domain] || 0) + seconds;
  await chrome.storage.local.set({ usage: data.usage, history: data.history || {} });
}

// Finalize current span, optionally start tracking a new domain.
async function rollover(newDomain) {
  const span = await getState();
  const now = Date.now();
  if (span && span.domain) {
    const elapsed = Math.round((now - span.start) / 1000);
    // Cap a single span at 30 min as a safety net against stuck spans.
    await addSeconds(span.domain, Math.min(elapsed, 1800));
  }
  await setState(newDomain ? { domain: newDomain, start: now } : null);
}

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return judgyNormalizeHost(u.hostname);
  } catch {
    return null;
  }
}

async function evaluateActiveTab() {
  try {
    const win = await chrome.windows.getLastFocused({ populate: false });
    if (!win || !win.focused) return rollover(null);
    const [tab] = await chrome.tabs.query({ active: true, windowId: win.id });
    if (!tab || !tab.url) return rollover(null);
    const idle = await chrome.idle.queryState(60);
    if (idle !== "active") return rollover(null);
    return rollover(domainFromUrl(tab.url));
  } catch {
    return rollover(null);
  }
}

chrome.tabs.onActivated.addListener(() => evaluateActiveTab());
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) evaluateActiveTab();
});
chrome.windows.onFocusChanged.addListener(() => evaluateActiveTab());
chrome.idle.onStateChanged.addListener(() => evaluateActiveTab());

chrome.idle.setDetectionInterval(60);

chrome.alarms.create("judgy-checkpoint", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "judgy-checkpoint") return;
  // Flush elapsed time and restart the span so totals stay current.
  await evaluateActiveTab();
});

chrome.runtime.onStartup.addListener(() => evaluateActiveTab());
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get("settings");
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: JUDGY_DEFAULT_SETTINGS });
  }
  evaluateActiveTab();
});
