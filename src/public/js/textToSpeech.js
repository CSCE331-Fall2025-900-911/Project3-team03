// uses Web Speech API (SpeechSynthesis)
// Reads out loud the text thats being clicked on or highlighted
(function () {
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
    console.warn('[TTS] Web Speech API not supported in this browser.');
    return;
  }

  const STORAGE_KEY = 'yf_tts_enabled';
  let ttsEnabled = false;

  function isInAccessibilityUI(target) {
    return !!(
      target.closest('.accessibility-panel') ||
      target.closest('.accessibility-launcher')
    );
  }

  function getSelectedText() {
    if (!window.getSelection) return '';
    return window.getSelection().toString().trim();
  }
  
  // Read current language from Google Translate dropdown or cookie
  function getCurrentTranslateLang() {
    const combo = document.querySelector('.goog-te-combo');
    if (combo && combo.value) {
      return combo.value.trim(); 
    }

    const match = document.cookie.match(/(?:^|;)\s*googtrans=\/[^/]+\/([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim());
    }

    // Default: English
    return 'en';
  }

  // Map Google Translate code to a language for voices
  function mapToVoiceLang(code) {
    switch (code) {
      case 'en':    return 'en-US';
      case 'es':    return 'es-ES';
      case 'fr':    return 'fr-FR';
      case 'de':    return 'de-DE';
      case 'pt':    return 'pt-BR';   
      case 'pt-PT': return 'pt-PT';
      case 'ru':    return 'ru-RU';
      case 'ja':    return 'ja-JP';
      case 'ko':    return 'ko-KR';
      case 'hi':    return 'hi-IN';
      case 'ar':    return 'ar-SA';
      case 'zh-CN': return 'zh-CN';
      case 'zh-TW': return 'zh-TW';
      default:
        return code;
    }
  }

  function pickVoiceForLang(langCode) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    let voice = voices.find(v => v.lang === langCode);
    if (voice) return voice;

    const base = langCode.split('-')[0];
    voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(base.toLowerCase()));
    return voice || null;
  }

  // get data-name or accesibility label or alt text on img
  function getSemanticLabel(el) {
    let node = el;

    while (node && node !== document.body) {
      if (node.dataset && node.dataset.name) {
        return node.dataset.name.trim();
      }

      if (node.getAttribute) {
        const aria = node.getAttribute('aria-label');
        if (aria) return aria.trim();

        const alt = node.getAttribute('alt');
        if (alt) return alt.trim();
      }

      node = node.parentElement;
    }

    return '';
  }

  function getElementText(el) {
    if (!el) return '';

    const labeled = getSemanticLabel(el);
    if (labeled) return labeled;

    let node = el;
    while (node && node !== document.body) {
      const clone = node.cloneNode(true);
      clone.querySelectorAll('script, style, noscript').forEach((n) => n.remove());
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      if (text) return text;
      node = node.parentElement;
    }

    return '';
  }

  function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();

    // Figure out which language we to use
    const googleLang = getCurrentTranslateLang();        
    const voiceLang = mapToVoiceLang(googleLang);      

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voice = pickVoiceForLang(utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
  };

  // Speak highlighted text or clicked element text
  function handlePotentialSpeech(eventTarget, { fromSelection = false, fromClick = false } = {}) {
    if (!ttsEnabled) return;
    if (isInAccessibilityUI(eventTarget)) return;

    const selected = getSelectedText();

    if (fromSelection && selected) {
      speak(selected);
      return;
    }

    if (fromClick) {
      if (selected) {
        speak(selected);
        return;
      }
      const text = getElementText(eventTarget);
      if (text) {
        speak(text);
      }
    }
  }

  function initTTS() {
    const ttsToggle = document.querySelector('#tts-toggle');

    if (!ttsToggle) {
      console.warn('[TTS] #tts-toggle not found in DOM.');
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'true') {
      ttsEnabled = true;
      ttsToggle.checked = true;
    }

    ttsToggle.addEventListener('change', () => {
      ttsEnabled = ttsToggle.checked;
      localStorage.setItem(STORAGE_KEY, ttsEnabled ? 'true' : 'false');

      if (!ttsEnabled) {
        window.speechSynthesis.cancel();
      }
    });

    document.addEventListener('mouseup', (event) => {
      handlePotentialSpeech(event.target, { fromSelection: true });
    });

    document.addEventListener('click', (event) => {
      handlePotentialSpeech(event.target, { fromClick: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTTS);
  } else {
    initTTS();
  }
})();