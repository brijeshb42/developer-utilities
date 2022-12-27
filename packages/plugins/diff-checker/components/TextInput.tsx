import { ChangeEvent, ComponentProps, useCallback } from "react";

type TextInputProps = {
  value: string;
  onChange: (newValue: string) => void;
} & Omit<ComponentProps<"textarea">, "onChange" | "value">;

export function TextInput({ value, onChange, ...rest }: TextInputProps) {
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(ev.target.value);
    },
    [onChange]
  );
  return (
    <textarea
      {...rest}
      className="h-full w-full block resize-none font-mono p-2"
      value={value}
      onChange={handleChange}
    />
  );
}
