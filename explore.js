(() => {
"use strict";

window.ALONExplore = {
filter(query) {
const searchQuery = String(query || "")
.trim()
.toLowerCase();

  document
    .querySelectorAll("[data-searchable]")
    .forEach((element) => {
      const text = element.textContent
        .toLowerCase();

      element.hidden =
        Boolean(searchQuery) &&
        !text.includes(searchQuery);
    });
}

};
})();