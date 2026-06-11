// Judgy widget. Injected on every http(s) page (top frame only).
// Renders inside a shadow DOM so page CSS and the widget never interact.

(async function () {
  if (window.top !== window) return;

  const host = judgyNormalizeHost(location.hostname);
  if (!host) return;

  let settings = await judgyGetSettings();
  let siteType = judgyClassify(host, location.pathname, settings);
  let lastMessageRaw = "";
  let localSeconds = 0; // today's seconds on this domain (synced + locally ticked)
  let sinkSeconds = 0; // today's seconds across all sinks
  let collapsed = false;

  // ---------- storage ----------

  async function syncFromStorage() {
    const data = await chrome.storage.local.get(["usage", "collapsed"]);
    const usage = data.usage && data.usage.date === judgyToday() ? data.usage : { domains: {} };
    localSeconds = usage.domains[host] || 0;
    sinkSeconds = judgySinkTotal(usage.domains, settings);
    collapsed = !!(data.collapsed || {})[host];
  }

  async function setCollapsed(value) {
    collapsed = value;
    const data = await chrome.storage.local.get("collapsed");
    const map = data.collapsed || {};
    map[host] = value;
    await chrome.storage.local.set({ collapsed: map });
  }

  async function classifyCurrentSite(as) {
    const stored = await chrome.storage.local.get("settings");
    const s = Object.assign({}, JUDGY_DEFAULT_SETTINGS, stored.settings || {});
    if (as === "sink" && !s.sinks.includes(host)) s.sinks = [...s.sinks, host];
    if (as === "virtue" && !s.virtues.includes(host)) s.virtues = [...s.virtues, host];
    await chrome.storage.local.set({ settings: s });
    settings = s;
    siteType = judgyClassify(host, location.pathname, settings);
    render();
    updateMessage();
  }

  // ---------- widget DOM ----------

  const container = document.createElement("div");
  container.id = "judgy-root";
  const shadow = container.attachShadow({ mode: "closed" });

  let cssText = "";
  try {
    cssText = await (await fetch(chrome.runtime.getURL("widget.css"))).text();
  } catch {
    return; // extension reloaded mid-session; bail quietly
  }
  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  const card = document.createElement("div");
  shadow.appendChild(card);
  (document.body || document.documentElement).appendChild(container);

  function positionClass() {
    return "pos-" + (settings.position || "bottom-right");
  }

  function render() {
    card.className = `judgy-card ${positionClass()} type-${siteType}` + (collapsed ? " collapsed" : "");
    if (collapsed) {
      card.innerHTML = `<button class="pill" title="Expand Judgy"><span class="dot"></span><span class="pill-time">0:00</span></button>`;
      card.querySelector(".pill").addEventListener("click", () => {
        setCollapsed(false).then(render).then(updateMessage);
      });
    } else {
      const faceUrl = chrome.runtime.getURL("icons/face.png");
      const label = siteType === "sink" ? "time sunk" : siteType === "virtue" ? "good time" : "time here";
      const classifyRow =
        siteType === "neutral"
          ? `<div class="classify"><button data-as="sink">judge this site</button><button data-as="virtue">praise this site</button></div>`
          : "";
      const messageRow = siteType === "neutral" ? "" : `<div class="message"></div>`;
      card.innerHTML = `
        <div class="header">
          <span class="site">${host}</span>
          <button class="collapse" title="Collapse">&minus;</button>
        </div>
        <div class="body">
          <img class="face" src="${faceUrl}" alt="" />
          <div class="body-main">
            <div class="timer"><span class="time">0:00</span><span class="label">${label} today</span></div>
            ${messageRow}
            ${classifyRow}
          </div>
        </div>`;
      card.querySelector(".collapse").addEventListener("click", () => {
        setCollapsed(true).then(render);
      });
      card.querySelectorAll(".classify button").forEach((btn) => {
        btn.addEventListener("click", () => classifyCurrentSite(btn.dataset.as));
      });
    }
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const el = card.querySelector(".time") || card.querySelector(".pill-time");
    if (el) el.textContent = judgyFormatDuration(localSeconds);
  }

  function updateMessage() {
    if (collapsed || siteType === "neutral") return;
    const el = card.querySelector(".message");
    if (!el) return;
    const goals = (settings.goals || []).filter((g) => g && g.trim());
    const goal = goals.length ? goals[Math.floor(Math.random() * goals.length)] : "";
    const picked = judgyPickMessage({
      minutes: Math.floor(localSeconds / 60),
      site: host,
      goal,
      totalSinkMinutes: Math.floor(sinkSeconds / 60),
      tone: settings.tone,
      type: siteType,
      lastText: lastMessageRaw
    });
    if (!picked) return;
    lastMessageRaw = picked.raw;
    el.textContent = picked.filled;
  }

  // ---------- timers ----------

  function isActivelyViewing() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  let currentTier = "";
  setInterval(() => {
    if (isActivelyViewing()) {
      localSeconds += 1;
      if (siteType === "sink") sinkSeconds += 1;
      updateTimerDisplay();
      // Escalate the message immediately when crossing a tier boundary.
      const tier = judgyTierForMinutes(Math.floor(localSeconds / 60));
      if (tier !== currentTier) {
        currentTier = tier;
        updateMessage();
      }
    }
  }, 1000);

  // Re-sync with background's authoritative totals every 30s.
  setInterval(async () => {
    if (isActivelyViewing()) {
      await syncFromStorage();
      updateTimerDisplay();
    }
  }, 30000);

  // Rotate the message every 5 minutes.
  setInterval(() => {
    if (isActivelyViewing()) updateMessage();
  }, 5 * 60 * 1000);

  // SPA navigation can change classification (e.g. linkedin.com/feed).
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      const newType = judgyClassify(host, lastPath, settings);
      if (newType !== siteType) {
        siteType = newType;
        render();
        updateMessage();
      }
    }
  }, 2000);

  // React to settings changes from the options page.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) {
      settings = Object.assign({}, JUDGY_DEFAULT_SETTINGS, changes.settings.newValue || {});
      siteType = judgyClassify(host, location.pathname, settings);
      render();
      updateMessage();
    }
  });

  // ---------- init ----------

  await syncFromStorage();
  currentTier = judgyTierForMinutes(Math.floor(localSeconds / 60));
  render();
  updateMessage();
})();
