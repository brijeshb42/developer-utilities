import { lazy, Suspense } from "react";
import { InputPanel as InputPanelProps } from "../../../schema/schema";
import { LoadingIndicator } from "../../LoadingIndicator";
import { useInput } from "../input-context";
import { TextareaInputPanel } from "./TextareaInputPanel";

const CodeEditorInputPanel = lazy(() =>
  import("./CodeEditorInputPanel").then(
    ({ CodeEditorInputPanel: CodePanel }) => ({
      default: CodePanel,
    })
  )
);

export function InputPanel({ inputId }: InputPanelProps) {
  const { raw } = useInput();
  const input = raw[inputId];
  if (!input) {
    return null;
  }

  switch (input.type) {
    case "textarea":
      return <TextareaInputPanel inputId={inputId} {...input} />;
    case "code":
      return (
        <Suspense fallback={<LoadingIndicator />}>
          <CodeEditorInputPanel inputId={inputId} {...input} />
        </Suspense>
      );
    default:
      break;
  }
  return null;
}
