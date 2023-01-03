import {
  DevUPlugin,
  LoadingIndicator,
  MainSchemaUI,
  useStorage,
} from "devu-core";
import { prefetch } from "devu-core/prefetch";
import { ResizeHandle } from "devu-core/components/ResizeHandle";
import { PanelGroup, Panel } from "react-resizable-panels";
import DiffCheckerPlugin from "devu-diff-checker";
import JsonFormatterPlugin from "devu-json-formatter";
import CssMinifierPlugin from "devu-css-minifier";
import LoremIpsumPlugin from "devu-lorem-ipsum";
import MarkdownPreviewPlugin from "devu-markdown-preview";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MainSidebar } from "./components/MainSidebar";
import iconUrl from "./assets/320.png";
import { useBeforeInstall } from "./hooks/useBeforeInstall";

const sizes = [15, 80];

const plugins: DevUPlugin[] = [
  DiffCheckerPlugin,
  JsonFormatterPlugin,
  CssMinifierPlugin,
  LoremIpsumPlugin,
  MarkdownPreviewPlugin,
];

function preload() {
  requestIdleCallback(() => {
    plugins.forEach((plugin) => {
      if (plugin.prefetch?.length) {
        plugin.prefetch.forEach((item) => item());
      }
    });
    prefetch.forEach((item) => item());
  });
}

const LAST_USED_PLUGIN_KEY = "last-used-plugin";

export function App() {
  const initialTitle = useRef("");
  const [selectedPluginId, setSelectedPluginId] = useState("");
  const { getItem, setItem } = useStorage();
  const [deferredPrompt, setDeferredPrompt] = useBeforeInstall();

  useEffect(() => {
    const pluginId = window.location.hash.substring(1);
    if (pluginId) {
      setSelectedPluginId(pluginId);
    } else {
      const storedItem = getItem(LAST_USED_PLUGIN_KEY);
      if (storedItem) {
        setSelectedPluginId(storedItem as string);
      }
    }
    preload();
  }, [getItem]);

  useEffect(() => {
    if (window.location.hash.substring(1) !== selectedPluginId) {
      window.history.replaceState(undefined, "", `#${selectedPluginId}`);
      setItem(LAST_USED_PLUGIN_KEY, selectedPluginId);
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

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    setDeferredPrompt(null);
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
  }, [deferredPrompt]);

  return (
    <div className="flex flex-col h-screen w-screen">
      {deferredPrompt && (
        <div className="flex flex-shrink gap-4 py-2 px-4 items-center justify-center border-b border-dashed">
          <div className="flex flex-grow items-center justify-center gap-4">
            <h2>Install DevU as an App for easy access even when offline</h2>
            <button
              type="button"
              className="btn btn-xs btn-success"
              onClick={handleInstall}
            >
              Install
            </button>
          </div>
          <button
            type="button"
            className="btn btn-xs btn-circle"
            onClick={() => setDeferredPrompt(null)}
          >
            <Cross2Icon />
          </button>
        </div>
      )}
      <PanelGroup
        className="flex flex-grow h-full w-full group"
        direction="horizontal"
      >
        <Panel defaultSize={sizes[0]} className="h-full w-full">
          <MainSidebar
            iconUrl={iconUrl}
            selectedPluginId={selectedPluginId}
            plugins={plugins}
            setSelectedPluginId={setSelectedPluginId}
          />
        </Panel>
        <ResizeHandle />
        <Panel className="p-2">
          <div className="h-full border border-dashed dark:border-gray-600 rounded-sm">
            <Suspense fallback={<LoadingIndicator />}>
              {PluginComponent ? <PluginComponent /> : element}
            </Suspense>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
