import { HtmlBasePlugin } from "@11ty/eleventy";
import slideTransform from "./transforms/slides.js";

const output = process.env.STATIC || "static";

export default async function (eleventyConfig) {

  // pass through all assets
  eleventyConfig.addPassthroughCopy(
    "slide-decks/**/assets/*"
  );
  // make dist available from client
  eleventyConfig.addPassthroughCopy("dist");

  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addTransform("slide", slideTransform);

  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => {
      const { filePathStem, outputFileExtension } = data.page;
      const filePath = filePathStem.split("/");

      if (
        filePath[filePath.length - 1] === "text" &&
        filePath[filePath.length - 2].endsWith(".textbundle")
      ) {
        // for textbundles, use the bundle directory
        return filePath.slice(0, -1).join("/") + "/";
      }

      // for HTML create a directory and an index.html
      return data.page.outputFileExtension === "html" &&
        !data.page.filePathStem.endsWith("/index")
        ? `${data.page.filePathStem}/index.${data.page.outputFileExtension}`
        : `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    };
  });

  return {
    dir: {
      input: "slide-decks/",
      output: output,
      includes: "../dist",
      layouts: "../layouts"
    }
  };
}
