(function () {
  "use strict";

  const body = document.body;
  const root = body.dataset.root || "./";
  const page = body.dataset.page || "home";
  const config = window.LAMMA_CONFIG || { tally: {}, social: {} };

  const pages = {
    home: { href: `${root}index.html`, ar: "الرئيسية", en: "Home" },
    gatherings: { href: `${root}gatherings/index.html`, ar: "اللمات", en: "Gatherings" },
    fellowship: { href: `${root}fellowship/index.html`, ar: "الزمالة الإبداعية", en: "Creative Fellowship" },
    spaces: { href: `${root}spaces/index.html`, ar: "المساحات المشتركة", en: "Shared Spaces" },
    contact: { href: `${root}contact/index.html`, ar: "التواصل والانضمام", en: "Contact / Join" }
  };

  function navLinks(className) {
    return Object.entries(pages).map(([key, item]) => {
      const active = key === page ? ' aria-current="page"' : "";
      return `<a class="${className}${key === page ? " active" : ""}" href="${item.href}" data-ar="${item.ar}" data-en="${item.en}"${active}>${item.ar}</a>`;
    }).join("");
  }

  function renderShell() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");

    if (header) {
      header.innerHTML = `
        <div class="nav-wrap">
          <div class="container">
            <nav class="nav" aria-label="Primary navigation">
              <a class="brand" href="${pages.home.href}" aria-label="Lamma home">
                <img class="brand-logo" src="${root}assets/images/logo/lamma-logo.svg" alt="" width="75" height="42">
              </a>
              <div class="nav-links">${navLinks("nav-link")}</div>
              <div class="nav-actions">
                <button class="lang" type="button" data-lang-toggle aria-label="Switch language">EN</button>
                <a class="btn small nav-join" href="${pages.contact.href}" data-ar="انضم للمجتمع ✦" data-en="Join the Community ✦">انضم للمجتمع ✦</a>
                <button class="menu-btn" type="button" data-menu-open aria-label="Open menu" aria-controls="mobileMenu" aria-expanded="false">
                  <span></span><span></span><span></span>
                </button>
              </div>
            </nav>
          </div>
        </div>
        <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
          <button class="mobile-menu-backdrop" type="button" data-menu-close aria-label="Close menu"></button>
          <div class="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div class="mobile-menu-top">
              <a class="brand" href="${pages.home.href}" aria-label="Lamma home">
                <img class="brand-logo" src="${root}assets/images/logo/lamma-logo.svg" alt="" width="75" height="42">
              </a>
              <button class="menu-close" type="button" data-menu-close aria-label="Close menu">×</button>
            </div>
            <div class="mobile-links">${navLinks("mobile-link")}</div>
            <button class="lang mobile-lang" type="button" data-lang-toggle aria-label="Switch language">EN</button>
            <a class="btn mobile-join" href="${pages.contact.href}" data-ar="انضم للمجتمع ✦" data-en="Join the Community ✦">انضم للمجتمع ✦</a>
          </div>
        </div>`;
    }

    if (footer) {
      footer.innerHTML = `
        <div class="container footer">
          <div>
            <a class="brand" href="${pages.home.href}" aria-label="Lamma home">
              <img class="brand-logo" src="${root}assets/images/logo/lamma-logo.svg" alt="" width="75" height="42">
            </a>
            <small data-ar="مجتمع إبداعي | إحدى منتجات وكالة حبك" data-en="A creative community | A product by Habak Agency">مجتمع إبداعي | إحدى منتجات وكالة حبك</small>
          </div>
          <nav class="footer-nav" aria-label="Footer navigation">${navLinks("footer-link")}</nav>
          <div class="socials" aria-label="Social media">
            <a data-config-href="social.instagram" data-fallback="disabled" href="${pages.contact.href}">Instagram</a>
            <a data-config-href="social.linkedin" data-fallback="disabled" href="${pages.contact.href}">LinkedIn</a>
            <a data-config-href="social.linktree" data-fallback="disabled" href="${pages.contact.href}">Linktree</a>
          </div>
        </div>`;
    }
  }

  function getConfigValue(path) {
    return path.split(".").reduce((value, key) => value && value[key], config);
  }

  function isExternalUrl(value) {
    if (typeof value !== "string") return false;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (_) {
      return false;
    }
  }

  function applyConfiguredLinks() {
    document.querySelectorAll("[data-config-href]").forEach((link) => {
      const value = getConfigValue(link.dataset.configHref);
      if (isExternalUrl(value)) {
        link.href = value;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
        link.removeAttribute("tabindex");
        link.classList.remove("is-disabled");
        link.removeAttribute("data-unconfigured");
        link.hidden = false;
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.dataset.unconfigured = "true";
        if (link.dataset.configHref.startsWith("social.")) {
          link.hidden = true;
        }
        if (link.dataset.fallback === "disabled") {
          link.removeAttribute("href");
          link.setAttribute("aria-disabled", "true");
          link.setAttribute("tabindex", "-1");
          link.classList.add("is-disabled");
          if (!link.querySelector(".soon-badge")) {
            link.insertAdjacentHTML("beforeend", '<span class="soon-badge" data-ar="قريبًا" data-en="Soon">قريبًا</span>');
          }
        }
      }
    });
    document.querySelectorAll(".socials").forEach((group) => {
      group.hidden = !group.querySelector("a:not([hidden])");
    });
  }

  let lang = localStorage.getItem("lamma-lang") === "en" ? "en" : "ar";

  function setLanguage(nextLanguage) {
    lang = nextLanguage === "en" ? "en" : "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    body.classList.toggle("en", lang === "en");

    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
      element.innerHTML = element.dataset[lang];
    });
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.textContent = lang === "ar" ? "EN" : "AR";
      button.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    });

    const title = body.dataset[`title${lang === "ar" ? "Ar" : "En"}`];
    if (title) document.title = title;
    localStorage.setItem("lamma-lang", lang);
  }

  function setupLanguage() {
    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-lang-toggle]");
      if (toggle) setLanguage(lang === "ar" ? "en" : "ar");
    });
    setLanguage(lang);
  }

  function setupMenu() {
    const menu = document.getElementById("mobileMenu");
    const openButton = document.querySelector("[data-menu-open]");
    if (!menu || !openButton) return;
    let lastFocus = null;

    function openMenu() {
      lastFocus = document.activeElement;
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      body.classList.add("menu-open");
      menu.querySelector("[data-menu-close]").focus();
    }

    function closeMenu() {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
      if (lastFocus) lastFocus.focus();
    }

    openButton.addEventListener("click", openMenu);
    menu.querySelectorAll("[data-menu-close], a").forEach((element) => element.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
  }

  function setupParallax() {
    const stage = document.querySelector(".visual-stage");
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.querySelectorAll(".word-chip").forEach((element, index) => {
        const movement = (index + 1) * 8;
        element.style.transform = `translate(${x * movement}px, ${y * movement}px)`;
      });
    });
    stage.addEventListener("pointerleave", () => {
      stage.querySelectorAll(".word-chip").forEach((element) => { element.style.transform = ""; });
    });
  }

  renderShell();
  applyConfiguredLinks();
  setupLanguage();
  setupMenu();
  setupParallax();
})();
