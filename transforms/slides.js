import path from "node:path";
import { JSDOM } from "jsdom";

const PRESI_COMPONENT = "slide-presi";
const FOOTER_COMPONENT = "slide-footer";
const SLIDE_COMPONENT = "slide-view";

// JSDOM cannot parse modern CSS stylesheets.
// Workaround from: https://github.com/jsdom/jsdom/issues/3236#issuecomment-1699777509

const originalConsoleError = console.error;
console.error = (message, ...optionalParams) => {
  if (message.includes("Could not parse CSS stylesheet")) {
    return;
  }
  originalConsoleError(message, ...optionalParams);
};

export default function (content) {
  const { inputPath, outputPath } = this.page;
  const inputDir = path.dirname(inputPath);
  const inputFile = path.basename(inputPath);
  const outputDir = path.dirname(outputPath);
  const outputBase = path.dirname(outputDir);
  const outputFile = path.basename(outputPath);

  if (
    inputPath &&
    inputDir.endsWith(".textbundle") &&
    inputFile === "text.md"
  ) {
    console.log("Processing slides in...", inputDir);

    const DOM = new JSDOM(content);
    const { document } = DOM.window;
    const body = document.querySelector("body");
    const children = Array.from(body.children);
    const parts = children.reduce(
      (acc, val) => {
        let current = acc.length ? acc[acc.length - 1] : [];
        let previous = acc;
        if (val.tagName === "HR") {
          current = [];
        } else {
          current = current.concat([val]);
          previous = previous.slice(0, -1);
        }
        return previous.concat([current]);
      },
      [[]]
    );
    const count = parts.length;
    const slides = parts.map((children, i) => {
      const section = document.createElement(SLIDE_COMPONENT);
      section.replaceChildren(...children);
      return section;
    });

    const footer = document.createElement(FOOTER_COMPONENT);
    const countSpan = document.createElement('span');
    countSpan.textContent = count.toString();
    countSpan.setAttribute("slot", "count");
    footer.replaceChildren(countSpan);


    const presi = document.createElement(PRESI_COMPONENT);
    presi.replaceChildren(...slides, footer);

    body.replaceChildren(presi);

    return `<!doctype html>${document.documentElement.outerHTML}`;
  }

  return content;
}
