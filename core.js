(() => {
"use strict";

window.ALONCore = {
version: "V100",
ready: true,

q(selector, root = document) {
  return root.querySelector(selector);
}

};
})();