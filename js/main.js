/* ═══════════════════════════════════════════════════════════
   RETICLE MS — interaction & animation engine (vanilla JS)
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── Preloader → hero entrance ─────────────────────────── */
  const preloader = document.getElementById("preloader");
  const start = performance.now();
  const MIN_SHOW = prefersReduced ? 0 : 1350;

  function dismissPreloader() {
    const wait = Math.max(0, MIN_SHOW - (performance.now() - start));
    setTimeout(() => {
      preloader && preloader.classList.add("is-done");
      document.body.classList.add("is-loaded");
    }, wait);
  }
  if (document.readyState === "complete") dismissPreloader();
  else window.addEventListener("load", dismissPreloader);
  setTimeout(dismissPreloader, 3200); // safety: never trap the visitor

  /* ── Image fallback (CDN unreachable → styled backdrop) ── */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const host = img.closest("[data-reveal-img], .hero__media, .band__media, figure") || img.parentElement;
      if (host) host.classList.add("img-fallback");
    });
  });

  /* ── Hero background video (lazy, fallback-safe) ───────── */
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo && heroVideo.dataset.src && !prefersReduced) {
    const conn = navigator.connection || {};
    if (!conn.saveData) {
      const startVideo = () => setTimeout(() => {
        heroVideo.src = window.innerWidth >= 1100
          ? heroVideo.dataset.src
          : (heroVideo.dataset.srcSm || heroVideo.dataset.src);
        heroVideo.play()
          .then(() => heroVideo.classList.add("is-playing"))
          .catch(() => {}); // autoplay blocked or file missing → still image stays
      }, 250);
      if (document.readyState === "complete") startVideo();
      else window.addEventListener("load", startVideo, { once: true });
    }
  }

  /* ── Sticky nav state + scroll progress ────────────────── */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle("is-solid", y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      parallaxTick();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────────── */
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      nav.classList.toggle("is-menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        nav.classList.remove("is-menu-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ── Scrollspy ─────────────────────────────────────────── */
  const spyTargets = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  spyTargets.forEach((s) => spy.observe(s));

  /* ── Reveal-on-scroll with sibling stagger ─────────────── */
  const revealables = document.querySelectorAll("[data-reveal], [data-reveal-img]");
  // stagger siblings that share a parent so grids cascade
  const groups = new Map();
  revealables.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const i = groups.get(p);
    el.style.setProperty("--d", `${Math.min(i * 0.09, 0.45)}s`);
    groups.set(p, i + 1);
  });
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );
  revealables.forEach((el) => revealer.observe(el));

  /* ── Animated counters ─────────────────────────────────── */
  const counters = document.querySelectorAll("[data-counter]");
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  function runCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const dur = prefersReduced ? 1 : 1900;
    const t0 = performance.now();
    (function frame(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = (target * easeOut(p)).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter(e.target);
          countObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => countObs.observe(c));

  /* ── Marquee: clone track for a seamless loop ──────────── */
  document.querySelectorAll("[data-marquee]").forEach((m) => {
    const track = m.querySelector(".marquee__track");
    if (track) m.appendChild(track.cloneNode(true));
  });

  /* ── Facility band parallax ────────────────────────────── */
  const parallaxEls = prefersReduced ? [] : [...document.querySelectorAll("[data-parallax]")];
  function parallaxTick() {
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translateY(${progress * -8}%)`;
    });
  }

  /* ── Magnetic buttons ──────────────────────────────────── */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  }

  /* ── Crosshair cursor follower ─────────────────────────── */
  const cursor = document.getElementById("cursor");
  if (cursor && finePointer && !prefersReduced) {
    let cx = -100, cy = -100, tx = cx, ty = cy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("is-on");
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));
    (function follow() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px) ${cursor.classList.contains("is-hot") ? "scale(1.6) rotate(45deg)" : ""}`;
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, .card").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hot"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hot"));
    });
  }

  /* ── Testimonial slider ────────────────────────────────── */
  const slider = document.getElementById("quoteSlider");
  if (slider) {
    const quotes = [...slider.querySelectorAll(".quote")];
    const dots = [...slider.querySelectorAll(".quote-dot")];
    let idx = 0, timer = null;
    function show(i) {
      idx = (i + quotes.length) % quotes.length;
      quotes.forEach((q, k) => q.classList.toggle("is-active", k === idx));
      dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
    }
    function play() {
      if (prefersReduced) return;
      stop();
      timer = setInterval(() => show(idx + 1), 6500);
    }
    function stop() { if (timer) clearInterval(timer); }
    dots.forEach((d, k) =>
      d.addEventListener("click", () => { show(k); play(); })
    );
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    play();
  }

  /* ── Quote form → mailto compose ───────────────────────── */
  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const name = (d.get("name") || "").toString().trim();
      const email = (d.get("email") || "").toString().trim();
      const details = (d.get("details") || "").toString().trim();
      if (!name || !email || !details) {
        status.textContent = "Please fill in name, email, and project details.";
        return;
      }
      const subject = encodeURIComponent(`Quote request — ${name}${d.get("company") ? " · " + d.get("company") : ""}`);
      const body = encodeURIComponent(
        `Name: ${name}\nCompany: ${d.get("company") || "—"}\nEmail: ${email}\nPhone: ${d.get("phone") || "—"}\n\nProject details:\n${details}\n`
      );
      window.location.href = `mailto:M.Fetter@ReticleMS.com?subject=${subject}&body=${body}`;
      status.textContent = "Opening your email client… we'll reply within one business day.";
    });
  }

  /* ── Footer year ───────────────────────────────────────── */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
