import http from "node:http";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(rootDir, "out");
const port = Number(process.env.PORT || 3000);
let buildRunning = false;
let rebuildQueued = false;
let debounceTimer;

function runBuild() {
  if (buildRunning) {
    rebuildQueued = true;
    return Promise.resolve();
  }

  buildRunning = true;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(rootDir, "scripts", "build.mjs")], {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, SITE_URL: `http://localhost:${port}` }
    });

    child.on("exit", (code) => {
      buildRunning = false;
      if (code === 0) resolve();
      else reject(new Error(`Build stoppede med kode ${code}`));

      if (rebuildQueued) {
        rebuildQueued = false;
        void runBuild().catch((error) => console.error(error.message));
      }
    });
  });
}

function scheduleRebuild() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log("\nÆndring registreret. Bygger hjemmesiden igen ...");
    void runBuild()
      .then(() => console.log("Opdatering færdig. Genindlæs browseren.\n"))
      .catch((error) => console.error(`Opdateringen fejlede: ${error.message}`));
  }, 250);
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif"
};

await runBuild();

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://localhost:${port}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    let relativePath = pathname.replace(/^\/+/, "");
    if (!relativePath || pathname.endsWith("/")) relativePath = path.join(relativePath, "index.html");

    let filePath = path.resolve(outDir, relativePath);
    if (!filePath.startsWith(outDir + path.sep) && filePath !== path.join(outDir, "index.html")) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch {
      filePath = path.join(outDir, "404.html");
      response.statusCode = 404;
    }

    const content = await fs.readFile(filePath);
    response.setHeader("Content-Type", contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    response.setHeader("Cache-Control", "no-store");
    response.end(content);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Serverfejl: ${error.message}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`\nHjemmesiden kører på http://localhost:${port}`);
  console.log("Ændringer i data, billeder eller design bygges automatisk.");
  console.log("Stop serveren med Ctrl + C.\n");
});

for (const directory of ["data", "public", "src"].map((name) => path.join(rootDir, name))) {
  fsSync.watch(directory, { recursive: true }, scheduleRebuild);
}
