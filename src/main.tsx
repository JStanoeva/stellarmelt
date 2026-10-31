import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/martian-mono/wght.css";
import "@fontsource-variable/syne/wght.css";
import "@fontsource-variable/instrument-sans/wght.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
