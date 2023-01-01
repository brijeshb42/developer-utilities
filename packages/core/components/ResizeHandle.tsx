import clsx from "clsx";
import { PanelResizeHandle } from "react-resizable-panels";

type ResizeHandleProps = {
  className?: string;
  id?: string;
};

type IconType = "resize-horizontal" | "resize-vertical";

function Icon({
  className = "",
  type,
}: {
  className?: string;
  type: IconType;
}) {
  let path = "";
  switch (type) {
    case "resize-horizontal":
      path =
        "M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z";
      break;
    case "resize-vertical":
      path =
        "M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z";
      break;
    default:
      break;
  }

  return (
    <svg
      className={clsx(
        className,
        "absolute w-4 h-4 fill-current left-[calc(50%) - 0.5rem] top-[calc(50%) - 0.5rem]"
      )}
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d={path} />
    </svg>
  );
}

export function ResizeHandle({ className, id }: ResizeHandleProps) {
  return (
    <PanelResizeHandle
      className={clsx(
        className,
        "flex my-0.5 flex-grow-0 flex-shrink-0 basis-1 transition-colors duration-200 justify-center items-stretch p-0.5 outline-none bg-transparent rounded-md data-[resize-handle-active]:bg-slate-300 group/handle bg-gray-200 dark:bg-gray-900"
      )}
      id={id}
    >
      <div className="flex items-center justify-center text-gray-500">
        <Icon
          className="group-data-[panel-group-direction=vertical]/handle:hidden"
          type="resize-horizontal"
        />
        <Icon
          className="group-data-[panel-group-direction=horizontal]/handle:hidden"
          type="resize-vertical"
        />
      </div>
    </PanelResizeHandle>
  );
}
