import { useAtomValue } from "jotai";
import { lazy, Suspense, useMemo } from "react";
import { OutputPanel as OutputPanelProps } from "../../../schema/schema";
import { LoadingIndicator } from "../../LoadingIndicator";
import { useInput } from "../input-context";
import { usePanelInput } from "../panel-input-context";

export function OutputPanel({ resultUI }: OutputPanelProps) {
  const { atoms, raw } = useInput();
  const panelAtoms = usePanelInput();
  const Component = useMemo(() => (resultUI ? lazy(resultUI) : null), []);
  const inputProps = Object.keys(raw).reduce((acc, key) => {
    const inputVal = useAtomValue(atoms[key]);
    acc[key] = inputVal;
    return acc;
  }, {} as Record<string, string | boolean | string[]>);

  Object.keys(panelAtoms).forEach((key) => {
    const inputVal = useAtomValue(panelAtoms[key]);
    inputProps[key] = inputVal;
  });
  console.log(inputProps);

  return (
    <div className="w-full h-full overflow-auto">
      <Suspense fallback={<LoadingIndicator className="h-4 w-4" />}>
        {Component ? <Component {...inputProps} /> : null}
      </Suspense>
    </div>
  );
}
