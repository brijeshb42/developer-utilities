import { Schema } from "devu-core/schema/schema";
import { pluginId } from "./markedown-preview-plugin-utils";
// import type { InputParams } from "./utils/markdown-output";

export const MarkdownPreviewSchema: Schema = {
  id: pluginId,
  inputs: {
    input: {
      id: "input",
      type: "code",
      initialValue: "",
      autoFocus: true,
      dropMimeType: ".md,.markdown",
      fontSize: 18,
      placeholder:
        "Paste markdown text or drop files here or click to open file chooser",
      language: "markdown",
    },
  },
  outputs: {},
  panels: {
    input: {
      type: "input",
      inputId: "input",
      title: "Markdown text",
      toolbar: {
        items: [
          {
            type: "button",
            action: {
              type: "paste",
              inputId: "input",
            },
            label: "Paste",
          },
          {
            type: "button",
            action: {
              type: "clear",
              inputId: "input",
            },
            label: "Clear",
            icon: "cross",
            onlyIcon: true,
          },
        ],
      },
    },
    output: {
      type: "output",
      outputId: "output",
      title: "Output",
      toolbar: {
        items: [
          {
            type: "toggle",
            id: "gfm",
            initialValue: true,
            label: "GFM",
          },
          {
            type: "radiogroup",
            variant: "buttongroup",
            id: "type",
            initialValue: "html",
            options: [
              {
                label: "Preview",
                value: "html",
              },
              {
                label: "Raw HTML",
                value: "raw",
              },
            ],
            title: "Type",
          },
        ],
      },
      resultUI: () =>
        import("./components/MarkdownResult").then((module) => ({
          default: module.MarkdownResult,
        })),
    },
  },
  layout: {
    orientation: "horizontal",
    items: ["input", "output"],
  },
};
