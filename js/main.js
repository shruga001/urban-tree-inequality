/* main.js — Shared UI: nav toggle, active link, scroll effects, footer year */

// Mark active nav link based on current path
function setActiveNav() {
  const path = window.location.pathname;
  const links = document.querySelectorAll(".nav-link[data-page]");

  links.forEach((link) => {
    const page = link.getAttribute("data-page");
    // page values like "index", "the-problem" etc.
    const isIndex = page === "index" && (path.endsWith("index.html") || path.endsWith("/") || path.endsWith("urban-tree-inequality/"));
    const isOther = path.includes(page + ".html");
    if (isIndex || isOther) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

// Mobile nav toggle
function initNavToggle() {
  const nav = document.querySelector(".top-nav");
  const btn = document.querySelector(".nav-toggle");
  if (!nav || !btn) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  // Close when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) && e.target !== document) {
      // if click inside nav but not toggle, keep open — only close on link click
      const isLink = e.target.closest("a");
      if (isLink) {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
      return;
    }
    if (!nav.contains(e.target)) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
}

// Reveal on scroll — progressive enhancement, no layout shift if JS disabled
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

// Year in footer
function setYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initNavToggle();
  initReveal();
  setYear();

  // Auto-init charts if data and containers exist — keeps HTML free of inline scripts
  if (typeof neighborhoods !== "undefined") {
    const preview = document.getElementById("preview-bar");
    if (preview && typeof renderBarChart === "function") {
      renderBarChart("preview-bar", neighborhoods);
    }
    const bar = document.getElementById("bar-chart");
    const scatter = document.getElementById("scatter-chart");
    if ((bar || scatter) && typeof initCharts === "function") {
      initCharts(neighborhoods);
    }
    const mapGrid = document.getElementById("map-grid");
    if (mapGrid && typeof initMap === "function") {
      initMap(neighborhoods);
    }
  }
});
