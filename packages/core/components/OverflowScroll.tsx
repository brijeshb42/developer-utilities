import { PropsWithChildren } from "react";

export function OverflowScroll({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="h-full overflow-auto">{children}</div>
    </div>
  );
}
