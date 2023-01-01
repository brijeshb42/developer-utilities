import { LoremIpsum } from "lorem-ipsum";

export type InputParams = {
  format: "plain" | "html";
  type: "paragraph" | "sentence" | "word";
};

export function getOutput({ format, type }: InputParams) {
  const lipsum = new LoremIpsum({}, format ?? "plain");
  switch (type) {
    case "paragraph":
      return lipsum.generateParagraphs(10);
    case "sentence":
      return lipsum.generateSentences(10);
    case "word":
      return lipsum.generateWords(10);
    default:
      return lipsum.generateParagraphs(2);
  }
}
