/* ===== Phase 5 Header Layout + One-line Desktop Nav ===== */

/* Make sure these exist (light mode defaults) */
:root{
  --page-bg:#ffffff;
  --page-text:#0e1425;
  --muted:#5b647a;
  --header-bg: rgba(255,255,255,.92);
  --header-text:#0e1425;
  --footer-bg:#ffffff;
  --footer-text:#5b647a;
  --chip-bg: rgba(11,91,211,.08);
  --chip-text:#192033;
}

/* Dark theme (optional but fixes “invisible” issues) */
[data-theme="dark"]{
  --page-bg:#0b1020;
  --page-text:#eef2ff;
  --muted: rgba(238,242,255,.72);
  --header-bg: rgba(11,16,32,.72);
  --header-text:#eef2ff;
  --footer-bg:#0b1020;
  --footer-text: rgba(238,242,255,.72);
  --chip-bg: rgba(255,255,255,.10);
  --chip-text:#eef2ff;
}

body{
  background: var(--page-bg);
  color: var(--page-text);
}

/* HEADER */
.site-header{
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--header-bg);
  color: var(--header-text);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 10px 30px rgba(16,24,40,.06);
}

.header-inner{
  height: var(--header-h);
  display: grid;
  grid-template-columns: auto 1fr auto; /* brand | nav | actions */
  align-items: center;
  gap: var(--s-4);
}

/* NAV desktop: one row, spread out */
.nav{
  display: flex;
  align-items: center;
  justify-content: space-between; /* spreads items like your photo 2 */
  gap: clamp(10px, 2vw, 18px);
  white-space: nowrap;
  min-width: 0;
}

.nav a{
  font-weight: 850;
  font-size: 14px;
  color: var(--chip-text);
  padding: 10px 10px;
  border-radius: 12px;
  line-height: 1;
  transition: background 160ms var(--ease-out), color 160ms var(--ease-out);
}
.nav a:hover{ background: var(--chip-bg); }

.nav .nav-cta{
  background: var(--primary);
  color:#fff;
  padding: 10px 14px;
}
.nav .nav-cta:hover{ background: var(--primary2); }

/* “More” dropdown */
.nav-more{
  position: relative;
}
.nav-more summary{
  list-style: none;
  cursor: pointer;
  user-select: none;
  font-weight: 850;
  font-size: 14px;
  padding: 10px 10px;
  border-radius: 12px;
  color: var(--chip-text);
}
.nav-more summary::-webkit-details-marker{ display:none; }
.nav-more summary:hover{ background: var(--chip-bg); }

.nav-more-menu{
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 220px;
  background: var(--page-bg);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 8px;
  display: grid;
  gap: 4px;
}
.nav-more[open] .nav-more-menu{ animation: fadeIn 120ms ease-out; }

.nav-more-menu a{
  padding: 10px 10px;
  border-radius: 12px;
  color: var(--page-text);
}
.nav-more-menu a:hover{
  background: var(--chip-bg);
}

@keyframes fadeIn{
  from{ opacity: 0; transform: translateY(-4px); }
  to{ opacity: 1; transform: translateY(0); }
}

/* Right side actions */
.header-actions{
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

.icon-btn{
  height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--page-bg);
  color: var(--page-text);
  font-weight: 850;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Hamburger button (now lives in header-actions) */
.nav-toggle{
  display: none; /* desktop hidden */
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  background: var(--page-bg);
  border-radius: 12px;
  cursor: pointer;
}
.nav-toggle-bars{
  display:block;
  width:18px; height:2px;
  background: currentColor;
  margin:0 auto;
  position:relative;
  transition: background 180ms ease;
}
.nav-toggle-bars::before,.nav-toggle-bars::after{
  content:"";
  position:absolute; left:0;
  width:18px; height:2px;
  background: currentColor;
  transition: transform 180ms ease, top 180ms ease;
}
.nav-toggle-bars::before{ top:-6px; }
.nav-toggle-bars::after{ top:6px; }

.nav-toggle.is-open .nav-toggle-bars{ background: transparent; }
.nav-toggle.is-open .nav-toggle-bars::before{ top:0; transform: rotate(45deg); }
.nav-toggle.is-open .nav-toggle-bars::after{ top:0; transform: rotate(-45deg); }

/* Mobile: collapse nav into overlay, hamburger on right */
@media (max-width: 980px){
  .header-inner{
    grid-template-columns: auto 1fr auto;
  }

  .nav-toggle{ display: inline-flex; align-items:center; justify-content:center; }

  .nav{
    position: fixed;
    left: 16px;
    right: 16px;
    top: calc(var(--header-h) + 10px);

    background: var(--page-bg);
    color: var(--page-text);
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: var(--shadow);
    padding: var(--s-2);

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;

    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    visibility: hidden;

    transition: opacity 220ms ease, transform 220ms ease, visibility 0s linear 220ms;
  }

  .nav.is-open{
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    visibility: visible;
    transition: opacity 220ms ease, transform 220ms ease, visibility 0s;
  }

  .nav-more{
    width: 100%;
  }
  .nav-more-menu{
    position: static;
    min-width: auto;
    box-shadow: none;
    border-radius: 12px;
    margin-top: 6px;
  }
}

/* FOOTER visibility fix for both themes */
.site-footer{
  background: var(--footer-bg);
  border-top: 1px solid var(--line);
}
.site-footer p,
.footer-links a{
  color: var(--footer-text);
}
