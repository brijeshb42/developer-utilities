import { DevUPlugin } from "devu-core";
import { DiffIcon } from "./components/DiffIcon";
import { pluginId } from "./diff-checker-plugin-utils";
import { DiffPluginSchema } from "./diff-schema-ui";

const DiffCheckerPlugin: DevUPlugin = {
  id: pluginId,
  name: "Diff Checker",
  category: "other",
  icon: DiffIcon,
  schema: DiffPluginSchema,
  prefetch: [() => import("./components/DiffResult")],
};

export default DiffCheckerPlugin;
