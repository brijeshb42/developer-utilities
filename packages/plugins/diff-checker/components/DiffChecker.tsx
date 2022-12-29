import { useCallback } from "react";
import Split from "react-split";
import { useStorageValue } from "devu-core/providers/StorageContext";
import { DiffResult } from "./DiffResult";
import { InputArea } from "./InputArea";
import { pluginId } from "../diff-checker-plugin-utils";

const verticalSizes = [30, 70];

const KEYS = {
  input1: "input1",
  input2: "input2",
};

export default function DiffChecker() {
  const [input1, setInput1] = useStorageValue(KEYS.input1, "", pluginId);
  const [input2, setInput2] = useStorageValue(KEYS.input2, "", pluginId);
  const handleSwap = useCallback(() => {
    setInput1(input2);
    setInput2(input1);
  }, [input1, input2]);

  return (
    <Split
      className="flex flex-col h-full"
      direction="vertical"
      gutterSize={5}
      sizes={verticalSizes}
    >
      <div className="flex flex-shrink flex-col">
        <Split gutterSize={5} className="h-full flex" direction="horizontal">
          <InputArea
            className="relative"
            placeholder="Paste or drop a file or click to open file chooser"
            label="Initial Text"
            value={input1}
            onChange={setInput1}
            autoFocus
          >
            <button
              className="btn btn-xs btn-warning"
              type="button"
              disabled={!input1 && !input2}
              onClick={handleSwap}
            >
              Swap
            </button>
          </InputArea>
          <InputArea
            placeholder="Paste or drop a file or click to open file chooser"
            label="Changed Text"
            value={input2}
            onChange={setInput2}
          />
        </Split>
      </div>
      <div className="h-full flex flex-grow overflow-hidden p-2">
        <DiffResult input1={input1} input2={input2} />
      </div>
    </Split>
  );
}
