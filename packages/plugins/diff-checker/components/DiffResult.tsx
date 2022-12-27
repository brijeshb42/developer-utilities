import { Toolbar, useStorage } from "devu-core";
import { diffChars, diffLines, diffWords } from "diff";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

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

function DiffToken({
  added,
  removed,
  value,
}: {
  added?: boolean;
  removed?: boolean;
  value: string;
}) {
  if (added) {
    return (
      <ins className="bg-green-300 dark:bg-green-800 dark:text-white">
        {value}
      </ins>
    );
  }
  if (removed) {
    return (
      <del className="bg-red-400 dark:bg-red-800 dark:text-white">{value}</del>
    );
  }
  return <span className="text-gray-700 dark:text-white">{value}</span>;
}

export function DiffResult({ input1, input2 }: DiffResultProps) {
  const { scopedStorage } = useStorage();
  const storage = useMemo(() => scopedStorage?.("diff-checker"), []);
  const [diffMode, setDiffMode] = useState<DiffMode>(
    storage?.getValue?.("diff-mode", "chars") ?? "chars"
  );
  const [ignoreCase, setIgnoreCase] = useState(
    storage?.getValue?.("ignore-case", false) ?? false
  );

  useEffect(() => {
    storage?.setValue?.("diff-mode", diffMode);
  }, [storage, diffMode]);

  useEffect(() => {
    storage?.setValue?.("ignore-case", ignoreCase);
  }, [storage, ignoreCase]);

  const diff = useMemo(() => {
    switch (diffMode) {
      case undefined:
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

  return (
    <div className="flex flex-grow flex-col">
      <Toolbar label="Output">
        <li className="flex gap-2 items-center">
          <span>Diff by: </span>
          {MODE_OPTIONS.map((opt) => (
            <label
              key={opt.mode}
              className="flex gap-1 label cursor-pointer"
              htmlFor={`${opt.mode}-mode`}
            >
              <input
                name="diff-mode"
                id={`${opt.mode}-mode`}
                type="radio"
                className="radio radio-info radio-sm"
                value={opt.mode}
                checked={diffMode === opt.mode}
                onChange={handleRadio}
              />
              <span className="label-text">{opt.label}</span>
            </label>
          ))}
        </li>
        <li className="border-l pl-2">
          <label htmlFor="ignore-case" className="flex gap-2">
            <span className="label-text">Ignore Case</span>
            <input
              id="ignore-case"
              type="checkbox"
              className="toggle"
              checked={ignoreCase}
              onChange={(ev) => setIgnoreCase(ev.target.checked)}
            />
          </label>
        </li>
      </Toolbar>
      <div className="flex flex-grow overflow-auto border-t border-dashed mt-2 pt-2">
        {diff.length === 0 || (diff.length === 1 && diff[0].count === 0) ? (
          <p>No diff to show</p>
        ) : (
          <pre className="text-base">
            {diff.map((change, index) => (
              <DiffToken
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={change.value}
                added={change.added}
                removed={change.removed}
              />
            ))}
          </pre>
        )}
      </div>
    </div>
  );
}
