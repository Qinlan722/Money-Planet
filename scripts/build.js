import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/.openai", { recursive: true });
await mkdir("dist/server", { recursive: true });

await copyFile("worker/index.js", "dist/server/index.js");
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
