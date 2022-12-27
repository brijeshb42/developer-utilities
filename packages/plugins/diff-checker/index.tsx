import { DevUPlugin } from "devu-core";
import { DiffIcon } from "./components/DiffIcon";

const DiffCheckerPlugin: DevUPlugin = {
  id: "diff-checker",
  name: "Diff Checker",
  category: "other",
  icon: DiffIcon,
  load: () => import("./components/DiffChecker"),
};

export default DiffCheckerPlugin;
