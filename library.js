(() => {
"use strict";

window.ALONLibrary = {
open(target) {
if (!target) {
return;
}

  const value = String(target).trim();

  if (!value) {
    return;
  }

  // Direct HTML path
  if (value.endsWith(".html")) {
    window.location.href = value;
    return;
  }

  // Support paths and query parameters.
  // Example:
  // subject?department=computer
  // book?subject=programming
  // read?id=123
  window.location.href = value + ".html";
}

};
})();