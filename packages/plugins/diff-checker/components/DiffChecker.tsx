import { useStorage } from "devu-core";
import { useCallback, useEffect, useMemo, useState } from "react";
import Split from "react-split";
import { DiffResult } from "./DiffResult";
import { InputArea } from "./InputArea";

const verticalSizes = [30, 70];

export default function DiffChecker() {
  const { scopedStorage } = useStorage();
  const storage = useMemo(() => scopedStorage?.("diff-checker"), []);
  const [input1, setInput1] = useState(storage?.getValue?.("input1", "") ?? "");
  const [input2, setInput2] = useState(storage?.getValue?.("input2", "") ?? "");
  const handleSwap = useCallback(() => {
    setInput1(input2);
    setInput2(input1);
  }, [input1, input2]);

  useEffect(() => {
    if (!input1) {
      storage?.del?.("input1");
    }
    storage?.setValue?.("input1", input1);
  }, [storage, input1]);

  useEffect(() => {
    if (!input2) {
      storage?.del?.("input2");
    }
    storage?.setValue?.("input2", input2);
  }, [storage, input2]);

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
            placeholder="Initial Input"
            label="Initial Input"
            value={input1}
            onChange={setInput1}
            autoFocus
          >
            <button
              className="btn btn-xs btn-warning"
              type="button"
              onClick={handleSwap}
            >
              Swap
            </button>
          </InputArea>
          <InputArea
            placeholder="Changed Input"
            label="Changed Input"
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
