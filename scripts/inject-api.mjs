/**
 * Post-build script that injects the Python API serverless function
 * into Nitro's Vercel Build Output so /api/* routes reach the
 * FastAPI backend instead of being swallowed by the SSR catch-all.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const OUTPUT_DIR = path.join(ROOT, ".vercel", "output");
const CONFIG_PATH = path.join(OUTPUT_DIR, "config.json");
const FUNC_DIR = path.join(OUTPUT_DIR, "functions", "api", "index.func");

// 1. Create the Python function directory
fs.mkdirSync(FUNC_DIR, { recursive: true });

// 2. Copy the Python entry point
fs.copyFileSync(
  path.join(ROOT, "api", "index.py"),
  path.join(FUNC_DIR, "index.py")
);

// 3. Copy the requirements.txt
fs.copyFileSync(
  path.join(ROOT, "requirements.txt"),
  path.join(FUNC_DIR, "requirements.txt")
);

// 4. Copy the entire aurasport-backend directory
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    // Skip __pycache__, .env, .git dirs, venv, logs, uploads
    if (
      entry.name === "__pycache__" ||
      entry.name === ".git_repo_backup" ||
      entry.name === "venv" ||
      entry.name === ".env"
    ) {
      continue;
    }
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirSync(
  path.join(ROOT, "aurasport-backend"),
  path.join(FUNC_DIR, "aurasport-backend")
);

// 5. Install Python dependencies into the function directory
console.log("📦 Installing Python dependencies into function directory...");
try {
  execSync(
    `pip install -r "${path.join(FUNC_DIR, "requirements.txt")}" -t "${FUNC_DIR}" --no-cache-dir`,
    { stdio: "inherit" }
  );
  console.log("✅ Python dependencies installed successfully");
} catch (e) {
  // Try python3 -m pip if pip is not found
  try {
    execSync(
      `python3 -m pip install -r "${path.join(FUNC_DIR, "requirements.txt")}" -t "${FUNC_DIR}" --no-cache-dir`,
      { stdio: "inherit" }
    );
    console.log("✅ Python dependencies installed successfully (via python3 -m pip)");
  } catch (e2) {
    // Try python -m pip as last resort
    try {
      execSync(
        `python -m pip install -r "${path.join(FUNC_DIR, "requirements.txt")}" -t "${FUNC_DIR}" --no-cache-dir`,
        { stdio: "inherit" }
      );
      console.log("✅ Python dependencies installed successfully (via python -m pip)");
    } catch (e3) {
      console.error("⚠️ Could not install Python dependencies. pip not found.");
      console.error("   The function may fail if dependencies are not pre-installed.");
    }
  }
}

// 6. Write the .vc-config.json for the Python function
fs.writeFileSync(
  path.join(FUNC_DIR, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "python3.12",
      handler: "index.handler",
      launcherType: "Launcher",
      shouldAddHelpers: true,
    },
    null,
    2
  )
);

// 7. Patch the Vercel output config.json to route /api/* to our function
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

// Insert the /api route BEFORE the catch-all (which is the last entry)
const apiRoute = {
  src: "/api/(.*)",
  dest: "/api/index",
};

// Find the catch-all route and insert before it
const catchAllIndex = config.routes.findIndex(
  (r) => r.src === "/(.*)" && r.dest
);
if (catchAllIndex !== -1) {
  config.routes.splice(catchAllIndex, 0, apiRoute);
} else {
  // Fallback: just add before the last route
  config.routes.splice(config.routes.length - 1, 0, apiRoute);
}

fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

console.log("✅ Python API function injected into Vercel output");
console.log("   Function dir:", FUNC_DIR);
console.log("   Routes:", JSON.stringify(config.routes, null, 2));
