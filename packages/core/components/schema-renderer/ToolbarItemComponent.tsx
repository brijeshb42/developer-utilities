import { ToolbarItem } from "../../schema/schema";
import { Button } from "./Toolbar/Button";
import { RadioGroup } from "./Toolbar/RadioGroup";
import { TextInput } from "./Toolbar/TextInput";
import { Toggle } from "./Toolbar/Toggle";

export function ToolbarItemComponent({ item }: { item: ToolbarItem }) {
  switch (item.type) {
    case "button":
      return <Button {...item} />;
    case "radiogroup":
      return <RadioGroup {...item} />;
    case "toggle":
      return <Toggle {...item} />;
    case "number":
    case "text":
      return <TextInput {...item} />;
    default:
      return null;
  }
}
