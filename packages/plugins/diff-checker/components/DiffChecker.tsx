import { useCallback, useState } from "react";
import Split from "react-split";
import { DiffResult } from "./DiffResult";
import { TextInput } from "./TextInput";

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
      sizes={verticalSizes}
    >
      <div className="flex flex-shrink flex-col">
        <div className="flex justify-center">
          <button
            type="button"
            className="border rounded-md inline-flex p-1 text-sm"
            onClick={handleSwap}
          >
            Swap Inputs
          </button>
        </div>
        <Split className="h-full flex" direction="horizontal">
          <div>
            <TextInput
              value={input1}
              onChange={setInput1}
              placeholder="Initial Text"
            />
          </div>
          <div>
            <TextInput
              value={input2}
              onChange={setInput2}
              placeholder="Updated Text"
            />
          </div>
        </Split>
      </div>
      <div className="h-full flex flex-grow overflow-hidden">
        <DiffResult input1={input1} input2={input2} />
      </div>
    </Split>
  );
}
