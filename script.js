/* =========================
   NippuKoodi — script.js (Fixed)
   - Hamburger appears only when screen is small OR nav overflows
   - Theme toggle: moon <-> sun (icon updates)
   - Language toggle: EN <-> FI
   - Localization: data-i18n / placeholder / value / options
   - If FI selected and translation missing => EMPTY (no English leakage)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");

  const themeToggle = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langBtn");

  /* -------------------------
     NAV collapse on overflow
  -------------------------- */
  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function measureNavOverflow() {
    if (!header || !nav) return false;

    // Temporarily ensure we're measuring "desktop layout" (not overlay)
    const wasCollapsed = header.classList.contains("is-collapsed");
    if (wasCollapsed) header.classList.remove("is-collapsed");

    // Force layout flush
    // eslint-disable-next-line no-unused-expressions
    nav.offsetWidth;

    const overflows = nav.scrollWidth > nav.clientWidth + 8;

    // Restore state
    if (wasCollapsed) header.classList.add("is-collapsed");

    return overflows;
  }

  function applyCollapseState() {
    if (!header || !nav || !navToggle) return;

    const small = window.matchMedia("(max-width: 980px)").matches;
    const overflow = measureNavOverflow();
    const collapse = small || overflow;

    header.classList.toggle("is-collapsed", collapse);

    if (!collapse) closeNav();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!header) return;
      if (!header.classList.contains("is-collapsed")) return;

      const clickedNav = nav.contains(e.target);
      const clickedToggle = navToggle.contains(e.target);
      if (!clickedNav && !clickedToggle) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    let rt = null;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(applyCollapseState, 60);
    });

    setTimeout(applyCollapseState, 0);
    setTimeout(applyCollapseState, 250);
  }

  /* -------------------------
     THEME toggle (moon/sun)
  -------------------------- */
  const THEME_KEY = "nippu_theme";

  function currentTheme() {
    return document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function renderThemeIcon() {
    if (!themeToggle) return;

    // If you use the two <i> icons inside the button, CSS will handle display.
    // If button is empty, we inject a single icon.
    const hasMoon = themeToggle.querySelector(".theme-icon-moon");
    const hasSun = themeToggle.querySelector(".theme-icon-sun");

    if (hasMoon && hasSun) return;

    const t = currentTheme();
    themeToggle.innerHTML =
      t === "dark"
        ? `<i class="fa-solid fa-sun" aria-hidden="true"></i>`
        : `<i class="fa-solid fa-moon" aria-hidden="true"></i>`;
  }

  function setTheme(next) {
    document.body.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    renderThemeIcon();
    applyCollapseState(); // theme can slightly change widths -> re-check overflow
  }

  if (themeToggle) {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    themeToggle.addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  /* -------------------------
     LOCALIZATION
  -------------------------- */
  const LANG_KEY = "nippu_lang";

  const I18N = {
    en: {
      // nav
      "nav.about": "About",
      "nav.why": "Why",
      "nav.services": "Services",
      "nav.how": "How It Works",
      "nav.testimonials": "Testimonials",
      "nav.contact": "Contact",
      "nav.more": "More",
      "nav.forCompanies": "For Companies",
      "nav.forWorkers": "For Workers",
      "nav.process": "Process",
      "nav.dashboard": "Dashboard",
      "nav.insights": "Insights",
      "nav.cases": "Case Studies",
      "nav.contactPage": "Contact Page",

      // index hero
      "hero.title": "Connecting Skilled Workers",
      "hero.sub": "Verified workers. Clear process. Reliable staffing for teams that need results — not delays.",
      "hero.cta.company": "Hire Workers",
      "hero.cta.worker": "Join as a Worker",
      "hero.cta.process": "See the Process",
      "metric.fast": "Fast",
      "metric.fast.sub": "Quick placements",
      "metric.vetted": "Vetted",
      "metric.vetted.sub": "Verified workers",
      "metric.reliable": "Reliable",
      "metric.reliable.sub": "Trusted companies",
      "trust.strip": "Supporting teams across logistics, construction, operations, and technical roles",

      // choose path
      "path.title": "Choose your path",
      "path.sub": "Pick the flow that fits you — company hiring or worker joining.",
      "path.company": "For Companies",
      "path.company.sub": "Request vetted workers with clear expectations.",
      "path.worker": "For Workers",
      "path.worker.sub": "Join the vetted workforce with reliable placements.",

      // generic buttons
      "btn.backHome": "Back to Home",
      "btn.contact": "Contact us",
      "btn.askQuestion": "Ask a question",

      // blog
      "blog.title": "Insights",
      "blog.sub": "Short, practical notes on staffing clarity, reliability, and how to reduce hiring uncertainty.",
      "blog.latest": "Latest posts",
      "blog.latestSub": "No filler. Just high-signal guidance.",

      // cases
      "cases.title": "Case Studies",
      "cases.sub": "Examples of how trust-first staffing reduces risk and improves operational stability.",
      "cases.featured": "Featured cases",
      "cases.featuredSub": "Structured summaries: problem → approach → outcome.",

      // history/about
      "about.title": "About NippuKoodi",
      "about.sub": "Mission, approach, and commitment — how NippuKoodi delivers reliable staffing.",
    },

    fi: {
      // nav
      "nav.about": "Tietoa",
      "nav.why": "Miksi",
      "nav.services": "Palvelut",
      "nav.how": "Miten se toimii",
      "nav.testimonials": "Suositukset",
      "nav.contact": "Yhteys",
      "nav.more": "Lisää",
      "nav.forCompanies": "Yrityksille",
      "nav.forWorkers": "Työntekijöille",
      "nav.process": "Prosessi",
      "nav.dashboard": "Hallintapaneeli",
      "nav.insights": "Ajankohtaista",
      "nav.cases": "Tapaustutkimukset",
      "nav.contactPage": "Yhteyssivu",

      // index hero
      "hero.title": "Yhdistämme osaavat työntekijät",
      "hero.sub": "Varmistetut työntekijät. Selkeä prosessi. Luotettava henkilöstö tiimeille, jotka tarvitsevat tuloksia — ei viivästyksiä.",
      "hero.cta.company": "Palkkaa työntekijöitä",
      "hero.cta.worker": "Liity työntekijäksi",
      "hero.cta.process": "Katso prosessi",
      "metric.fast": "Nopea",
      "metric.fast.sub": "Nopeat sijoitukset",
      "metric.vetted": "Tarkistettu",
      "metric.vetted.sub": "Varmistetut työntekijät",
      "metric.reliable": "Luotettava",
      "metric.reliable.sub": "Luotetut yritykset",
      "trust.strip": "Tukemme logistiikan, rakentamisen, operaatioiden ja teknisten roolien tiimeille",

      // choose path
      "path.title": "Valitse polkusi",
      "path.sub": "Valitse sinulle sopiva: yrityksen rekrytointi tai työntekijäksi liittyminen.",
      "path.company": "Yrityksille",
      "path.company.sub": "Pyydä tarkistetut työntekijät selkein odotuksin.",
      "path.worker": "Työntekijöille",
      "path.worker.sub": "Liity tarkistettuun työvoimaan ja saa luotettavia sijoituksia.",

      // generic buttons
      "btn.backHome": "Takaisin etusivulle",
      "btn.contact": "Ota yhteyttä",
      "btn.askQuestion": "Kysy kysymys",

      // blog
      "blog.title": "Ajankohtaista",
      "blog.sub": "Lyhyitä, käytännöllisiä huomioita rekrytoinnin selkeydestä, luotettavuudesta ja epävarmuuden vähentämisestä.",
      "blog.latest": "Uusimmat",
      "blog.latestSub": "Ei täytettä. Vain olennaista.",

      // cases
      "cases.title": "Tapaustutkimukset",
      "cases.sub": "Esimerkkejä siitä, miten luottamukseen perustuva henkilöstö vähentää riskiä ja parantaa toimintavarmuutta.",
      "cases.featured": "Esittelyssä",
      "cases.featuredSub": "Rakenteiset yhteenvedot: ongelma → tapa → lopputulos.",

      // history/about
      "about.title": "Tietoa NippuKoodista",
      "about.sub": "Missio, toimintatapa ja sitoumus — miten NippuKoodi tuottaa luotettavaa henkilöstöä.",
    },
  };

  function getLang() {
    const saved = (localStorage.getItem(LANG_KEY) || "en").toLowerCase();
    return saved === "fi" ? "fi" : "en";
  }

  function setLang(next) {
    localStorage.setItem(LANG_KEY, next);
    applyLang(next);
    applyCollapseState(); // language length changes widths -> re-check overflow
  }

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;

    document.documentElement.setAttribute("lang", lang);
    document.body.setAttribute("data-lang", lang);

    // text nodes
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];

      if (typeof val === "string") el.textContent = val;
      else el.textContent = lang === "fi" ? "" : (I18N.en[key] || "");
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = dict[key];
      el.setAttribute("placeholder", typeof val === "string" ? val : (lang === "fi" ? "" : (I18N.en[key] || "")));
    });

    // values
    document.querySelectorAll("[data-i18n-value]").forEach((el) => {
      const key = el.getAttribute("data-i18n-value");
      const val = dict[key];
      el.value = typeof val === "string" ? val : (lang === "fi" ? "" : (I18N.en[key] || ""));
    });

    // option text
    document.querySelectorAll("option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      const val = dict[key];
      opt.textContent = typeof val === "string" ? val : (lang === "fi" ? "" : (I18N.en[key] || ""));
    });

    if (langBtn) {
      langBtn.innerHTML = (lang === "fi" ? "FI" : "EN") + ' <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      langBtn.setAttribute("aria-expanded", "false");
    }
  }

  // initial language
  applyLang(getLang());

  // toggle EN/FI
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      setLang(getLang() === "en" ? "fi" : "en");
    });
  }
});
