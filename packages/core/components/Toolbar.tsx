import clsx from "clsx";
import type { ReactNode, MouseEventHandler } from "react";

type ToolbarProps = {
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  items?: {
    id: string;
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }[];
};

const toolbarBtnClass =
  "inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 disabled:cursor-not-allowed disabled:text-blue-300";

export function Toolbar({
  label,
  items = [],
  className,
  children,
}: ToolbarProps) {
  return (
    <div
      className={clsx(
        "flex flex-shrink items-center justify-between",
        className
      )}
    >
      {label && <span>{label}</span>}
      <ul className="flex gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={toolbarBtnClass}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          </li>
        ))}
        {children}
      </ul>
    </div>
  );
}
