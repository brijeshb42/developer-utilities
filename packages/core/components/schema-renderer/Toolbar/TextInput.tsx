import { useAtom } from "jotai";
import { ChangeEvent, useCallback } from "react";
import { TextInput as TextInputProps } from "../../../schema/schema";
import { usePanelInput } from "../panel-input-context";
import { TextComponent } from "../TextComponent";

export function TextInput({ id, title, type }: TextInputProps) {
  const atoms = usePanelInput();
  const [value, setValue] = useAtom(atoms[id]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        setValue(ev.target.valueAsNumber);
      } else {
        setValue(ev.target.value);
      }
    },
    [type]
  );

  return (
    <label className="flex gap-2 label" htmlFor={`toolbar-input-${id}`}>
      <TextComponent className="label-text" text={title} as="span" />
      <input
        className="input input-bordered input-xs max-w-[100px] text-center"
        id={`toolbar-input-${id}`}
        type={type}
        value={value as string}
        onChange={handleChange}
      />
    </label>
  );
}
