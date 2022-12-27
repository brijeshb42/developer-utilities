import { Toolbar } from "devu-core";
import { diffChars, diffLines, diffWords } from "diff";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

type DiffResultProps = {
  input1: string;
  input2: string;
};

type DiffMode = "chars" | "lines" | "words";

const MODE_OPTIONS: { mode: DiffMode; label: string }[] = [
  {
    mode: "chars",
    label: "Characters",
  },
  { mode: "lines", label: "Lines" },
  { mode: "words", label: "Words" },
];

export function DiffResult({ input1, input2 }: DiffResultProps) {
  const [diffMode, setDiffMode] = useState<DiffMode>("chars");
  const [ignoreCase, setIgnoreCase] = useState(false);

  const diff = useMemo(() => {
    switch (diffMode) {
      case "chars":
        return diffChars(input1, input2, {
          ignoreCase,
        });
      case "lines":
        return diffLines(input1, input2, {
          ignoreCase,
        });
      case "words":
        return diffWords(input1, input2, {
          ignoreCase,
        });
      default:
        return [];
    }
  }, [input1, input2, diffMode, ignoreCase]);

  const handleRadio = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setDiffMode(ev.target.value as DiffMode);
  }, []);

  console.log(diff);

  return (
    <div className="flex flex-grow flex-col">
      <Toolbar label="Output">
        <li className="flex gap-2">
          <span>Diff by: </span>
          {MODE_OPTIONS.map((opt) => (
            <label
              key={opt.mode}
              className="flex gap-1"
              htmlFor={`${opt.mode}-mode`}
            >
              <input
                name="diff-mode"
                id={`${opt.mode}-mode`}
                type="radio"
                value={opt.mode}
                checked={diffMode === opt.mode}
                onChange={handleRadio}
              />
              {opt.label}
            </label>
          ))}
        </li>
        <li>
          <label htmlFor="ignore-case" className="flex gap-2">
            <input
              id="ignore-case"
              type="checkbox"
              checked={ignoreCase}
              onChange={(ev) => setIgnoreCase(ev.target.checked)}
            />
            Ignore Case
          </label>
        </li>
      </Toolbar>
      <div className="flex flex-grow overflow-auto">
        {diff.length === 0 || (diff.length === 1 && diff[0].count === 0) ? (
          <p>No diff to show</p>
        ) : (
          <pre>
            {diff.map((change, index) => {
              if (change.added) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <ins key={index} className="bg-green-200">
                    {change.value}
                  </ins>
                );
              }
              if (change.removed) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <del key={index} className="bg-red-200">
                    {change.value}
                  </del>
                );
              }
              // eslint-disable-next-line react/no-array-index-key
              return <span key={index}>{change.value}</span>;
            })}
          </pre>
        )}
      </div>
    </div>
  );
}
