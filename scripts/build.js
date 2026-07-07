import { mkdir, rm, writeFile } from "node:fs/promises";
import * as esbuild from "esbuild";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/.openai", { recursive: true });
await mkdir("dist/server", { recursive: true });

// worker/index.js imports per-game modules from games/**. The deploy target only confirms
// a single-file worker entrypoint, so bundle everything into one file at build time rather
// than relying on multi-file ESM resolution at runtime.
await esbuild.build({
  entryPoints: ["worker/index.js"],
  outfile: "dist/server/index.js",
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
});

await writeFile(
  "dist/.openai/hosting.json",
  JSON.stringify(
    {
      version: 1,
      type: "worker",
      entrypoint: "server/index.js",
      server: "server/index.js",
    },
    null,
    2,
  ),
  "utf8",
);

console.log("Built OpenAI Sites Worker artifact in dist/");
