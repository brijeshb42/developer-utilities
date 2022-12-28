import { diffChars, diffLines, diffWords } from "diff";

export type DiffMode = "chars" | "lines" | "words";

export function getDiff(
  input1: string,
  input2: string,
  diffMode: DiffMode,
  ignoreCase?: boolean
) {
  switch (diffMode) {
    case undefined:
    case "chars":
      return diffChars(input1, input2, {
        ignoreCase,
      });
    case "lines":
      return diffLines(input1, input2, {
        ignoreCase,
      });
    case "words":
      return diffWords(input1, input2, {
        ignoreCase,
      });
    default:
      return [];
  }
}
