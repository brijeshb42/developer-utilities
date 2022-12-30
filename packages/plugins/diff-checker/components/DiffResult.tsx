import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RpcWorker, toWorker } from "devu-utils/worker-utils/main-thread";
import { debounce } from "lodash";
import {
  ToolbarLeftRenderer,
  ToolbarRightRenderer,
  useClipboard,
} from "devu-core";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

// eslint-disable-next-line import/no-unresolved
import DiffWorker from "../utils/diff-worker?worker";
import { Change, DiffText } from "./DiffText";
import { DiffMode } from "../utils/diff-utils";
import { OutputFormat } from "./DiffToken";

type DiffResultProps = {
  input1: string;
  input2: string;
  diffMode: DiffMode;
  outputFormat: OutputFormat;
};

export function DiffResult({
  input1,
  input2,
  diffMode,
  outputFormat,
}: DiffResultProps) {
  const { pasteTo } = useClipboard();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);
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

  return (
    <div className="flex flex-grow flex-col h-full w-full">
      <div className="flex flex-grow flex-1 overflow-auto border-t border-dashed mt-2 pt-2">
        {diffs.length === 0 ? (
          <p>{isLoading ? "Calculating diff" : "No diff to show"}</p>
        ) : (
          <DiffText outputFormat={outputFormat} changes={diffs} />
        )}
      </div>
      <ToolbarLeftRenderer className="flex items-center gap-2">
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
      </ToolbarLeftRenderer>
      <ToolbarRightRenderer>
        <button type="button" className="btn btn-xs" onClick={handleCopy}>
          Copy
        </button>
      </ToolbarRightRenderer>
    </div>
  );
}
