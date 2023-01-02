import { Schema } from "devu-core/schema/schema";
import { pluginId } from "./css-minifier-plugin-utils";
import type { InputParams } from "./utils/css-minifier";

export const CssMinifierPluginSchema: Schema = {
  id: pluginId,
  inputs: {
    input1: {
      id: "input",
      type: "code",
      placeholder: "Paste or drop a file or click to open file picker",
      initialValue: "",
      autoFocus: true,
      language: "css",
      fontSize: 18,
    },
  },
  outputs: {
    output: {
      id: "css-output",
      type: "code",
      placeholder: "Minified CSS",
      language: "css",
      fontSize: 18,
      showLint: false,
      getOutput: (input: unknown) =>
        import("./utils/css-minifier").then(({ getOutput }) =>
          getOutput(input as InputParams)
        ),
    },
  },
  panels: {
    input1: {
      title: {
        tag: "label",
        text: "Input",
        htmlFor: "input1",
      },
      type: "input",
      toolbar: {
        items: [
          {
            type: "button",
            action: {
              type: "paste",
              inputId: "input1",
            },
            label: "Paste",
          },
          {
            type: "button",
            action: {
              type: "clear",
              inputId: "input1",
            },
            label: "Clear",
            icon: "cross",
            onlyIcon: true,
          },
        ],
      },
      inputId: "input1",
    },
    output: {
      title: "Output",
      type: "output",
      toolbar: {
        items: [
          {
            type: "toggle",
            label: "Nesting",
            id: "nesting",
            initialValue: true,
          },
          {
            type: "toggle",
            label: "Minify",
            id: "minify",
            initialValue: true,
          },
          {
            type: "button",
            action: {
              type: "copy",
              inputId: "output",
            },
            state: "info",
            label: "Copy",
          },
        ],
      },
      outputId: "output",
    },
  },
  layout: {
    orientation: "horizontal",
    items: ["input1", "output"],
  },
};
