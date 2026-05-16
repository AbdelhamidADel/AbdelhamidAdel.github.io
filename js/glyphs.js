/* Hieroglyphic UI accents — motion & hero field */

(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GLYPHS = ["𓂀", "☥", "𓊽", "𓇳", "𓋹", "𓏏", "𓈖", "𓎛"];

  /* Hero floating glyphs */
  function initHeroGlyphs() {
    const field = document.querySelector(".hero-glyph-field");
    if (!field) return;

    const positions = [
      { top: "12%", left: "8%" },
      { top: "22%", left: "88%" },
      { top: "55%", left: "4%" },
      { top: "70%", left: "92%" },
      { top: "38%", left: "78%" },
      { top: "82%", left: "18%" },
      { top: "18%", left: "42%" },
      { top: "48%", left: "55%" },
    ];

    positions.forEach((pos, i) => {
      const el = document.createElement("span");
      el.className = "hero-glyph";
      el.textContent = GLYPHS[i % GLYPHS.length];
      el.style.top = pos.top;
      el.style.left = pos.left;
      el.style.setProperty("--d", String(i));
      el.setAttribute("aria-hidden", "true");
      field.appendChild(el);
    });
  }

  /* Section glyph pulse on scroll */
  function initSectionGlyphs() {
    const glyphs = document.querySelectorAll(".section-glyph");
    if (!glyphs.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("glyph-pulse");
            setTimeout(() => e.target.classList.remove("glyph-pulse"), 1200);
          }
        });
      },
      { threshold: 0.6 }
    );

    glyphs.forEach((g) => obs.observe(g.closest(".section-label") || g));
  }

  /* Subtle glyph shimmer on archive toggle */
  function initArchiveGlyphs() {
    document.querySelectorAll(".archive-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (REDUCED) return;
        card.classList.add("glyph-flash");
        setTimeout(() => card.classList.remove("glyph-flash"), 650);
      });
    });
  }

  initHeroGlyphs();
  initSectionGlyphs();
  initArchiveGlyphs();
})();
