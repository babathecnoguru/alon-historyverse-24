(() => {
"use strict";

window.ALONEngine = {
navigate(path) {
if (!path) {
return;
}

  window.location.href = path;
}

};
})();