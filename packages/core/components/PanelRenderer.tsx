import clsx from "clsx";
import { ReactNode, Suspense } from "react";
import Split from "react-split";
import type { Panel } from "../devu-plugin";

type PanelRendererProps = {
  panel: Panel;
  renderPanel: (panelId: string) => ReactNode;
};

export function PanelRenderer({ panel, renderPanel }: PanelRendererProps) {
  if (!panel.items.length) {
    return null;
  }

  return (
    <Split
      className={clsx("flex", {
        "flex-col": panel.direction === "vertical",
      })}
      sizes={panel.sizes?.length ? panel.sizes : undefined}
    >
      {panel.items.map((item) => (
        <div key={item.id}>
          <Suspense
            fallback={
              <div className="h-full w-full items-center justify-center">
                <p>Loading...</p>
              </div>
            }
          >
            {renderPanel(item.id)}
          </Suspense>
        </div>
      ))}
    </Split>
  );
}
