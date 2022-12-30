import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import throttle from "lodash/throttle";
import { StorageContext, StorageContextType } from "./StorageContext";

export function StorageProvider({ children }: PropsWithChildren) {
  const data = useRef<Record<string, unknown>>({});
  const flushStorage = useCallback(() => {
    const strData = JSON.stringify(data.current);
    localStorage.setItem("devutils", strData);
  }, []);
  const throttledFlush = useRef(throttle(flushStorage, 2000));

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
  const getItem = useCallback((key: string) => data.current[key], []);
  const removeItem = useCallback((key: string) => {
    delete data.current[key];
    throttledFlush.current();
  }, []);

  const setItem = useCallback((key: string, value: unknown) => {
    data.current[key] = value;
    throttledFlush.current();
  }, []);

  const scopedStorage = useCallback(
    (prefix: string) => {
      if (!prefix) {
        return { getItem, setItem, removeItem };
      }
      return {
        getItem(key) {
          return getItem(`${prefix}:${key}`);
        },
        setItem(key, value) {
          setItem(`${prefix}:${key}`, value);
        },
        removeItem(key) {
          removeItem(`${prefix}:${key}`);
        },
      } as StorageContextType;
    },
    [getItem, setItem, removeItem]
  );

  const contextValue = useMemo(
    () => ({ getItem, setItem, scopedStorage, removeItem }),
    [getItem, setItem, scopedStorage, removeItem]
  );

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}
