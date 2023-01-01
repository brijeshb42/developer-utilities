import { DevUPlugin, LoadingIndicator, MainSchemaUI } from "devu-core";
import { prefetch } from "devu-core/prefetch";
import Split from "react-split";
import DiffCheckerPlugin from "devu-diff-checker";
import JsonFormatterPlugin from "devu-json-formatter";
import CssMinifierPlugin from "devu-css-minifier";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { MainSidebar } from "./components/MainSidebar";
import iconUrl from "./assets/320.png";

const sizes = [20, 80];

const plugins: DevUPlugin[] = [
  DiffCheckerPlugin,
  JsonFormatterPlugin,
  CssMinifierPlugin,
];

export function App() {
  const initialTitle = useRef("");
  const [selectedPluginId, setSelectedPluginId] = useState("");

  useEffect(() => {
    const pluginId = window.location.hash.substring(1);
    if (pluginId) {
      setSelectedPluginId(pluginId);
    }
    requestIdleCallback(() => {
      plugins.forEach((plugin) => {
        if (plugin.prefetch?.length) {
          plugin.prefetch.forEach((item) => item());
        }
      });
      prefetch.forEach((item) => item());
    });
  }, []);

  useEffect(() => {
    if (window.location.hash.substring(1) !== selectedPluginId) {
      window.history.replaceState(undefined, "", `#${selectedPluginId}`);
    }
  }, [selectedPluginId]);

  const currentPlugin = useMemo(
    () => plugins.find((p) => p.id === selectedPluginId),
    [selectedPluginId]
  );

  useEffect(() => {
    if (currentPlugin) {
      initialTitle.current = window.document.title;
      window.document.title = currentPlugin.name;
    } else {
      window.document.title =
        initialTitle.current || "DevU - Everyday utilities for developers";
    }
  }, [currentPlugin]);

  const PluginComponent = useMemo(() => {
    if (currentPlugin?.load) {
      return lazy(currentPlugin.load);
    }
    return null;
  }, [currentPlugin]);
  const element = currentPlugin?.schema ? (
    <MainSchemaUI key={currentPlugin.id} schema={currentPlugin.schema} />
  ) : null;

  return (
    <Split gutterSize={2} sizes={sizes} className="flex h-screen w-screen">
      <div className="h-full overflow-hidden">
        <MainSidebar
          iconUrl={iconUrl}
          selectedPluginId={selectedPluginId}
          plugins={plugins}
          setSelectedPluginId={setSelectedPluginId}
        />
      </div>
      <div className="h-full w-full p-2">
        <div className="h-full border border-dashed dark:border-gray-600 rounded-sm">
          <Suspense fallback={<LoadingIndicator />}>
            {PluginComponent ? <PluginComponent /> : element}
          </Suspense>
        </div>
      </div>
    </Split>
  );
}
