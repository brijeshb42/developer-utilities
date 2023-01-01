import { useEffect, useRef } from "react";
import {
  EditorView,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
  placeholder as placeholderExt,
  ViewUpdate,
} from "@codemirror/view";
import { EditorState, Compartment, Extension } from "@codemirror/state";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { lintKeymap, linter, lintGutter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";

import noop from "lodash/noop";
import {
  CodeEditor as BaseCodeEditorProps,
  LanguageName,
} from "../../schema/schema";

const baseExtensions = [
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, {
    fallback: true,
  }),
  bracketMatching(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...lintKeymap]),
];

type CodeEditorProps = Pick<
  BaseCodeEditorProps,
  | "autoFocus"
  | "fontSize"
  | "language"
  | "placeholder"
  | "showLineNumbers"
  | "wrapLines"
  | "showLint"
  | "editable"
> & {
  theme?: "light" | "dark";
  value: string;
  onChange: (newValue: string) => void;
};

function getFontSizeTheme(size: number) {
  return {
    ".cm-content": {
      fontSize: `${size}px`,
    },
    ".cm-gutterElement": {
      fontSize: `${size}px`,
    },
  };
}

const lineNumberCompartment = new Compartment();
const placeholderCompartment = new Compartment();
const fontSizeCompartment = new Compartment();
const themeCompartment = new Compartment();
const lineWrapCompartment = new Compartment();
const customLangCompartment = new Compartment();
const editableCompartment = new Compartment();

async function loadLanguage(
  lang: LanguageName,
  showLint: boolean
): Promise<Extension> {
  switch (lang) {
    case "json": {
      const { json, jsonParseLinter } = await import("@codemirror/lang-json");
      if (!showLint) {
        return [json()];
      }
      return [json(), linter(jsonParseLinter()), lintGutter()];
    }
    default:
      return [];
  }
}

export function CodeEditor({
  placeholder,
  showLineNumbers = true,
  fontSize = 14,
  theme = "dark",
  wrapLines = true,
  value,
  language,
  autoFocus,
  showLint = true,
  editable = true,
  onChange,
}: CodeEditorProps) {
  const cmDivRef = useRef<HTMLDivElement>(null);
  const editorStateRef = useRef<EditorState>();
  const editorViewRef = useRef<EditorView>();

  useEffect(() => {
    const listener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
      if (viewUpdate.docChanged) {
        onChange?.(viewUpdate.state.doc.toString());
      }
    });

    const state = EditorState.create({
      extensions: [
        ...baseExtensions,
        editableCompartment.of(EditorView.editable.of(true)),
        lineNumberCompartment.of([lineNumbers(), foldGutter()]),
        placeholderCompartment.of(placeholderExt("")),
        fontSizeCompartment.of(EditorView.theme(getFontSizeTheme(fontSize))),
        themeCompartment.of([]),
        customLangCompartment.of([]),
        lineWrapCompartment.of(EditorView.lineWrapping),
        listener,
      ],
    });
    editorStateRef.current = state;
    const view = new EditorView({
      state,
      parent: cmDivRef.current as HTMLDivElement,
    });
    if (autoFocus) {
      view.focus();
    }
    editorViewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    if (!showLineNumbers) {
      view.dispatch({
        effects: lineNumberCompartment.reconfigure([]),
      });
    } else {
      view.dispatch({
        effects: lineNumberCompartment.reconfigure([
          lineNumbers(),
          foldGutter(),
        ]),
      });
    }
  }, [showLineNumbers]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: placeholderCompartment.reconfigure(
        placeholderExt(placeholder ?? "")
      ),
    });
  }, [placeholder]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: fontSizeCompartment.reconfigure(
        EditorView.theme(getFontSizeTheme(fontSize))
      ),
    });
  }, [fontSize]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }
    const currentInput = view.state.doc.toString();
    if (currentInput === value) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  }, [value]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: themeCompartment.reconfigure(theme === "dark" ? oneDark : []),
    });
  }, [theme]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: lineWrapCompartment.reconfigure(
        wrapLines ? EditorView.lineWrapping : []
      ),
    });
  }, [wrapLines]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: editableCompartment.reconfigure(
        EditorView.editable.of(editable)
      ),
    });
  }, [editable]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) {
      return noop;
    }

    let mounted = true;
    if (!language) {
      view.dispatch({
        effects: customLangCompartment.reconfigure([]),
      });
      return noop;
    }
    loadLanguage(language, showLint).then((extensions) => {
      if (!mounted) {
        return;
      }
      view.dispatch({
        effects: customLangCompartment.reconfigure(extensions),
      });
    });
    return () => {
      mounted = false;
    };
  }, [language, showLint]);

  return <div ref={cmDivRef} className="h-full w-full" />;
}
