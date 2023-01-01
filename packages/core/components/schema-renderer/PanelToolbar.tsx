import clsx from "clsx";
import { Text, Toolbar } from "../../schema/schema";
import { TextComponent } from "./TextComponent";
import { ToolbarItemComponent } from "./ToolbarItemComponent";

type PanelToolbarProps = {
  title: Text;
  className?: string;
  panelId: string;
} & Toolbar;

export function PanelToolbar({
  title,
  items,
  className,
  hasSeparator,
  panelId,
  ...rest
}: PanelToolbarProps) {
  return (
    <div
      className={clsx(
        "flex flex-shrink justify-between items-center",
        className
      )}
      {...rest}
    >
      <TextComponent text={title} as="h2" />
      <ul
        className={clsx("flex gap-1 items-center", {
          "divide-x": !!hasSeparator,
        })}
      >
        <li id={`panel-${panelId}-left`} />
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            <ToolbarItemComponent item={item} />
          </li>
        ))}
        <li id={`panel-${panelId}-right`} />
      </ul>
    </div>
  );
}
