import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePanelId } from "./panel-context";

export type ToolbarPortalRenderer = PropsWithChildren<{
  className?: string;
}>;

export function ToolbarLeftRenderer({
  children,
  className,
}: ToolbarPortalRenderer) {
  const { id: panelId } = usePanelId();
  const root = useRef(
    document.getElementById(`panel-${panelId}-left`) as HTMLElement
  );

  useEffect(() => {
    const originalClassName = root.current.className;
    root.current.className = className as string;
    return () => {
      root.current.className = originalClassName;
    };
  }, [className]);

  return createPortal(children, root.current);
}

export function ToolbarRightRenderer({
  children,
  className,
}: ToolbarPortalRenderer) {
  const { id: panelId } = usePanelId();
  const root = useRef(
    document.getElementById(`panel-${panelId}-right`) as HTMLElement
  );

  useEffect(() => {
    const originalClassName = root.current.className;
    root.current.className = className as string;
    return () => {
      root.current.className = originalClassName;
    };
  }, [className]);

  return createPortal(children, root.current);
}
