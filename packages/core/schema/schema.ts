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

export type Action = ClearAction | PasteAction | SwapAction;

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
  variant?: "radio" | "buttongroup";
  title: Text;
  id: string;
  initialValue: string;
  options: Option[];
};

export type Checkbox = {
  type: "checkbox";
  id: string;
  initialValue: boolean;
} & Option;

export type CheckboxGroup = {
  type: "checkboxgroup";
  id: string;
  initialValue: string[];
  options: Option[];
};

export type ToolbarItem = Button | RadioGroup | Checkbox | CheckboxGroup;

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

export type CodeEditor = {
  type: "code";
  id: string;
  language?: string;
  initialValue: string;
};

export type Input = Textarea | CodeEditor;

export type Layout = {
  orientation: Orientation;
  items: Array<string | Layout>;
};

export type Schema = {
  id: string;
  inputs: Record<string, Input>;
  panels: Record<string, Panel>;
  layout: Layout;
};
