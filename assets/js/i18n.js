// Locale by country: Russia → ru, else → en
(() => {
  const STORAGE_KEY = "site-locale";
  const RU_COUNTRY = "RU";

  const STRINGS = {
    en: {
      "meta.description":
        "Nikita Korablev — product advertising: concept, storyboard, render, and post-production.",
      "nav.work": "Work",
      "nav.workBack": "← Work",
      "nav.navigation": "Navigation",
      "nav.home": "Home",
      "nav.portfolio": "Portfolio",
      "hero.eyebrow": "Product Advertising",
      "hero.title":
        'I specialize in <em>product advertising</em> — from concept and storyboarding to final render and post-production',
      "hero.workBelow": "My work below",
      "hero.scrollWork": "Scroll to work",
      "footer.heading": 'Get in<br><span>touch</span>',
      "footer.backTop": "↑ Back to top",
      "fab.backTop": "Back to top",
      "lightbox.close": "Close video",
      "lightbox.error":
        "Video is still loading or unavailable. Try again in a moment.",
      "badge.soon": "soon",
      "project.kicker": "Project",
      "project.soon": "Video coming soon",
    },
    ru: {
      "meta.description":
        "Никита Корablёв — реклама продуктов: концепция, сториборд, рендер и постпродакшн.",
      "nav.work": "Работы",
      "nav.workBack": "← Работы",
      "nav.navigation": "Навигация",
      "nav.home": "Главная",
      "nav.portfolio": "Портфолио",
      "hero.eyebrow": "Реклама продуктов",
      "hero.title":
        "Я специализируюсь на <em>рекламе продуктов</em> — от концепции и сториборда до финального рендера и постпродакшна",
      "hero.workBelow": "Мои работы ниже",
      "hero.scrollWork": "К работам",
      "footer.heading": 'Свяжитесь<br><span>со мной</span>',
      "footer.backTop": "↑ Наверх",
      "fab.backTop": "Наверх",
      "lightbox.close": "Закрыть видео",
      "lightbox.error":
        "Видео ещё загружается или недоступно. Попробуйте через минуту.",
      "badge.soon": "скоро",
      "project.kicker": "Проект",
      "project.soon": "Видео скоро",
    },
  };

  const localeFromUrl = () => {
    const lang = new URLSearchParams(location.search).get("lang");
    if (lang === "ru" || lang === "en") return lang;
    return null;
  };

  const localeFromBrowser = () =>
    (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en";

  const fetchCountryCode = async () => {
    const withTimeout = (ms) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    };

    const controllers = [
      async () => {
        const res = await fetch("https://ipapi.co/country_code/", {
          signal: withTimeout(2500),
        });
        if (!res.ok) throw new Error("ipapi");
        return (await res.text()).trim().toUpperCase();
      },
      async () => {
        const res = await fetch("https://get.geojs.io/v1/ip/country.json", {
          signal: withTimeout(2500),
        });
        if (!res.ok) throw new Error("geojs");
        const data = await res.json();
        return String(data.country || "").toUpperCase();
      },
    ];

    for (const attempt of controllers) {
      try {
        const code = await attempt();
        if (code) return code;
      } catch {
        /* try next provider */
      }
    }
    return null;
  };

  const resolveLocale = async () => {
    const forced = localeFromUrl();
    if (forced) return forced;

    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached === "ru" || cached === "en") return cached;

    const country = await fetchCountryCode();
    if (country === RU_COUNTRY) return "ru";
    if (country) return "en";
    return localeFromBrowser();
  };

  const t = (key) => {
    const locale = document.documentElement.lang === "ru" ? "ru" : "en";
    return STRINGS[locale][key] ?? STRINGS.en[key] ?? key;
  };

  const applyLocale = (locale) => {
    const lang = locale === "ru" ? "ru" : "en";
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (key) el.innerHTML = t(key);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      if (key) el.setAttribute("aria-label", t(key));
    });

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));

    document.documentElement.style.setProperty("--badge-soon", `"${t("badge.soon")}"`);

    document.dispatchEvent(new CustomEvent("localechange", { detail: { locale: lang } }));
  };

  window.t = t;
  window.applySiteLocale = applyLocale;

  window.i18nReady = (async () => {
    const locale = await resolveLocale();
    sessionStorage.setItem(STORAGE_KEY, locale);
    applyLocale(locale);
    return locale;
  })();
})();
