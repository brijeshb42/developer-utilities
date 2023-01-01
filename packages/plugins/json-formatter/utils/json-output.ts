export type InputParams = {
  input1: string;
  tabSize: "min" | "2" | "4" | "8" | "tab";
};

export function getOutput({ input1, tabSize }: InputParams) {
  try {
    let size: number | string = 2;
    if (tabSize === "min") {
      size = 0;
    } else if (tabSize === "tab") {
      size = "\t";
    } else {
      const num = parseInt(tabSize, 10);
      if (!Number.isNaN(num)) {
        size = num;
      }
    }
    return JSON.stringify(JSON.parse(input1), undefined, size);
  } catch (ex) {
    if (!(ex instanceof SyntaxError)) {
      console.error(ex);
    }
    return "";
  }
}
