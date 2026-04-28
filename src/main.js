// BUTTMAN — minimal interactions
// 1) burger menu toggle (mobile)
// 2) replay the hero swoop on every page load (incl. bfcache restore)
// 3) gentle parallax on the bat-signal & character
// 4) click-to-copy contract address chips
// 5) chill console signature

(function () {
  const chips = document.querySelectorAll('.ca');
  if (!chips.length) return;

  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    return ok;
  }

  chips.forEach((chip) => {
    const ca = chip.dataset.ca || '';
    const label = chip.querySelector('.ca__copy');
    const def = label ? (label.dataset.default || label.textContent) : '';
    const done = label ? (label.dataset.copied || 'COPIED ✓') : '';

    chip.addEventListener('click', async () => {
      const ok = await copy(ca);
      if (!ok) return;
      chip.classList.add('is-copied');
      if (label) label.textContent = done;
      clearTimeout(chip._t);
      chip._t = setTimeout(() => {
        chip.classList.remove('is-copied');
        if (label) label.textContent = def;
      }, 1600);
    });
  });
})();

(function () {
  const burger = document.getElementById('burgerBtn');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('is-open');
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') links.classList.remove('is-open');
    });
  }
})();

(function () {
  const char = document.querySelector('.hero__char');
  if (!char) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // hide before first paint so we never flash the resting position
  char.style.opacity = '0';
  char.style.transform = 'translate3d(120vw, -20vh, 0) rotate(-18deg)';

  function play() {
    char.getAnimations().forEach((a) => a.cancel());

    const anim = char.animate(
      [
        { transform: 'translate3d(120vw, -20vh, 0) rotate(-18deg)', opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.30 },
        { transform: 'translate3d(-26px, 0, 0) rotate(4deg)',       opacity: 1, offset: 0.72 },
        { transform: 'translate3d(10px, 0, 0) rotate(-1.5deg)',     opacity: 1, offset: 0.88 },
        { transform: 'translate3d(0, 0, 0) rotate(0deg)',           opacity: 1, offset: 1 },
      ],
      {
        duration: 1300,
        easing: 'cubic-bezier(0.18, 0.72, 0.22, 1)',
        fill: 'forwards',
      }
    );

    anim.addEventListener('finish', () => {
      char.style.transform = 'translate3d(0, 0, 0)';
      char.style.opacity = '1';
      anim.cancel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', play, { once: true });
  } else {
    play();
  }

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) play();
  });
})();

(function () {
  const charImg = document.querySelector('.hero__charImg');
  const signal  = document.querySelector('.hero__signal');
  const bat     = document.querySelector('.hero__bat');
  if (!charImg) return;

  let raf = 0;
  let cx = 0, cy = 0, sx = 0, sy = 0;

  const onMove = (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const px = (e.clientX / w - 0.5) * 2;
    const py = (e.clientY / h - 0.5) * 2;
    cx = px * 10;
    cy = py * 6;
    sx = px * -16;
    sy = py * -10;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const apply = () => {
    raf = 0;
    charImg.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
    if (signal) signal.style.transform = `translate(-50%, -50%) translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
    if (bat)    bat.style.transform    = `translate(-50%, -50%) translate3d(${(sx*0.6).toFixed(2)}px, ${(sy*0.6).toFixed(2)}px, 0)`;
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch   = matchMedia('(pointer: coarse)').matches;
  if (!reduced && !touch) {
    window.addEventListener('mousemove', onMove, { passive: true });
  }
})();

(function () {
  if (typeof console === 'undefined') return;
  const css = 'background:#ffd23f;color:#0a0a14;font-weight:800;padding:4px 10px;border-radius:6px;font-family:monospace;';
  console.log('%c ★ BUTTMAN ★ ', css, "I am the night. and the squat rack.");
})();
