import { define } from "@unbndl/html";
import { PresiElement, SlideElement, FooterElement, scaleSlides } from "./slides.js";

define({
  "slide-presi": PresiElement,
  "slide-view": SlideElement,
  "slide-footer": FooterElement
});

scaleSlides();
