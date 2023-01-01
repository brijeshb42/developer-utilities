import { ElementType, lazy } from "react";

export type Orientation = "horizontal" | "vertical";

export type Icon = "cross";

export type FormattedText = {
  link?: string;
  linkExternal?: boolean;
  text: string;
  bold?: boolean;
  italic?: boolean;
  htmlFor?: string;
  tag: ElementType;
};

export type Text = FormattedText | string;

export type Option = {
  label: Text;
  value: string;
};

export type ClearAction = {
  type: "clear";
  inputId: string;
};
export type PasteAction = {
  type: "paste";
  inputId: string;
};
export type SwapAction = {
  type: "swap";
  between: [string, string];
};
export type CopyAction = {
  type: "copy";
  inputId: string;
};

export type Action = ClearAction | PasteAction | SwapAction | CopyAction;

export type Button = {
  type: "button";
  label: Text;
  action: Action;
  state?: "info" | "success" | "warning" | "error";
  icon?: Icon;
  onlyIcon?: boolean;
};

export type RadioGroup = {
  type: "radiogroup";
  variant?: "radio" | "buttongroup" | "select";
  title: Text;
  id: string;
  initialValue: string;
  options: Option[];
};

export type Toggle = {
  type: "toggle";
  id: string;
  initialValue: boolean;
  label: Text;
};

export type CheckboxGroup = {
  type: "checkboxgroup";
  id: string;
  initialValue: string[];
  options: Option[];
};

export type ToolbarItem = Button | RadioGroup | Toggle | CheckboxGroup;

export type Toolbar = {
  hasSeparator?: boolean;
  items: ToolbarItem[];
};

export type InputPanel = {
  type: "input";
  title: Text;
  inputId: string;
  toolbar: Toolbar;
};

export type OutputPanel = {
  type: "output";
  title: Text;
  toolbar: Toolbar;
  outputId?: string;
  resultUI?: Parameters<typeof lazy>[0];
};

export type Panel = InputPanel | OutputPanel;

export type Textarea = {
  type: "textarea";
  id: string;
  initialValue: string;
  placeholder?: string;
  dropMimeType?: string;
  autoFocus?: boolean;
};

export type LanguageName = "json" | "javascript" | "typescript" | "css";

export type CodeEditor = {
  type: "code";
  id: string;
  language?: LanguageName;
  initialValue: string;
  placeholder?: string;
  autoFocus?: boolean;
  dropMimeType?: string;
  showLineNumbers?: boolean;
  fontSize?: number;
  wrapLines?: boolean;
  showLint?: boolean;
  editable?: boolean;
};

export type Input = Textarea | CodeEditor;

export type TextAreaOutput = {
  type: "textarea";
  id: string;
  placeholder?: string;
  dropMimeType?: string;
};

export type CodeEditorOutput = {
  type: "code";
  id: string;
  language?: LanguageName;
  placeholder?: string;
  autoFocus?: boolean;
  showLineNumbers?: boolean;
  fontSize?: number;
  wrapLines?: boolean;
  editable?: boolean;
  showLint?: boolean;
  getOutput: (input: unknown) => Promise<string>;
};

export type Output = TextAreaOutput | CodeEditorOutput;

export type Layout = {
  orientation: Orientation;
  initialSizes?: number[];
  items: Array<string | Layout>;
};

export type Schema = {
  id: string;
  inputs: Record<string, Input>;
  outputs: Record<string, Output>;
  panels: Record<string, Panel>;
  layout: Layout;
};
