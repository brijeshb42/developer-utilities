import { CodeEditor, ToolbarRightRenderer, useClipboard } from "devu-core";
import { useDarkMode, useIsMounted } from "usehooks-ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import dom from "dompurify";
import { getOutput } from "../utils/markdown-output";

type MarkdownResultProps = {
  type: "raw" | "html";
  input: string;
  gfm?: boolean;
};

function MarkdownHtmlPreview({ html }: { html: string }) {
  const purifiedHtml = useMemo(() => {
    if (html) {
      return dom.sanitize(html);
    }
    return html;
  }, [html]);

  return (
    <div
      className={`w-full h-full items-center justify-center ${
        !html ? "flex" : ""
      }`}
    >
      {html ? (
        <div
          className="w-full h-full overflow-auto prose mx-auto"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: purifiedHtml }}
        />
      ) : (
        <p className="text-xl font-bold">Preview will be available here</p>
      )}
    </div>
  );
}

export function MarkdownResult({ input, gfm, type }: MarkdownResultProps) {
  const [output, setOutput] = useState("");
  const isMounted = useIsMounted();
  const { pasteTo } = useClipboard();
  const { isDarkMode } = useDarkMode();
  const debouncer = useRef(
    debounce((input1: string, gfm1: boolean) => {
      const out = getOutput({
        input: input1,
        gfm: !!gfm1,
      });
      if (!isMounted()) {
        return;
      }
      setOutput(out);
    })
  );
  useEffect(() => {
    debouncer.current(input, !!gfm);
  }, [input, gfm]);
  const handleCopy = useCallback(() => {
    pasteTo?.(output);
  }, [pasteTo, output]);

  return (
    <>
      <ToolbarRightRenderer>
        <button type="button" className="btn btn-xs" onClick={handleCopy}>
          Copy
        </button>
      </ToolbarRightRenderer>
      {type === "raw" ? (
        <CodeEditor
          value={output}
          onChange={setOutput}
          fontSize={18}
          language="html"
          placeholder="HTML output"
          theme={isDarkMode ? "dark" : "light"}
        />
      ) : (
        <MarkdownHtmlPreview html={output} />
      )}
    </>
  );
}
