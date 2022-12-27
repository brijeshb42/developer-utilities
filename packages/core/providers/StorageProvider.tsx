import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import throttle from "lodash/throttle";
import { GetValue, StorageContext, StorageContextType } from "./StorageContext";

export function StorageProvider({ children }: PropsWithChildren) {
  const data = useRef<Record<string, unknown>>({});
  useEffect(() => {
    try {
      const dataStr = localStorage.getItem("devutils");
      if (!dataStr) {
        return;
      }
      const storedData = JSON.parse(dataStr);
      data.current = storedData;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
    }
  }, []);
  const getValue = useCallback<GetValue>((key, fallback) => {
    const val = data.current[key];
    if (typeof val === "undefined") {
      return fallback;
    }

    return val as typeof fallback;
  }, []);

  const flushStorage = useCallback(() => {
    const strData = JSON.stringify(data.current);
    localStorage.setItem("devutils", strData);
  }, []);
  const throttledFlush = useRef(throttle(flushStorage, 2000));

  const setValue = useCallback((key: string, value: unknown) => {
    data.current[key] = value;
    throttledFlush.current();
  }, []);

  const scopedStorage = useCallback(
    (prefix: string) => {
      if (!prefix) {
        return { getValue, setValue };
      }
      return {
        getValue(key, fallback) {
          return getValue(`${prefix}:${key}`, fallback);
        },
        setValue(key, value) {
          setValue(`${prefix}:${key}`, value);
        },
      } as StorageContextType;
    },
    [getValue, setValue]
  );

  const contextValue = useMemo(
    () => ({ getValue, setValue, scopedStorage }),
    [getValue, setValue, scopedStorage]
  );

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}
