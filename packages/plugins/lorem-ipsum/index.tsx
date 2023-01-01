import { DevUPlugin } from "devu-core";
import { LoreIpsumIcon } from "./components/LoremIpsumIcon";
import { pluginId } from "./lorem-ipsum-plugin-utils";
import { LoremIpsumPluginSchema } from "./lorem-ipsum-schema-ui";

const LoremIpsumPlugin: DevUPlugin = {
  id: pluginId,
  name: "Lorem Ipsum",
  category: "other",
  icon: LoreIpsumIcon,
  schema: LoremIpsumPluginSchema,
  prefetch: [() => import("./utils/lorem-ipsum-output")],
};

export default LoremIpsumPlugin;
