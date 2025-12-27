import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const thisUrl = fileURLToPath(import.meta.url);
export const ROOT = path.resolve(path.dirname(thisUrl), "..");

export function fbgRun(cmd, err) {
  try {
    execSync(cmd, { cwd: process.cwd(), stdio: 'inherit' });
  } catch (error) {
    if (err) printErr(err);
    process.exit(1);
  }
}

export function cd(dir) {
  if (dir) {
    process.chdir(path.resolve(ROOT, dir));
  } else {
    process.chdir(ROOT);
  }
}

export function decodeCsv(csv) {
  return csv.split(",").map((x) => x.trim());
}

export function dirExists(dir) {
  return existsSync(dir);
}

export function print(text) {
  console.log(`[FBG] ${text}`);
}

export function printErr(text) {
  console.error(`[FBG ERROR] ${text}`);
}

export function checkEnvironment() {
  if (!dirExists(path.resolve(ROOT, "node_modules"))) {
    printErr("Run 'yarn install' on root before running this command.");
    process.exit(1);
  }
}

export function checkGameExists(game) {
  if (!dirExists(path.resolve(ROOT, "web", "src", "games", game))) {
    printErr(`${game}: Game not found.`);
    process.exit(1);
  }
}
