import { ClipboardProvider, StorageProvider } from "devu-core";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./index.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ClipboardProvider>
        <StorageProvider>
          <App />
        </StorageProvider>
      </ClipboardProvider>
    </React.StrictMode>
  );
}
