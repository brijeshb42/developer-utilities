import { ComponentProps, ComponentType, lazy } from "react";
import { Schema } from "./schema/schema";

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
  load?: Parameters<typeof lazy>[0];
  schema?: Schema;
}
