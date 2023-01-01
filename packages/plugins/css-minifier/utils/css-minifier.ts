import { loadLightningWasm } from "./css-prefetch";

export type InputParams = {
  input1: string;
  minify: boolean;
  nesting: boolean;
  customMedia: boolean;
};

export async function getOutput({
  input1,
  minify,
  nesting,
  customMedia,
}: InputParams) {
  if (!input1) {
    return "";
  }

  const { transform } = await loadLightningWasm();

  try {
    const result = transform({
      code: new TextEncoder().encode(input1),
      filename: "style.css",
      minify,
      drafts: {
        nesting: !!nesting,
        customMedia: !!customMedia,
      },
    });
    return new TextDecoder().decode(result.code);
  } catch (ex) {
    return (ex as Error).message;
  }
}
