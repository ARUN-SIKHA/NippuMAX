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
    else setActive("about");
  }

  // Phase 3: Prefill contact select from URL params (?role=Company&topic=Hiring)
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

  // Phase 3: Smarter contact UX (AJAX submit + status message)
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
        // If fetch isn't available, let normal form submit happen
        if (!window.fetch) return;

        e.preventDefault();
        statusEl.classList.remove("is-success", "is-error");
        statusEl.textContent = "Sending…";

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
            statusEl.textContent = "Message sent successfully. We’ll get back to you soon.";
          } else {
            statusEl.classList.add("is-error");
            statusEl.textContent = "Something went wrong. Please try again, or use the Contact Page.";
          }
        } catch (err) {
          statusEl.classList.add("is-error");
          statusEl.textContent = "Network error. Please try again, or use the Contact Page.";
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initHeroSlider();
    initReveal();
    initActiveNav();
    initPrefillContact();
    initSmartForms();
  });
})();
