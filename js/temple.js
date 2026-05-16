/* Pharaonic Cyberpunk — Temple interactions */

const HIEROGLYPHS = "𓀀𓁐𓂀𓃀𓄿𓅓𓆙𓇳𓈖𓉐𓊪𓋴𓌳𓍯𓎛𓏏☥𓊽𓋹𓌞𓍶𓎡𓏤";
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Cursor glow ─── */
(function initCursor() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || REDUCED_MOTION) return;

  let visible = false;
  document.addEventListener(
    "mousemove",
    (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      if (!visible) {
        document.body.classList.add("has-mouse");
        visible = true;
      }
    },
    { passive: true }
  );
  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("has-mouse");
    visible = false;
  });
})();

/* ─── Main background canvas ─── */
(function initBgCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles = [], glyphs = [], streams = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initSystems();
  }

  function initSystems() {
    const area = w * h;
    const count = REDUCED_MOTION ? 25 : Math.min(100, Math.floor(area / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 + 0.15,
      r: Math.random() * 1.8 + 0.4,
      gold: Math.random() > 0.55,
    }));

    const gCount = REDUCED_MOTION ? 6 : Math.min(18, Math.floor(area / 80000));
    glyphs = Array.from({ length: gCount }, () => ({
      char: HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)],
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      size: Math.random() * 14 + 10,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.004,
      opacity: Math.random() * 0.07 + 0.03,
    }));

    streams = Array.from({ length: REDUCED_MOTION ? 2 : 5 }, (_, i) => ({
      y: (h / 6) * (i + 1),
      offset: Math.random() * 1000,
      speed: 0.4 + Math.random() * 0.6,
    }));
  }

  document.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true }
  );

  function draw() {
    ctx.clearRect(0, 0, w, h);

    /* Data streams */
    streams.forEach((s) => {
      s.offset += s.speed;
      ctx.strokeStyle = "rgba(0, 209, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 12) {
        const y = s.y + Math.sin((x + s.offset) * 0.02) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(212, 175, 55, 0.35)";
      for (let x = (s.offset % 80); x < w; x += 80) {
        const y = s.y + Math.sin((x + s.offset) * 0.02) * 8;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    /* Particles + connections */
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        p.x -= (dx / dist) * 0.4;
        p.y -= (dy / dist) * 0.4;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(212, 175, 55, ${0.25 + p.r * 0.15})`
        : `rgba(0, 209, 255, ${0.2 + p.r * 0.12})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 90) {
          ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - d / 90) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    /* Floating hieroglyphs */
    glyphs.forEach((g) => {
      g.x += g.vx;
      g.y += g.vy;
      g.rot += g.rotV;
      if (g.x < -40) g.x = w + 40;
      if (g.x > w + 40) g.x = -40;
      if (g.y < -40) g.y = h + 40;
      if (g.y > h + 40) g.y = -40;

      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot);
      ctx.font = `${g.size}px serif`;
      ctx.fillStyle = `rgba(212, 175, 55, ${g.opacity})`;
      ctx.textAlign = "center";
      ctx.fillText(g.char, 0, 0);
      ctx.restore();
    });

    if (!REDUCED_MOTION) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  if (!REDUCED_MOTION) draw();
  else draw();
})();

/* ─── Nav ─── */
(function initNav() {
  const nav = document.getElementById("navbar");
  const toggle = document.querySelector(".mobile-toggle");
  const links = document.querySelector(".nav-links");

  window.addEventListener(
    "scroll",
    () => nav.classList.toggle("scrolled", window.scrollY > 40),
    { passive: true }
  );

  toggle?.addEventListener("click", () => links?.classList.toggle("open"));

  document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => links?.classList.remove("open"));
  });
})();

/* ─── Typewriter ─── */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  const phrases = [
    "Data Engineer",
    "ETL Developer",
    "AWS Certified Engineer",
    "Data Analytics Specialist",
  ];
  let pi = 0,
    ci = 0,
    del = false;

  function tick() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ci++);
      if (ci > cur.length) {
        del = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 75);
    } else {
      el.textContent = cur.slice(0, ci--);
      if (ci < 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        ci = 0;
      }
      setTimeout(tick, 45);
    }
  }
  tick();
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

/* ─── 3D tilt on power cards ─── */
document.querySelectorAll(".power-card").forEach((card) => {
  card.addEventListener(
    "mousemove",
    (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
      const rotX = (y - 50) / 25;
      const rotY = (50 - x) / 25;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    },
    { passive: true }
  );
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

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

/* ─── Parallax hero pipeline ─── */
(function initParallax() {
  const pipe = document.querySelector(".hero-pipeline");
  if (!pipe || REDUCED_MOTION) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY * 0.15;
      pipe.style.transform = `translateY(${y}px)`;
    },
    { passive: true }
  );
})();
