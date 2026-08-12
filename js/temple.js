/* Portfolio interactions */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Hero entrance ─── */
(function initHeroEntrance() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  requestAnimationFrame(() => hero.classList.add("is-ready"));
})();

/* ─── Nav — scroll state, mobile menu, active section ─── */
(function initNav() {
  const nav = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const backdrop = document.getElementById("nav-backdrop");
  const navLinks = document.querySelectorAll(".nav-link[data-nav]");

  const sections = ["about", "skills", "projects", "certifications", "contact"];

  function setMenuOpen(open) {
    menu?.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY > 24;
      nav?.classList.toggle("scrolled", scrolled);
      document.getElementById("nav-header")?.classList.toggle("is-scrolled", scrolled);
    },
    { passive: true }
  );

  toggle?.addEventListener("click", () => {
    setMenuOpen(!menu?.classList.contains("is-open"));
  });

  backdrop?.addEventListener("click", () => setMenuOpen(false));

  document.querySelectorAll('.navbar a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  const sectionEls = sections
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sectionEls.length && navLinks.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sectionEls.forEach((el) => obs.observe(el));
  }
})();

/* ─── Scroll reveal ─── */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => obs.observe(el));
})();

/* ─── Archive expand ─── */
window.toggleArchive = function (card) {
  document.querySelectorAll(".archive-card.open").forEach((c) => {
    if (c !== card) c.classList.remove("open");
  });
  card.classList.toggle("open");
};

/* ─── Hero stat counters ─── */
(function initCounters() {
  const stats = document.querySelectorAll("[data-count]");
  const run = () => {
    stats.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      let start = null;
      const dur = 1600;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * ease).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const hero = document.getElementById("hero");
  if (!hero) return;
  const obs = new IntersectionObserver(
    (e) => {
      if (e[0].isIntersecting) {
        run();
        obs.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  obs.observe(hero);
})();
