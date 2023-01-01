import { PrimitiveAtom } from "jotai";
import { createContext, useContext } from "react";
import { Input, Output } from "../../schema/schema";

export type InputContextType = {
  atoms: Record<string, PrimitiveAtom<string>>;
  raw: Record<string, Input>;
  outputs: Record<string, Output>;
};

export const InputContext = createContext<InputContextType>({
  atoms: {},
  raw: {},
  outputs: {},
});

export const useInput = () => useContext(InputContext);
