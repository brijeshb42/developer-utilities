import { createContext, useContext } from "react";

export const PanelContext = createContext({
  id: "panel-id",
});

export const usePanelId = () => useContext(PanelContext);
