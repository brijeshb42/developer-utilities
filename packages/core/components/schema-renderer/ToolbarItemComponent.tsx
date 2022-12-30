import { ToolbarItem } from "../../schema/schema";
import { Button } from "./Toolbar/Button";
import { RadioGroup } from "./Toolbar/RadioGroup";

export function ToolbarItemComponent({ item }: { item: ToolbarItem }) {
  switch (item.type) {
    case "button":
      return <Button {...item} />;
    case "radiogroup":
      return <RadioGroup {...item} />;
    default:
      return null;
  }
}
