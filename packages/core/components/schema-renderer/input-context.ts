import { PrimitiveAtom } from "jotai";
import { createContext, useContext } from "react";
import { Input } from "../../schema/schema";

export type InputContextType = {
  atoms: Record<string, PrimitiveAtom<string>>;
  raw: Record<string, Input>;
};

export const InputContext = createContext<InputContextType>({
  atoms: {},
  raw: {},
});

export const useInput = () => useContext(InputContext);
