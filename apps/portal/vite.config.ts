import { fileURLToPath, URL } from "node:url";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      target: "react",
    }),
    react(),
    ...(command === "serve"
      ? [babel({ presets: [reactCompilerPreset()] })]
      : []),
    tailwindcss(),
  ],
  build: {
    minify: false,
    reportCompressedSize: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
