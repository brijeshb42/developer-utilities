import { useCallback, useState } from "react";
import Split from "react-split";
import { DiffResult } from "./DiffResult";
import { InputArea } from "./InputArea";

const verticalSizes = [30, 70];

export default function DiffChecker() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
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
            placeholder="Initial Input"
            label="Initial Input"
            value={input1}
            onChange={setInput1}
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
