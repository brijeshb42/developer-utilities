import { DevUPlugin } from "devu-core";
import { JsonIcon } from "./components/JsonIcon";
import { pluginId } from "./json-formatter-plugin-utils";
import { DiffPluginSchema } from "./json-schema-ui";

const DiffCheckerPlugin: DevUPlugin = {
  id: pluginId,
  name: "JSON Formatter",
  category: "formatter",
  icon: JsonIcon,
  schema: DiffPluginSchema,
  prefetch: [() => import("./utils/json-output")],
};

export default DiffCheckerPlugin;
