import { Change } from "diff";
import { useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { DiffToken } from "./DiffToken";

export function DiffText({ changes }: { changes: Change[] }) {
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
      className="text-base whitespace-pre-wrap"
      onClick={handleSelect}
    >
      {changes.map((change, index) => (
        <DiffToken
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          count={index}
          value={change.value}
          added={change.added}
          removed={change.removed}
        />
      ))}
    </pre>
  );
}
