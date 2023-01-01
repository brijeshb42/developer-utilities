import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(dirname, p);

let template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");

const OUTLET_START_TEMPLATE = "<!--ssr-outlet-start-->";
const OUTLET_END_TEMPLATE = "<!--ssr-outlet-end-->";
const HYDRATE_TEMPLATE = "<!--hydrate global-->";
const outletStartIndex = template.indexOf(OUTLET_START_TEMPLATE);
const outletEndIndex = template.indexOf(OUTLET_END_TEMPLATE);
const endIndexToReplace = outletEndIndex + OUTLET_END_TEMPLATE.length;

const { render } = await import("./dist/server/entry-server.js");

const appHtml = render();
template = template.replace(
  template.substring(outletStartIndex, endIndexToReplace),
  appHtml
);

template = template.replace(
  HYDRATE_TEMPLATE,
  "<script>window.shouldHydrate = true;</script>"
);

fs.writeFileSync(toAbsolute("dist/index.html"), template, "utf-8");
