import clsx from "clsx";
import { useAtom } from "jotai";
import { ChangeEvent, useCallback } from "react";
import { Option, RadioGroup as RadioGroupProps } from "../../../schema/schema";
import { usePanelInput } from "../panel-input-context";
import { TextComponent } from "../TextComponent";

function RadioVariant({
  options,
  value,
  id,
  onChange,
}: {
  id: string;
  value: string;
  options: Option[];
  onChange: (newValue: string) => void;
}) {
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      onChange((ev.target as HTMLInputElement).value);
    },
    [onChange]
  );

  return (
    <>
      {options.map((opt) => (
        <label
          className="flex gap-1 items-center"
          htmlFor={`radio-${opt.value}`}
          key={opt.value}
        >
          <input
            id={`radio-${opt.value}`}
            name={id}
            type="radio"
            className="radio radio-info radio-sm"
            checked={value === opt.value}
            value={opt.value}
            onChange={handleChange}
          />
          <TextComponent text={opt.label} as="span" className="text-xs" />
        </label>
      ))}
    </>
  );
}

function ButtonVariant({
  labelId,
  options,
  value,
  onChange,
}: {
  labelId?: string;
  value: string;
  options: Option[];
  onChange: (newValue: string) => void;
}) {
  return (
    <div className="btn-group" role="radiogroup" aria-describedby={labelId}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={clsx("btn btn-xs", {
            "btn-active": opt.value === value,
          })}
          aria-label={
            typeof opt.label === "string" ? opt.label : opt.label.text
          }
          onClick={() => onChange(opt.value)}
        >
          <TextComponent text={opt.label} as="span" />
        </button>
      ))}
    </div>
  );
}

export function RadioGroup({
  title,
  id,
  options,
  variant = "radio",
}: RadioGroupProps) {
  const atoms = usePanelInput();
  const [value, setValue] = useAtom(atoms[id]);
  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
    },
    [setValue]
  );

  return (
    <div className="flex items-center gap-2">
      <TextComponent
        id={`label-${id}`}
        text={title}
        as="span"
        className="pl-2"
      />
      {variant === "radio" ? (
        <RadioVariant
          id={id}
          options={options}
          value={value as string}
          onChange={handleChange}
        />
      ) : (
        <ButtonVariant
          labelId={`label-${id}`}
          options={options}
          value={value as string}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
