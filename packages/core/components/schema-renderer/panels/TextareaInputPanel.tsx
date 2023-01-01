import clsx from "clsx";
import { useAtom } from "jotai";
import { ChangeEvent, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Textarea as BaseTextAreaProps } from "../../../schema/schema";
import { useInput } from "../input-context";

type TextareaInputPanelProps = BaseTextAreaProps & {
  inputId: string;
};

export function TextareaInputPanel({
  placeholder,
  autoFocus,
  id,
  inputId,
  dropMimeType,
}: TextareaInputPanelProps) {
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
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(ev.target.value);
    },
    [setValue]
  );

  return (
    <div
      className={clsx("w-full h-full mt-2", {
        "animate-pulse": isDragActive,
      })}
      {...getRootProps()}
    >
      <input
        title="File chooser"
        {...getInputProps({
          accept: dropMimeType,
        })}
      />
      <textarea
        id={id}
        placeholder={placeholder}
        className="textarea textarea-bordered w-full h-full resize-none rounded-sm font-mono dark:text-white"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
