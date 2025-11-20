// ADHD Focus: darken entire screen except for a horizontal strip that follows the mouse.
// Controlled by a toggle inside an accessibility panel opened from the floating icon.
const STORAGE_KEY = 'yf_adhd_focus';
const BAND_HEIGHT = 200; // height of the visible strip in pixels

let adhdFocusEnabled = false;
let lastY = window.innerHeight / 2;

const launcher = document.querySelector('.accessibility-launcher');
const panel = document.querySelector('.accessibility-panel');

if (launcher && panel) {
  const closeBtn = panel.querySelector('.accessibility-close');
  const checkbox = panel.querySelector('input[type="checkbox"]');

  const topMask = document.createElement('div');
  topMask.className = 'adhd-focus-overlay adhd-focus-overlay-top';

  const bottomMask = document.createElement('div');
  bottomMask.className = 'adhd-focus-overlay adhd-focus-overlay-bottom';

  topMask.style.display = 'none';
  bottomMask.style.display = 'none';

  document.body.appendChild(topMask);
  document.body.appendChild(bottomMask);

  function updateMasks(y) {
    const half = BAND_HEIGHT / 2;
    const viewportH = window.innerHeight;

    const topHeight = Math.max(0, y - half);
    const bottomTop = Math.min(viewportH, y + half);

    topMask.style.height = `${topHeight}px`;

    bottomMask.style.top = `${bottomTop}px`;
    bottomMask.style.height = `${Math.max(0, viewportH - bottomTop)}px`;
  }

  function handleMouseMove(e) {
    lastY = e.clientY;
    updateMasks(lastY);
  }

  function handleResize() {
    if (adhdFocusEnabled) {
      updateMasks(lastY);
    }
  }

  function enableAdhdFocus() {
    if (adhdFocusEnabled) return;
    adhdFocusEnabled = true;

    launcher.classList.add('adhd-focus-on');
    launcher.setAttribute('aria-pressed', 'true');
    if (checkbox) checkbox.checked = true;
    localStorage.setItem(STORAGE_KEY, '1');

    topMask.style.display = 'block';
    bottomMask.style.display = 'block';

    updateMasks(lastY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
  }

  function disableAdhdFocus() {
    if (!adhdFocusEnabled) return;
    adhdFocusEnabled = false;

    launcher.classList.remove('adhd-focus-on');
    launcher.setAttribute('aria-pressed', 'false');
    if (checkbox) checkbox.checked = false;
    localStorage.setItem(STORAGE_KEY, '0');

    topMask.style.display = 'none';
    bottomMask.style.display = 'none';

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
  }

  function openPanel() {
    panel.classList.add('open');
    if (checkbox) checkbox.focus();
  }

  function closePanel() {
    panel.classList.remove('open');
    launcher.focus();
  }

  // Launcher click: open/close panel
  launcher.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  // Close button in panel
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closePanel();
    });
  }

  // Toggle ADHD Focus when slider changes
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        enableAdhdFocus();
      } else {
        disableAdhdFocus();
      }
    });
  }

  // Close panel with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      e.preventDefault();
      closePanel();
    }
  });

  // Load initial state from localStorage
  const initialEnabled = localStorage.getItem(STORAGE_KEY) === '1';
  if (initialEnabled) {
    enableAdhdFocus();
  }
}
