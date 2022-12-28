import { DevUPlugin } from "devu-core";
import { DiffIcon } from "./components/DiffIcon";
import { pluginId } from "./diff-checker-plugin-utils";

const DiffCheckerPlugin: DevUPlugin = {
  id: pluginId,
  name: "Diff Checker",
  category: "other",
  icon: DiffIcon,
  load: () => import("./components/DiffChecker"),
};

export default DiffCheckerPlugin;
