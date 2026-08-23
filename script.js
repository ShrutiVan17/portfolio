/* =========================================================
   SHRUTI VANPARIA PORTFOLIO
   Motion + Interaction Script
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) =>
  [...scope.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   1. INTRO / OPENING ANIMATION
========================================================= */

const introScreen = $("#introScreen");

if (introScreen) {
  if (reducedMotion) {
    introScreen.remove();
    document.body.classList.add("site-ready");
  } else {
    document.body.classList.add("intro-active");

    window.addEventListener("load", () => {
      setTimeout(() => {
        introScreen.classList.add("intro-exit");

        document.body.classList.remove("intro-active");
        document.body.classList.add("site-ready");

        setTimeout(() => {
          introScreen.remove();
        }, 850);
      }, 950);
    });
  }
}


/* =========================================================
   2. HEADER + MOBILE MENU
========================================================= */

const header = $("#siteHeader");
const menuToggle = $("#menuToggle");

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    document.body.classList.toggle(
      "menu-open",
      open
    );
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      document.body.classList.remove("menu-open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}


/* =========================================================
   3. HEADER SCROLL STATE
========================================================= */

function updateHeader() {
  if (!header) return;

  if (window.scrollY > 40) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
}

updateHeader();

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);


/* =========================================================
   4. TOP SCROLL PROGRESS BAR
========================================================= */

const scrollProgress = $("#scrollProgress");

function updateScrollProgress() {
  if (!scrollProgress) return;

  const pageHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    pageHeight > 0
      ? (window.scrollY / pageHeight) * 100
      : 0;

  scrollProgress.style.width =
    `${Math.min(100, Math.max(0, progress))}%`;
}

updateScrollProgress();

window.addEventListener(
  "scroll",
  updateScrollProgress,
  { passive: true }
);


/* =========================================================
   5. SCROLL REVEAL ANIMATIONS
========================================================= */

const revealElements = $$("[data-reveal]");

if (reducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        const delay =
          Number(element.dataset.delay || 0);

        setTimeout(() => {
          element.classList.add("is-visible");
        }, delay);

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    /*
      Gives neighboring cards a subtle stagger
      without requiring HTML changes.
    */
    if (!element.dataset.delay) {
      element.style.setProperty(
        "--reveal-index",
        index % 4
      );
    }

    revealObserver.observe(element);
  });
}


/* =========================================================
   6. HERO TEXT ENTRANCE
========================================================= */

const heroLines = $$(".hero-line");

if (!reducedMotion) {
  window.addEventListener("load", () => {
    heroLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("hero-line-visible");
      }, 1100 + index * 130);
    });
  });
} else {
  heroLines.forEach((line) => {
    line.classList.add("hero-line-visible");
  });
}


/* =========================================================
   7. MOUSE / BACKGROUND GLOW
========================================================= */

if (!reducedMotion) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;

  let currentX = pointerX;
  let currentY = pointerY;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { passive: true }
  );

  function animatePointerGlow() {
    currentX += (pointerX - currentX) * 0.08;
    currentY += (pointerY - currentY) * 0.08;

    document.documentElement.style.setProperty(
      "--cursor-x",
      `${currentX}px`
    );

    document.documentElement.style.setProperty(
      "--cursor-y",
      `${currentY}px`
    );

    requestAnimationFrame(
      animatePointerGlow
    );
  }

  animatePointerGlow();
}


/* =========================================================
   8. HERO CARD 3D MOVEMENT
========================================================= */

const heroCard = $("#heroCard");

if (
  heroCard &&
  !reducedMotion &&
  window.matchMedia("(pointer: fine)").matches
) {
  heroCard.addEventListener(
    "pointermove",
    (event) => {
      const rect =
        heroCard.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      const rotateY =
        (x - 0.5) * 7;

      const rotateX =
        (0.5 - y) * 7;

      heroCard.style.transform =
        `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-3px)
        `;

      heroCard.style.setProperty(
        "--card-x",
        `${x * 100}%`
      );

      heroCard.style.setProperty(
        "--card-y",
        `${y * 100}%`
      );
    }
  );

  heroCard.addEventListener(
    "pointerleave",
    () => {
      heroCard.style.transform = "";

      heroCard.style.setProperty(
        "--card-x",
        "50%"
      );

      heroCard.style.setProperty(
        "--card-y",
        "50%"
      );
    }
  );
}


/* =========================================================
   9. INTERACTIVE CARD SPOTLIGHT EFFECT
========================================================= */

const interactiveCards =
  $$(".interactive-card");

if (
  !reducedMotion &&
  window.matchMedia("(pointer: fine)").matches
) {
  interactiveCards.forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        card.style.setProperty(
          "--mouse-x",
          `${x}px`
        );

        card.style.setProperty(
          "--mouse-y",
          `${y}px`
        );
      }
    );
  });
}


/* =========================================================
   10. MAGNETIC BUTTONS
========================================================= */

const magneticElements =
  $$(".magnetic");

if (
  !reducedMotion &&
  window.matchMedia("(pointer: fine)").matches
) {
  magneticElements.forEach((element) => {
    element.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }
    );

    element.addEventListener(
      "pointerleave",
      () => {
        element.style.transform =
          "";
      }
    );
  });
}


/* =========================================================
   11. PROJECT FILTERS
========================================================= */

