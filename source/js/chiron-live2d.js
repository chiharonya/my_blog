(function () {
  var live2dPath = "https://fastly.jsdelivr.net/npm/live2d-widgets@0/";
  var modelPath = "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Pio/index.json";
  var tipsPath = "/js/chiron-waifu-tips.json";
  var minViewportWidth = 360;
  var positionStorageKey = "chiron-waifu-position";
  var passiveCooldown = 5000;
  var interactionCooldown = 1800;
  var selectorCooldown = 5000;
  var hoverDelay = 500;
  var idleDelay = 15000;
  var tipTimer;
  var hoverTimer;
  var idleTimer;
  var lastPassiveAt = 0;
  var lastInteractionAt = 0;
  var lastSelectorAt = {};
  var lastActivityAt = Date.now();
  var tipsConfig = null;

  function loadExternalResource(url, type) {
    return new Promise(function (resolve, reject) {
      var tag;

      if (type === "css") {
        tag = document.createElement("link");
        tag.rel = "stylesheet";
        tag.href = url;
      }

      if (type === "js") {
        tag = document.createElement("script");
        tag.src = url;
        tag.defer = true;
      }

      if (!tag) {
        reject(new Error("Unsupported Live2D resource type: " + type));
        return;
      }

      tag.onload = function () {
        resolve(url);
      };
      tag.onerror = function () {
        reject(new Error("Failed to load Live2D resource: " + url));
      };
      document.head.appendChild(tag);
    });
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function pick(messages) {
    return Array.isArray(messages) ? messages[Math.floor(Math.random() * messages.length)] : messages;
  }

  function getPoint(event) {
    return event.touches ? event.touches[0] : event;
  }

  function getScaledSize(element) {
    var rect = element.getBoundingClientRect();
    return {
      width: rect.width || element.offsetWidth,
      height: rect.height || element.offsetHeight
    };
  }

  function textFromTarget(target) {
    return (target.innerText || target.title || target.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40);
  }

  function markActivity() {
    lastActivityAt = Date.now();
  }

  function showTip(message, options) {
    var tips = document.getElementById("waifu-tips");
    var now = Date.now();
    var opts = options || {};

    if (!tips || !message) return false;
    if (opts.kind === "passive" && now - lastPassiveAt < passiveCooldown) return false;
    if (opts.kind === "interaction" && now - lastInteractionAt < interactionCooldown) return false;

    clearTimeout(tipTimer);
    tips.innerHTML = message;
    tips.classList.add("waifu-tips-active");
    tipTimer = setTimeout(function () {
      tips.classList.remove("waifu-tips-active");
    }, opts.duration || 4200);

    if (opts.kind === "passive") lastPassiveAt = now;
    if (opts.kind === "interaction") lastInteractionAt = now;
    return true;
  }

  function applySavedPosition(waifu) {
    var saved = localStorage.getItem(positionStorageKey);
    if (!saved) return;

    try {
      var position = JSON.parse(saved);
      var size = getScaledSize(waifu);
      waifu.style.left = clamp(position.left, 0, window.innerWidth - size.width) + "px";
      waifu.style.top = clamp(position.top, 0, window.innerHeight - size.height) + "px";
      waifu.style.right = "auto";
      waifu.style.bottom = "auto";
    } catch (error) {
      localStorage.removeItem(positionStorageKey);
    }
  }

  function createWaifuContainer() {
    if (document.getElementById("waifu")) return;

    document.body.insertAdjacentHTML("beforeend", [
      '<div id="waifu">',
      '  <div id="waifu-tips"></div>',
      '  <canvas id="live2d" width="800" height="800"></canvas>',
      '</div>'
    ].join(""));

    setTimeout(function () {
      var waifu = document.getElementById("waifu");
      if (waifu) waifu.style.bottom = "0";
    }, 0);
  }

  function enableWaifuDrag() {
    var waifu = document.getElementById("waifu");
    var live2d = document.getElementById("live2d");
    if (!waifu || !live2d) return;

    var startX = 0;
    var startY = 0;
    var originLeft = 0;
    var originTop = 0;
    var moved = false;
    var dragging = false;

    applySavedPosition(waifu);

    function onMove(event) {
      if (!dragging) return;

      var point = getPoint(event);
      var size = getScaledSize(waifu);
      var deltaX = point.clientX - startX;
      var deltaY = point.clientY - startY;
      var nextLeft = clamp(originLeft + deltaX, 0, window.innerWidth - size.width);
      var nextTop = clamp(originTop + deltaY, 0, window.innerHeight - size.height);

      if (Math.abs(deltaX) + Math.abs(deltaY) > 8) moved = true;
      waifu.style.left = nextLeft + "px";
      waifu.style.top = nextTop + "px";
      waifu.style.right = "auto";
      waifu.style.bottom = "auto";
      event.preventDefault();
    }

    function onEnd() {
      if (!dragging) return;
      dragging = false;
      waifu.classList.remove("is-dragging");

      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);

      if (moved) {
        localStorage.setItem(positionStorageKey, JSON.stringify({
          left: waifu.offsetLeft,
          top: waifu.offsetTop
        }));
        showTip(pick([
          "好，炼金台搬到这里。",
          "这个位置不错，不挡你看字。",
          "搬家完成。药瓶一个也没碎。"
        ]), { kind: "interaction", duration: 2800 });
      } else {
        showTip(pick(tipsConfig.click[0].text), { kind: "interaction", duration: 3200 });
      }
    }

    function onStart(event) {
      var point = getPoint(event);
      var rect = waifu.getBoundingClientRect();

      markActivity();
      moved = false;
      dragging = true;
      startX = point.clientX;
      startY = point.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      waifu.style.left = originLeft + "px";
      waifu.style.top = originTop + "px";
      waifu.style.right = "auto";
      waifu.style.bottom = "auto";
      waifu.classList.add("is-dragging");

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
      event.preventDefault();
    }

    live2d.addEventListener("mousedown", onStart);
    live2d.addEventListener("touchstart", onStart, { passive: false });
  }

  function findPassiveTip(target) {
    var rules = tipsConfig.mouseover || [];

    for (var i = 0; i < rules.length; i += 1) {
      if (target.closest(rules[i].selector)) return rules[i];
    }

    return null;
  }

  function enablePassiveHints() {
    document.addEventListener("mouseover", function (event) {
      var rule = findPassiveTip(event.target);
      var matched;
      var message;
      var now = Date.now();

      markActivity();
      clearTimeout(hoverTimer);
      if (!rule) return;
      if (now - (lastSelectorAt[rule.selector] || 0) < selectorCooldown) return;

      matched = event.target.closest(rule.selector);
      hoverTimer = setTimeout(function () {
        message = pick(rule.text).replace("{text}", textFromTarget(matched));
        if (showTip(message, { kind: "passive" })) lastSelectorAt[rule.selector] = Date.now();
      }, hoverDelay);
    });

    document.addEventListener("mouseout", function () {
      clearTimeout(hoverTimer);
    });

    document.addEventListener("copy", function () {
      markActivity();
      showTip(tipsConfig.message.copy, { kind: "interaction", duration: 3800 });
    });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        markActivity();
        showTip(tipsConfig.message.visibilitychange, { kind: "passive", duration: 3500 });
      }
    });
  }

  function enableIdleTalk() {
    function scheduleIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        if (Date.now() - lastActivityAt >= idleDelay) {
          showTip(pick(tipsConfig.message.default), { kind: "passive", duration: 4800 });
        }
        scheduleIdle();
      }, idleDelay);
    }

    ["mousemove", "keydown", "scroll", "touchstart"].forEach(function (eventName) {
      window.addEventListener(eventName, markActivity, { passive: true });
    });
    scheduleIdle();
  }

  function greetingMessage() {
    var hour = new Date().getHours();
    var timeRules = tipsConfig.time || [];

    if (location.pathname !== "/") {
      return '欢迎阅读<span>「' + document.title.split(" | ")[0] + "」</span>。";
    }

    for (var i = 0; i < timeRules.length; i += 1) {
      var parts = timeRules[i].hour.split("-");
      var start = Number(parts[0]);
      var end = Number(parts[1] || parts[0]);
      if (start <= hour && hour <= end) return timeRules[i].text;
    }

    return pick(tipsConfig.message.default);
  }

  function initChironLive2D() {
    if (window.__chironLive2dLoaded || window.innerWidth < minViewportWidth) return;
    window.__chironLive2dLoaded = true;

    Promise.all([
      loadExternalResource(live2dPath + "waifu.css", "css"),
      loadExternalResource(live2dPath + "live2d.min.js", "js"),
      fetch(tipsPath).then(function (response) {
        return response.json();
      })
    ]).then(function (results) {
      if (typeof window.loadlive2d !== "function") return;

      tipsConfig = results[2];
      createWaifuContainer();
      window.loadlive2d("live2d", modelPath);
      enableWaifuDrag();
      enablePassiveHints();
      enableIdleTalk();
      setTimeout(function () {
        showTip(greetingMessage(), { kind: "passive", duration: 5200 });
      }, 900);
    }).catch(function (error) {
      console.warn(error);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChironLive2D);
  } else {
    initChironLive2D();
  }
}());
