import { css, html, shadow } from "@unbndl/html";

export class FooterElement extends HTMLElement {
  static template = html`
    <template>
      <footer>
        <fieldset name="overlay">
            <label>
                <input type="radio" name="overlay" value="pointer" checked>
                <span>Select</span>
            </label>
            <label>
                <input type="radio" name="overlay" value="brush">
                <span>Brush</span>
            </label>
            <label>
                <input type="radio" name="overlay" value="eraser">
                <span>Eraser</span>
            </label>
            <label>
                <input type="radio" name="overlay" value="hidden">
                <span>Hide</span>
            </label>
        </fieldset>
        <span>
          <input name="slide" type="number" min="1" value="1">
          /
          <slot name="count">N</span>
        </span>
      </footer>
    </template>
    `;

  static styles = css`
    footer {
      display: flex;
      justify-content: space-between;
      color: var(--color-text-inverted);
    }
    span {
      background: rgb(0 0 0 / 0.8);
      border-radius: var(--size-spacing-small);
      padding: var(--size-spacing-small);
    }
    input,
    select {
      font: inherit;
      color: inherit;
      line-height: inherit;
      border: none;
      border-radius: 1px;
      background: transparent;
    }
    input[type="number"] {
      width: 3em;
    }
  `;

  slideControl = null;
  overlayControl = null;

  constructor() {
    super();

    shadow(this)
      .template(FooterElement.template)
      .styles(FooterElement.styles)
      .delegate('input[name="slide"]', {
        input: (ev) =>
          this.relay("slide:input", { slide: ev.target.value })
      })
      .delegate('input[name="overlay"]', {
        change: (ev) =>
          this.relay("slide:overlay", { overlay: ev.target.value })
      });

    this.slideControl = this.shadowRoot.querySelector(
      'input[name="slide"]'
    );
    this.overlayControl = this.shadowRoot.querySelector(
      'fieldset[name="overlay"]'
    );

  }

  static observedAttributes = ["slide", "overlay", "color"];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "slide":
        this.slideControl.value = newValue;
        break;
      case "overlay": {
        const input = this.overlayControl.querySelector(`input[value="${newValue}"]`);
        if (input) input.checked = true;
        break;
      }
    }
  }

  relay(type, detail) {
    const event = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail
    });
    this.dispatchEvent(event);
  }
}
