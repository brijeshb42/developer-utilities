import { ClipboardProvider, StorageProvider } from "devu-core";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";

import "./index.css";

const root = document.getElementById("root");

function render() {
  if (!root) {
    return;
  }
  root.innerHTML = "";
  const element = (
    <React.StrictMode>
      <ClipboardProvider>
        <StorageProvider>
          <App />
        </StorageProvider>
      </ClipboardProvider>
    </React.StrictMode>
  );

  if (window.shouldHydrate) {
    hydrateRoot(root, element);
  } else {
    createRoot(root).render(element);
  }
}

render();
