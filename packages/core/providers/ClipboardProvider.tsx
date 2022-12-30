import type ClipboardJS from "clipboard";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ClipboardContext, ClipboardContextType } from "./ClipboardContext";

let Clipboard: { default: typeof ClipboardJS; prototype: ClipboardJS };

const lazyCopy = () => import("clipboard");

export function ClipboardProvider({ children }: PropsWithChildren) {
  const [supportData, setIsClipboardSupported] = useState<
    ClipboardContextType["supportData"]
  >({
    readSupported: false,
    writeSupported: false,
    readPerm: false,
    writePerm: false,
  });

  useEffect(() => {
    const readSupport =
      !!navigator.clipboard &&
      typeof navigator.clipboard.readText === "function";
    const writeSupport =
      !!navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function";
    setIsClipboardSupported((currentVal) => ({
      ...currentVal,
      readSupported: readSupport,
      writeSupported: writeSupport,
      readPerm: readSupport,
      writePerm: writeSupport,
    }));

    lazyCopy().then((module) => {
      Clipboard = module;
    });
  }, []);

  const pasteFrom = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
      setIsClipboardSupported((currentVal) => {
        if (!currentVal.readPerm) {
          return currentVal;
        }
        return {
          ...currentVal,
          readPerm: false,
        };
      });
      return "";
    }
  }, []);
  const pasteTo = useCallback(async (text: string, mimeType?: string) => {
    try {
      if (mimeType) {
        await navigator.clipboard.write([
          new ClipboardItem({
            mimeType: new Blob([text], {
              type: mimeType,
            }),
            "text/plain": new Blob([text], {
              type: "text/plain",
            }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      return true;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
      setIsClipboardSupported((currentVal) => {
        if (!currentVal.writePerm) {
          return currentVal;
        }
        return {
          ...currentVal,
          writePerm: false,
        };
      });
      if (Clipboard) {
        Clipboard.default.copy(text);
      }
      return false;
    }
  }, []);
  const contextValue: ClipboardContextType = useMemo(
    () => ({ pasteFrom, pasteTo, supportData }),
    [pasteFrom, pasteTo, supportData]
  );

  return (
    <ClipboardContext.Provider value={contextValue}>
      {children}
    </ClipboardContext.Provider>
  );
}
