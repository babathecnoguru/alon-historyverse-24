(() => {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
document
.querySelectorAll("[data-country]")
.forEach((element) => {
element.addEventListener("click", () => {
const countryId = element.dataset.country;

      if (
        window.ALONCountry &&
        typeof window.ALONCountry.open === "function"
      ) {
        window.ALONCountry.open(countryId);
      }
    });
  });

});
})();