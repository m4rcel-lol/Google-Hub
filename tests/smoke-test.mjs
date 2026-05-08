import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = 31987;
const adminToken = "smoke-test-token";
const baseUrl = `http://127.0.0.1:${port}`;
const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = await fs.mkdtemp(path.join(os.tmpdir(), "google-hub-git-"));
const gitRoot = path.join(root, "repositories");
const workRoot = path.join(root, "work");
const cloneRoot = path.join(root, "clone");

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...(options.env || {}) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(
        new Error(
          `${command} ${args.join(" ")} failed with ${code}\n${stdout}\n${stderr}`,
        ),
      );
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Server did not become healthy.");
}

const server = spawn("npx", ["tsx", "server.ts"], {
  cwd: path.resolve(testDir, ".."),
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    ADMIN_TOKEN: adminToken,
    GIT_ROOT: gitRoot,
    PUBLIC_BASE_URL: baseUrl,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString("utf8");
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString("utf8");
});

try {
  await waitForServer();

  const createResponse = await fetch(`${baseUrl}/api/v1/repos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner: "main",
      name: "smoke",
      description: "Smoke test repository",
    }),
  });
  if (createResponse.status !== 201) {
    throw new Error(`Create repository failed: ${createResponse.status}`);
  }

  await fs.mkdir(workRoot, { recursive: true });
  await run("git", ["init", "--initial-branch=main"], { cwd: workRoot });
  await run("git", ["config", "user.email", "smoke@example.test"], {
    cwd: workRoot,
  });
  await run("git", ["config", "user.name", "Smoke Test"], { cwd: workRoot });
  await fs.writeFile(path.join(workRoot, "README.md"), "# Smoke\n", "utf8");
  await run("git", ["add", "README.md"], { cwd: workRoot });
  await run("git", ["commit", "-m", "Initial commit"], { cwd: workRoot });
  await run(
    "git",
    [
      "remote",
      "add",
      "origin",
      `http://admin:${adminToken}@127.0.0.1:${port}/main/smoke.git`,
    ],
    { cwd: workRoot },
  );
  await run("git", ["push", "origin", "main"], { cwd: workRoot });

  const contentsResponse = await fetch(
    `${baseUrl}/api/v1/repos/main/smoke/contents`,
  );
  const contents = await contentsResponse.json();
  if (!Array.isArray(contents) || !contents.some((item) => item.name === "README.md")) {
    throw new Error("Repository contents did not include README.md.");
  }

  const readmeResponse = await fetch(
    `${baseUrl}/api/v1/repos/main/smoke/contents/README.md`,
  );
  const readme = await readmeResponse.json();
  const decoded = Buffer.from(readme.content, "base64").toString("utf8");
  if (decoded !== "# Smoke\n") {
    throw new Error("README content did not round-trip through the API.");
  }

  await run("git", ["clone", `${baseUrl}/main/smoke.git`, cloneRoot]);
  const clonedReadme = await fs.readFile(path.join(cloneRoot, "README.md"), "utf8");
  if (clonedReadme !== "# Smoke\n") {
    throw new Error("Public clone did not contain expected README content.");
  }

  console.log("Smoke test passed.");
} catch (error) {
  console.error(serverOutput);
  throw error;
} finally {
  server.kill("SIGTERM");
  await fs.rm(root, { recursive: true, force: true });
}
