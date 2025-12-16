(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initNav() {
    const toggle = $("#navToggle");
    const nav = $("#siteNav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

    $$("#siteNav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const within = nav.contains(e.target) || toggle.contains(e.target);
      if (!within) setOpen(false);
    });

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

    const slide1 = $("#slide1img");
    if (slide1) {
      slide1.addEventListener(
        "error",
        () => {
          const fallback = slide1.getAttribute("data-fallback");
          if (fallback && !slide1.src.includes(fallback)) slide1.src = fallback;
        },
        { once: true }
      );
    }

    const imgs = slides
      .map((s) => $("img", s))
      .filter(Boolean)
      .map((img) => img.getAttribute("src"));

    preloadImages(imgs).finally(() => {
      let index = 0;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === 0));
      if (reduceMotion) return;

      const intervalMs = 4500;
      setInterval(() => {
        slides[index].classList.remove("is-active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("is-active");
      }, intervalMs);
    });
  }

  function initReveal() {
    // only if body opted in
    if (!document.body.hasAttribute("data-animate")) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = $$(".section, .site-footer");
    targets.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((el) => io.observe(el));
  }

  function initActiveNav() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    },
    { threshold: [0.15, 0.25, 0.4, 0.6], rootMargin: "-15% 0px -70% 0px" }
  );

  sections.forEach((s) => io.observe(s));

 // default on load (use hash if present, else About)
const hash = window.location.hash.replace("#", "");
if (hash) setActive(hash);
else setActive("about");
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeroSlider();
  initReveal();
  initActiveNav();
});
})();
