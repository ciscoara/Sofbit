// Shared theme + i18n engine for the Sofbit site.
// Each page defines window.I18N_STRINGS = { es: {...}, en: {...} } before calling initI18n().

(function () {
  const THEME_KEY = 'prefers-dark';
  const LANG_KEY = 'lang';

  function initTheme() {
    const root = document.documentElement;

    function updateImages() {
      const isDark = root.classList.contains('dark');
      document.querySelectorAll('img[data-light][data-dark]').forEach((img) => {
        img.src = isDark ? img.getAttribute('data-dark') : img.getAttribute('data-light');
      });
    }

    function apply() {
      localStorage.getItem(THEME_KEY) === 'true' ? root.classList.add('dark') : root.classList.remove('dark');
      updateImages();
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = !(localStorage.getItem(THEME_KEY) === 'true');
        localStorage.setItem(THEME_KEY, String(next));
        apply();
      });
    });

    apply();
  }

  function initI18n(defaultLang) {
    defaultLang = defaultLang || 'es';
    const strings = window.I18N_STRINGS || { es: {}, en: {} };

    function getLang() {
      return localStorage.getItem(LANG_KEY) || defaultLang;
    }

    function t(lang, key) {
      const dict = strings[lang] || {};
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : null;
    }

    function apply(lang) {
      document.documentElement.setAttribute('lang', lang);

      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const val = t(lang, el.getAttribute('data-i18n'));
        if (val != null) el.textContent = val;
      });

      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const val = t(lang, el.getAttribute('data-i18n-html'));
        if (val != null) el.innerHTML = val;
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const val = t(lang, el.getAttribute('data-i18n-placeholder'));
        if (val != null) el.setAttribute('placeholder', val);
      });

      document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
          const [attr, key] = pair.split(':').map((s) => s && s.trim());
          if (!attr || !key) return;
          const val = t(lang, key);
          if (val != null) el.setAttribute(attr, val);
        });
      });

      document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
        btn.textContent = lang === 'es' ? 'EN' : 'ES';
        btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
      });

      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    function setLang(lang) {
      localStorage.setItem(LANG_KEY, lang);
      apply(lang);
    }

    document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
      btn.addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
    });

    apply(getLang());
    return { getLang, setLang, t };
  }

  window.SofbitSite = { initTheme, initI18n };
})();
