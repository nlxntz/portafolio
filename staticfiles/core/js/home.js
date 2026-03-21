// ── Typewriter ───────────────────────────────────────────────
const roles   = ['Full Stack Developer', 'Backend Engineer', 'Frontend Developer', 'Data Enthusiast'];
const target  = document.getElementById('typewriter-text');
const cursor  = document.querySelector('.cursor-blink');
let roleIdx   = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

function typeLoop() {
    if (paused || !target) return;

    const current = roles[roleIdx];

    if (!deleting) {
        target.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            paused = true;
            setTimeout(() => { paused = false; deleting = true; typeLoop(); }, 2200);
            return;
        }
        setTimeout(typeLoop, 75);
    } else {
        target.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            roleIdx  = (roleIdx + 1) % roles.length;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 40);
    }
}

if (target) {
    setTimeout(typeLoop, 600);
}

// ── Contador animado (stats) ─────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const step   = 16;
    const inc    = target / (dur / step);
    let   count  = 0;

    const timer = setInterval(() => {
        count = Math.min(count + inc, target);
        el.textContent = Math.floor(count) + suffix;
        if (count >= target) clearInterval(timer);
    }, step);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            statsObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => statsObserver.observe(el));

// ── Skill bars ───────────────────────────────────────────────
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            barObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-fill').forEach(el => barObserver.observe(el));

// ── AOS init (si está cargado) ───────────────────────────────
if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, duration: 700, offset: 80 });
}