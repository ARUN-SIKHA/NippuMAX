/* =========================
   NippuKoodi — Phase 5 script.js (Full)
   - Collapses nav when screen is small OR nav overflows
   - Hamburger toggles overlay nav
   - Closes nav on outside click + Escape
   - Theme toggle (persists in localStorage)
   - Localization framework (data-i18n)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");

  const themeToggle = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langBtn");

  /* -------------------------
     NAV: collapse on overflow
  -------------------------- */
  if (header && nav && navToggle) {
    const mq = window.matchMedia("(max-width: 980px)");

    function isNavOverflowing() {
      // Measure in "desktop mode" only.
      // If header is already collapsed, nav is overlay -> measurement becomes meaningless.
      if (header.classList.contains("is-collapsed")) return false;
      return nav.scrollWidth > nav.clientWidth + 4;
    }

    function shouldCollapse() {
      return mq.matches || isNavOverflowing();
    }

    function closeNav() {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    function applyCollapseState() {
      // Ensure we're measuring real desktop layout first:
      header.classList.remove("is-collapsed");

      const collapse = shouldCollapse();
      header.classList.toggle("is-collapsed", collapse);

      // If not collapsed, nav must not be "open overlay"
      if (!collapse) closeNav();
      else {
        // When collapsed, hamburger must be usable
        navToggle.style.display = "inline-flex";
      }
    }

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const clickedInsideNav = nav.contains(e.target);
      const clickedToggle = navToggle.contains(e.target);
      if (!clickedInsideNav && !clickedToggle) closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", () => requestAnimationFrame(applyCollapseState));
    mq.addEventListener?.("change", applyCollapseState);

    applyCollapseState();
  }

  /* -------------------------
     THEME TOGGLE
  -------------------------- */
  if (themeToggle) {
    const THEME_KEY = "nippu_theme";

    function setTheme(theme) {
      if (theme === "dark") document.body.setAttribute("data-theme", "dark");
      else document.body.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, theme);
    }

    // Load saved theme, else prefer system
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  /* -------------------------
     LOCALIZATION (data-i18n)
     Use: <span data-i18n="nav.about"></span>
  -------------------------- */
  const I18N = {
    en: {
      "nav.about": "About",
      "nav.why": "Why",
      "nav.services": "Services",
      "nav.how": "How It Works",
      "nav.testimonials": "Testimonials",
      "nav.contact": "Contact",
      "nav.contactPage": "Contact Page",
      "hero.subtitle": "Verified workers. Clear process. Reliable staffing for teams that need results — not delays."
    },
    fi: {
      "nav.about": "Tietoa",
      "nav.why": "Miksi",
      "nav.services": "Palvelut",
      "nav.how": "Miten se toimii",
      "nav.testimonials": "Suositukset",
      "nav.contact": "Yhteys",
      "nav.contactPage": "Yhteyssivu",
      "hero.subtitle": "Varmistetut työntekijät. Selkeä prosessi. Luotettava henkilöstö yrityksille, jotka tarvitsevat tuloksia — ei viiveitä."
    }
  };

  const LANG_KEY = "nippu_lang";

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;

    document.documentElement.setAttribute("lang", lang === "fi" ? "fi" : "en");
    document.body.setAttribute("data-lang", lang);

    // Replace every node with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = dict[key];
      if (typeof value === "string") el.textContent = value;
    });

    localStorage.setItem(LANG_KEY, lang);

    // Update the language button label if present
    if (langBtn) {
      langBtn.innerHTML = (lang === "fi" ? "FI" : "EN") + ' <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      langBtn.setAttribute("aria-expanded", "false");
    }
  }

  // Load saved lang or default EN
  const savedLang = localStorage.getItem(LANG_KEY) || "en";
  applyLang(savedLang);

  // Simple toggle EN <-> FI (you can expand later)
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const current = (localStorage.getItem(LANG_KEY) || "en").toLowerCase();
      const next = current === "en" ? "fi" : "en";
      applyLang(next);
    });
  }
});
