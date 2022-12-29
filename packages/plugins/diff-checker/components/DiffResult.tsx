import { Toolbar, LoadingIndicator, useClipboard } from "devu-core";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { RpcWorker, toWorker } from "devu-utils/worker-utils/main-thread";
import clsx from "clsx";
import { Change } from "diff";
import { debounce } from "lodash";
import { useStorageValue } from "devu-core/providers/StorageContext";

// eslint-disable-next-line import/no-unresolved
import DiffWorker from "../utils/diff-worker?worker";
import { pluginId } from "../diff-checker-plugin-utils";
import { DiffText } from "./DiffText";
import { DiffMode } from "../utils/diff-utils";
import { OutputFormat } from "./DiffToken";

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
  outputFormat: "output-format",
};

export function DiffResult({ input1, input2 }: DiffResultProps) {
  const { pasteTo } = useClipboard();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);
  const [diffMode, setDiffMode] = useStorageValue(
    KEYS.diffMode,
    "chars" as DiffMode,
    pluginId
  );
  const [outputFormat, setOutputFormat] = useStorageValue(
    KEYS.outputFormat,
    "raw" as OutputFormat,
    pluginId
  );
  const [diffs, setDiffs] = useState<Change[]>([]);
  const rpcWorkerRef = useRef<RpcWorker>();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const debouncedDiffer = useRef(
    debounce(
      (args: unknown[]) => {
        if (!rpcWorkerRef.current) {
          return;
        }
        setDiffs([]);
        setIsLoading(true);
        rpcWorkerRef.current.post("getDiff", args).then((result) => {
          if (!isMounted.current) {
            return;
          }
          setDiffs(result as Change[]);
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
    const diffWorker = new DiffWorker();
    const worker = toWorker(diffWorker);
    rpcWorkerRef.current = worker;
    return () => {
      debouncedDiffer.current.cancel();
      worker.dispose();
    };
  }, []);

  useEffect(() => {
    debouncedDiffer.current([input1, input2, diffMode]);
  }, [input1, input2, diffMode]);

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

  const handleSetOutputFormat = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      const { type } = (ev.target as HTMLButtonElement).dataset;
      if (!type) {
        return;
      }
      setOutputFormat(type as OutputFormat);
    },
    []
  );

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
      inline: "nearest",
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
      block: "nearest",
      inline: "nearest",
    });
  }, [focussableItemsCount]);

  const handleModeChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setDiffMode(ev.target.value as DiffMode);
  }, []);

  const handleCopy = useCallback(async () => {
    if (outputFormat === "raw") {
      await pasteTo?.(diffs.map((d) => d.value).join(""));
    } else if (outputFormat === "html") {
      const text = `<pre>${diffs
        .map((d) => {
          if (d.added) {
            return `<ins style="background-color: green">${d.value
              .split("\n")
              .join("<br>\n")}</ins>`;
          }
          if (d.removed) {
            return `<del style="background-color: red">${d.value
              .split("\n")
              .join("<br>\n")}</del>`;
          }
          return d.value.split("\n").join("<br>\n");
        })
        .join("")}</pre>`;
      await pasteTo?.(text, "text/html");
    }
  }, [diffs, outputFormat]);

  const focussableDiffsCount =
    focussableItemsCount.added + focussableItemsCount.removed;
  const hasDiffs = focussableDiffsCount > 0;

  return (
    <div className="flex flex-grow flex-col h-full w-full">
      <Toolbar label="Output">
        {isLoading && (
          <li>
            <LoadingIndicator className="h-4 w-4" />
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
                onChange={handleModeChange}
              />
              <span className="label-text">{opt.label}</span>
            </label>
          ))}
        </li>
        {hasDiffs && (
          <>
            <li
              className={clsx("flex gap-2 items-center", {
                "pointer-events-none": outputFormat !== "raw",
              })}
            >
              <button
                type="button"
                className="btn btn-xs btn-square"
                aria-label="Goto previous"
                disabled={outputFormat !== "raw"}
                onClick={handlePrevious}
              >
                <ChevronLeftIcon />
              </button>
              <span>Jump</span>
              <button
                type="button"
                className="btn btn-xs btn-square"
                onClick={handleNext}
                disabled={outputFormat !== "raw"}
                aria-label="Goto next"
              >
                <ChevronRightIcon />
              </button>
            </li>
            <li className="flex gap-2 items-center">
              <span>Format</span>
              <div className="btn-group">
                <button
                  data-type="raw"
                  type="button"
                  className={clsx("btn btn-xs", {
                    "btn-active": outputFormat === "raw",
                  })}
                  onClick={handleSetOutputFormat}
                >
                  Raw
                </button>
                <button
                  data-type="html"
                  type="button"
                  className={clsx("btn btn-xs", {
                    "btn-active": outputFormat === "html",
                  })}
                  onClick={handleSetOutputFormat}
                >
                  HTML
                </button>
                {/* <button
                  data-type="patch"
                  type="button"
                  className="btn btn-xs btn-accent"
                >
                  Patch
                </button> */}
              </div>
              <button type="button" className="btn btn-xs" onClick={handleCopy}>
                Copy
              </button>
            </li>
          </>
        )}
        {/* <li className="border-l pl-2">
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
        </li> */}
      </Toolbar>
      <div className="flex flex-grow flex-1 overflow-auto border-t border-dashed mt-2 pt-2">
        {diffs.length === 0 || (diffs.length === 1 && diffs[0].count === 0) ? (
          <p>{isLoading ? "Calculating diff" : "No diff to show"}</p>
        ) : (
          <DiffText outputFormat={outputFormat} changes={diffs} />
        )}
      </div>
    </div>
  );
}
