export * from "./slide-footer.js";
export * from "./slide-view.js";
export * from "./slide-presi.js";

export function scaleSlides() {
  window.addEventListener("resize", computeSlideScaling);
  computeSlideScaling();
}

function computeSlideScaling() {
  const body = document.body;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  body.classList.add("presentation-scaled");
  body.style.setProperty("--viewport-width", vw.toString());
  body.style.setProperty("--viewport-height", vh.toString());
  console.log("Rescaled", vw, vh);
}
