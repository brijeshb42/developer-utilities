import { resolve } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, splitVendorChunkPlugin } from "vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import react from "@vitejs/plugin-react";

// const pwaManifestPlugin: () => PluginOption = () => {
//   let config: ResolvedConfig;

//   return {
//     name: "vite:pwa",
//     enforce: "post",
//     apply: "build",
//     configResolved(cfg) {
//       config = cfg;
//     },
//     transformIndexHtml: {
//       order: "post",
//       handler(html) {
//         return {
//           html,
//           tags: [
//             {
//               tag: "link",
//               attrs: {
//                 rel: "manifest",
//                 href: `${config.env.BASE_URL}manifest.webmanifest`,
//               },
//               injectTo: "head",
//             },
//             {
//               tag: "meta",
//               name: "theme-color",
//               content: manifestJson.theme_color,
//             },
//           ],
//         };
//       },
//     },
//     generateBundle(_opt, bundle) {
//       if (!bundle) {
//         return;
//       }
//       // const icons = manifestJson.icons.map((icon) => {
//       //   const newPath =
//       //     bundles.find((bun) => bun.startsWith(icon.src)) ?? icon.src;
//       //   return {
//       //     ...icon,
//       //     src: `/${newPath}`,
//       //   };
//       // });
//       // manifestJson.icons.forEach(icon => {
//       //   bundle[]
//       // })

//       // eslint-disable-next-line no-param-reassign
//       bundle["manifest.webmanifest"] = {
//         type: "asset",
//         name: undefined,
//         fileName: "manifest.webmanifest",
//         source: JSON.stringify(manifestJson, undefined, 2),
//       };
//       manifestJson.icons.forEach((icon) => {
//         // eslint-disable-next-line no-param-reassign
//         bundle[icon.src] = {
//           type: "asset",
//           name: undefined,
//           fileName: icon.src.split("/").pop() as string,
//           source: fs.readFileSync(icon.src, {
//             encoding: "utf-8",
//           }),
//         };
//       });
//     },
//   };
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [splitVendorChunkPlugin(), react()],
  ssr: {
    noExternal: ["usehooks-ts", "react-dropzone"],
  },
  build: {
    sourcemap: true,
    manifest: "client-manifest.json",
    minify: "terser",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        manifest: resolve(__dirname, "manifest.html"),
        sw: resolve(__dirname, "sw.html"),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/@codemirror")) {
            return "vendor-codemirror";
          }
          // if (["node_modules/react"].some((mod) => id.includes(mod))) {
          //   return "vendor-react";
          // }
          if (id.includes("node_modules")) {
            return "vendor-other";
          }
          return undefined;
        },
      },
    },
  },
});
