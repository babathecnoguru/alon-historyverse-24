(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const raw = params.get("country") || "India";
  const name = raw.replace(/[-_]+/g," ").replace(/\b\w/g,c=>c.toUpperCase());
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-country-name]").forEach(el => el.textContent = name);
    const title = document.querySelector("title");
    if (title) title.textContent = `${name} — ALON HISTORYVERSE 24`;
  });
})();
