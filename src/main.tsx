import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "@fontsource-variable/martian-mono/wght.css";
import "@fontsource-variable/syne/wght.css";
import "@fontsource-variable/instrument-sans/wght.css";
import "./index.css";
import { router } from "./app/router";

// After a redeploy, an open tab can ask for chunks that no longer exist: reload to get the new ones,
// unless a reload in the last 10 s didn't help (a chunk that is really missing would loop).
window.addEventListener("vite:preloadError", (event) => {
  try {
    const lastReload = Number(sessionStorage.getItem("stellarmelt-reloaded-at"));
    if (Date.now() - lastReload < 10_000) return;
    sessionStorage.setItem("stellarmelt-reloaded-at", String(Date.now()));
  } catch {
    return; // Blocked storage: no guard against a reload loop, so don't reload.
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
