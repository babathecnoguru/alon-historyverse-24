(() => {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
document
.querySelectorAll("[data-library-link]")
.forEach((element) => {
element.addEventListener("click", () => {
const target = element.dataset.libraryLink;

      if (
        window.ALONLibrary &&
        typeof window.ALONLibrary.open === "function"
      ) {
        window.ALONLibrary.open(target);
      }
    });
  });

});
})();