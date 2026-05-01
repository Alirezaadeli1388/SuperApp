import { renderCalculator } from './apps/calculator.js';
import { renderNotes } from './apps/notes.js';
import { renderMusic } from './apps/music.js';
import { renderContacts } from './apps/contacts.js';
import { renderSettings } from './apps/settings.js';
import { renderTool } from './apps/tool.js';

let z = 1;

const windows = {};
const dockState = {};

const dock = document.getElementById('dock');
const container = document.getElementById('windows');

const map = {
  Calculator: renderCalculator,
  Note: renderNotes,
  Music: renderMusic,
  Contacts: renderContacts,
  Settings: renderSettings,
  Tool: renderTool
};

// ================= OPEN WINDOW =================
export function openWindow(app) {
  let w = windows[app];

  // اگر پنجره قبلاً وجود دارد
  if (w) {
    w.style.display = 'block';
    w.style.pointerEvents = 'auto';
    w.style.zIndex = ++z;
    dockState[app] = false;
    return;
  }

  // ساخت پنجره
  w = document.createElement('div');
  windows[app] = w;

  w.className = 'window';

  const width = 1000;
  const height = 600;

  w.style.width = width + 'px';
  w.style.height = height + 'px';

  // ================= TITLE BAR =================
  const bar = document.createElement('div');
  bar.className = 'titlebar';

  const title = document.createElement('span');
  title.innerText = app;

  const controls = document.createElement('div');

  // ================= MINIMIZE =================
  const min = document.createElement('button');
  min.style.backgroundColor = "gold";

  min.onclick = () => {
    w.classList.add('minimizeAnim');

    setTimeout(() => {
      w.style.display = 'none';
      w.classList.remove('minimizeAnim');
    }, 300);

    dockState[app] = true;
  };

  // ================= MAXIMIZE =================
  let isMax = false;
  let prev = {};

  const max = document.createElement('button');
  max.style.backgroundColor = "green";

  max.onclick = () => {
    if (!isMax) {
      const rect = w.getBoundingClientRect();

      prev = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };

      w.classList.add('maximized');

      w.style.left = '0px';
      w.style.top = '0px';
      w.style.width = '100vw';
      w.style.height = '100vh';

      isMax = true;
    } else {
      w.classList.remove('maximized');
      w.classList.add('restoreAnim');

      w.style.left = prev.left + 'px';
      w.style.top = prev.top + 'px';
      w.style.width = prev.width + 'px';
      w.style.height = prev.height + 'px';

      setTimeout(() => {
        w.classList.remove('restoreAnim');
      }, 300);

      isMax = false;
    }
  };

  // ================= CLOSE =================
  const close = document.createElement('button');
  close.style.backgroundColor = "darkred";

  close.onclick = () => {
    w.classList.add('closeAnim');

    setTimeout(() => {
      delete windows[app];
      w.remove();
    }, 250);
  };

  controls.append(min, max, close);
  bar.append(title, controls);

  // ================= CONTENT =================
  const content = document.createElement('div');
  content.className = 'window-content';

  w.append(bar, content);
  container.appendChild(w);

  center(w, width, height);
  drag(w, bar);

  // ================= ROUTER =================
  map[app]?.(content);
}

// ================= DRAG =================
function drag(el, bar) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  const start = (e) => {
    if (e.target.closest('button')) return;

    dragging = true;

    const rect = el.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    e.preventDefault();
  };

  const move = (e) => {
    if (!dragging) return;

    el.style.position = 'fixed';
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;

    e.preventDefault();
  };

  const end = () => {
    dragging = false;
  };

  bar.addEventListener('pointerdown', start);

  // 🔥 مهم: روی window نه bar
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
}

// ================= CENTER =================
function center(w, width, height) {
  w.style.left = `${(window.innerWidth - width) / 2}px`;
  w.style.top = `${(window.innerHeight - height) / 2}px`;
}