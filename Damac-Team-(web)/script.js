const hamburger = document.querySelector(".hamburger");
const navHeader = document.querySelector(".nav-header");

hamburger.addEventListener("click", () => {
    navHeader.classList.toggle("active");
    document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".nav-header a").forEach(link => {
    link.addEventListener("click", () => {
        navHeader.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});
