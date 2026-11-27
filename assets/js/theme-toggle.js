// Navbar colour-theme toggle: system -> light -> dark -> system.
// The initial theme is applied in <head> by _includes/theme-init.html.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var ORDER = ["system", "light", "dark"];
  var LABELS = { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" };

  function getPref() {
    try { return localStorage.getItem("theme") || "system"; } catch (e) { return "system"; }
  }

  function apply(pref) {
    var dark = pref === "dark" || (pref === "system" && media && media.matches);
    root.setAttribute("data-theme-pref", pref);
    root.setAttribute("data-theme", dark ? "dark" : "light");

    // Beautiful Jekyll picks navbar-light/-dark from the navbar colour on load; keep it in sync.
    var nav = document.querySelector(".navbar");
    if (nav) {
      nav.classList.toggle("navbar-dark", dark);
      nav.classList.toggle("navbar-light", !dark);
    }

    var btn = document.getElementById("nav-theme-toggle");
    if (btn) {
      btn.setAttribute("title", LABELS[pref] + " (click to change)");
      btn.setAttribute("aria-label", LABELS[pref] + " (click to change)");
    }
    var text = document.getElementById("nav-theme-text");
    if (text) text.textContent = LABELS[pref];
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(getPref());
    var btn = document.getElementById("nav-theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var next = ORDER[(ORDER.indexOf(getPref()) + 1) % ORDER.length];
      try { localStorage.setItem("theme", next); } catch (err) {}
      apply(next);
    });
  });

  if (media) {
    var onChange = function () { if (getPref() === "system") apply("system"); };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }
})();
