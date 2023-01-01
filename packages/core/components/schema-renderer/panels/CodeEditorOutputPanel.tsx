import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "usehooks-ts";
import debounce from "lodash/debounce";
import { useAtom } from "jotai";
import { CodeEditorOutput as BaseCodeEditorProps } from "../../../schema/schema";
import { CodeEditor } from "../../CodeEditor/CodeEditor";
import { useInput } from "../input-context";
import { ToolbarLeftRenderer } from "../ToolbarPortalRenderer";
import { LoadingIndicator } from "../../LoadingIndicator";

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
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);
  const debouncer = useRef(
    debounce(
      (inp: unknown) => {
        getOutput(inp)
          .then((out) => {
            if (!isMounted.current) {
              return;
            }
            setOutput(out);
            setIsLoading(false);
          })
          .catch(() => {
            if (!isMounted.current) {
              return;
            }
            setIsLoading(false);
          });
      },
      500,
      {
        leading: true,
      }
    )
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    debouncer.current(input);
  }, [input]);

  return (
    <div className="w-full h-full overflow-auto">
      {isLoading && (
        <ToolbarLeftRenderer>
          <div className="flex items-center gap-2">
            <span>Loading...</span>
            <LoadingIndicator className="h-4 w-4" />
          </div>
        </ToolbarLeftRenderer>
      )}
      <CodeEditor
        theme={isDarkMode ? "dark" : "light"}
        value={output}
        onChange={setOutput}
        {...rest}
      />
    </div>
  );
}
