import { Schema } from "devu-core/schema/schema";
import { pluginId } from "./lorem-ipsum-plugin-utils";
import { InputParams } from "./utils/lorem-ipsum-output";

export const LoremIpsumPluginSchema: Schema = {
  id: pluginId,
  inputs: {},
  outputs: {
    output: {
      id: "lorem-ipsum-output",
      type: "code",
      placeholder: "Lorem ipsum dolor sit amet",
      fontSize: 18,
      showLint: false,
      language: "html",
      getOutput: (input: unknown) =>
        import("./utils/lorem-ipsum-output").then(({ getOutput }) =>
          getOutput(input as InputParams)
        ),
    },
  },
  panels: {
    output: {
      title: "Generated text",
      type: "output",
      toolbar: {
        items: [
          {
            type: "number",
            initialValue: 10,
            id: "count",
            title: "Generate",
          },
          {
            type: "radiogroup",
            id: "type",
            initialValue: "paragraph",
            title: "Type",
            variant: "buttongroup",
            options: [
              {
                label: "Paragraphs",
                value: "paragraph",
              },
              {
                label: "Sentences",
                value: "sentence",
              },
              {
                label: "Words",
                value: "word",
              },
            ],
          },
          {
            type: "radiogroup",
            id: "format",
            initialValue: "plain",
            title: "Format",
            variant: "buttongroup",
            options: [
              {
                label: "Plain",
                value: "plain",
              },
              {
                label: "HTML",
                value: "html",
              },
            ],
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
    orientation: "vertical",
    items: ["output"],
  },
};
