import { DevUPlugin, LoadingIndicator } from "devu-core";
import Split from "react-split";
import DiffCheckerPlugin from "devu-diff-checker";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { MainSidebar } from "./components/MainSidebar";
import iconUrl from "./assets/320.png";

const sizes = [20, 80];

const plugins: DevUPlugin[] = [DiffCheckerPlugin];

export function App() {
  const [selectedPluginId, setSelectedPluginId] = useState("");

  useEffect(() => {
    const pluginId = window.location.hash.substring(1);
    if (pluginId) {
      setSelectedPluginId(pluginId);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash.substring(1) !== selectedPluginId) {
      window.history.replaceState(undefined, "", `#${selectedPluginId}`);
    }
  }, [selectedPluginId]);

  const PluginComponent = useMemo(() => {
    const plugin = plugins.find((p) => p.id === selectedPluginId);
    if (plugin) {
      return lazy(plugin.load);
    }
    return null;
  }, [selectedPluginId]);

  return (
    <Split gutterSize={2} sizes={sizes} className="flex h-screen w-screen">
      <div className="bg-gray-100 h-full overflow-hidden">
        <MainSidebar
          iconUrl={iconUrl}
          selectedPluginId={selectedPluginId}
          plugins={plugins}
          setSelectedPluginId={setSelectedPluginId}
        />
      </div>
      <div className="h-full w-full p-2">
        <div className="h-full border border-dashed rounded-sm">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingIndicator />
              </div>
            }
          >
            {PluginComponent ? <PluginComponent /> : null}
          </Suspense>
        </div>
      </div>
    </Split>
  );
}
