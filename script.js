/* ============================
   Scroll Progress Bar
   ============================ */
const scrollBar = document.createElement('div');
scrollBar.id = 'scroll-bar';
document.body.prepend(scrollBar);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (scrolled / total * 100) + '%';
});

/* ============================
   Mobile Menu
   ============================ */
const menuIcon = document.getElementById('menu-icon');
const navMenu  = document.getElementById('nav-menu');

menuIcon.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuIcon.classList.toggle('open', isOpen);
    menuIcon.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuIcon.classList.remove('open');
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

/* ============================
   Hero — reveal on load
   ============================ */
const heroEls = [
    document.querySelector('.hero-text h1'),
    document.querySelector('.hero-text h2'),
    document.querySelector('.hero-text p'),
    document.querySelector('.but'),
    document.querySelector('.hero-form'),
];

heroEls.forEach((el, i) => {
    if (!el) return;
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
        if (el.classList.contains('hero-form')) {
            el.classList.add('visible'); // triggers float animation
        }
    }, 150 + i * 140);
});

/* ============================
   Scroll Fade-up (cards & blocks)
   ============================ */
const fadeTargets = document.querySelectorAll(
    '.card-right, .card-cuntar, .projects-card, .contanr, .about-form, .sochil-conact a, .form-conact'
);

fadeTargets.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = (i % 3) * 0.11 + 's';
});

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeTargets.forEach(el => fadeObserver.observe(el));

/* ============================
   Active nav on scroll
   ============================ */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active-nav'));
            const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active-nav');
        }
    });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ============================
   Contact Form — EmailJS
   ============================ */
emailjs.init("yVHZC-2io8HMIAqN3");

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn          = this.querySelector('button');
        const status       = document.getElementById('form-status');
        const originalText = btn.innerText;

        btn.innerText  = 'جاري الإرسال...';
        btn.disabled   = true;

        emailjs.sendForm('service_x94jgnq', 'template_cuj2dht', this)
            .then(() => {
                status.innerText    = '✅ تم الإرسال بنجاح! شكراً لتواصلك.';
                status.style.color  = '#06B6D4';
                btn.innerText       = originalText;
                btn.disabled        = false;
                contactForm.reset();
                setTimeout(() => { status.innerText = ''; }, 5000);
            })
            .catch(() => {
                status.innerText    = '❌ نعتذر، حدث خطأ. حاول مرة أخرى.';
                status.style.color  = '#EF4444';
                btn.innerText       = originalText;
                btn.disabled        = false;
            });
    });
});
