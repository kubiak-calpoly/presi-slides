import { Events, html, css, shadow } from "@unbndl/html";
import Konva from 'konva';


export class SlideElement extends HTMLElement {
  static template = html`
    <template>
      <slot></slot>
      <div id="overlay"></div>
    </template>
  `;

  static styles = css`
    :host {
      --slide-pointer-events: none;
      --slide-opacity: 1;
      --slide-overlay-visibility: hidden;
      /*position: relative;*/
    }
    @media screen {
      :host {
        --slide-opacity: 1; // make it 0.2 for fading effect on scroll;
        --slide-overlay-visibility: visible;
      }
      :host([active]) {
        --slide-opacity: 1;
        cursor: url("/includes/images/pointer.png") 0 0, pointer;
      }
      :host([overlay="hidden"]) {
        --slide-overlay-visibility: hidden;
      }
      :host([overlay="brush"]) {
          cursor: url("/includes/images/pencil.png") 0 100, crosshair;
        --slide-pointer-events: auto;
      }
      :host([overlay="eraser"]) {
          cursor: url("/includes/images/eraser.png") 35 100, not-allowed;
        --slide-pointer-events: auto;
      }
      #overlay {
        position: absolute;
        inset: 0;
        pointer-events: var(--slide-pointer-events);
        visibility: var(--slide-overlay-visibility);
      }
      ::slotted(*) {
        opacity: var(--slide-opacity);
        transition: opacity 1s;
      }
    }
  `;

  // initialize the Konva overlay
  isPaint = false;
  overlayMode = "pointer";
  overlayColor = "red";
  stage = null;

  constructor() {
    super();

    shadow(this)
      .template(SlideElement.template)
      .styles(SlideElement.styles);

    Events.delegate(this, ".reveal", {
      click: (ev) => {
        const target = ev.target;
        if (target) {
          const next = target.nextElementSibling;
          if (next) next.classList.add("reveal");
          target.classList.remove("reveal");
        }
      }
    });

    Events.delegate(this, ".reveal ~ :not(.reveal)", {
      click: (ev) => {
        const target = ev.target;
        if (target) {
          target.classList.add("reveal-one");
        }
      }
    });
  }

  static observedAttributes = ["active", "overlay"];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "overlay":
        this.overlayMode = newValue;
        this.createOverlay();
        break;
      case "color":
        this.overlayColor = newValue;
        break;
    }
  }

  disconnectedCallback() {
    if (this.stage) delete this.stage;
  }

  createOverlay() {
    if (this.stage) return;

    const container = this.shadowRoot.getElementById("overlay");

    console.log("Creating overlay if needed", this.stage);

    this.stage = new Konva.Stage({
      container,
      width: container?.clientWidth,
      height: container?.clientHeight
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", (e) => {
      this.isPaint = true;
      const pos = this.stage.getPointerPosition();
      console.log("touchstart", pos);
      this.lastLine = new Konva.Line({
        stroke: this.overlayColor,
        strokeWidth: this.overlayMode === "eraser" ? 20 : 4,
        globalCompositeOperation:
          this.overlayMode === "brush"
            ? "source-over"
            : "destination-out",
        // round cap for smoother lines
        lineCap: "round",
        lineJoin: "round",
        // add point twice, so we have some drawings even on a simple click
        points: [pos.x, pos.y, pos.x, pos.y]
      });
      this.layer.add(this.lastLine);
    });

    this.stage.on("mouseup touchend", () => {
      this.isPaint = false;
      console.log("touchend");
    });

    // and core function - drawing
    this.stage.on("mousemove touchmove", (e) => {
      if (!this.isPaint) return;

      // prevent scrolling on touch devices
      e.evt.preventDefault();

      const pos = this.stage.getPointerPosition();
      const newPoints = this.lastLine
        .points()
        .concat([pos.x, pos.y]);
      this.lastLine.points(newPoints);
    });
  }
}
