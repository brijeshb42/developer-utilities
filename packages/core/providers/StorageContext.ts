import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type GetValue = <T>(key: string, fallback: T) => T;

export type StorageContextType = {
  getValue?: GetValue;
  setValue?: (key: string, value: unknown) => void;
  del?: (key: string) => void;
  scopedStorage?: (prefix: string) => StorageContextType;
};

export const StorageContext = createContext<StorageContextType>({});

export const useStorage = () => useContext(StorageContext);

export function useStorageValue<T>(
  key: string,
  defaultValue: T,
  scope?: string
) {
  const storage = useStorage();
  const finalStorage = useMemo(() => {
    if (!scope) {
      return storage;
    }
    return storage.scopedStorage?.(scope);
  }, [scope, storage]);
  const [val, setVal] = useState(
    finalStorage?.getValue?.(key, defaultValue) ?? defaultValue
  );
  useEffect(() => {
    if (val === defaultValue) {
      finalStorage?.del?.(key);
    } else {
      finalStorage?.setValue?.(key, val);
    }
  }, [val, finalStorage, key]);
  return [val, setVal] as const;
}
