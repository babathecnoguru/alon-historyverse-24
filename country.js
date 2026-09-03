(() => {
"use strict";

window.ALONCountry = {
open(countryId) {
if (!countryId) {
return;
}

  window.location.href =
    "country.html?country=" +
    encodeURIComponent(countryId);
}

};
})();