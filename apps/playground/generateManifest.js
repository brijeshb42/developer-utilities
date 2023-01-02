import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(dirname, p);
const assets = fs.readdirSync("dist/assets");
const swWorkerFile = assets.find(
  (asset) => asset.startsWith("serviceWorker-") && asset.endsWith(".js")
);

const manifestStr = fs.readFileSync(
  toAbsolute("dist/client-manifest.json"),
  "utf-8"
);
const manifestJson = JSON.parse(manifestStr);
let template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");

const webManifestFileName = "manifest.webmanifest";
const pwaManifestTemplate = "<!--pwa manifest-->";
const serviceWorkerTemplate = "<!--serviceworker-->";

template = template.replace(
  pwaManifestTemplate,
  `<link rel="manifest" href="/${webManifestFileName}" />`
);

template = template.replace(
  serviceWorkerTemplate,
  `<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
</script>`
);

const icons = [48, 72, 96, 144, 192, 512];

const webManifest = {
  short_name: "DevU",
  name: "Developer Utilities",
  // purpose: "any maskable",
  id: "/",
  start_url: "/?source-pwa",
  background_color: "#79c2e1",
  display: "standalone",
  scope: "/",
  theme_color: "#1d509b",
  shortcuts: [],
  description: "Utilities used by developers almost everyday.",
  screenshots: [],
};

webManifest.icons = icons.map((iconSize) => ({
  src: `/${
    manifestJson[`src/assets/android-launchericon-${iconSize}-${iconSize}.png`]
      .file
  }`,
  type: "image/png",
  sizes: `${iconSize}x${iconSize}`,
}));

function filterManifest() {
  const keys = Object.keys(manifestJson);
  const filter = (key) =>
    key.startsWith("src") || key.startsWith("_") || key === "index.html";
  // keys = keys.filter(filter);
  const finalAssets = new Set();
  keys.forEach((key) => {
    const data = manifestJson[key];
    finalAssets.add(data.file);
    ["imports", "dynamicImports", "css", "assets"].forEach((type) => {
      data[type]?.filter(filter).forEach((item) => {
        finalAssets.add(item[0] === "_" ? manifestJson[key].file : item);
      });
    });
  });
  return Array.from(finalAssets);
}

const swContent = `var assets = ${JSON.stringify(
  filterManifest(),
  undefined,
  2
)};
var cacheId = ${JSON.stringify(swWorkerFile.split("-")[1].split(".")[0])};
importScripts('/assets/${swWorkerFile}');`;

fs.writeFileSync(
  toAbsolute(`dist/${webManifestFileName}`),
  JSON.stringify(webManifest, null, 2),
  "utf-8"
);
fs.writeFileSync(toAbsolute("dist/index.html"), template, "utf-8");
fs.writeFileSync(toAbsolute("dist/sw.js"), swContent, "utf-8");
