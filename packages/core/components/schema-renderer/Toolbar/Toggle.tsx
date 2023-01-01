import { useAtom } from "jotai";
import { Toggle as ToggleProps } from "../../../schema/schema";
import { usePanelInput } from "../panel-input-context";
import { TextComponent } from "../TextComponent";

export function Toggle({ id, label }: ToggleProps) {
  const atoms = usePanelInput();
  const [value, setValue] = useAtom(atoms[id]);

  return (
    <label htmlFor={`input-${id}`} className="flex items-center gap-1">
      <TextComponent text={label} as="span" />
      <input
        id={`input-${id}`}
        className="toggle toggle-sm"
        type="checkbox"
        checked={!!value}
        onChange={(ev) => setValue(ev.target.checked)}
      />
    </label>
  );
}
