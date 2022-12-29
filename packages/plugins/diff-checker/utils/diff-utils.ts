import {
  DIFF_DELETE,
  DIFF_INSERT,
  diff_match_patch as DiffMatchPatch,
  Diff as DiffBase,
} from "diff-match-patch";

export type Diff = {
  added?: boolean;
  removed?: boolean;
  value: string;
};

export type DiffMode = "chars" | "lines" | "words";

class Dmp extends DiffMatchPatch {
  // eslint-disable-next-line class-methods-use-this
  diffLinesToWords(text1: string, text2: string) {
    const lineArray: string[] = []; // e.g. lineArray[4] == 'Hello\n'
    const lineHash: Record<string, number> = {}; // e.g. lineHash['Hello\n'] == 4

    // '\x00' is a valid character, but various debuggers don't like it.
    // So we'll insert a junk entry to avoid generating a null character.
    lineArray[0] = "";
    // Allocate 2/3rds of the space for text1, the rest for text2.
    let maxLines = 40000;

    /**
     * Split a text into an array of strings.  Reduce the texts to a string of
     * hashes where each Unicode character represents one line.
     * Modifies linearray and linehash through being a closure.
     */
    function linesToWordsMunge(text: string) {
      let chars = "";
      // Walk the text, pulling out a substring for each line.
      // text.split('\n') would would temporarily double our memory footprint.
      // Modifying text would create many large strings to garbage collect.
      let lineStart = 0;
      let lineEnd = -1;
      // Keeping our own length variable is faster than looking it up.
      let lineArrayLength = lineArray.length;
      while (lineEnd < text.length - 1) {
        lineEnd = text.indexOf(" ", lineStart);
        if (lineEnd === -1) {
          lineEnd = text.length - 1;
        }
        let line = text.substring(lineStart, lineEnd + 1);

        if (
          lineHash.hasOwnProperty
            ? // eslint-disable-next-line no-prototype-builtins
              lineHash.hasOwnProperty(line)
            : lineHash[line] !== undefined
        ) {
          chars += String.fromCharCode(lineHash[line]);
        } else {
          if (lineArrayLength === maxLines) {
            // Bail out at 65535 because
            // String.fromCharCode(65536) == String.fromCharCode(0)
            line = text.substring(lineStart);
            lineEnd = text.length;
          }
          chars += String.fromCharCode(lineArrayLength);
          lineHash[line] = lineArrayLength;
          lineArray[lineArrayLength] = line;
          lineArrayLength += 1;
        }
        lineStart = lineEnd + 1;
      }
      return chars;
    }
    const chars1 = linesToWordsMunge(text1);
    maxLines = 65535;
    const chars2 = linesToWordsMunge(text2);
    return { chars1, chars2, lineArray };
  }
}

function dmpDiffToDiff(diffs: DiffBase[]): Diff[] {
  return diffs.map((diff) => ({
    added: diff[0] === DIFF_INSERT ? true : undefined,
    removed: diff[0] === DIFF_DELETE ? true : undefined,
    value: diff[1],
  }));
}

function diffCharsMode(input1: string, input2: string): Diff[] {
  const dmp = new Dmp();
  const diffs = dmp.diff_main(input1, input2, false, 0);
  // dmp.diff_cleanupSemantic(diffs);
  return dmpDiffToDiff(diffs);
}

function diffLinesMode(input1: string, input2: string): Diff[] {
  const dmp = new Dmp();
  // eslint-disable-next-line no-underscore-dangle
  const linesToChars = dmp.diff_linesToChars_(input1, input2);
  const { chars1: lineText1, chars2: lineText2, lineArray } = linesToChars;
  const diffs = dmp.diff_main(lineText1, lineText2, true, 0);
  // eslint-disable-next-line no-underscore-dangle
  dmp.diff_charsToLines_(diffs, lineArray);
  dmp.diff_cleanupSemantic(diffs);
  return dmpDiffToDiff(diffs);
}

function diffWordsMode(input1: string, input2: string): Diff[] {
  const dmp = new Dmp();
  // eslint-disable-next-line no-underscore-dangle
  const linesToChars = dmp.diffLinesToWords(input1, input2);
  const { chars1: lineText1, chars2: lineText2, lineArray } = linesToChars;
  const diffs = dmp.diff_main(lineText1, lineText2, true, 0);
  // eslint-disable-next-line no-underscore-dangle
  dmp.diff_charsToLines_(diffs, lineArray);
  dmp.diff_cleanupSemantic(diffs);
  return dmpDiffToDiff(diffs);
}

export function getDiff(
  input1: string,
  input2: string,
  diffMode: DiffMode
  // ignoreCase?: boolean
) {
  switch (diffMode) {
    case undefined:
    case "chars":
      return diffCharsMode(input1, input2);
    case "lines":
      return diffLinesMode(input1, input2);
    case "words":
      return diffWordsMode(input1, input2);
    default:
      return [];
  }
}
