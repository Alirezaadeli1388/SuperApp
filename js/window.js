import { renderCalculator } from './apps/calculator.js';
import { renderNotes } from './apps/notes.js';
import { renderMusic } from './apps/music.js';
import { renderContacts } from './apps/contacts.js';
import { renderSettings } from './apps/settings.js';
import { renderTool } from './apps/tool.js';

let z = 1;

export function openWindow(app) {
  const w = document.createElement('div');
  w.className = 'window';
  w.style.zIndex = ++z;

  const width = 1000;
  const height = 600;

  // ---------- TITLE BAR ----------
  const bar = document.createElement('div');
  bar.className = 'titlebar';

  const title = document.createElement('span');
  title.innerText = app;

  const controls = document.createElement('div');

  const min = document.createElement('button');
  min.style.backgroundColor = "gold";
  min.onclick = () => w.style.display = 'none';

  // ---------- MAXIMIZE LOGIC ----------
  let isMax = false;
  let prev = {};

  const max = document.createElement('button');
  max.style.backgroundColor = "green";

  max.onclick = () => {
    if (!isMax) {
      prev = {
        left: w.style.left,
        top: w.style.top,
        width: w.style.width,
        height: w.style.height
      };

      document.body.appendChild(w);
      w.classList.add('maximized');

      w.style.left = '0';
      w.style.top = '0';

      isMax = true;
    } else {
      w.classList.remove('maximized');

      document.getElementById('windows').appendChild(w);

      w.style.left = prev.left;
      w.style.top = prev.top;
      w.style.width = prev.width;
      w.style.height = prev.height;

      isMax = false;
    }
  };

  const close = document.createElement('button');
  close.style.backgroundColor = "darkred";
  close.onclick = () => w.remove();

  controls.append(min, max, close);
  bar.append(title, controls);

  // ---------- CONTENT ----------
  const content = document.createElement('div');
  content.className = 'window-content';

  w.append(bar, content);

  document.getElementById('windows').appendChild(w);

  // ---------- CENTER POSITION (FIXED) ----------
    w.style.width = width + 'px';
    w.style.height = height + 'px';

    requestAnimationFrame(() => {
    // ---------- SIZE ----------
    w.style.width = width + 'px';
    w.style.height = height + 'px';

    // 🔥 اول اضافه کن
    document.getElementById('windows').appendChild(w);

    // 🔥 بعد center کن (بدون requestAnimationFrame)
    centerWindow(w, width, height);
  });

  // ---------- DRAG ----------
  drag(w, bar);

  // ---------- ROUTER ----------
  if (app === 'Calculator') renderCalculator(content);
  if (app === 'Note') renderNotes(content);
  if (app === 'Music') renderMusic(content);
  if (app === 'Contacts') renderContacts(content);
  if (app === 'Settings') renderSettings(content);
  if (app === 'Tool') renderTool(content);
}

// ---------- DRAG FUNCTION (FIXED) ----------
function drag(el, bar) {
  let offsetX = 0;
  let offsetY = 0;

  bar.onmousedown = (e) => {
    if (el.classList.contains('maximized')) return;

    el.style.zIndex = ++z;

    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;

    document.onmousemove = (e2) => {
      if (el.classList.contains('maximized')) return;

      el.style.left = (e2.clientX - offsetX) + 'px';
      el.style.top = (e2.clientY - offsetY) + 'px';
    };

    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };
}

function centerWindow(w, width, height) {
  requestAnimationFrame(() => {
    w.style.left = `${(window.innerWidth - width) / 2}px`;
    w.style.top = `${(window.innerHeight - height) / 2}px`;
  });
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.window').forEach(w => {
    if (w.classList.contains('maximized')) return;

    const width = parseInt(w.style.width || 600);
    const height = parseInt(w.style.height || 400);

    w.style.left = `${(window.innerWidth - width) / 2}px`;
    w.style.top = `${(window.innerHeight - height) / 2}px`;
  });
});