const filterButtons = $$(".filter");
const projectCards = $$(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const selected =
      button.dataset.filter;

    projectCards.forEach(
      (card, index) => {
        const categories =
          (
            card.dataset.category || ""
          )
            .split(" ")
            .filter(Boolean);

        const shouldShow =
          selected === "all" ||
          categories.includes(selected);

        if (shouldShow) {
          card.classList.remove(
            "project-hidden"
          );

          if (!reducedMotion) {
            card.animate(
              [
                {
                  opacity: 0,
                  transform:
                    "translateY(20px) scale(.98)"
                },
                {
                  opacity: 1,
                  transform:
                    "translateY(0) scale(1)"
                }
              ],
              {
                duration: 430,
                delay: index * 45,
                easing:
                  "cubic-bezier(.2,.7,.2,1)",
                fill: "both"
              }
            );
          }
        } else {
          card.classList.add(
            "project-hidden"
          );
        }
      }
    );
  });
});


/* =========================================================
   12. CLIMATE MODEL COUNTER
========================================================= */

const counters = $$(".counter");

const counterObserver =
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter =
          entry.target;

        const target =
          Number(
            counter.dataset.target || 0
          );

        if (reducedMotion) {
          counter.textContent =
            target === 919
              ? "0.919"
              : target.toLocaleString();

          observer.unobserve(counter);
          return;
        }

        const duration = 1400;
        const start =
          performance.now();

        function animateCounter(time) {
          const progress =
            Math.min(
              (time - start) /
                duration,
              1
            );

          /*
            Smooth ease-out animation
          */
          const eased =
            1 -
            Math.pow(
              1 - progress,
              3
            );

          const value =
            target * eased;

          /*
            Climate card uses target 919
            but displays 0.919.
          */
          if (target === 919) {
            counter.textContent =
              (value / 1000)
                .toFixed(3);
          } else {
            counter.textContent =
              Math.round(value)
                .toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(
              animateCounter
            );
          }
        }

        requestAnimationFrame(
          animateCounter
        );

        observer.unobserve(counter);
      });
    },
    {
      threshold: 0.6
    }
  );

counters.forEach((counter) => {
  counterObserver.observe(counter);
});


/* =========================================================
   13. EXPERIENCE TIMELINE PROGRESS
========================================================= */

const timeline =
  $(".timeline");

const timelineProgress =
  $("#timelineProgress");

function updateTimelineProgress() {
  if (
    !timeline ||
    !timelineProgress
  ) {
    return;
  }

  const rect =
    timeline.getBoundingClientRect();

  const viewport =
    window.innerHeight;

  const start =
    viewport * 0.78;

  const end =
    viewport * 0.2;

  const distance =
    rect.height +
    start -
    end;

  const passed =
    start -
    rect.top;

  const progress =
    Math.min(
      1,
      Math.max(
        0,
        passed / distance
      )
    );

  timelineProgress.style.height =
    `${progress * 100}%`;
}

updateTimelineProgress();

window.addEventListener(
  "scroll",
  updateTimelineProgress,
  { passive: true }
);


/* =========================================================
   14. ACTIVE NAV SECTION
========================================================= */

const sections =
  $$("main section[id]");

const navLinks =
  $$(".nav-links a");

if (sections.length) {
  const sectionObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            const id =
              entry.target.id;

            navLinks.forEach(
              (link) => {
                link.classList.toggle(
                  "active-link",
                  link.getAttribute(
                    "href"
                  ) === `#${id}`
                );
              }
            );
          }
        );
      },
      {
        rootMargin:
          "-35% 0px -55% 0px"
      }
    );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* =========================================================
   15. FLOW NODE ANIMATION
========================================================= */

const flowNodes =
  $$(".flow-node");

if (!reducedMotion) {
  const flowObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(
          (entry) => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            flowNodes.forEach(
              (node, index) => {
                setTimeout(() => {
                  node.classList.add(
                    "flow-active"
                  );
                }, index * 220);
              }
            );

            observer.disconnect();
          }
        );
      },
      {
        threshold: 0.45
      }
    );

  const decisionFlow =
    $(".decision-flow");

  if (decisionFlow) {
    flowObserver.observe(
      decisionFlow
    );
  }
}


/* =========================================================
   16. PARALLAX PAGE GLOWS
========================================================= */

const glowOne =
  $(".glow-one");

const glowTwo =
  $(".glow-two");

if (
  !reducedMotion &&
  glowOne &&
  glowTwo
) {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const scroll =
          window.scrollY;

        glowOne.style.transform =
          `translate3d(0, ${
            scroll * 0.08
          }px, 0)`;

        glowTwo.style.transform =
          `translate3d(0, ${
            scroll * -0.05
          }px, 0)`;

        ticking = false;
      });
    },
    { passive: true }
  );
}


/* =========================================================
   17. SMOOTH INTERNAL NAVIGATION
========================================================= */

$$('a[href^="#"]').forEach(
  (link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetId =
          link.getAttribute(
            "href"
          );

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          $(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",
          block: "start"
        });
      }
    );
  }
);


/* =========================================================
   18. KEYBOARD ESCAPE CLOSES MENU
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      header &&
      header.classList.contains(
        "nav-open"
      )
    ) {
      header.classList.remove(
        "nav-open"
      );

      document.body.classList.remove(
        "menu-open"
      );

      if (menuToggle) {
        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    }
  }
);


/* =========================================================
   19. REMOVE HOVER TRANSFORMS ON RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {
    if (
      window.innerWidth < 900
    ) {
      interactiveCards.forEach(
        (card) => {
          card.style.transform = "";
        }
      );

      magneticElements.forEach(
        (element) => {
          element.style.transform =
            "";
        }
      );
    }
  }
);


/* =========================================================
   20. PAGE READY
========================================================= */

window.addEventListener(
  "load",
  () => {
    document.documentElement.classList.add(
      "page-loaded"
    );
  }
);
