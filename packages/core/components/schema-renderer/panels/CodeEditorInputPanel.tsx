import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDarkMode } from "usehooks-ts";
import { CodeEditor as BaseCodeEditorProps } from "../../../schema/schema";
import { useInput } from "../input-context";
import { CodeEditor } from "../../CodeEditor/CodeEditor";

type CodeEditorInputPanelProps = BaseCodeEditorProps & {
  inputId: string;
};

export function CodeEditorInputPanel({
  // id,
  inputId,
  dropMimeType,
  ...rest
}: CodeEditorInputPanelProps) {
  const { atoms } = useInput();
  const [value, setValue] = useAtom(atoms[inputId]);
  const handleDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener("loadend", () => {
        setValue(reader.result as string);
      });
      reader.readAsText(file);
    },
    [setValue, value]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: !!value,
    onDrop: handleDrop,
  });
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={clsx("w-full h-full mt-2 overflow-auto", {
        "animate-pulse": isDragActive,
      })}
      {...getRootProps()}
    >
      <input
        title="File chooser"
        {...getInputProps({
          accept: dropMimeType,
          multiple: false,
        })}
      />
      <CodeEditor
        theme={isDarkMode ? "dark" : "light"}
        value={value}
        onChange={setValue}
        {...rest}
      />
    </div>
  );
}
