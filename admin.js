(() => {
"use strict";

window.ALONAdmin = {
login(pin) {
if (String(pin) === "2468") {
sessionStorage.setItem("alon_admin", "1");
return true;
}

  return false;
},

logout() {
  sessionStorage.removeItem("alon_admin");
},

isLoggedIn() {
  return sessionStorage.getItem("alon_admin") === "1";
}

};
})();