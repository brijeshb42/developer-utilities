import { createContext, useContext } from "react";

export type GetValue = <T>(key: string, fallback: T) => T;

export type StorageContextType = {
  getValue?: GetValue;
  setValue?: (key: string, value: unknown) => void;
  scopedStorage?: (prefix: string) => StorageContextType;
};

export const StorageContext = createContext<StorageContextType>({});

export const useStorage = () => useContext(StorageContext);
