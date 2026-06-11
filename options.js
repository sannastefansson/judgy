async function loadSettings() {
  const s = await judgyGetSettings();
  document.getElementById("goal1").value = s.goals[0] || "";
  document.getElementById("goal2").value = s.goals[1] || "";
  document.getElementById("goal3").value = s.goals[2] || "";
  document.getElementById("sinks").value = s.sinks.join("\n");
  document.getElementById("virtues").value = s.virtues.join("\n");
  document.getElementById("tone").value = s.tone;
  document.getElementById("position").value = s.position;
}

function parseList(text) {
  return text
    .split("\n")
    .map((l) => l.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, ""))
    .filter(Boolean);
}

async function saveSettings() {
  const settings = {
    goals: [
      document.getElementById("goal1").value.trim(),
      document.getElementById("goal2").value.trim(),
      document.getElementById("goal3").value.trim()
    ],
    sinks: parseList(document.getElementById("sinks").value),
    virtues: parseList(document.getElementById("virtues").value),
    tone: document.getElementById("tone").value,
    position: document.getElementById("position").value
  };
  await chrome.storage.local.set({ settings });
  const status = document.getElementById("status");
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 2000);
  renderHistory();
}

async function renderHistory() {
  const settings = await judgyGetSettings();
  const data = await chrome.storage.local.get(["usage", "history"]);
  const days = {};
  if (data.usage && data.usage.date) days[data.usage.date] = data.usage.domains || {};
  Object.assign(days, data.history || {});

  const rows = [];
  for (const date of Object.keys(days).sort().reverse().slice(0, 7)) {
    const domains = days[date];
    for (const [domain, seconds] of Object.entries(domains)) {
      if (seconds < 30) continue;
      const isSink = settings.sinks.some((e) => judgyMatchEntry(domain, "/", e.split("/")[0]));
      const isVirtue = settings.virtues.some((e) => judgyMatchEntry(domain, "/", e.split("/")[0]));
      if (isSink) rows.push({ date, domain, seconds, type: "wasted" });
      else if (isVirtue) rows.push({ date, domain, seconds, type: "well spent" });
    }
  }

  const el = document.getElementById("history");
  if (rows.length === 0) {
    el.innerHTML = `<p class="empty">Nothing yet. Either you have been good, or it is day one.</p>`;
    return;
  }
  rows.sort((a, b) => (a.date === b.date ? b.seconds - a.seconds : a.date < b.date ? 1 : -1));
  const table = document.createElement("table");
  table.innerHTML = `<tr><th>Date</th><th>Site</th><th>Time</th><th>Verdict</th></tr>`;
  for (const r of rows) {
    const tr = document.createElement("tr");
    const cells = [r.date, r.domain, judgyFormatDuration(r.seconds), r.type];
    cells.forEach((text, i) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (i === 2) td.className = "num";
      if (i === 3) td.className = r.type === "wasted" ? "verdict-sink" : "verdict-virtue";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }
  el.innerHTML = "";
  el.appendChild(table);
}

document.getElementById("save").addEventListener("click", saveSettings);
loadSettings();
renderHistory();
