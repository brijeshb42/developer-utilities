import clsx from "clsx";
import { Toolbar, useClipboard } from "devu-core";
import { ReactNode, useCallback, useId, useRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDropzone } from "react-dropzone";
import { TextInput, TextInputProps } from "./TextInput";

type InputAreaProps = TextInputProps & {
  label: string;
  children?: ReactNode;
};

export function InputArea({
  value,
  onChange,
  placeholder,
  label,
  className,
  autoFocus,
  children,
}: InputAreaProps) {
  const { supportData, pasteFrom } = useClipboard();
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = useCallback((files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onChange(reader.result as string);
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: !!value,
    onDrop: handleDrop,
  });
  const handleClear = useCallback(() => {
    onChange("");
    textInputRef.current?.focus();
  }, [onChange]);
  const id = useId();

  const handlePaste = useCallback(async () => {
    const text = await pasteFrom?.();
    if (text) {
      onChange(text);
    }
  }, [pasteFrom, onChange]);

  return (
    <div className={clsx("flex flex-col form-control px-2 pb-2", className)}>
      <Toolbar
        className={clsx({
          "pr-8": !!children,
          "pl-6": !children,
        })}
        label={
          <label htmlFor={`${id}-text-input`} className="label">
            {label}
          </label>
        }
      >
        {supportData?.readSupported && (
          <li>
            <button
              type="button"
              className="btn btn-xs"
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
              onClick={handlePaste}
            >
              Paste
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className="btn btn-xs btn-error btn-circle"
            aria-label="Clear Input"
            title="Clear Input"
            disabled={!value}
            onClick={handleClear}
          >
            <Cross2Icon />
          </button>
        </li>
      </Toolbar>
      <input
        {...getInputProps({
          accept: "*/*",
        })}
      />
      <div
        className={clsx("flex flex-col h-full w-full", {
          "animate-pulse": isDragActive,
        })}
        {...getRootProps()}
      >
        <TextInput
          id={`${id}-text-input`}
          autoFocus={autoFocus}
          ref={textInputRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {children && (
        <div className="absolute translate-x-1/2 right-0 top-2">{children}</div>
      )}
    </div>
  );
}
