import { Fragment } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import { Schema } from "../../schema/schema";
import { PanelComponent } from "./PanelComponent";
import { ResizeHandle } from "../ResizeHandle";

type SchemaRendererProps = Omit<Schema, "inputs" | "id" | "outputs">;

function LayoutRenderer({ layout, panels, ...rest }: SchemaRendererProps) {
  return (
    <PanelGroup direction={layout.orientation} {...rest}>
      {layout.items.map((item, index) => {
        if (typeof item === "string") {
          const panelProps = panels[item];
          if (!panelProps) {
            return null;
          }
          const element = (
            <Panel key={item}>
              <PanelComponent panelId={item} {...panelProps} />
            </Panel>
          );
          if (index === layout.items.length - 1) {
            return element;
          }
          return (
            <Fragment key={item}>
              {element}
              <ResizeHandle />
            </Fragment>
          );
        }
        const element = (
          // eslint-disable-next-line react/no-array-index-key
          <Panel key={index}>
            <LayoutRenderer layout={item} panels={panels} />
          </Panel>
        );

        if (index === layout.items.length - 1) {
          return element;
        }

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {element}
            <ResizeHandle />
          </Fragment>
        );
      })}
    </PanelGroup>
  );
}

export function SchemaRenderer({ layout, panels }: SchemaRendererProps) {
  return <LayoutRenderer layout={layout} panels={panels} />;
}
