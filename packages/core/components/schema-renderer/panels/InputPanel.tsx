import { InputPanel as InputPanelProps } from "../../../schema/schema";
import { useInput } from "../input-context";
import { TextareInputPanel } from "./TextareInputPanel";

export function InputPanel({ inputId }: InputPanelProps) {
  const { raw } = useInput();
  const input = raw[inputId];
  if (!input) {
    return null;
  }

  switch (input.type) {
    case "textarea":
      return <TextareInputPanel inputId={inputId} {...input} />;
    default:
      break;
  }
  return null;
}
