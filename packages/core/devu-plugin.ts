import { ComponentProps, ComponentType, lazy, ReactNode } from "react";

export type PanelDirection = "horizontal" | "vertical";

export type Panel = {
  direction: PanelDirection;
  sizes: number[];
  items: Array<
    Panel & {
      /**
       * Should be unique across the whole panel list
       */
      id: string;
    }
  >;
};

export interface DevUPlugin {
  id: string;
  category?: "formatter" | "other";
  name: string;
  icon: ComponentType<ComponentProps<"svg">>;
  load: Parameters<typeof lazy>[0];
  panels?: Panel;
  renderPanel?: (panelId: string) => ReactNode;
}
