import clsx from "clsx";
import { Toolbar } from "devu-core";
import { ReactNode, useCallback, useId, useRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
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
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const handleClear = useCallback(() => {
    onChange("");
    textInputRef.current?.focus();
  }, [onChange]);
  const id = useId();

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
        <li>
          <button
            type="button"
            className="btn btn-xs btn-error btn-circle"
            aria-label="Clear Input"
            title="Clear Input"
            onClick={handleClear}
          >
            <Cross2Icon />
          </button>
        </li>
      </Toolbar>
      <TextInput
        id={`${id}-text-input`}
        autoFocus={autoFocus}
        ref={textInputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {children && (
        <div className="absolute translate-x-1/2 right-0 top-2">{children}</div>
      )}
    </div>
  );
}
