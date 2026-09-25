/* charts.js — Vanilla SVG charts: bar + scatter. No libraries. */

function formatIncome(n) {
  return "$" + n.toLocaleString();
}

// Lightweight tooltip element reused across charts
let tooltipEl = null;

function getTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "chart-tooltip";
    tooltipEl.style.cssText =
      "position:fixed;pointer-events:none;background:#0c0a09;color:#fff;font-size:12px;padding:8px 10px;border-radius:8px;opacity:0;transform:translate(-50%,-110%);transition:opacity 0.15s;z-index:50;white-space:nowrap;max-width:260px;white-space:normal;line-height:1.4;";
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function showTooltip(html, x, y) {
  const el = getTooltip();
  el.innerHTML = html;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.opacity = "1";
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.style.opacity = "0";
}

/* — Bar chart: canopy % by neighborhood, sorted by income — */
function renderBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Sort by medianIncome descending for the income vs canopy story
  const sorted = [...data].sort((a, b) => b.medianIncome - a.medianIncome);

  const width = container.clientWidth || 700;
  const isMobile = width < 560;
  const margin = { top: 16, right: 16, bottom: isMobile ? 110 : 70, left: 40 };
  const rowH = isMobile ? 34 : 28;
  const height = margin.top + margin.bottom + sorted.length * rowH;
  const chartW = width - margin.left - margin.right;

  const maxCanopy = 40; // fixed scale 0–40%

  // Build SVG
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Bar chart showing canopy cover percent by neighborhood ordered by income");
  svg.classList.add("chart-svg");

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const x = margin.left + (chartW * i) / 4;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", String(x));
    line.setAttribute("x2", String(x));
    line.setAttribute("y1", String(margin.top));
    line.setAttribute("y2", String(height - margin.bottom));
    line.setAttribute("stroke", "#f0efed");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(height - margin.bottom + 18));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "11");
    label.setAttribute("fill", "#777169");
    label.textContent = Math.round((maxCanopy * i) / 4) + "%";
    svg.appendChild(label);
  }

  sorted.forEach((d, idx) => {
    const y = margin.top + idx * rowH + 4;
    const barW = (d.canopyPct / maxCanopy) * chartW;
    const barH = isMobile ? 18 : 16;

    // Background track
    const track = document.createElementNS(svgNS, "rect");
    track.setAttribute("x", String(margin.left));
    track.setAttribute("y", String(y));
    track.setAttribute("width", String(chartW));
    track.setAttribute("height", String(barH));
    track.setAttribute("rx", "6");
    track.setAttribute("fill", "#fafafa");
    svg.appendChild(track);

    // Color by canopy tier — inline color-scale logic
    let fill = "#1a5c2e";
    if (d.canopyPct >= 30) fill = "#1a5c2e";
    else if (d.canopyPct >= 20) fill = "#3a9a57";
    else if (d.canopyPct >= 12) fill = "#7fc095";
    else fill = "#c2e8ce";

    const bar = document.createElementNS(svgNS, "rect");
    bar.setAttribute("x", String(margin.left));
    bar.setAttribute("y", String(y));
    bar.setAttribute("width", String(barW));
    bar.setAttribute("height", String(barH));
    bar.setAttribute("rx", "6");
    bar.setAttribute("fill", fill);
    bar.classList.add("bar");
    bar.setAttribute("tabindex", "0");
    bar.setAttribute("aria-label", `${d.name}: ${d.canopyPct}% canopy, ${formatIncome(d.medianIncome)} median income`);

    bar.addEventListener("mouseenter", (e) => {
      showTooltip(
        `<strong>${d.name}</strong><br>${d.canopyPct}% canopy · ${formatIncome(d.medianIncome)}<br>${d.surfaceTempC}°C surface · AQI ${d.aqiEstimate}`,
        e.clientX,
        e.clientY - 8
      );
    });
    bar.addEventListener("mousemove", (e) => {
      const el = getTooltip();
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY - 8 + "px";
    });
    bar.addEventListener("mouseleave", hideTooltip);
    bar.addEventListener("focus", () => {
      const rect = bar.getBoundingClientRect();
      showTooltip(
        `<strong>${d.name}</strong><br>${d.canopyPct}% canopy · ${formatIncome(d.medianIncome)}`,
        rect.left + rect.width / 2,
        rect.top
      );
    });
    bar.addEventListener("blur", hideTooltip);

    svg.appendChild(bar);

    // Value label at end of bar
    const vlabel = document.createElementNS(svgNS, "text");
    vlabel.setAttribute("x", String(margin.left + barW + 6));
    vlabel.setAttribute("y", String(y + barH / 2 + 4));
    vlabel.setAttribute("font-size", "11");
    vlabel.setAttribute("font-weight", "600");
    vlabel.setAttribute("fill", "#292524");
    vlabel.textContent = d.canopyPct + "%";
    svg.appendChild(vlabel);

    // Neighborhood label on left
    const nlabel = document.createElementNS(svgNS, "text");
    nlabel.setAttribute("x", String(margin.left));
    nlabel.setAttribute("y", String(y - 4));
    nlabel.setAttribute("font-size", isMobile ? "11" : "12");
    nlabel.setAttribute("fill", "#292524");
    nlabel.setAttribute("font-weight", "500");
    nlabel.textContent = isMobile
      ? d.name.split(" ")[0]
      : d.name + " · " + d.incomeBracket;
    svg.appendChild(nlabel);
  });

  container.innerHTML = "";
  container.appendChild(svg);
}

