import { useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import clsx from "clsx";
import { DiffToken, OutputFormat } from "./DiffToken";

export type Change = {
  added?: boolean;
  removed?: boolean;
  value: string;
};

export function DiffText({
  changes,
  outputFormat,
}: {
  changes: Change[];
  outputFormat: OutputFormat;
}) {
  const clickCount = useRef(0);
  const preRef = useRef<HTMLPreElement>(null);
  const debouncedClear = useRef(
    debounce(() => {
      clickCount.current = 0;
    }, 500)
  );
  const handleSelect = useCallback(() => {
    clickCount.current += 1;
    debouncedClear.current();
    if (clickCount.current < 4) {
      return;
    }
    clickCount.current = -1;
    if (!preRef.current) {
      return;
    }
    const range = new Range();
    range.setStart(preRef.current.firstChild as HTMLElement, 0);
    range.setEnd(preRef.current.lastChild as HTMLElement, 1);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <pre
      ref={preRef}
      className={clsx("text-base whitespace-pre-wrap", {
        "whitespace-nowrap": outputFormat === "html",
      })}
      onClick={handleSelect}
    >
      {changes.map((change, index) => (
        <DiffToken
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          count={index}
          outputFormat={outputFormat}
          value={change.value}
          added={change.added}
          removed={change.removed}
        />
      ))}
    </pre>
  );
}
