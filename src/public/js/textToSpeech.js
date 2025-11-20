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

   // get data-name or acessibility label or alt text on img
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

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';   // base-language
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  // Speak highlighted text OR clicked element text
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
