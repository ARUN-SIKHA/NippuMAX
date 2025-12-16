(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initNav() {
    const toggle = $("#navToggle");
    const nav = $("#siteNav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open); // ✅ triggers hamburger -> X animation
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

    // Close on link click (mobile)
    $$("#siteNav a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    // Close if clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const within = nav.contains(e.target) || toggle.contains(e.target);
      if (!within) setOpen(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function preloadImages(urls) {
    return Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ url, ok: true });
            img.onerror = () => resolve({ url, ok: false });
            img.src = url;
          })
      )
    );
  }

  function initHeroSlider() {
    const slides = $$(".hero-slide");
    if (!slides.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fix slide1 accidentally being the logo by using slide1.jpg + fallback to slide2.jpg.
    // If slide1.jpg doesn't exist, it will fall back (and NOT show logo.png).
    const slide1 = $("#slide1img");
    if (slide1) {
      slide1.addEventListener(
        "error",
        () => {
          const fallback = slide1.getAttribute("data-fallback");
          if (fallback && slide1.src.indexOf(fallback) === -1) slide1.src = fallback;
        },
        { once: true }
      );
    }

    const imgs = slides
      .map((s) => $("img", s))
      .filter(Boolean)
      .map((img) => img.getAttribute("src"));

    // Preload, then start
    preloadImages(imgs).finally(() => {
      let index = 0;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === 0));

      if (reduceMotion) return; // no autoplay for reduced motion

      const intervalMs = 4500;

      setInterval(() => {
        slides[index].classList.remove("is-active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("is-active");
      }, intervalMs);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initHeroSlider();
  });
})();
