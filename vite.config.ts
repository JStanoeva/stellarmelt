import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Scan only the site's entry for deps, not untracked local prototypes.
  optimizeDeps: { entries: ["index.html"] },
});
