import { Schema } from "devu-core/schema/schema";

export const DiffPluginSchema: Schema = {
  id: "diff-checker",
  inputs: {
    input1: {
      id: "input1",
      type: "textarea",
      placeholder: "Paste or drop a file or click to open file choose",
      dropMimeType: "*/*",
      initialValue: "",
      autoFocus: true,
    },
    input2: {
      id: "input2",
      type: "textarea",
      placeholder: "Paste or drop a file or click to open file choose",
      dropMimeType: "*/*",
      initialValue: "",
    },
  },
  panels: {
    input1: {
      title: {
        tag: "label",
        text: "Original Input",
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
          {
            type: "button",
            label: "Swap Inputs",
            state: "warning",
            action: {
              type: "swap",
              between: ["input1", "input2"],
            },
          },
        ],
      },
      inputId: "input1",
    },
    input2: {
      title: {
        tag: "label",
        text: "Updated Input",
        htmlFor: "input2",
      },
      type: "input",
      toolbar: {
        items: [
          {
            type: "button",
            action: {
              type: "paste",
              inputId: "input2",
            },
            label: "Paste",
          },
          {
            type: "button",
            action: {
              type: "clear",
              inputId: "input2",
            },
            label: "Clear",
            icon: "cross",
            onlyIcon: true,
          },
        ],
      },
      inputId: "input2",
    },
    output: {
      title: "Output",
      type: "output",
      toolbar: {
        items: [
          {
            type: "radiogroup",
            id: "diffMode",
            initialValue: "chars",
            options: [
              {
                label: "Chars",
                value: "chars",
              },
              {
                label: "Lines",
                value: "lines",
              },
              {
                label: "Words",
                value: "words",
              },
            ],
            title: "Diff By",
          },
          {
            type: "radiogroup",
            id: "outputFormat",
            initialValue: "raw",
            options: [
              {
                label: "Text",
                value: "raw",
              },
              {
                label: "HTML",
                value: "html",
              },
            ],
            title: "Output Format",
          },
        ],
      },
      resultUI: () =>
        import("./components/DiffResult").then(({ DiffResult }) => ({
          default: DiffResult,
        })),
    },
  },
  layout: {
    orientation: "vertical",
    items: [
      {
        orientation: "horizontal",
        items: ["input1", "input2"],
      },
      "output",
    ],
  },
};
