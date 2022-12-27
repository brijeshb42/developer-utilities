import { ChangeEvent, ComponentProps, forwardRef, useCallback } from "react";

export type TextInputProps = {
  value: string;
  onChange: (newValue: string) => void;
} & Omit<ComponentProps<"textarea">, "onChange" | "value">;

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ value, onChange, ...rest }: TextInputProps, ref) => {
    const handleChange = useCallback(
      (ev: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(ev.target.value);
      },
      [onChange]
    );
    return (
      <textarea
        {...rest}
        ref={ref}
        className="flex flex-grow resize-none font-mono textarea textarea-bordered rounded-sm dark:text-white"
        value={value}
        onChange={handleChange}
      />
    );
  }
);
