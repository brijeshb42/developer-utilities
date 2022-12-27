import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ClipboardContext, ClipboardContextType } from "./ClipboardContext";

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
  const pasteTo = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

export const useClipboard = () => useContext(ClipboardContext);
