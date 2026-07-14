// REPL driver for driving the Money Planet site with headless Chromium.
// Reads newline-separated commands from stdin. See SKILL.md for usage.
//
// Commands:
//   nav <path-or-url>          navigate (path is resolved against BASE_URL)
//   click <selector>           click, e.g. `click text=Play Now` or `click .btn`
//   fill <selector> <text>     fill an input
//   press <key>                press a key (e.g. Enter)
//   wait-for <selector>        wait for selector to be visible
//   screenshot [name]          save PNG to ./screenshots/<name|timestamp>.png
//   eval <js>                  run JS in page context, prints the result
//   console-errors             print collected console.error/pageerror text
//   quit                       close the browser and exit

import { chromium } from "playwright";
import readline from "node:readline";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5175";

await mkdir(SCREENSHOT_DIR, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

function resolveUrl(target) {
  if (/^https?:\/\//.test(target)) return target;
  return BASE_URL + (target.startsWith("/") ? target : "/" + target);
}

async function run(line) {
  const [cmd, ...rest] = line.trim().split(/\s+/);
  const arg = rest.join(" ");
  switch (cmd) {
    case "": return;
    case "nav":
      await page.goto(resolveUrl(arg), { waitUntil: "networkidle" });
      console.log("OK nav ->", page.url());
      return;
    case "click":
      await page.click(arg);
      console.log("OK click", arg);
      return;
    case "fill": {
      const [selector, ...value] = rest;
      await page.fill(selector, value.join(" "));
      console.log("OK fill", selector);
      return;
    }
    case "press":
      await page.keyboard.press(arg);
      console.log("OK press", arg);
      return;
    case "wait-for":
      await page.waitForSelector(arg, { state: "visible", timeout: 10000 });
      console.log("OK wait-for", arg);
      return;
    case "screenshot": {
      const name = arg || String(Date.now());
      const file = path.join(SCREENSHOT_DIR, `${name}.png`);
      await page.screenshot({ path: file });
      console.log("OK screenshot ->", file);
      return;
    }
    case "eval": {
      const result = await page.evaluate(new Function("return (" + arg + ")"));
      console.log("EVAL", JSON.stringify(result));
      return;
    }
    case "console-errors":
      console.log("CONSOLE_ERRORS", JSON.stringify(consoleErrors));
      return;
    case "quit":
    case "exit":
      await browser.close();
      process.exit(0);
      return;
    default:
      console.log("UNKNOWN COMMAND:", cmd);
  }
}

const rl = readline.createInterface({ input: process.stdin });
for await (const line of rl) {
  try {
    await run(line);
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}
await browser.close();
