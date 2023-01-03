import { DevUPlugin } from "devu-core";
import { MarkdownIcon } from "./components/MarkdownIcon";
import { MarkdownPreviewSchema } from "./markdown-preview-schema";
import { pluginId } from "./markedown-preview-plugin-utils";

const MarkdownPreviewPlugin: DevUPlugin = {
  id: pluginId,
  name: "Markdown Preview",
  category: "other",
  icon: MarkdownIcon,
  schema: MarkdownPreviewSchema,
  prefetch: [() => import("./components/MarkdownResult")],
};

export default MarkdownPreviewPlugin;
