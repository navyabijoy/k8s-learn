/* Kubernetes Handbook — sidebar, prev/next, theme, syntax colours, copy buttons.
   Plain JS, no build step. Works from file:// (double-click index.html). */
(function () {
  "use strict";

  // Links use the .html filename so they work from file:// as well as on Vercel
  // (cleanUrls redirects /06-pods.html to /06-pods).
  var CHAPTERS = [
    { n: 1,  file: "01-why-kubernetes.html",   title: "Why Kubernetes exists" },
    { n: 2,  file: "02-containers.html",       title: "Containers in five minutes" },
    { n: 3,  file: "03-cluster.html",          title: "What a cluster is" },
    { n: 4,  file: "04-local-cluster.html",    title: "Getting a cluster on your machine" },
    { n: 5,  file: "05-kubectl-yaml.html",     title: "kubectl basics and reading YAML" },
    { n: 6,  file: "06-pods.html",             title: "Pods", ready: true },
    { n: 7,  file: "07-deployments.html",      title: "Deployments, ReplicaSets, rollouts" },
    { n: 8,  file: "08-labels-namespaces.html",title: "Labels, selectors and namespaces" },
    { n: 9,  file: "09-services.html",         title: "Services and cluster DNS" },
    { n: 10, file: "10-ingress.html",          title: "Ingress" },
    { n: 11, file: "11-config-secrets.html",   title: "ConfigMaps and Secrets" },
    { n: 12, file: "12-storage.html",          title: "Storage: volumes, PV, PVC" },
    { n: 13, file: "13-probes-resources.html", title: "Probes, requests, limits, self-healing" },
    { n: 14, file: "14-workloads.html",        title: "StatefulSets, DaemonSets, Jobs, CronJobs" },
    { n: 15, file: "15-scheduling.html",       title: "Scheduling: taints, tolerations, affinity" },
    { n: 16, file: "16-rbac.html",             title: "RBAC and ServiceAccounts" },
    { n: 17, file: "17-networking.html",       title: "Networking: Pod network, CNI, NetworkPolicy" },
    { n: 18, file: "18-helm.html",             title: "Helm" },
    { n: 19, file: "19-operators.html",        title: "Operators, CRDs, the reconcile loop" },
    { n: 20, file: "20-troubleshooting.html",  title: "When it's broken" },
    { n: 21, file: "21-observability.html",    title: "Logs, metrics and Prometheus" },
    { n: 22, file: "22-canonical.html",        title: "Kubernetes at Canonical" },
    { n: 23, file: "23-conclusion.html",       title: "Conclusion" }
  ];

  window.K8S_CHAPTERS = CHAPTERS;

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function span(cls, s) { return '<span class="' + cls + '">' + esc(s) + "</span>"; }

  var current = parseInt(document.body.getAttribute("data-chapter") || "0", 10);

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  function savedTheme() { try { return localStorage.getItem("k8s-theme"); } catch (e) { return null; } }
  function saveTheme(t) { try { localStorage.setItem("k8s-theme", t); } catch (e) {} }
  var st = savedTheme();
  if (st === "light" || st === "dark") root.setAttribute("data-theme", st);
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---------- Sidebar, top bar, theme button ---------- */
  var layout = document.querySelector(".layout");
  var side = document.getElementById("sidebar");
  if (layout && side) {
    var items = CHAPTERS.map(function (c) {
      var label = '<span class="n">' + pad(c.n) + "</span><span>" + esc(c.title) + "</span>";
      if (!c.ready) return '<li class="soon"><span class="item" title="Coming soon">' + label + "</span></li>";
      var cur = c.n === current ? ' aria-current="page"' : "";
      return '<li><a href="' + c.file + '"' + cur + ">" + label + "</a></li>";
    }).join("");
    side.innerHTML =
      '<a class="brand" href="index.html">Kubernetes Handbook<small>for interview prep</small></a>' +
      "<nav aria-label=\"Chapters\"><ol>" + items + "</ol></nav>";
    var activeLink = side.querySelector('[aria-current="page"]');
    if (activeLink && activeLink.scrollIntoView) activeLink.scrollIntoView({ block: "center" });

    var chap = CHAPTERS.filter(function (c) { return c.n === current; })[0];
    var topbar = el("div", { "class": "topbar" },
      '<button class="icon-btn" id="menu-btn" aria-label="Open chapter list" aria-expanded="false" aria-controls="sidebar">☰</button>' +
      '<span class="title">' + esc(chap ? pad(chap.n) + " · " + chap.title : "Kubernetes Handbook") + "</span>");
    var scrim = el("div", { "class": "scrim" });
    layout.parentNode.insertBefore(topbar, layout);
    document.body.appendChild(scrim);

    var menuBtn = document.getElementById("menu-btn");
    function setNav(open) {
      document.body.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    menuBtn.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
    scrim.addEventListener("click", function () { setNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  }

  var themeBtn = el("button", { "class": "icon-btn theme-btn", "aria-label": "Toggle light and dark mode", type: "button" });
  function paintThemeBtn() { themeBtn.textContent = isDark() ? "☀ Light" : "☾ Dark"; }
  themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    saveTheme(next);
    paintThemeBtn();
  });
  paintThemeBtn();
  document.body.appendChild(themeBtn);

  /* ---------- "Chapter N of 23" marker ---------- */
  var headH1 = document.querySelector(".chapter-head h1");
  if (headH1 && current) {
    var pct = Math.round((current / CHAPTERS.length) * 100);
    var marker = el("div", { "class": "chap-count" },
      "<span>Chapter " + current + " of " + CHAPTERS.length + '</span><span class="bar" role="presentation"><i style="width:' + pct + '%"></i></span>');
    headH1.parentNode.insertBefore(marker, headH1);
  }

  /* ---------- Prev / next ---------- */
  var navBox = document.getElementById("chapter-nav");
  if (navBox && current) {
    function link(c, cls, dir) {
      if (!c) return '<span class="spacer"></span>';
      if (!c.ready) return '<div class="' + cls + ' disabled"><small>' + dir + " · coming soon</small>" + pad(c.n) + " · " + esc(c.title) + "</div>";
      return '<a class="' + cls + '" href="' + c.file + '"><small>' + dir + "</small>" + pad(c.n) + " · " + esc(c.title) + "</a>";
    }
    var prev = CHAPTERS[current - 2], next = CHAPTERS[current];
    navBox.innerHTML = link(prev, "prev", "← Previous") + link(next, "next", "Next →");
  }

  /* ---------- Syntax colouring ---------- */
  var VERBS = {};
  ("get describe apply create delete run expose logs exec edit label annotate scale rollout set patch replace " +
   "port-forward cp top explain config cordon uncordon drain taint auth wait diff api-resources api-versions " +
   "version cluster-info events attach debug proxy certificate autoscale").split(" ")
    .forEach(function (v) { VERBS[v] = 1; });
  var PROGRAMS = { kubectl: 1, minikube: 1, kind: 1, helm: 1, docker: 1, microk8s: 1, juju: 1, snap: 1, curl: 1, sudo: 1, k: 1 };

  function hlBash(text) {
    return text.split("\n").map(function (line) {
      var out = "", re = /(\s+)|(#.*$)|("[^"]*"|'[^']*')|(&&|\|\||[|;]|>>?|2>&1)|([^\s|;&>]+)/g, m;
      var first = true, prog = "", verbDone = false;
      while ((m = re.exec(line))) {
        if (m[1]) { out += m[1]; continue; }
        if (m[2]) {
          if (out === "" || /\s$/.test(out.replace(/<[^>]+>/g, ""))) { out += span("t-com", m[2]); continue; }
        }
        if (m[3]) { out += span("t-str", m[3]); continue; }
        if (m[4]) { out += span("t-punc", m[4]); first = true; verbDone = false; prog = ""; continue; }
        var w = m[5] || m[2] || "";
        if (first && PROGRAMS[w]) {
          out += span("t-cmd", w);
          if (w === "sudo") continue; // keep "first" so the next word is the real program
          prog = w; first = false; continue;
        }
        if (first) { out += span("t-cmd", w); first = false; prog = w; continue; }
        if (w.charAt(0) === "-" && w.length > 1 && /^-{1,2}[A-Za-z]/.test(w)) {
          var eq = w.indexOf("=");
          if (eq > 0) {
            var val = w.slice(eq + 1);
            out += span("t-flag", w.slice(0, eq)) + span("t-punc", "=") +
              (/^"|^'/.test(val) ? span("t-str", val) : esc(val));
          } else out += span("t-flag", w);
          continue;
        }
        if (!verbDone && VERBS[w] && (prog === "kubectl" || prog === "k" || prog === "microk8s")) {
          out += span("t-verb", w); verbDone = true; continue;
        }
        if (/^\d+$/.test(w)) { out += span("t-num", w); continue; }
        out += esc(w);
      }
      return out;
    }).join("\n");
  }

  function hlYamlValue(v) {
    var out = "", re = /("(?:[^"\\]|\\.)*"|'[^']*')|(\s#.*$)|(-?\b\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)|([\[\]{},|>])|([^"'\s\[\]{},|>#]+|\s+)/g, m;
    while ((m = re.exec(v))) {
      if (m[1]) out += span("t-str", m[1]);
      else if (m[2]) out += span("t-com", m[2]);
      else if (m[3]) out += span("t-num", m[3]);
      else if (m[4]) out += span("t-punc", m[4]);
      else out += esc(m[5]);
    }
    return out;
  }
  function hlYaml(text) {
    return text.split("\n").map(function (line) {
      if (/^\s*#/.test(line)) return span("t-com", line);
      if (/^---\s*$/.test(line)) return span("t-punc", line);
      var m = /^(\s*(?:-\s+)*)([A-Za-z0-9_.\/-]+|"[^"]+")(:)(\s.*|)$/.exec(line);
      if (m) return esc(m[1]).replace(/-/g, '<span class="t-punc">-</span>') + span("t-key", m[2]) + span("t-punc", m[3]) + hlYamlValue(m[4]);
      var l = /^(\s*)(-)(\s+)(.*)$/.exec(line);
      if (l) return l[1] + span("t-punc", l[2]) + l[3] + hlYamlValue(l[4]);
      return hlYamlValue(line);
    }).join("\n");
  }

  /* ---------- Code blocks: colours + copy button ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".code"), function (box) {
    var pre = box.querySelector("pre"), code = pre.querySelector("code") || pre;
    var lang = box.getAttribute("data-lang") || "plain";
    var raw = code.textContent.replace(/^\n+|\s+$/g, "");
    box.classList.add(lang);
    if (lang === "yaml") code.innerHTML = hlYaml(raw);
    else if (lang === "bash") code.innerHTML = hlBash(raw);
    else code.textContent = raw;

    var file = box.getAttribute("data-file");
    if (file) box.insertBefore(el("span", { "class": "file" }, esc(file)), pre);

    if (lang === "out" || lang === "tree") return;
    var btn = el("button", { "class": "copy", type: "button", "aria-label": "Copy code" }, "Copy");
    btn.addEventListener("click", function () {
      function ok() { btn.textContent = "Copied"; btn.classList.add("done"); setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1400); }
      function fallback() {
        var ta = el("textarea"); ta.value = raw; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Press Ctrl+C"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(raw).then(ok, fallback);
      else fallback();
    });
    box.appendChild(btn);
  });

  /* ---------- Print: open every answer so the PDF has them ---------- */
  var reopened = [];
  window.addEventListener("beforeprint", function () {
    reopened = [];
    Array.prototype.forEach.call(document.querySelectorAll("details:not([open])"), function (d) { d.open = true; reopened.push(d); });
  });
  window.addEventListener("afterprint", function () { reopened.forEach(function (d) { d.open = false; }); });
})();
