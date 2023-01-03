import { marked } from "marked";

export type InputParams = {
  input: string;
  gfm: boolean;
};

export function getOutput({ input, gfm }: InputParams) {
  return marked(input, {
    gfm,
  });
}
