import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");
const staticDir = path.join(root, ".next", "static");
const publicDir = path.join(root, "public");

function copyDir(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDir(from, to);
      continue;
    }

    fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(standaloneDir)) {
  console.error("Chýba .next/standalone. Najprv spustite npm run build.");
  process.exit(1);
}

copyDir(publicDir, path.join(standaloneDir, "public"));
copyDir(staticDir, path.join(standaloneDir, ".next", "static"));
console.log("Standalone balík pripravený.");
