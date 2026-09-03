(() => {
"use strict";

const STORAGE_KEY = "alon-language";

const savedLanguage =
localStorage.getItem(STORAGE_KEY) || "en";

window.ALONLanguage = {
current: savedLanguage,

set(language) {
  const value = String(language || "").trim().toLowerCase();

  if (!value) {
    return this.current;
  }

  this.current = value;

  localStorage.setItem(
    STORAGE_KEY,
    value
  );

  document.documentElement.lang = value;

  return value;
},

get() {
  return this.current;
}

};

document.documentElement.lang = savedLanguage;
})();