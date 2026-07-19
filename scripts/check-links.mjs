import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = normalize(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const errors = [];

async function walk(folder) {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

for (const htmlPath of (await walk(projectRoot)).filter((file) => extname(file) === ".html")) {
  const html = await readFile(htmlPath, "utf8");
  if (/\s(?:href|src)=["']#["']/.test(html)) errors.push(`${htmlPath}: contains a bare # link`);
  for (const requiredId of ["main", "site-header", "site-footer"]) {
    if (!new RegExp(`\\sid=["']${requiredId}["']`).test(html)) errors.push(`${htmlPath}: missing #${requiredId}`);
  }

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${htmlPath}: duplicate ids (${[...new Set(duplicateIds)].join(", ")})`);

  const attributes = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const value of attributes) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value) || value.startsWith("#")) continue;
    const pathOnly = value.split("#")[0].split("?")[0];
    if (!pathOnly) continue;
    const localPath = resolve(dirname(htmlPath), pathOnly);
    if (!localPath.startsWith(projectRoot)) {
      errors.push(`${htmlPath}: path escapes the project (${value})`);
      continue;
    }
    try { await access(localPath); }
    catch { errors.push(`${htmlPath}: missing local target (${value})`); }
  }
}

for (const scriptPath of (await walk(join(projectRoot, "assets", "js"))).filter((file) => [".js", ".mjs"].includes(extname(file)))) {
  const script = await readFile(scriptPath, "utf8");
  if (/\balert\s*\(/.test(script)) errors.push(`${scriptPath}: contains alert()`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("All HTML links and local assets are valid.");
