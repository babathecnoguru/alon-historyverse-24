/*
============================================================
 ALON HISTORYVERSE 24
 JOBS MODULE
 File: jobs.js
 Version: 1.0 API INTEGRATION
 Creator: Baba Thecno Guru

 Connects to the existing Marketplace API.
 Supports:
   - Local Jobs
   - International Jobs
   - Marketplace API login / registration
   - Server-side job records
   - My Jobs / edit / delete
   - Image and video uploads through API media storage
   - Existing Country → State → City controls where available

 IMPORTANT:
 The Marketplace Worker must allow marketplace="jobs"
 before server-side Jobs operations can work.
============================================================
*/
(() => {
  "use strict";

  if (window.__ALON_JOBS_API_MODULE__) return;
  window.__ALON_JOBS_API_MODULE__ = true;

  const CONFIG = Object.freeze({
    version: "1.0 API INTEGRATION",
    apiBase: "https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev",
    marketplace: "jobs",
    storage: {
      token: "ALON_JOBS_API_TOKEN",
      user: "ALON_JOBS_API_USER",
      cache: "alon_historyverse_jobs_data",
      oldUsers: "alon_historyverse_jobs_users",
      oldLogin: "alon_historyverse_jobs_login"
    },
    limits: {
      imageBytes: 8 * 1024 * 1024,
      videoBytes: 40 * 1024 * 1024
    }
  });

  const state = {
    user: null,
    token: "",
    jobs: [],
    busy: false,
    initialized: false
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function readJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function getToken() {
    return state.token || localStorage.getItem(CONFIG.storage.token) || "";
  }

  function getUser() {
    return state.user || readJSON(CONFIG.storage.user, null);
  }

  function setSession(user, token) {
    state.user = user || null;
    state.token = token || "";

    if (user) saveJSON(CONFIG.storage.user, user);
    else localStorage.removeItem(CONFIG.storage.user);

    if (token) localStorage.setItem(CONFIG.storage.token, token);
    else localStorage.removeItem(CONFIG.storage.token);

    updateAccountUI();
  }

  function clearSession() {
    setSession(null, "");
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function escapeAttr(value) {
    return escapeHTML(value).replace(/`/g, "&#96;");
  }

  function createId() {
    return "job_" +
      Date.now().toString(36) + "_" +
      Math.random().toString(36).slice(2, 10);
  }

  function normalizeJobType(value) {
    const text = String(value || "").toLowerCase();

    if (text.includes("international") || text.includes("global")) {
      return "international";
    }

    return "local";
  }

  function jobTypeLabel(job) {
    return normalizeJobType(job.jobType || job.type) === "international"
      ? "International Job"
      : "Local Job";
  }

  function notify(message, type = "info") {
    const existing = $("#jobsApiNotice");

    if (existing) existing.remove();

    const notice = document.createElement("div");
    notice.id = "jobsApiNotice";
    notice.setAttribute("role", "status");
    notice.textContent = String(message);
    notice.style.cssText = [
      "position:relative",
      "z-index:10000",
      "margin:12px 0",
      "padding:12px 15px",
      "border-radius:8px",
      "font-size:14px",
      "line-height:1.5",
      "background:" + (type === "error" ? "#fff0f0" : "#edf8ef"),
      "color:" + (type === "error" ? "#9b2020" : "#175c2a"),
      "border:1px solid " + (type === "error" ? "#e6b8b8" : "#b9dfc2")
    ].join(";");

    const anchor = findNoticeAnchor();
    if (anchor) anchor.prepend(notice);
    else document.body.prepend(notice);

    window.setTimeout(() => notice.remove(), 7000);
  }

  function findNoticeAnchor() {
    return $(
      "#jobsApp, #jobs-app, #jobsMain, #jobs-main, " +
      "#internationalJobsPanel, #localJobsPanel, main, body"
    );
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = { Accept: "application/json" };

    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;

    let body = options.body;

    if (body instanceof FormData) {
      // The browser must set the multipart Content-Type boundary.
    } else if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }

    let response;

    try {
      response = await fetch(CONFIG.apiBase + path, {
        method,
        headers,
        body,
        credentials: "omit",
        cache: "no-store"
      });
    } catch (_) {
      throw new Error(
        "Marketplace API से संपर्क नहीं हो पाया। इंटरनेट और Worker URL जाँचें।"
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (_) {
      result = {};
    }

    if (!response.ok || result.ok === false) {
      if (response.status === 401) {
        clearSession();
      }

      const message = result.message || result.error ||
        "API अनुरोध पूरा नहीं हुआ (" + response.status + ")।";

      throw new Error(message);
    }

    return result;
  }

  function formValue(form, selectors, fallback = "") {
    for (const selector of selectors) {
      const element = $(selector, form);
      if (element && element.value != null) {
        return String(element.value).trim();
      }
    }

    return fallback;
  }

  function fieldValue(form, names, fallback = "") {
    for (const name of names) {
      const element = $(`[name="${CSS.escape(name)}"]`, form);
      if (element && element.value != null) {
        return String(element.value).trim();
      }
    }

    return fallback;
  }

  function findField(form, selectors) {
    for (const selector of selectors) {
      const element = $(selector, form);
      if (element) return element;
    }
    return null;
  }

  function getFormData(form) {
    const data = new FormData(form);

    return {
      title: String(
        data.get("title") ||
        data.get("jobTitle") ||
        data.get("position") ||
        ""
      ).trim(),

      company: String(
        data.get("company") ||
        data.get("companyName") ||
        data.get("employer") ||
        ""
      ).trim(),

      category: String(
        data.get("category") ||
        data.get("jobCategory") ||
        data.get("field") ||
        ""
      ).trim(),

      jobType: normalizeJobType(
        data.get("jobType") ||
        data.get("type") ||
        form.id
      ),

      country: String(data.get("country") || "").trim(),
      state: String(data.get("state") || "").trim(),
      city: String(data.get("city") || "").trim(),
      location: String(
        data.get("location") ||
        data.get("jobLocation") ||
        ""
      ).trim(),

      salary: String(
        data.get("salary") ||
        data.get("pay") ||
        data.get("salaryRange") ||
        ""
      ).trim(),

      appointment: String(
        data.get("appointment") ||
        data.get("employmentType") ||
        data.get("jobTypeDetail") ||
        ""
      ).trim(),

      description: String(
        data.get("description") ||
        data.get("jobDescription") ||
        data.get("details") ||
        ""
      ).trim(),

      applicationUrl: String(
        data.get("applicationUrl") ||
        data.get("applyUrl") ||
        data.get("website") ||
        ""
      ).trim(),

      contactEmail: String(
        data.get("contactEmail") ||
        data.get("employerEmail") ||
        ""
      ).trim(),

      _formData: data
    };
  }

  function findFile(data, names) {
    for (const name of names) {
      const item = data.get(name);
      if (item instanceof File && item.size > 0) return item;
    }

    for (const item of data.values()) {
      if (item instanceof File && item.size > 0) return item;
    }

    return null;
  }

  async function uploadMedia(file) {
    if (!file) return "";

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      throw new Error("केवल image या video फ़ाइल अपलोड कर सकते हैं।");
    }

    if (isImage && file.size > CONFIG.limits.imageBytes) {
      throw new Error("Image का आकार 8 MB से अधिक नहीं होना चाहिए।");
    }

    if (isVideo && file.size > CONFIG.limits.videoBytes) {
      throw new Error("Video का आकार 40 MB से अधिक नहीं होना चाहिए।");
    }

    const form = new FormData();
    form.append("file", file);
    form.append("marketplace", CONFIG.marketplace);

    const result = await api("/api/media", {
      method: "POST",
      body: form
    });

    return result.url || "";
  }

  async function uploadJobMedia(job, formData) {
    const image = findFile(formData, [
      "image", "jobImage", "photo", "jobPhoto", "imageFile"
    ]);

    const video = findFile(formData, [
      "video", "jobVideo", "videoFile"
    ]);

    if (image) job.image = await uploadMedia(image);
    if (video) job.video = await uploadMedia(video);

    return job;
  }

  function validateJob(job) {
    if (!job.title) return "Job title भरना जरूरी है।";
    if (!job.description) return "Job description भरना जरूरी है।";
    if (!job.country) return "Country चुनना जरूरी है।";

    if (job.applicationUrl) {
      try {
        const url = new URL(job.applicationUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          return "Application link सही HTTPS/HTTP URL होना चाहिए।";
        }
      } catch (_) {
        return "Application link सही URL नहीं है।";
      }
    }

    return "";
  }

  async function loadJobs() {
    const result = await api(
      "/api/marketplace/records/listing?marketplace=" +
      encodeURIComponent(CONFIG.marketplace)
    );

    state.jobs = Array.isArray(result.records)
      ? result.records
      : [];

    saveJSON(CONFIG.storage.cache, state.jobs);
    renderJobs();
    updateAccountUI();

    return state.jobs;
  }

  function isMyJob(job) {
    const user = getUser();
    if (!user) return false;

    const ownerId = job.ownerId || job.sellerId || "";
    return ownerId && ownerId === user.id;
  }

  function filteredJobs(type, onlyMine = false) {
    return state.jobs.filter(job => {
      const matchesType = normalizeJobType(job.jobType || job.type) === type;
      return matchesType && (!onlyMine || isMyJob(job));
    });
  }

  function findJobContainer(type, mine = false) {
    const selectors = mine
      ? [
          "#myJobsList", "#myJobsContainer", "#my-jobs-list",
          "#myJobsGrid", "#my-jobs", "[data-jobs-mine]"
        ]
      : type === "international"
        ? [
            "#internationalJobsList", "#internationalJobsGrid",
            "#internationalJobsContainer", "#international-jobs-list",
            "#internationalJobsResults", "[data-jobs-list='international']"
          ]
        : [
            "#localJobsList", "#localJobsGrid", "#localJobsContainer",
            "#local-jobs-list", "#localJobsResults",
            "[data-jobs-list='local']"
          ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element) return element;
    }

    const panel = type === "international"
      ? $("#internationalJobsPanel")
      : $("#localJobsPanel");

    if (!mine && panel) {
      let container = $(".jobs-api-results", panel);

      if (!container) {
        container = document.createElement("div");
        container.className = "jobs-api-results";
        container.setAttribute("data-jobs-list", type);
        panel.appendChild(container);
      }

      return container;
    }

    return null;
  }

  function renderJobCard(job, mine = false) {
    const title = escapeHTML(job.title || "Untitled job");
    const company = escapeHTML(job.company || job.employer || "");
    const country = escapeHTML(job.country || "");
    const place = [job.city, job.state, job.country]
      .filter(Boolean).map(escapeHTML).join(", ");
    const salary = escapeHTML(job.salary || "");
    const description = escapeHTML(job.description || "");
    const media = job.image
      ? `<img src="${escapeAttr(job.image)}" alt="${escapeAttr(job.title || "Job")}" loading="lazy" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px">`
      : "";

    const applyLink = job.applicationUrl
      ? `<a href="${escapeAttr(job.applicationUrl)}" target="_blank" rel="noopener noreferrer">Apply / Website</a>`
      : "";

    const ownerActions = mine
      ? `<div class="jobs-api-actions">
           <button type="button" data-jobs-edit="${escapeAttr(job.id)}">Edit</button>
           <button type="button" data-jobs-delete="${escapeAttr(job.id)}">Delete</button>
         </div>`
      : "";

    return `
      <article class="jobs-api-card" data-job-id="${escapeAttr(job.id)}"
        style="border:1px solid #ddd;border-radius:12px;padding:14px;margin:12px 0;background:#fff;color:#17202a">
        ${media}
        <div style="font-size:12px;font-weight:700;color:#946c13;margin:8px 0">
          ${escapeHTML(jobTypeLabel(job))}
        </div>
        <h3 style="margin:6px 0">${title}</h3>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        ${place ? `<p><strong>Location:</strong> ${place}</p>` : ""}
        ${salary ? `<p><strong>Salary:</strong> ${salary}</p>` : ""}
        ${job.category ? `<p><strong>Category:</strong> ${escapeHTML(job.category)}</p>` : ""}
        <p style="white-space:pre-wrap">${description}</p>
        ${applyLink ? `<p>${applyLink}</p>` : ""}
        ${ownerActions}
      </article>`;
  }

  function renderList(container, jobs, mine = false) {
    if (!container) return;

    if (!jobs.length) {
      container.innerHTML = `
        <div class="jobs-api-empty" style="padding:14px;margin:10px 0;border:1px dashed #ccc;border-radius:8px">
          ${mine ? "You have not posted any jobs yet." : "No jobs are available here yet."}
        </div>`;
      return;
    }

    container.innerHTML = jobs
      .map(job => renderJobCard(job, mine))
      .join("");
  }

  function renderJobs() {
    renderList(findJobContainer("local"), filteredJobs("local"));
    renderList(findJobContainer("international"), filteredJobs("international"));
    renderList(findJobContainer("local", true), state.jobs.filter(isMyJob), true);
  }

  function updateAccountUI() {
    const user = getUser();

    const idTargets = [
      "#jobsUserId", "#jobsUserID", "#currentJobsUserId",
      "#accountUserId", "[data-jobs-user-id]"
    ];

    idTargets.forEach(selector => {
      $$(selector).forEach(element => {
        element.textContent = user ? (user.id || user.email || "") : "";
      });
    });

    const emailTargets = [
      "#jobsUserEmail", "#currentJobsEmail", "#accountEmail"
    ];

    emailTargets.forEach(selector => {
      $$(selector).forEach(element => {
        element.textContent = user ? user.email || "" : "";
      });
    });

    $$("[data-jobs-logout], #jobsLogoutBtn, #jobsLogout, #logoutBtn").forEach(button => {
      button.hidden = !user;
    });

    $$("[data-jobs-login-required]").forEach(element => {
      element.hidden = !user;
    });
  }

  async function login(email, password) {
    const result = await api("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    if (!result.token || !result.user) {
      throw new Error("API ने valid login session नहीं लौटाया।");
    }

    setSession(result.user, result.token);
    await loadJobs();

    notify("Login सफल हुआ। Jobs API से कनेक्शन तैयार है।");
    return result;
  }

  async function register(email, password, displayName, termsAccepted) {
    const result = await api("/api/auth/register", {
      method: "POST",
      body: {
        email,
        password,
        displayName,
        termsAccepted: termsAccepted === true
      }
    });

    if (result.token && result.user) {
      setSession(result.user, result.token);
      await loadJobs();
    }

    notify("Account बन गया है।");
    return result;
  }

  async function logout() {
    try {
      if (getToken()) {
        await api("/api/auth/logout", { method: "POST" });
      }
    } catch (error) {
      console.warn("Jobs logout:", error.message);
    }

    clearSession();
    notify("Logout हो गया।");
  }

  async function saveJob(job, formData, existingId = "") {
    const error = validateJob(job);
    if (error) throw new Error(error);

    await uploadJobMedia(job, formData);

    const method = existingId ? "PUT" : "POST";
    const endpoint = "/api/marketplace/records/listing?marketplace=" +
      encodeURIComponent(CONFIG.marketplace) +
      (existingId ? "/" + encodeURIComponent(existingId) : "");

    if (existingId) job.id = existingId;
    else job.id = job.id || createId();

    const result = await api(endpoint, {
      method,
      body: { record: job }
    });

    await loadJobs();
    notify(existingId ? "Job अपडेट हो गई।" : "Job सर्वर पर प्रकाशित हो गई।");

    return result.record || job;
  }

  async function deleteJob(id) {
    const job = state.jobs.find(item => item.id === id);

    if (!job) throw new Error("Job नहीं मिली।");
    if (!isMyJob(job)) throw new Error("आप केवल अपनी Job हटा सकते हैं।");

    const endpoint = "/api/marketplace/records/listing?marketplace=" +
      encodeURIComponent(CONFIG.marketplace) +
      "/" + encodeURIComponent(id);

    await api(endpoint, { method: "DELETE" });
    await loadJobs();
    notify("Job हटा दी गई।");
  }

  function looksLikeLoginForm(form) {
    const id = (form.id || "").toLowerCase();
    const fields = $$("input", form);

    return (
      /login|signin|sign-in|jobslogin/.test(id) &&
      fields.some(input => /email/i.test(input.type) || /email/i.test(input.name || input.id)) &&
      fields.some(input => input.type === "password")
    );
  }

  function looksLikeSignupForm(form) {
    const id = (form.id || "").toLowerCase();
    const fields = $$("input", form);

    return (
      /signup|register|createaccount|create-account/.test(id) &&
      fields.some(input => /email/i.test(input.type) || /email/i.test(input.name || input.id)) &&
      fields.some(input => input.type === "password")
    );
  }

  function looksLikeJobForm(form) {
    const id = (form.id || "").toLowerCase();
    const names = $$("[name]", form).map(element => element.name.toLowerCase());

    const hasTitle = names.some(name =>
      ["title", "jobtitle", "position"].includes(name)
    );

    const hasDescription = names.some(name =>
      ["description", "jobdescription", "details"].includes(name)
    );

    return hasTitle && hasDescription &&
      (/job|international|local/.test(id) || !!findField(form, [
        "[name='country']", "#jobCountry", "#country"
      ]));
  }

  function getExistingJobId(form) {
    const hidden = findField(form, [
      "input[name='id']", "input[name='jobId']",
      "input[name='editId']", "#jobId"
    ]);

    return hidden ? hidden.value.trim() : "";
  }

  function termsAccepted(form) {
    const checkbox = findField(form, [
      "input[name='termsAccepted']",
      "input[name='terms']",
      "input[name='acceptTerms']",
      "#termsAccepted",
      "#jobsTerms",
      "#termsCheckbox"
    ]);

    return !!(checkbox && checkbox.checked);
  }

  function preventDuplicateSubmit(form) {
    if (form.dataset.jobsApiBusy === "1") return false;
    form.dataset.jobsApiBusy = "1";

    const submit = $("button[type='submit'], input[type='submit']", form);
    if (submit) {
      submit.dataset.jobsApiOriginalText =
        submit.textContent || submit.value || "";
      submit.disabled = true;
    }

    return true;
  }

  function restoreSubmit(form) {
    delete form.dataset.jobsApiBusy;

    const submit = $("button[type='submit'], input[type='submit']", form);
    if (!submit) return;

    submit.disabled = false;

    if (submit.tagName === "INPUT") {
      if (submit.dataset.jobsApiOriginalText) {
        submit.value = submit.dataset.jobsApiOriginalText;
      }
    } else if (submit.dataset.jobsApiOriginalText) {
      submit.textContent = submit.dataset.jobsApiOriginalText;
    }
  }

  function bindFormHandlers() {
    document.addEventListener("submit", async event => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      if (looksLikeLoginForm(form)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (!preventDuplicateSubmit(form)) return;

        try {
          const email = formValue(form, [
            "input[type='email']", "input[name='email']",
            "#jobsLoginEmail", "#loginEmail"
          ]);

          const password = formValue(form, [
            "input[type='password']", "input[name='password']",
            "#jobsLoginPassword", "#loginPassword"
          ]);

          if (!email || !password) {
            throw new Error("Email और Password भरें।");
          }

          await login(email, password);
          form.reset();
        } catch (error) {
          notify(error.message, "error");
        } finally {
          restoreSubmit(form);
        }

        return;
      }

      if (looksLikeSignupForm(form)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (!preventDuplicateSubmit(form)) return;

        try {
          const email = formValue(form, [
            "input[type='email']", "input[name='email']",
            "#jobsSignupEmail", "#signupEmail"
          ]);

          const password = formValue(form, [
            "input[type='password']", "input[name='password']",
            "#jobsSignupPassword", "#signupPassword"
          ]);

          const name = formValue(form, [
            "input[name='displayName']", "input[name='name']",
            "#jobsSignupName", "#signupName"
          ]);

          if (!email || !password) {
            throw new Error("Email और Password भरें।");
          }

          await register(email, password, name, termsAccepted(form));
          form.reset();
        } catch (error) {
          notify(error.message, "error");
        } finally {
          restoreSubmit(form);
        }

        return;
      }

      if (looksLikeJobForm(form)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (!preventDuplicateSubmit(form)) return;

        try {
          if (!getToken()) {
            throw new Error("Job प्रकाशित करने के लिए पहले API account में login करें।");
          }

          const job = getFormData(form);
          const id = getExistingJobId(form);

          await saveJob(job, job._formData, id);
          form.reset();
        } catch (error) {
          notify(error.message, "error");
        } finally {
          restoreSubmit(form);
        }
      }
    }, true);
  }

  function bindActions() {
    document.addEventListener("click", async event => {
      const logoutButton = event.target.closest(
        "[data-jobs-logout], #jobsLogoutBtn, #jobsLogout, #logoutBtn"
      );

      if (logoutButton) {
        event.preventDefault();
        await logout();
        return;
      }

      const deleteButton = event.target.closest("[data-jobs-delete]");
      if (deleteButton) {
        event.preventDefault();

        const id = deleteButton.getAttribute("data-jobs-delete");
        if (!id) return;

        if (!window.confirm("क्या आप इस Job को हटाना चाहते हैं?")) return;

        try {
          await deleteJob(id);
        } catch (error) {
          notify(error.message, "error");
        }

        return;
      }

      const editButton = event.target.closest("[data-jobs-edit]");
      if (editButton) {
        event.preventDefault();

        const id = editButton.getAttribute("data-jobs-edit");
        const job = state.jobs.find(item => item.id === id);
        if (!job) return;

        const form = $$("form").find(looksLikeJobForm);
        if (!form) {
          notify("Edit form नहीं मिला। मौजूदा Job form में edit support जोड़ना होगा।", "error");
          return;
        }

        const values = {
          title: job.title,
          jobTitle: job.title,
          company: job.company,
          companyName: job.company,
          category: job.category,
          country: job.country,
          state: job.state,
          city: job.city,
          location: job.location,
          salary: job.salary,
          appointment: job.appointment,
          description: job.description,
          applicationUrl: job.applicationUrl
        };

        Object.entries(values).forEach(([name, value]) => {
          const field = $(`[name="${CSS.escape(name)}"]`, form);
          if (field && !field.value) field.value = value || "";
        });

        let hidden = $("input[name='id']", form);
        if (!hidden) {
          hidden = document.createElement("input");
          hidden.type = "hidden";
          hidden.name = "id";
          form.appendChild(hidden);
        }

        hidden.value = job.id;
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  async function checkExistingSession() {
    if (!getToken()) return false;

    try {
      const result = await api("/api/auth/session");
      if (result.user) {
        setSession(result.user, getToken());
        return true;
      }
    } catch (_) {
      clearSession();
    }

    return false;
  }

  async function init() {
    if (state.initialized) return;
    state.initialized = true;

    state.user = readJSON(CONFIG.storage.user, null);
    state.token = localStorage.getItem(CONFIG.storage.token) || "";

    bindFormHandlers();
    bindActions();
    updateAccountUI();

    try {
      await checkExistingSession();
      await loadJobs();
    } catch (error) {
      console.error("[ALON Jobs API]", error);

      const cached = readJSON(CONFIG.storage.cache, []);
      if (Array.isArray(cached)) {
        state.jobs = cached;
        renderJobs();
      }

      notify(
        "Jobs API अभी अनुरोध पूरा नहीं कर पाई: " + error.message +
        " स्थानीय cache केवल पिछला डेटा दिखा सकता है; वह server sync का प्रमाण नहीं है।",
        "error"
      );
    }

    if (window.ALON && typeof window.ALON.registerModule === "function") {
      window.ALON.registerModule("jobs", {
        version: CONFIG.version,
        reload: loadJobs,
        login,
        register,
        logout,
        getJobs: () => [...state.jobs],
        saveJob,
        deleteJob
      });
    }

    document.dispatchEvent(new CustomEvent("alon:jobs:ready", {
      detail: {
        version: CONFIG.version,
        apiBase: CONFIG.apiBase,
        signedIn: !!getUser()
      }
    }));
  }

  window.ALON_JOBS_API = Object.freeze({
    version: CONFIG.version,
    reload: loadJobs,
    login,
    register,
    logout,
    getJobs: () => [...state.jobs],
    saveJob,
    deleteJob
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();