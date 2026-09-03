(() => {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
document
.querySelectorAll('form[data-contact]')
.forEach((form) => {
form.addEventListener("submit", (event) => {
event.preventDefault();

      if (
        window.ALONSubmit &&
        typeof window.ALONSubmit.save === "function"
      ) {
        window.ALONSubmit.save(form);

        const status = form.querySelector("#contact-status");

        if (status) {
          status.textContent = "Message saved locally.";
          status.className = "status success";
        } else {
          alert("Message saved locally.");
        }

        form.reset();
      } else {
        const status = form.querySelector("#contact-status");

        if (status) {
          status.textContent =
            "Contact system is not available.";
          status.className = "status error";
        }
      }
    });
  });

});
})();