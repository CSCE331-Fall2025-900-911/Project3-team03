(function () {
  function loadGoogleTranslate() {
    if (window.google && window.google.translate) {
      return;
    }

    window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
        {
            pageLanguage: 'en',
            includedLanguages: [
            'en','es','zh-CN','zh-TW','hi','ar','pt','ru','fr','de',
            'ja','ko','it','nl','tr','pl','uk','vi','th','id',
            'fa','he','sv','no','da','fi','cs','el','ro','hu',
            'bg','sr','hr','sk','sl','ms','ta','te','bn','ur'
            ].join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
        );
    };

    const script = document.createElement('script');
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleTranslate);
  } else {
    loadGoogleTranslate();
  }
})();
