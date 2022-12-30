import { PropsWithChildren, useMemo } from "react";
import { PrimitiveAtom, atom } from "jotai";

import { Schema } from "../../schema/schema";
import { useStorage } from "../../providers/StorageContext";
import { InputContext } from "./input-context";

type InputProviderProps = PropsWithChildren<{
  inputs: Schema["inputs"];
  baseId: string;
}>;

export function InputProvider({
  baseId,
  inputs,
  children,
}: InputProviderProps) {
  const storage = useStorage();
  const scopedStorage = useMemo(() => storage.scopedStorage(baseId), [baseId]);
  const inputAtoms = useMemo(
    () =>
      Object.keys(inputs).reduce((acc, key) => {
        const input = inputs[key];
        const at = atom(input.initialValue ?? "");
        acc[key] = at;
        return acc;
      }, {} as Record<string, PrimitiveAtom<string>>),
    [inputs, scopedStorage]
  );
  const contextValue = useMemo(
    () => ({
      raw: inputs,
      atoms: inputAtoms,
    }),
    [inputs, inputAtoms]
  );

  return (
    <InputContext.Provider value={contextValue}>
      {children}
    </InputContext.Provider>
  );
}
