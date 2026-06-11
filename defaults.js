// Shared defaults and helpers. Loaded by content script, options page and
// (via importScripts) the background service worker.

const JUDGY_DEFAULT_SINKS = [
  "instagram.com",
  "tiktok.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "reddit.com",
  "youtube.com",
  "twitch.tv",
  "pinterest.com",
  "9gag.com",
  "linkedin.com/feed"
];

const JUDGY_DEFAULT_VIRTUES = [
  "sannasays.com",
  "sannastefansson.com",
  "docs.craft.do"
];

const JUDGY_DEFAULT_SETTINGS = {
  goals: ["", "", ""],
  sinks: JUDGY_DEFAULT_SINKS,
  virtues: JUDGY_DEFAULT_VIRTUES,
  tone: "snarky", // gentle | snarky | brutal
  position: "bottom-right" // bottom-right | bottom-left | top-right | top-left
};

function judgyNormalizeHost(hostname) {
  return (hostname || "").toLowerCase().replace(/^www\./, "");
}

// Entry: "instagram.com" or "linkedin.com/feed"
// Matches host (incl. subdomains) and, if present, path prefix.
function judgyMatchEntry(host, path, entry) {
  const trimmed = (entry || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  if (!trimmed) return false;
  const slash = trimmed.indexOf("/");
  const eHost = slash === -1 ? trimmed : trimmed.slice(0, slash);
  const ePath = slash === -1 ? "" : trimmed.slice(slash);
  const hostOk = host === eHost || host.endsWith("." + eHost);
  if (!hostOk) return false;
  if (!ePath) return true;
  return (path || "/").startsWith(ePath);
}

function judgyClassify(host, path, settings) {
  if (settings.sinks.some((e) => judgyMatchEntry(host, path, e))) return "sink";
  if (settings.virtues.some((e) => judgyMatchEntry(host, path, e))) return "virtue";
  return "neutral";
}

function judgyToday() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function judgyFormatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}:${String(sec).padStart(2, "0")}`;
  return `0:${String(sec).padStart(2, "0")}`;
}

// Sum today's seconds across all domains matching the sink list.
function judgySinkTotal(usageDomains, settings) {
  let total = 0;
  for (const [domain, seconds] of Object.entries(usageDomains || {})) {
    if (settings.sinks.some((e) => judgyMatchEntry(domain, "/", e.split("/")[0]))) {
      total += seconds;
    }
  }
  return total;
}

async function judgyGetSettings() {
  const stored = await chrome.storage.local.get("settings");
  return Object.assign({}, JUDGY_DEFAULT_SETTINGS, stored.settings || {});
}
