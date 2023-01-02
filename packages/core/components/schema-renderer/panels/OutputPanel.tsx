import { useAtomValue } from "jotai";
import { lazy, Suspense, useMemo } from "react";
import {
  OutputPanel as OutputPanelProps,
  Output as OutputProps,
} from "../../../schema/schema";
import { LoadingIndicator } from "../../LoadingIndicator";
import { useInput } from "../input-context";
import { usePanelInput, InputType } from "../panel-input-context";
import { CodeEditorOutputPanel } from "./CodeEditorOutputPanel";

export function OutputRenderer({
  type,
  input,
  outputId,
  ...rest
}: OutputProps & { input: unknown; outputId: string }) {
  switch (type) {
    case "code": {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const getOutput1 = rest.getOutput as (input1: unknown) => Promise<string>;
      return (
        <Suspense fallback={<LoadingIndicator />}>
          <CodeEditorOutputPanel
            inputId={outputId}
            input={input}
            {...rest}
            getOutput={getOutput1}
          />
        </Suspense>
      );
    }
    default:
      return null;
  }
}

export function OutputPanel({ resultUI, outputId }: OutputPanelProps) {
  const { atoms, raw, outputs } = useInput();
  const panelAtoms = usePanelInput();
  const Component = useMemo(() => (resultUI ? lazy(resultUI) : null), []);
  const inputProps = Object.keys(raw).reduce((acc, key) => {
    const inputVal = useAtomValue(atoms[key]);
    acc[key] = inputVal;
    return acc;
  }, {} as Record<string, InputType>);

  Object.keys(panelAtoms).forEach((key) => {
    const inputVal = useAtomValue(panelAtoms[key]);
    inputProps[key] = inputVal;
  });
  const output = outputId ? outputs[outputId] : null;

  return (
    <div className="w-full h-full overflow-hidden mt-2">
      <Suspense fallback={<LoadingIndicator className="h-12 w-12" />}>
        {Component ? <Component {...inputProps} /> : null}
        {output && outputId && (
          <OutputRenderer outputId={outputId} input={inputProps} {...output} />
        )}
      </Suspense>
    </div>
  );
}
