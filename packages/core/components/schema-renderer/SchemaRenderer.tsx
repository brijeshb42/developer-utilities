import clsx from "clsx";
import Split from "react-split";
import { Schema } from "../../schema/schema";
import { PanelComponent } from "./PanelComponent";

type SchemaRendererProps = Omit<Schema, "inputs" | "id">;

function LayoutRenderer({ layout, panels }: SchemaRendererProps) {
  const className = clsx("flex h-full", {
    "flex-col": layout.orientation === "vertical",
  });

  return (
    <Split gutterSize={7} className={className} direction={layout.orientation}>
      {layout.items.map((item, index) => {
        if (typeof item === "string") {
          const panelProps = panels[item];
          if (!panelProps) {
            return null;
          }
          return <PanelComponent key={item} panelId={item} {...panelProps} />;
        }
        // eslint-disable-next-line react/no-array-index-key
        return <LayoutRenderer key={index} layout={item} panels={panels} />;
      })}
    </Split>
  );
}

export function SchemaRenderer({ layout, panels }: SchemaRendererProps) {
  return <LayoutRenderer layout={layout} panels={panels} />;
}
