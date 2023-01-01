import { DevUPlugin } from "devu-core";
import { CssIcon } from "./components/CssIcon";
import { pluginId } from "./css-minifier-plugin-utils";
import { CssMinifierPluginSchema } from "./css-minifier-schema-ui";
import { wasmLoader, loadLightningWasm } from "./utils/css-prefetch";

const DiffCheckerPlugin: DevUPlugin = {
  id: pluginId,
  name: "CSS Minifier",
  category: "other",
  icon: CssIcon,
  schema: CssMinifierPluginSchema,
  prefetch: [
    () => import("./utils/css-minifier"),
    wasmLoader,
    loadLightningWasm,
  ],
};

export default DiffCheckerPlugin;
