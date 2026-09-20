/* OVERLUKING: homepage behavior. No libraries, no build step. */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header turns solid after you leave the top of the page ---------- */
  var header = doc.querySelector(".site-header");
  function updateHeader() {
    header.classList.toggle("is-solid", window.scrollY > 24);
  }
  updateHeader();

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("site-nav");
  var toggleLabel = doc.querySelector(".nav-toggle__label");

  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggleLabel.textContent = open ? "Close" : "Menu";
  }
  toggle.addEventListener("click", function () {
    setMenu(!body.classList.contains("nav-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Hero: light switch (dawn, day, dusk) ---------- */
  var hero = doc.querySelector(".hero");
  var lightButtons = doc.querySelectorAll(".light-switch button");
  lightButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      hero.setAttribute("data-light", btn.dataset.light);
      lightButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
    });
  });

  /* ---------- Hero: gentle parallax (far ridges drift, the ledge stays put) ---------- */
  var layers = Array.prototype.map.call(hero.querySelectorAll(".layer"), function (el) {
    return { el: el, depth: parseFloat(el.getAttribute("data-depth")) || 0 };
  });
  var ticking = false;
  function paintParallax() {
    var y = Math.min(window.scrollY, hero.offsetHeight);
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.style.transform = "translateY(" + (y * layers[i].depth).toFixed(1) + "px)";
    }
    ticking = false;
  }

  function onScroll() {
    updateHeader();
    if (!reduceMotion && !ticking && window.scrollY < hero.offsetHeight + 100) {
      ticking = true;
      window.requestAnimationFrame(paintParallax);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Highlight the nav link for the section you are reading ---------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav a"));
  var targets = navLinks
    .map(function (a) { return doc.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) {
            a.setAttribute("aria-current", "location");
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- Small toast, used while links are still placeholders ---------- */
  var toast = doc.getElementById("toast");
  var toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  // Any link whose href is just "#" is a page we have not built yet.
  // When you add a real page or affiliate URL, this code simply stops applying to that link.
  doc.addEventListener("click", function (e) {
    var link = e.target.closest('a[href="#"]');
    if (!link) return;
    e.preventDefault();
    showToast(link.hasAttribute("data-slot") ? "Affiliate link coming soon." : "This page is coming soon.");
  });

  /* ---------- Ten Essentials checklist (remembers your ticks on this device) ---------- */
  var boxes = Array.prototype.slice.call(doc.querySelectorAll('input[name="essential"]'));
  var count = doc.getElementById("essentials-count");
  var bar = doc.getElementById("essentials-bar");
  var STORE_KEY = "overluking.essentials";

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (err) { return []; }
  }
  function writeStore(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (err) { /* private mode: ignore */ }
  }
  function updateProgress() {
    var done = boxes.filter(function (b) { return b.checked; });
    count.textContent = done.length;
    bar.style.setProperty("--p", (done.length / boxes.length) * 100);
    bar.parentNode.parentNode.classList.toggle("is-complete", done.length === boxes.length);
    writeStore(done.map(function (b) { return b.value; }));
  }
  var saved = readStore();
  boxes.forEach(function (b) {
    b.checked = saved.indexOf(b.value) !== -1;
    b.addEventListener("change", updateProgress);
  });
  updateProgress();

  /* ---------- Newsletter form ----------
     Not connected to an email service yet. To connect one, put its form URL
     in ENDPOINT below (for example a Buttondown, ConvertKit, or Mailchimp form action). */
  var ENDPOINT = "";
  var form = doc.getElementById("signup");
  var emailInput = doc.getElementById("signup-email");
  var msg = doc.getElementById("signup-msg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    emailInput.setAttribute("aria-invalid", String(!valid));
    if (!valid) {
      msg.textContent = "Enter an email address like you@example.com.";
      emailInput.focus();
      return;
    }
    if (!ENDPOINT) {
      msg.textContent = "Signup is not connected yet. Please check back soon.";
      return;
    }
    msg.textContent = "Sending...";
    var data = new FormData();
    data.append("email", email);
    fetch(ENDPOINT, { method: "POST", body: data, mode: "no-cors" })
      .then(function () {
        form.reset();
        msg.textContent = "You're on the list. Check your inbox to confirm.";
      })
      .catch(function () {
        msg.textContent = "Something went wrong. Please try again.";
      });
  });

  /* ---------- Footer year ---------- */
  var year = doc.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
