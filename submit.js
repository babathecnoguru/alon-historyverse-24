(() => {
"use strict";

const STORAGE_KEY = "alon_submissions";

function getSubmissions() {
try {
const data = JSON.parse(
localStorage.getItem(STORAGE_KEY) || "[]"
);

  return Array.isArray(data) ? data : [];
} catch (error) {
  console.error(
    "ALONSubmit: Unable to read submissions.",
    error
  );

  return [];
}

}

function save(form) {
if (!form) {
return null;
}

const submission = Object.fromEntries(
  new FormData(form)
);

submission.id = Date.now();

const submissions = getSubmissions();

submissions.push(submission);

localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(submissions)
);

return submission;

}

window.ALONSubmit = {
save,
list: getSubmissions
};
})();