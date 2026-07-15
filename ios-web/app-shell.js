(function () {
  "use strict";

  var REMOTE_ORIGIN = "https://www.otherbali.com";
  var PLAN_KEY = "otherbali.app.plan.v1";
  var FAVOURITES_KEY = "otherbali.app.favourites.v1";
  var moods = [
    ["slow-morning", "Slow morning", "Good coffee, no rush."],
    ["work-session", "Work session", "Fast wifi, a calm table."],
    ["midday-reset", "Midday reset", "Lunch, surf, or a reset."],
    ["golden-hour", "Golden hour", "The view, the drink, the sun."],
    ["late-dinner", "Late dinner", "A real table after dark."],
    ["special-occasion", "Special occasion", "Book ahead for a proper dinner."]
  ];
  var districts = ["canggu", "ubud", "seminyak", "uluwatu", "sanur", "jimbaran", "nusa-dua"];
  var state = { mood: "", district: "canggu", days: "1", plan: readJson(PLAN_KEY, null), favourites: readJson(FAVOURITES_KEY, []) };
  var root = document.getElementById("app");

  function readJson(key, fallback) {
    try { var value = JSON.parse(localStorage.getItem(key) || "null"); return value == null ? fallback : value; } catch { return fallback; }
  }
  function saveJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function esc(value) { return String(value).replace(/[&<>\"']/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[char]; }); }
  function title(value) { return value.split("-").map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); }).join(" "); }
  function onlineLabel() { return navigator.onLine ? "Live guide available" : "Offline · your last plan is still here"; }
  function selectedMood() { return moods.find(function (mood) { return mood[0] === state.mood; }); }
  function planUrl(plan) {
    var path = plan.district === "canggu" ? "/plan?m=" + encodeURIComponent(plan.mood) : "/bali/" + encodeURIComponent(plan.district);
    return REMOTE_ORIGIN + path;
  }
  function favouriteFromUrl(url) {
    var match = url.match(/\/places\/([^/?#]+)/); return match ? decodeURIComponent(match[1]) : null;
  }
  function applyDeepLink(raw) {
    if (!raw) return;
    try {
      var url = new URL(raw);
      if (url.protocol === "otherbali:") {
        var kind = url.hostname || url.pathname.replace(/^\//, "");
        if (kind === "plan") {
          state.mood = url.searchParams.get("m") || state.mood;
          state.district = url.searchParams.get("district") || state.district;
          state.days = url.searchParams.get("days") || state.days;
        }
        if (kind === "place") {
          var slug = url.pathname.split("/").filter(Boolean)[0]; if (slug) addFavourite(slug);
        }
      }
      var webFavourite = favouriteFromUrl(url.pathname); if (webFavourite) addFavourite(webFavourite);
    } catch {}
  }
  function addFavourite(slug) {
    if (state.favourites.indexOf(slug) < 0) state.favourites.push(slug);
    saveJson(FAVOURITES_KEY, state.favourites);
  }
  function render() {
    var moodCards = moods.map(function (mood) { return '<button class="choice" type="button" data-mood="' + mood[0] + '" aria-pressed="' + (state.mood === mood[0]) + '"><strong>' + esc(mood[1]) + '</strong><span>' + esc(mood[2]) + '</span></button>'; }).join("");
    root.innerHTML = '<div class="wrap"><p class="eyebrow">Other Bali · iPhone</p><h1>The right place for the moment.</h1><p class="lede">Build a day that fits how Bali feels today. No account, no booking engine, no third-party app required.</p><div class="status"><span><i class="status-dot ' + (navigator.onLine ? "" : "offline") + '"></i>' + onlineLabel() + '</span><span class="saved-count">' + state.favourites.length + ' saved</span></div><section class="step"><span class="step-label">01 · Your mood</span><div class="choices">' + moodCards + '</div></section><section class="step"><label class="step-label" for="district">02 · Your district</label><select class="select" id="district">' + districts.map(function (district) { return '<option value="' + district + '" ' + (district === state.district ? "selected" : "") + '>' + esc(title(district)) + '</option>'; }).join("") + '</select></section><section class="step"><label class="step-label" for="days">03 · How long?</label><select class="select" id="days"><option value="1">One day</option><option value="3">Three days</option><option value="7">One week</option></select></section><div class="actions"><button class="button" id="build" type="button" ' + (state.mood ? "" : "disabled") + '>Build my day</button>' + (state.plan ? '<button class="button secondary" id="saved" type="button">Open last plan</button>' : "") + '</div><p class="note">Your plan and saved place references stay on this device. We do not store identity in browser storage.</p><div id="plan"></div><footer class="footer"><a href="' + REMOTE_ORIGIN + '/places">Browse the full guide</a> · <a href="' + REMOTE_ORIGIN + '/privacy">Privacy</a></footer></div>';
    document.querySelectorAll("[data-mood]").forEach(function (button) { button.addEventListener("click", function () { state.mood = button.getAttribute("data-mood"); render(); }); });
    document.getElementById("district").addEventListener("change", function (event) { state.district = event.target.value; });
    document.getElementById("days").value = state.days;
    document.getElementById("days").addEventListener("change", function (event) { state.days = event.target.value; });
    document.getElementById("build").addEventListener("click", buildPlan);
    var saved = document.getElementById("saved"); if (saved) saved.addEventListener("click", function () { showPlan(state.plan); });
    if (state.plan) showPlan(state.plan);
  }
  function buildPlan() { state.plan = { version: 1, mood: state.mood, district: state.district, days: state.days, savedAt: new Date().toISOString() }; saveJson(PLAN_KEY, state.plan); showPlan(state.plan); }
  function showPlan(plan) {
    var mood = moods.find(function (item) { return item[0] === plan.mood; });
    var target = document.getElementById("plan"); if (!target) return;
    target.innerHTML = '<section class="card"><p class="eyebrow">Your day plan</p><h2>' + esc(mood ? mood[1] : "A Bali day") + '</h2><p class="note">A focused starting point for ' + esc(title(plan.district)) + '. The full guide adds current places, directions, menus and verified actions when you are online.</p><div class="plan-meta"><div class="meta"><small>District</small><strong>' + esc(title(plan.district)) + '</strong></div><div class="meta"><small>Length</small><strong>' + esc(plan.days) + (plan.days === "1" ? " day" : " days") + '</strong></div><div class="meta"><small>Saved</small><strong>On device</strong></div></div><div class="actions"><a class="button" href="' + planUrl(plan) + '" target="_blank" rel="noreferrer">Open full plan</a><button class="button secondary" id="share" type="button">Share plan</button></div></section>';
    document.getElementById("share").addEventListener("click", function () { sharePlan(plan); });
  }
  async function sharePlan(plan) {
    var data = { title: "My Other Bali day", text: "'" + (selectedMood() ? selectedMood()[1] : "Bali day") + "' in " + title(plan.district), url: "otherbali://plan?m=" + encodeURIComponent(plan.mood) + "&district=" + encodeURIComponent(plan.district) + "&days=" + encodeURIComponent(plan.days) };
    try {
      var nativeShare = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share;
      if (nativeShare && nativeShare.share) { await nativeShare.share(data); return; }
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url); alert("Plan link copied");
    } catch {}
  }
  window.addEventListener("online", render); window.addEventListener("offline", render);
  applyDeepLink(window.location.href);
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) window.Capacitor.Plugins.App.addListener("appUrlOpen", function (event) { applyDeepLink(event.url); render(); });
  render();
})();
