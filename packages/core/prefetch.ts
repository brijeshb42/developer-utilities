export const prefetch = [
  () => import("@codemirror/lang-json"),
  () => import("@codemirror/autocomplete"),
  () => import("@codemirror/lang-css"),
  () => import("@codemirror/lang-html"),
  () => import("@codemirror/lang-markdown"),
  () => import("./components/schema-renderer/panels/CodeEditorInputPanel"),
  () => import("clipboard"),
];
