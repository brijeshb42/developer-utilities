import { useEffect, useRef } from "react";
import { useDarkMode } from "usehooks-ts";
import debounce from "lodash/debounce";
import { useAtom } from "jotai";
import { CodeEditorOutput as BaseCodeEditorProps } from "../../../schema/schema";
import { CodeEditor } from "../../CodeEditor/CodeEditor";
import { useInput } from "../input-context";

type CodeEditorInputPanelProps = Omit<BaseCodeEditorProps, "type"> & {
  input: unknown;
  inputId: string;
};

export function CodeEditorOutputPanel({
  getOutput,
  // id,
  inputId,
  input,
  ...rest
}: CodeEditorInputPanelProps) {
  const { atoms } = useInput();
  const [output, setOutput] = useAtom(atoms[inputId]);
  const { isDarkMode } = useDarkMode();
  const debouncer = useRef(
    debounce(
      (inp: unknown) => {
        getOutput(inp).then((out) => {
          setOutput(out);
        });
      },
      500,
      {
        leading: true,
      }
    )
  );

  useEffect(() => {
    debouncer.current(input);
  }, [input]);

  return (
    <div className="w-full h-full overflow-auto">
      <CodeEditor
        theme={isDarkMode ? "dark" : "light"}
        value={output}
        onChange={setOutput}
        {...rest}
      />
    </div>
  );
}
