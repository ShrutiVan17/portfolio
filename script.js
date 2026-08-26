const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("siteNav");
const filters = [...document.querySelectorAll(".filter")];
const projects = [...document.querySelectorAll(".project")];
const visibleCount = document.getElementById("visibleCount");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

function applyFilter(filter, activeButton) {
  filters.forEach((item) => item.classList.toggle("is-active", item === activeButton));

  let count = 0;
  projects.forEach((project) => {
    const categories = project.dataset.category.split(" ");
    const show = filter === "all" || categories.includes(filter);
    project.classList.toggle("is-hidden", !show);
    if (show) count += 1;
  });

  visibleCount.textContent = String(count);
}

filters.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter, button));
});

const defaultFilter = document.querySelector(".filter.is-active");
applyFilter(defaultFilter.dataset.filter, defaultFilter);

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px" });

  revealTargets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.getElementById("year").textContent = String(new Date().getFullYear());
