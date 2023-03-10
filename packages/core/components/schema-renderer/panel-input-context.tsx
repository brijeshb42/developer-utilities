import { atom, PrimitiveAtom } from "jotai";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { ToolbarItem } from "../../schema/schema";

export type InputType = string | boolean | string[] | number;

export const PanelInputContext = createContext<
  Record<string, PrimitiveAtom<InputType>>
>({});

export function PanelInputProvider({
  items,
  children,
}: PropsWithChildren<{ items: ToolbarItem[] }>) {
  const atoms = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (item.type !== "button") {
          acc[item.id] = atom(item.initialValue);
        }
        return acc;
      }, {} as Record<string, PrimitiveAtom<InputType>>),
    [items]
  );

  return (
    <PanelInputContext.Provider value={atoms}>
      {children}
    </PanelInputContext.Provider>
  );
}

export const usePanelInput = () => useContext(PanelInputContext);
