(() => {
"use strict";

window.ALONSubject = {
open(subject) {
const value = String(subject || "").trim();

  if (!value) {
    return;
  }

  window.location.href =
    "subject.html?subject=" +
    encodeURIComponent(value);
}

};
})();