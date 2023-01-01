import { PropsWithChildren, useMemo } from "react";
import { PrimitiveAtom, atom } from "jotai";

import { Schema } from "../../schema/schema";
import { useStorage } from "../../providers/StorageContext";
import { InputContext } from "./input-context";

type InputProviderProps = PropsWithChildren<{
  inputs: Schema["inputs"];
  outputs: Schema["outputs"];
  baseId: string;
}>;

export function InputProvider({
  baseId,
  inputs,
  outputs,
  children,
}: InputProviderProps) {
  const storage = useStorage();
  const scopedStorage = useMemo(() => storage.scopedStorage(baseId), [baseId]);
  const inputAtoms = useMemo(() => {
    let atoms = Object.keys(inputs).reduce((acc, key) => {
      const input = inputs[key];
      const at = atom(input.initialValue ?? "");
      acc[key] = at;
      return acc;
    }, {} as Record<string, PrimitiveAtom<string>>);
    atoms = Object.keys(outputs).reduce((acc, key) => {
      acc[key] = atom("");
      return acc;
    }, atoms);
    return atoms;
  }, [inputs, outputs, scopedStorage]);
  const contextValue = useMemo(
    () => ({
      raw: inputs,
      atoms: inputAtoms,
      outputs,
    }),
    [inputs, inputAtoms, outputs]
  );

  return (
    <InputContext.Provider value={contextValue}>
      {children}
    </InputContext.Provider>
  );
}
