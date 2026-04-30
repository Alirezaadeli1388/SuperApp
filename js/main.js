import './auth.js';
import { openWindow } from './window.js';

// ================= CLOCK =================
function createClock() {
  const clock = document.createElement('div');
  clock.id = 'clock';

  document.body.appendChild(clock);

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${h}:${m}`;
  }

  update();
  setInterval(update, 60000);
}

createClock();

window.addEventListener("DOMContentLoaded", () => {
  const savedBg = localStorage.getItem("bgImage");

  if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
});

window.openWindow = openWindow;