/* — Scatter: canopy % vs surface temp — */
function renderScatter(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.clientWidth || 700;
  const height = width < 560 ? 360 : 420;
  const margin = { top: 20, right: 24, bottom: 48, left: 52 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const xMin = 0, xMax = 40; // canopy %
  const yMin = 30, yMax = 42; // temp C

  function xScale(v) { return margin.left + ((v - xMin) / (xMax - xMin)) * plotW; }
  function yScale(v) { return margin.top + (1 - (v - yMin) / (yMax - yMin)) * plotH; }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Scatter plot of canopy cover versus summer surface temperature");
  svg.classList.add("chart-svg");

  // Grid
  const grid = document.createElementNS(svgNS, "g");
  grid.classList.add("scatter-grid");
  for (let t = yMin; t <= yMax; t += 2) {
    const y = yScale(t);
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", String(margin.left));
    line.setAttribute("x2", String(width - margin.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "#f0efed");
    grid.appendChild(line);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", String(margin.left - 8));
    label.setAttribute("y", String(y + 4));
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "11");
    label.setAttribute("fill", "#777169");
    label.textContent = t + "°";
    svg.appendChild(label);
  }
  svg.appendChild(grid);

  // X labels
  for (let c = 0; c <= 40; c += 10) {
    const x = xScale(c);
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(height - margin.bottom + 22));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "11");
    label.setAttribute("fill", "#777169");
    label.textContent = c + "%";
    svg.appendChild(label);
  }

  // Axis titles
  const xTitle = document.createElementNS(svgNS, "text");
  xTitle.setAttribute("x", String(margin.left + plotW / 2));
  xTitle.setAttribute("y", String(height - 10));
  xTitle.setAttribute("text-anchor", "middle");
  xTitle.setAttribute("font-size", "12");
  xTitle.setAttribute("font-weight", "600");
  xTitle.setAttribute("fill", "#292524");
  xTitle.textContent = "Canopy cover (%) →";
  svg.appendChild(xTitle);

  const yTitle = document.createElementNS(svgNS, "text");
  yTitle.setAttribute("transform", `rotate(-90)`);
  yTitle.setAttribute("x", String(-(margin.top + plotH / 2)));
  yTitle.setAttribute("y", String(14));
  yTitle.setAttribute("text-anchor", "middle");
  yTitle.setAttribute("font-size", "12");
  yTitle.setAttribute("font-weight", "600");
  yTitle.setAttribute("fill", "#292524");
  yTitle.textContent = "Summer surface temp (°C) →";
  svg.appendChild(yTitle);

  // Trend line (simple linear fit for story)
  const x1 = xScale(7), y1 = yScale(40.6);
  const x2 = xScale(38), y2 = yScale(31.4);
  const trend = document.createElementNS(svgNS, "line");
  trend.setAttribute("x1", String(x1));
  trend.setAttribute("y1", String(y1));
  trend.setAttribute("x2", String(x2));
  trend.setAttribute("y2", String(y2));
  trend.setAttribute("stroke", "#a8a29e");
  trend.setAttribute("stroke-width", "1.5");
  trend.setAttribute("stroke-dasharray", "6 6");
  svg.appendChild(trend);

  // Points
  data.forEach((d) => {
    const cx = xScale(d.canopyPct);
    const cy = yScale(d.surfaceTempC);

    // Income encodes size slightly
    const r = 6 + (d.medianIncome - 32000) / 40000 * 4;

    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", String(cx));
    c.setAttribute("cy", String(cy));
    c.setAttribute("r", String(r));
    c.setAttribute("tabindex", "0");
    c.setAttribute("aria-label", `${d.name}: ${d.canopyPct}% canopy, ${d.surfaceTempC}°C`);
    c.classList.add("scatter-point");

    // Color by heat
    let fill = "#1a5c2e";
    if (d.surfaceTempC >= 39) fill = "#7f1d1d";
    else if (d.surfaceTempC >= 37) fill = "#dc2626";
    else if (d.surfaceTempC >= 34) fill = "#fb923c";
    else fill = "#1a5c2e";

    c.setAttribute("fill", fill);
    c.setAttribute("stroke", "#fff");
    c.setAttribute("stroke-width", "1.5");

    c.addEventListener("mouseenter", (e) => {
      showTooltip(
        `<strong>${d.name}</strong> · ${d.incomeBracket}<br>${d.canopyPct}% canopy → ${d.surfaceTempC}°C surface<br>${formatIncome(d.medianIncome)} · AQI ${d.aqiEstimate}`,
        e.clientX,
        e.clientY - 10
      );
    });
    c.addEventListener("mousemove", (e) => {
      const el = getTooltip();
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY - 10 + "px";
    });
    c.addEventListener("mouseleave", hideTooltip);
    c.addEventListener("focus", () => {
      const rect = c.getBoundingClientRect();
      showTooltip(
        `<strong>${d.name}</strong><br>${d.canopyPct}% → ${d.surfaceTempC}°C`,
        rect.left,
        rect.top
      );
    });
    c.addEventListener("blur", hideTooltip);

    svg.appendChild(c);
  });

  container.innerHTML = "";
  container.appendChild(svg);
}

// Re-render on resize (debounced)
let resizeTimer = null;
function initCharts(data) {
  const doRender = () => {
    renderBarChart("bar-chart", data);
    renderScatter("scatter-chart", data);
  };
  doRender();
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doRender, 180);
  });
}
