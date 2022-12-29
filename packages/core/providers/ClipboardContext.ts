import { createContext, useContext } from "react";

export type ClipboardContextType = {
  supportData: {
    readSupported: boolean;
    writeSupported: boolean;
    readPerm: boolean;
    writePerm: boolean;
  };
  pasteFrom?: () => Promise<string>;
  pasteTo?: (text: string, mime?: string) => Promise<boolean>;
};

export const ClipboardContext = createContext<ClipboardContextType>({
  supportData: {
    readSupported: false,
    writeSupported: false,
    readPerm: false,
    writePerm: false,
  },
});

export const useClipboard = () => useContext(ClipboardContext);
