(() => {
"use strict";

window.ALONRead = {
open(id) {
const value = String(id || "").trim();

  window.location.href =
    "read.html?id=" +
    encodeURIComponent(value);
}

};
})();