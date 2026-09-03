(() => {
"use strict";

window.ALONSecurity = {
sanitize(value) {
return String(value ?? "")
.replace(/[<>]/g, "");
}
};
})();