import { Schema } from "devu-core/schema/schema";
import { pluginId } from "./json-formatter-plugin-utils";
import { InputParams } from "./utils/json-output";

export const JsonFormatterPluginSchema: Schema = {
  id: pluginId,
  inputs: {
    input1: {
      id: "input",
      type: "code",
      placeholder: "Paste or drop a file or click to open file picker",
      initialValue: "",
      autoFocus: true,
      language: "json",
      fontSize: 18,
    },
  },
  outputs: {
    output: {
      id: "json-output",
      type: "code",
      placeholder: "Formatted JSON",
      language: "json",
      fontSize: 18,
      showLint: false,
      getOutput: (input: unknown) =>
        import("./utils/json-output").then(({ getOutput }) =>
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
            type: "radiogroup",
            title: "Tab size",
            id: "tabSize",
            initialValue: "2",
            variant: "buttongroup",
            options: [
              {
                label: "Minify",
                value: "min",
              },
              {
                label: "2",
                value: "2",
              },
              {
                label: "4",
                value: "4",
              },
              {
                label: "8",
                value: "8",
              },
              {
                label: "Tab",
                value: "tab",
              },
            ],
          },
          {
            type: "button",
            action: {
              type: "copy",
              inputId: "output",
            },
            label: "Copy",
          },
        ],
      },
      outputId: "output",
    },
  },
  layout: {
    orientation: "vertical",
    initialSizes: [30, 70],
    items: ["input1", "output"],
  },
};
