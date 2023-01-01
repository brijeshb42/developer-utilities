import { DevUPlugin } from "devu-core";
import { JsonIcon } from "./components/JsonIcon";
import { pluginId } from "./json-formatter-plugin-utils";
import { JsonFormatterPluginSchema } from "./json-schema-ui";

const JsonFormatterPlugin: DevUPlugin = {
  id: pluginId,
  name: "JSON Formatter",
  category: "formatter",
  icon: JsonIcon,
  schema: JsonFormatterPluginSchema,
  prefetch: [() => import("./utils/json-output")],
};

export default JsonFormatterPlugin;
