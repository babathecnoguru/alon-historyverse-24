(() => {
"use strict";

const supported = ["en", "hi"];

window.ALONWorldLanguage = {
supported,

switchTo(language) {
  const value = String(language || "")
    .trim()
    .toLowerCase();

  if (!supported.includes(value)) {
    return false;
  }

  if (
    window.ALONLanguage &&
    typeof window.ALONLanguage.set === "function"
  ) {
    window.ALONLanguage.set(value);
    return true;
  }

  return false;
}

};
})();