export const prefetch = [
  () => import("@codemirror/lang-json"),
  () => import("@codemirror/autocomplete"),
  () => import("@codemirror/lang-css"),
  () => import("./components/schema-renderer/panels/CodeEditorInputPanel"),
  () => import("clipboard"),
];
