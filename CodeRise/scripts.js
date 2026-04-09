const codeHTML = `
<span class="cm">&lt;!-- Main Hero --&gt;</span>
<span class="kw">&lt;section</span> class=<span class="str">"hero"</span><span class="kw">&gt;</span>
  <span class="kw">&lt;h1&gt;</span>يقولون تبي تسوي موقع؟<span class="kw">&lt;/h1&gt;</span>
  <span class="kw">&lt;p&gt;</span> ابشر بنا، نرتّبه لك من الألف للياء بشكل يليق فيك، سريع، نظيف، ومتوافق مع كل الأجهزة.<span class="kw">&lt;/p&gt;</span>
  <span class="kw">&lt;a</span> class=<span class="str">"hero-btn"</span> href=<span class="str">"#"</span><span class="kw">&gt;</span>خلنا نبدأ<span class="kw">&lt;/a&gt;</span>
<span class="kw">&lt;/section&gt;</span>

<span class="cm">/* Css Code */</span>
<span class="kw">.hero</span> {
  <span class="kw">display</span>: grid;
  <span class="kw">grid-template-columns</span>: <span class="num">1fr</span> <span class="num">1fr</span>;
  <span class="kw">gap</span>: <span class="num">40px</span>;
}
`.trim();

const el = document.getElementById("feCode");
const box = document.getElementById("feBody");

let i = 0;
const speed = 12;
let timer = null;
let paused = true;

function tick() {
  if (paused) return;

  if (i <= codeHTML.length) {
    el.innerHTML = codeHTML.slice(0, i);
    i++;
    
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
    
    timer = setTimeout(tick, speed);
  } else {
    timer = setTimeout(() => {
      i = 0;
      if (box) box.scrollTop = 0; 
      tick();
    }, 1800);
  }
}

function start() {
  if (!paused) return;
  paused = false;
  tick();
}

function stop() {
  paused = true;
  if (timer) clearTimeout(timer);
  timer = null;
}

const target = box || el;
const io = new IntersectionObserver((entries) => {
  const visible = entries[0] && entries[0].isIntersecting;
  if (visible) start();
  else stop();
}, { threshold: 0.15 });

if (target) io.observe(target);

const menuIcon = document.getElementById('menuIcon');
const navMenu = document.getElementById('navMenu');

menuIcon.addEventListener('click', () => {

    navMenu.classList.toggle('active');
    
    const icon = menuIcon.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuIcon.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
    });
});