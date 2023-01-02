import { LoremIpsum } from "lorem-ipsum";

export type InputParams = {
  format: "plain" | "html";
  type: "paragraph" | "sentence" | "word";
  count: number;
};

export function getOutput({ format, type, count }: InputParams) {
  const lipsum = new LoremIpsum({}, format ?? "plain");
  const num =
    typeof count === "number"
      ? count
      : (() => {
          const parsedNum = parseInt(count, 10);
          if (Number.isNaN(parsedNum)) {
            return 10;
          }
          return parsedNum;
        })();
  switch (type) {
    case "paragraph":
      return lipsum.generateParagraphs(num);
    case "sentence":
      return lipsum.generateSentences(num);
    case "word":
      return lipsum.generateWords(num);
    default:
      return lipsum.generateParagraphs(num);
  }
}
