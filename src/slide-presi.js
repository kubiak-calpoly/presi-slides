import { html } from "@unbndl/html";

const MIN_INTERSECTION = 0.4;
const MAX_INTERSECTION = 0.8;

let params = new URLSearchParams(document.location.search);

export class PresiElement extends HTMLElement {
  VIEW_ELEMENT = "slide-view";
  FOOTER_ELEMENT = "slide-footer";

  controls = null;
  active = null;

  observer = new IntersectionObserver(
    (entries) => {
      let maxIntersection = 0;
      let maxElement = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          //console.log("Intersection:", element, entry.intersectionRatio);
          if (entry.intersectionRatio < MIN_INTERSECTION) {
            element.removeAttribute("active");
          } else {
            if (entry.intersectionRatio > maxIntersection) {
              maxIntersection = entry.intersectionRatio;
              maxElement = element;
            }
          }
        }
      });

      if (maxElement && maxElement !== this.active) {
        this.setActiveSlide(maxElement);
        // this.gotoSlide(maxElement);
      }
    },
    {
      threshold: [0, MIN_INTERSECTION, MAX_INTERSECTION, 1],
      delay: 300
    }
  );

  constructor() {
    super();
    this.addEventListener("slide:input", (ev) => {
      const { slide } = ev.detail;
      const element = this.slide(slide);
      // console.log("Change Slide:", slide, element);
      this.setActiveSlide(element);
      this.jumpToSlide(element);
    });
    this.addEventListener("slide:overlay", (ev) => {
      this.manageOverlay(ev.detail);
    });

    if (params.get("reveal"))
      this.classList.add("reveal-all");
  }

  slide(n) {
    const slides = Array.from(
      this.querySelectorAll(this.VIEW_ELEMENT)
    );
    return slides[n - 1];
  }

  connectedCallback() {
    const slides = Array.from(
      this.querySelectorAll(this.VIEW_ELEMENT)
    );
    this.controls = this.querySelector(this.FOOTER_ELEMENT);
    slides.forEach((target) => this.observer.observe(target));
  }

  gotoSlide(element) {
    console.log("Going to slide", element);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }

  jumpToSlide(element) {
    if (element) {
      element.scrollIntoView({
        block: "center",
        inline: "nearest"
      });
    }
  }

  setActiveSlide(element) {
    //console.log("Activating slide", element);
    this.active = element;
    if (this.active) {
      this.active.setAttribute("active", "active");
      const slides = Array.from(
        this.querySelectorAll(this.VIEW_ELEMENT)
      );
      const index = slides.findIndex(
        (slide) => slide === element
      );
      if (this.controls) {
        this.controls.setAttribute("slide", index + 1);
        this.controls.setAttribute(
          "overlay",
          element.getAttribute("overlay") || "pointer"
        );
      }
    }
  }

  manageOverlay(options) {
    const { overlay } = options || {};
    console.log("Overlay options", options);
    if (this.active && overlay) {
      this.active.setAttribute("overlay", overlay);
    }
  }
}
