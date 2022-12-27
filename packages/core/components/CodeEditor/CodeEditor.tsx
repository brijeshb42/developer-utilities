import ReactCodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

type CodeEditorProps = ReactCodeMirrorProps;

export function CodeEditor({ placeholder, ...rest }: CodeEditorProps) {
  return (
    <ReactCodeMirror
      placeholder={placeholder}
      {...rest}
      className="h-full w-full"
    />
  );
}
