import { Toolbar } from "devu-core";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { RpcWorker, toWorker } from "devu-utils/worker-utils/main-thread";
import { Change } from "diff";
import { debounce } from "lodash";
import { useStorageValue } from "devu-core/providers/StorageContext";

// eslint-disable-next-line import/no-unresolved
import DiffWorker from "../utils/diff-worker?worker";
import { pluginId } from "../diff-checker-plugin-utils";
import { DiffText } from "./DiffText";
import { DiffMode } from "../utils/diff-utils";

type DiffResultProps = {
  input1: string;
  input2: string;
};

const MODE_OPTIONS: { mode: DiffMode; label: string }[] = [
  {
    mode: "chars",
    label: "Characters",
  },
  { mode: "lines", label: "Lines" },
  { mode: "words", label: "Words" },
];

const KEYS = {
  diffMode: "diff-mode",
  ignoreCase: "ignore-case",
};

export function DiffResult({ input1, input2 }: DiffResultProps) {
  const [diffMode, setDiffMode] = useStorageValue(
    KEYS.diffMode,
    "chars" as DiffMode,
    pluginId
  );
  const [ignoreCase, setIgnoreCase] = useStorageValue(
    KEYS.ignoreCase,
    false,
    pluginId
  );
  const [diffs, setDiffs] = useState<Change[]>([]);
  const rpcWorkerRef = useRef<RpcWorker>();
  const debouncedDiffer = useRef(
    debounce(
      (args: unknown[]) => {
        if (!rpcWorkerRef.current) {
          return;
        }
        rpcWorkerRef.current.post("getDiff", args).then((result) => {
          setDiffs(result as Change[]);
        });
      },
      500,
      {
        leading: true,
      }
    )
  );

  useEffect(() => {
    const diffWorker = new DiffWorker();
    const worker = toWorker(diffWorker);
    rpcWorkerRef.current = worker;
    return () => {
      debouncedDiffer.current.cancel();
      worker.dispose();
    };
  }, []);

  useEffect(() => {
    debouncedDiffer.current([input1, input2, diffMode, ignoreCase]);
  }, [input1, input2, diffMode, ignoreCase]);

  const focussableItemsCount = useMemo(
    () =>
      diffs.reduce(
        (acc, ch) => {
          if (ch.added) {
            acc.added += 1;
          } else if (ch.removed) {
            acc.removed += 1;
          }
          return acc;
        },
        { added: 0, removed: 0 }
      ),
    [diffs]
  );
  const currentFocussedElement = useRef(-1);

  useEffect(() => {
    currentFocussedElement.current = -1;
  }, [diffs]);

  const handleNext = useCallback(() => {
    if (
      currentFocussedElement.current >=
      focussableItemsCount.added + focussableItemsCount.removed - 1
    ) {
      currentFocussedElement.current = 0;
    } else {
      currentFocussedElement.current += 1;
    }
    const el =
      document.querySelectorAll<HTMLButtonElement>("[data-diff-token]")[
        currentFocussedElement.current
      ];
    el?.focus();
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [focussableItemsCount]);

  const handlePrevious = useCallback(() => {
    if (currentFocussedElement.current <= 0) {
      currentFocussedElement.current =
        focussableItemsCount.added + focussableItemsCount.removed - 1;
    } else {
      currentFocussedElement.current -= 1;
    }
    const el =
      document.querySelectorAll<HTMLButtonElement>("[data-diff-token]")[
        currentFocussedElement.current
      ];
    el?.focus();
    el?.scrollIntoView({
      behavior: "smooth",
    });
  }, [focussableItemsCount]);

  const handleRadio = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setDiffMode(ev.target.value as DiffMode);
  }, []);

  const focussableDiffsCount =
    focussableItemsCount.added + focussableItemsCount.removed;
  const hasDiffs = focussableDiffsCount > 0;

  return (
    <div className="flex flex-grow flex-col">
      <Toolbar label="Output">
        {hasDiffs && (
          <li className="flex gap-2 items-center">
            <span>Copy:</span>
            <div className="btn-group">
              <button
                data-type="raw"
                type="button"
                className="btn btn-xs btn-accent"
              >
                Raw
              </button>
              <button
                data-type="html"
                type="button"
                className="btn btn-xs btn-accent"
              >
                HTML
              </button>
              <button
                data-type="patch"
                type="button"
                className="btn btn-xs btn-accent"
              >
                Patch
              </button>
            </div>
          </li>
        )}
        {hasDiffs && (
          <li className="flex gap-2 items-center">
            <button
              type="button"
              className="btn btn-xs btn-square"
              aria-label="Goto previous"
              onClick={handlePrevious}
            >
              <ChevronLeftIcon />
            </button>
            <span>Jump</span>
            <button
              type="button"
              className="btn btn-xs btn-square"
              onClick={handleNext}
              aria-label="Goto next"
            >
              <ChevronRightIcon />
            </button>
          </li>
        )}
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
        {diffs.length === 0 || (diffs.length === 1 && diffs[0].count === 0) ? (
          <p>No diff to show</p>
        ) : (
          <DiffText changes={diffs} />
        )}
      </div>
    </div>
  );
}
