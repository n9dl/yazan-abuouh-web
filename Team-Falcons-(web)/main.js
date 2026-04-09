// ===============================
// About - More Button
// ===============================
const moreBtn = document.getElementById("moreBtn");
const aboutFull = document.getElementById("aboutFull");

if (moreBtn && aboutFull) {
    moreBtn.addEventListener("click", () => {
        const opened = aboutFull.style.display === "block";

        aboutFull.style.display = opened ? "none" : "block";
        moreBtn.textContent = opened ? "المزيد+" : "إخفاء";
    });
}


// ===============================
// About - Counters (run once)
// ===============================
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function animateCounters() {
    counters.forEach(counter => {
        const target = Number(counter.dataset.target) || 0;
        let value = 0;

        const step = target > 500 ? Math.ceil(target / 80) : Math.max(1, Math.floor(target / 60));

        const timer = setInterval(() => {
            value += step;

            if (value >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = value;
            }
        }, 18);
    });
}

const aboutSection = document.getElementById("about");

if (aboutSection && counters.length) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            animateCounters();
        }
    }, { threshold: 0.4 });

    observer.observe(aboutSection);
}


// ===============================
// Mobile Menu (Font Awesome) - Fullscreen
// ===============================
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
    const icon = menuBtn.querySelector("i");

    function openMenu() {
        navMenu.classList.add("open");
        if (icon) icon.className = "fa-solid fa-xmark";
        document.body.style.overflow = "hidden";
        menuBtn.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        navMenu.classList.remove("open");
        if (icon) icon.className = "fa-solid fa-bars";
        document.body.style.overflow = "";
        menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("open");
        isOpen ? closeMenu() : openMenu();
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 640) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });
}
