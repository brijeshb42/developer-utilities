import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

const OUTLET_START_TEMPLATE = "<!--ssr-outlet-start-->";
const OUTLET_END_TEMPLATE = "<!--ssr-outlet-end-->";
const HYDRATE_TEMPLATE = "<!--hydrate global-->";

export async function createServer(root = process.cwd(), hmrPort) {
  const resolve = (p) => path.resolve(__dirname, p);

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  const vite = await createViteServer({
    root,
    logLevel: isTest ? "error" : "info",
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
      hmr: {
        port: hmrPort,
      },
    },
    appType: "custom",
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template;
      let render;
      // always read fresh template in dev
      template = fs.readFileSync(resolve("index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;

      const outletStartIndex = template.indexOf(OUTLET_START_TEMPLATE);
      const outletEndIndex = template.indexOf(OUTLET_END_TEMPLATE);
      const endIndexToReplace = outletEndIndex + OUTLET_END_TEMPLATE.length;

      const context = {};
      const appHtml = render();

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      let html = template.replace(
        template.substring(outletStartIndex, endIndexToReplace),
        appHtml
      );
      html = html.replace(
        HYDRATE_TEMPLATE,
        "<script>window.shouldHydrate = true;</script>"
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

createServer().then(({ app }) =>
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  })
);
