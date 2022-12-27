import clsx from "clsx";
import { DevUPlugin } from "devu-core";
import { useCallback, MouseEvent } from "react";

type MainSidebarProps = {
  iconUrl: string;
  selectedPluginId: string;
  setSelectedPluginId: (newId: string) => void;
  plugins: DevUPlugin[];
};

export function MainSidebar({
  iconUrl,
  plugins,
  selectedPluginId,
  setSelectedPluginId,
}: MainSidebarProps) {
  const handleMenuItemClick = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      const pluginId = (ev.target as HTMLAnchorElement).href.split("#")[1];
      setSelectedPluginId(pluginId);
    },
    [setSelectedPluginId]
  );
  return (
    <div className="h-full flex flex-col pt-5 pb-4">
      <div className="flex flex-shrink pb-2">
        <a href="/" className="flex-shrink-0 flex items-center px-4 gap-2">
          <img
            width="32"
            height="32"
            className="h-8 w-auto"
            src={iconUrl}
            alt="DevU"
          />
          <h1 className="dark:text-white">Utilities</h1>
        </a>
      </div>
      <div className="flex flex-grow flex-col px-2">
        <div className="flex flex-grow flex-col overflow-auto">
          {plugins.map((plugin) => (
            <a
              key={plugin.id}
              href={`#${plugin.id}`}
              onClick={handleMenuItemClick}
              className={clsx(
                selectedPluginId === plugin.id
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-400 hover:text-gray-900",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md dark:text-white"
              )}
            >
              <plugin.icon
                className={clsx(
                  selectedPluginId === plugin.id
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 h-6 w-6"
                )}
                aria-hidden="true"
              />
              {plugin.name}
            </a>
          ))}
        </div>
        <div className="flex flex-shrink px-2">
          <p>Build: {import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA}</p>
        </div>
      </div>
    </div>
  );
}
