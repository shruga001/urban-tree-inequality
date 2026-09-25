/* map.js — Interactive neighborhood grid + comparison tool */

let selectedIds = [];

// Heat overlay color helper
function heatOverlay(tempC) {
  if (tempC >= 40) return "rgba(127, 29, 29, 0.22)";
  if (tempC >= 38) return "rgba(220, 38, 38, 0.18)";
  if (tempC >= 35) return "rgba(251, 146, 60, 0.16)";
  if (tempC >= 33) return "rgba(253, 230, 138, 0.18)";
  return "rgba(26, 92, 46, 0.14)";
}

function canopyBg(pct) {
  if (pct >= 30) return "#e6f4ea";
  if (pct >= 20) return "#eef6f0";
  if (pct >= 12) return "#fef9e7";
  return "#fef2f2";
}

function renderMapGrid(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "map-grid";
  grid.setAttribute("role", "list");
  grid.setAttribute("aria-label", "Neighborhood comparison grid");

  data.forEach((d) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "map-cell";
    cell.setAttribute("role", "listitem");
    cell.setAttribute("aria-pressed", "false");
    cell.setAttribute("aria-label", `${d.name}, ${d.incomeBracket}, ${d.canopyPct}% canopy, ${d.surfaceTempC} degrees, AQI ${d.aqiEstimate}. Select to compare.`);
    cell.dataset.id = d.id;
    cell.style.background = canopyBg(d.canopyPct);

    const selected = selectedIds.includes(d.id);
    if (selected) {
      cell.classList.add("is-selected");
      cell.setAttribute("aria-pressed", "true");
    }

    // Heat tint overlay
    const overlay = document.createElement("span");
    overlay.className = "map-heat-overlay";
    overlay.style.background = heatOverlay(d.surfaceTempC);
    overlay.setAttribute("aria-hidden", "true");

    const top = document.createElement("div");
    const name = document.createElement("div");
    name.className = "map-cell-name";
    name.textContent = d.name;
    const meta = document.createElement("div");
    meta.className = "map-cell-meta";
    meta.textContent = d.incomeBracket + " · " + d.medianIncome.toLocaleString() + " median";

    const bottom = document.createElement("div");
    const canopy = document.createElement("div");
    canopy.className = "map-cell-canopy";
    canopy.textContent = d.canopyPct + "%";
    const sub = document.createElement("div");
    sub.className = "map-cell-meta";
    sub.textContent = d.surfaceTempC + "°C · AQI " + d.aqiEstimate;

    top.appendChild(name);
    top.appendChild(meta);
    bottom.appendChild(canopy);
    bottom.appendChild(sub);

    cell.appendChild(overlay);
    cell.appendChild(top);
    cell.appendChild(bottom);

    cell.addEventListener("click", () => toggleSelect(d.id, data));

    // Keyboard hint: Enter/Space handled by button natively
    grid.appendChild(cell);
  });

  container.appendChild(grid);
}

function toggleSelect(id, data) {
  const idx = selectedIds.indexOf(id);
  if (idx >= 0) {
    selectedIds.splice(idx, 1);
  } else {
    if (selectedIds.length >= 2) {
      selectedIds.shift(); // keep max 2 for side-by-side clarity
    }
    selectedIds.push(id);
  }
  renderMapGrid("map-grid", data);
  renderComparePanel("compare-panel", data);
}

function renderComparePanel(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (selectedIds.length === 0) {
    container.innerHTML = '<div class="compare-empty">Select up to two neighborhoods on the grid to compare shade, temperature, and air side-by-side. <span style="display:block;margin-top:6px;font-size:12px;color:#a8a29e;">Use Tab + Enter to select via keyboard.</span></div>';
    return;
  }

  const selected = selectedIds.map((id) => data.find((d) => d.id === id));
  container.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "compare-panel";

  selected.forEach((d) => {
    const card = document.createElement("div");
    card.className = "compare-card";

    const h = document.createElement("h4");
    h.textContent = d.name + " — " + d.incomeBracket;
    card.appendChild(h);

    const rows = [
      ["Canopy cover", d.canopyPct + "%"],
      ["Median income", "$" + d.medianIncome.toLocaleString()],
      ["Summer surface temp", d.surfaceTempC + "°C"],
      ["AQI estimate", String(d.aqiEstimate)],
      ["Population", d.population.toLocaleString()],
    ];

    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "compare-row";
      const l = document.createElement("span");
      l.textContent = label;
      const v = document.createElement("span");
      v.textContent = value;
      row.appendChild(l);
      row.appendChild(v);
      card.appendChild(row);
    });

    const note = document.createElement("p");
    note.style.cssText = "margin-top:10px;font-size:12px;color:#777169;line-height:1.4;";
    note.textContent = d.description;
    card.appendChild(note);

    // Delta hint if two selected
    if (selected.length === 2) {
      const other = selected.find((x) => x.id !== d.id);
      const canopyDelta = d.canopyPct - other.canopyPct;
      const tempDelta = (d.surfaceTempC - other.surfaceTempC).toFixed(1);
      const delta = document.createElement("p");
      delta.style.cssText = "margin-top:10px;font-size:12px;font-weight:600;color:#1a5c2e;";
      const sign = canopyDelta > 0 ? "+" : "";
      delta.textContent =
        (canopyDelta > 0 ? "+" : "") + canopyDelta + " pts canopy vs " + other.name + " · " + (tempDelta > 0 ? "+" : "") + tempDelta + "°C";
      card.appendChild(delta);
    }

    panel.appendChild(card);
  });

  // If only one selected, add placeholder for second
  if (selected.length === 1) {
    const ph = document.createElement("div");
    ph.className = "compare-empty";
    ph.style.display = "grid";
    ph.style.placeItems = "center";
    ph.textContent = "Select a second neighborhood to compare.";
    panel.appendChild(ph);
  }

  container.appendChild(panel);
}

function initMap(data) {
  renderMapGrid("map-grid", data);
  renderComparePanel("compare-panel", data);

  // Optional: expose clear
  const clearBtn = document.getElementById("map-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      selectedIds = [];
      renderMapGrid("map-grid", data);
      renderComparePanel("compare-panel", data);
    });
  }
}
