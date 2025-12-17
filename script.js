(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===== Phase 5: Theme (Dark mode toggle) =====
  function initTheme() {
    const root = document.documentElement;
    const btn = $("#themeToggle");
    const saved = localStorage.getItem("nk_theme"); // "dark" | "light" | null

    if (saved === "dark") root.setAttribute("data-theme", "dark");
    if (saved === "light") root.setAttribute("data-theme", "light");

    const applyLabel = () => {
      if (!btn) return;
      const isDark = root.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    };

    if (btn) {
      btn.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        root.setAttribute("data-theme", isDark ? "light" : "dark");
        localStorage.setItem("nk_theme", isDark ? "light" : "dark");
        applyLabel();
      });
    }

    applyLabel();
  }

  // ===== Phase 5: Localization (EN/FI) =====
  const I18N = {
    en: {
      nav_about: "About",
      nav_why: "Why",
      nav_services: "Services",
      nav_how: "How It Works",
      nav_testimonials: "Testimonials",
      nav_contact: "Contact",
      nav_companies: "For Companies",
      nav_workers: "For Workers",
      nav_process: "Process",
      nav_blog: "Insights",
      nav_cases: "Case Studies",
      nav_dashboard: "Dashboard",
      nav_contact_page: "Contact Page",
      hero_title: "Connecting Skilled Workers",
      hero_sub: "Verified workers. Clear process. Reliable staffing for teams that need results — not delays.",
      trust_strip: "Supporting teams across logistics, construction, operations, and technical roles",
      cta_ready: "Ready for reliable staffing?",
      cta_sub: "Choose the flow that fits you — company hiring or worker joining — and we’ll guide the next step.",
      form_status_sending: "Sending…",
      form_status_ok: "Message sent successfully. We’ll get back to you soon.",
      form_status_err: "Something went wrong. Please try again, or use the Contact Page.",
      form_status_net: "Network error. Please try again, or use the Contact Page.",
      lang_label: "EN",
    },
    fi: {
      nav_about: "Tietoa",
      nav_why: "Miksi",
      nav_services: "Palvelut",
      nav_how: "Miten toimii",
      nav_testimonials: "Arviot",
      nav_contact: "Yhteys",
      nav_companies: "Yrityksille",
      nav_workers: "Työntekijöille",
      nav_process: "Prosessi",
      nav_blog: "Insights",
      nav_cases: "Case-tarinat",
      nav_dashboard: "Dashboard",
      nav_contact_page: "Yhteyssivu",
      hero_title: "Yhdistämme osaajat ja työn",
      hero_sub: "Varmistetut työntekijät. Selkeä prosessi. Luotettava henkilöstöratkaisu ilman viivästyksiä.",
      trust_strip: "Tukemme kattaa logistiikan, rakentamisen, operatiiviset ja tekniset roolit",
      cta_ready: "Valmiina luotettavaan henkilöstöön?",
      cta_sub: "Valitse sinulle sopiva polku — yritys tai työntekijä — ja ohjaamme seuraaviin askeliin.",
      form_status_sending: "Lähetetään…",
      form_status_ok: "Viesti lähetetty. Palaamme asiaan pian.",
      form_status_err: "Jokin meni pieleen. Yritä uudelleen tai käytä Yhteyssivua.",
      form_status_net: "Verkkovirhe. Yritä uudelleen tai käytä Yhteyssivua.",
      lang_label: "FI",
    },
  };

  function applyLanguage(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.setAttribute("lang", lang);

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || !(key in dict)) return;
      el.textContent = dict[key];
    });

    // placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !(key in dict)) return;
      el.setAttribute("placeholder", dict[key]);
    });

    // store current for other functions
    document.documentElement.setAttribute("data-lang", lang);
  }

  function initLanguage() {
    const btn = $("#langToggle");
    const saved = localStorage.getItem("nk_lang"); // "en" | "fi" | null

    const initial =
      saved ||
      (navigator.language && navigator.language.toLowerCase().startsWith("fi") ? "fi" : "en");

    applyLanguage(initial);

    const updateBtn = () => {
      if (!btn) return;
      const lang = document.documentElement.getAttribute("data-lang") || "en";
      btn.setAttribute("aria-label", lang === "en" ? "Switch language to Finnish" : "Vaihda kieli englanniksi");
      btn.querySelector("span").textContent = (I18N[lang] || I18N.en).lang_label;
    };

    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-lang") || "en";
        const next = current === "en" ? "fi" : "en";
        localStorage.setItem("nk_lang", next);
        applyLanguage(next);
        updateBtn();
      });
    }

    updateBtn();
  }

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
    if (!document.body.hasAttribute("data-animate")) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = $$(".section, .site-footer, .cta-strip");
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

    // Only activate section highlighting on pages that have hash sections
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

    const hash = window.location.hash.replace("#", "");
    if (hash) setActive(hash);
    else setActive(sections[0].id);
  }

  // Prefill contact selects (?role=Company&topic=Hiring)
  function initPrefillContact() {
    const role = $("#role");
    const topic = $("#topic");
    if (!role && !topic) return;

    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    const topicParam = params.get("topic");

    if (role && roleParam) {
      const match = Array.from(role.options).find((o) => o.value.toLowerCase() === roleParam.toLowerCase());
      if (match) role.value = match.value;
    }

    if (topic && topicParam) {
      const match = Array.from(topic.options).find((o) => o.value.toLowerCase() === topicParam.toLowerCase());
      if (match) topic.value = match.value;
    }
  }

  // Smarter contact UX (AJAX submit + status message)
  function initSmartForms() {
    const forms = $$("form[data-formspree]");
    if (!forms.length) return;

    forms.forEach((form) => {
      const statusEl =
        form.querySelector(".form-status") ||
        (() => {
          const p = document.createElement("p");
          p.className = "form-status";
          p.setAttribute("aria-live", "polite");
          form.appendChild(p);
          return p;
        })();

      const submitBtn = form.querySelector('button[type="submit"]');

      form.addEventListener("submit", async (e) => {
        if (!window.fetch) return;

        e.preventDefault();
        statusEl.classList.remove("is-success", "is-error");

        const lang = document.documentElement.getAttribute("data-lang") || "en";
        const dict = I18N[lang] || I18N.en;

        statusEl.textContent = dict.form_status_sending;
        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });

          if (res.ok) {
            form.reset();
            statusEl.classList.add("is-success");
            statusEl.textContent = dict.form_status_ok;
          } else {
            statusEl.classList.add("is-error");
            statusEl.textContent = dict.form_status_err;
          }
        } catch (err) {
          statusEl.classList.add("is-error");
          statusEl.textContent = dict.form_status_net;
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLanguage();
    initNav();
    initHeroSlider();
    initReveal();
    initActiveNav();
    initPrefillContact();
    initSmartForms();
  });
})();
