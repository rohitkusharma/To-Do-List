// Utility helpers

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function el(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.html) node.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }
  return node;
}

export function showToast(message, timeout = 1500) {
  const container = document.getElementById('toastContainer');
  const toast = el('div', { className: 'toast' });
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    setTimeout(() => toast.remove(), 300);
  }, timeout);
}

export function confettiBurst(x = window.innerWidth / 2, y = 80, count = 24) {
  const container = document.getElementById('confettiContainer');
  const colors = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#f87171'];
  for (let i = 0; i < count; i++) {
    const bit = el('div', { className: 'confetti-bit' });
    bit.style.left = `${x}px`;
    bit.style.top = `${y}px`;
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.opacity = '1';
    container.appendChild(bit);
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 30;
    const rotate = (Math.random() * 360) | 0;
    bit.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(.22,.61,.36,1)' });
    setTimeout(() => bit.remove(), 1700);
  }
}
