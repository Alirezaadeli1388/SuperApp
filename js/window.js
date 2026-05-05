import { renderCalculator } from './apps/calculator.js';
import { renderNotes } from './apps/notes.js';
import { renderMusic } from './apps/music.js';
import { renderContacts } from './apps/contacts.js';
import { renderSettings } from './apps/settings.js';
import { renderTool } from './apps/tool.js';

let z = 1;

const windows = {};
const container = document.getElementById('windows');

const appMap = {
  Calculator: renderCalculator,
  Note: renderNotes,
  Music: renderMusic,
  Contacts: renderContacts,
  Settings: renderSettings,
  Tool: renderTool
};

// ================= DOCK STATE =================
function setDockActive(app, state) {
  const btn = document.querySelector(`#dock button[data-app="${app}"]`);
  if (!btn) return;

  btn.classList.toggle('active', state);
}

// ================= OPEN WINDOW =================
export function openWindow(app) {
  let w = windows[app];

  // اگر پنجره وجود دارد
  if (w) {
    w.style.display = 'block';
    w.style.pointerEvents = 'auto';
    w.style.zIndex = ++z;

    w.classList.remove('minimized');
    w.classList.remove('minimizeAnim');

    setDockActive(app, true);
    return;
  }

  // ساخت پنجره جدید
  w = document.createElement('div');
  windows[app] = w;

  w.className = 'window';

  const isTablet = window.innerWidth <= 1024;
  const width = isTablet ? window.innerWidth * 0.8 : 1000;
  const height = isTablet ? window.innerHeight * 0.7 : 600;

  w.style.width = width + 'px';
  w.style.height = height + 'px';

  center(w, width, height);

  // ================= TITLE BAR =================
  const bar = document.createElement('div');
  bar.className = 'titlebar';

  const title = document.createElement('span');
  title.innerText = app;

  const controls = document.createElement('div');

  // ================= MINIMIZE =================
  const min = document.createElement('button');
  min.style.background = "gold";

  min.onclick = () => {
    w.classList.add('minimizeAnim');

    if (w._dragStop) w._dragStop();

    setTimeout(() => {
      w.style.display = 'none';
      w.classList.remove('minimizeAnim');
      w.classList.add('minimized');
    }, 200);

    setDockActive(app, true);
  };

  // ================= MAXIMIZE =================
  let isMax = false;
  let prev = null;

  const max = document.createElement('button');
  max.style.background = "green";

  max.onclick = () => {
    if (!isMax) {
      const rect = w.getBoundingClientRect();

      prev = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };

      w.style.left = "0px";
      w.style.top = "0px";
      w.style.width = "100vw";
      w.style.height = "100vh";

      w.classList.add('maximized');
      isMax = true;
    } else {
      w.style.left = prev.left + "px";
      w.style.top = prev.top + "px";
      w.style.width = prev.width + "px";
      w.style.height = prev.height + "px";

      w.classList.remove('maximized');
      w.classList.add('restoreAnim');

      setTimeout(() => {
        w.classList.remove('restoreAnim');
      }, 200);

      isMax = false;
    }
  };

  // ================= CLOSE =================
  const close = document.createElement('button');
  close.style.background = "darkred";

  close.onclick = () => {
    w.classList.add('closeAnim');

    setTimeout(() => {
      if (w._dragStop) w._dragStop();

      delete windows[app];
      w.remove();

      setDockActive(app, false);
    }, 200);
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

  appMap[app]?.(content);

  setDockActive(app, true);
}

// ================= DRAG =================
function drag(el, bar) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let pointerId = null;

  const start = (e) => {
    if (e.target.closest('button')) return;

    dragging = true;
    pointerId = e.pointerId;

    const rect = el.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.zIndex = ++z;

    bar.setPointerCapture?.(pointerId);
  };

  const move = (e) => {
    if (!dragging || e.pointerId !== pointerId) return;

    el.style.position = 'fixed';
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  };

  const end = (e) => {
    if (e.pointerId !== pointerId) return;

    dragging = false;
    pointerId = null;

    bar.releasePointerCapture?.(e.pointerId);
  };

  bar.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);

  el._dragStop = () => {
    dragging = false;
    pointerId = null;
  };
}

// ================= CENTER =================
function center(w, width, height) {
  w.style.left = `${(window.innerWidth - width) / 2}px`;
  w.style.top = `${(window.innerHeight - height) / 2}px`;
}