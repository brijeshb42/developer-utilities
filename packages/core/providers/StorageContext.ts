import noop from "lodash/noop";
import { createContext, useContext } from "react";

export type GetValueFallback = <T>(key: string, fallback: T) => T;

export type StorageContextType = {
  getItem: (key: string) => unknown;
  // getItemFallback: GetValueFallback;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void;
  scopedStorage: (prefix: string) => Omit<StorageContextType, "scopedStorage">;
};

const DEFAULT: StorageContextType = {
  getItem: (key: string) => key,
  // getItemFallback: <T>(key: string, fallback: T) => fallback,
  setItem: noop,
  removeItem: noop,
  scopedStorage: () => DEFAULT,
};

export const StorageContext = createContext<StorageContextType>(DEFAULT);

export const useStorage = () => useContext(StorageContext);
