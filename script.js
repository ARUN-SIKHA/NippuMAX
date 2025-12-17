document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");

  if (!header || !nav || !toggle) return;

  function shouldCollapse() {
    const small = window.matchMedia("(max-width: 980px)").matches;

    // IMPORTANT: measure overflow only in desktop layout
    // If nav is already overlay/fixed, scrollWidth checks become meaningless
    const isOverlayMode = header.classList.contains("is-collapsed");
    if (small) return true;

    // Temporarily ensure nav is not in open overlay state for accurate measurement
    const wasOpen = nav.classList.contains("is-open");
    if (wasOpen) nav.classList.remove("is-open");

    const navOverflows = nav.scrollWidth > nav.clientWidth + 8;

    if (wasOpen) nav.classList.add("is-open");

    return navOverflows;
  }

  function applyCollapseState() {
    const collapse = shouldCollapse();
    header.classList.toggle("is-collapsed", collapse);

    if (!collapse) {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  window.addEventListener("resize", applyCollapseState);
  applyCollapseState();
});
