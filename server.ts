import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { createServer as createViteServer } from "vite";

import {
  getUserStorePath,
  hasAdminUser,
  verifyAdminCredentials,
} from "./src/server/userStore.ts";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const GIT_ROOT = path.resolve(
  process.env.GIT_ROOT || path.join(process.cwd(), "data", "repositories"),
);
const MAX_API_BLOB_BYTES = Number.parseInt(
  process.env.MAX_API_BLOB_BYTES || `${1024 * 1024}`,
  10,
);

const SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const SAFE_REF_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,255}$/;
const JSON_LIMIT = "64kb";

type GitRunResult = {
  stdout: Buffer;
  stderr: Buffer;
  code: number | null;
};

type RepositoryRef = {
  owner: string;
  repo: string;
  gitDir: string;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

function runGit(args: string[], input?: Buffer): Promise<GitRunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new HttpError(504, "Git command timed out."));
    }, 30_000);

    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      resolve({
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
        code,
      });
    });

    if (input) {
      child.stdin.end(input);
    } else {
      child.stdin.end();
    }
  });
}

async function gitText(args: string[], status = 500): Promise<string> {
  const result = await runGit(args);
  if (result.code !== 0) {
    throw new HttpError(
      status,
      result.stderr.toString("utf8").trim() || "Git command failed.",
    );
  }
  return result.stdout.toString("utf8").trim();
}

async function gitBuffer(args: string[], status = 500): Promise<Buffer> {
  const result = await runGit(args);
  if (result.code !== 0) {
    throw new HttpError(
      status,
      result.stderr.toString("utf8").trim() || "Git command failed.",
    );
  }
  return result.stdout;
}

function validateSlug(kind: "owner" | "repository", value: unknown): string {
  if (typeof value !== "string" || !SLUG_PATTERN.test(value)) {
    throw new HttpError(
      400,
      `Invalid ${kind}. Use letters, numbers, dots, underscores, or hyphens.`,
    );
  }
  if (value === "." || value === ".." || value.endsWith(".git")) {
    throw new HttpError(400, `Invalid ${kind}.`);
  }
  return value;
}

function validateRef(value: unknown): string {
  if (typeof value !== "string" || !SAFE_REF_PATTERN.test(value)) {
    throw new HttpError(400, "Invalid Git reference.");
  }
  if (value.includes("..") || value.includes("@{") || value.endsWith(".lock")) {
    throw new HttpError(400, "Invalid Git reference.");
  }
  return value;
}

function validateRepoFilePath(value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw new HttpError(400, "Invalid path.");
  if (value.includes("\0") || value.startsWith("/") || value.includes("\\")) {
    throw new HttpError(400, "Invalid path.");
  }
  const parts = value.split("/");
  if (parts.some((part) => part === "" || part === "." || part === "..")) {
    throw new HttpError(400, "Invalid path.");
  }
  return value;
}

function repoPath(owner: string, repo: string): string {
  return path.join(GIT_ROOT, owner, `${repo}.git`);
}

function repositoryFromParams(req: Request): RepositoryRef {
  const owner = validateSlug("owner", req.params.owner);
  const repo = validateSlug("repository", req.params.repo);
  return { owner, repo, gitDir: repoPath(owner, repo) };
}

async function assertRepoExists(ref: RepositoryRef): Promise<void> {
  if (!existsSync(ref.gitDir)) {
    throw new HttpError(404, "Repository not found.");
  }
}

function basicCredentials(req: Request) {
  const header = req.get("authorization") || "";
  if (!header.startsWith("Basic ")) return null;

  try {
    const decoded = Buffer.from(header.slice("Basic ".length), "base64").toString(
      "utf8",
    );
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

async function isAdminRequest(req: Request): Promise<boolean> {
  const credentials = basicCredentials(req);
  if (!credentials) return false;
  return verifyAdminCredentials(credentials.username, credentials.password);
}

async function requireAdmin(req: Request): Promise<void> {
  if (await isAdminRequest(req)) return;
  const adminExists = await hasAdminUser();
  throw new HttpError(
    adminExists ? 401 : 503,
    adminExists
      ? "Admin username and password required."
      : "No admin user exists. Create one inside the container with npm run admin:create.",
  );
}

function publicBaseUrl(req: Request): string {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/+$/, "");
  }
  const forwardedProto = (req.get("x-forwarded-proto") || "").split(",")[0];
  const forwardedHost = (req.get("x-forwarded-host") || "").split(",")[0];
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host") || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

function encodePathSegmented(value: string): string {
  return value.split("/").map(encodeURIComponent).join("/");
}

function avatarUrl(req: Request, username: string): string {
  return `${publicBaseUrl(req)}/api/v1/avatar/${encodeURIComponent(username)}`;
}

async function readDescription(gitDir: string): Promise<string> {
  try {
    const description = await fs.readFile(path.join(gitDir, "description"), "utf8");
    const trimmed = description.trim();
    return trimmed === "Unnamed repository; edit this file 'description' to name the repository."
      ? ""
      : trimmed;
  } catch {
    return "";
  }
}

async function defaultBranch(gitDir: string): Promise<string> {
  try {
    return await gitText(["--git-dir", gitDir, "symbolic-ref", "--short", "HEAD"]);
  } catch {
    const branches = await gitText(
      ["--git-dir", gitDir, "for-each-ref", "--format=%(refname:short)", "refs/heads"],
      404,
    );
    return branches.split("\n").filter(Boolean)[0] || "main";
  }
}

async function hasCommit(gitDir: string, ref = "HEAD"): Promise<boolean> {
  const result = await runGit([
    "--git-dir",
    gitDir,
    "rev-parse",
    "--verify",
    `${ref}^{commit}`,
  ]);
  return result.code === 0;
}

async function lastUpdated(gitDir: string): Promise<string> {
  if (await hasCommit(gitDir)) {
    return gitText(["--git-dir", gitDir, "log", "-1", "--format=%cI"]);
  }
  const stat = await fs.stat(gitDir);
  return stat.mtime.toISOString();
}

async function commitCount(gitDir: string): Promise<number> {
  if (!(await hasCommit(gitDir))) return 0;
  const count = await gitText(["--git-dir", gitDir, "rev-list", "--count", "HEAD"]);
  return Number.parseInt(count, 10) || 0;
}

const EXTENSION_LANGUAGES: Record<string, string> = {
  ".c": "C",
  ".cc": "C++",
  ".cpp": "C++",
  ".cs": "C#",
  ".css": "CSS",
  ".go": "Go",
  ".html": "HTML",
  ".java": "Java",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".json": "JSON",
  ".kt": "Kotlin",
  ".mjs": "JavaScript",
  ".php": "PHP",
  ".py": "Python",
  ".rb": "Ruby",
  ".rs": "Rust",
  ".scss": "SCSS",
  ".sh": "Shell",
  ".swift": "Swift",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".vue": "Vue",
};

function languageForFile(filePath: string): string | null {
  const base = path.basename(filePath).toLowerCase();
  if (base === "dockerfile") return "Dockerfile";
  if (base === "makefile") return "Makefile";
  return EXTENSION_LANGUAGES[path.extname(base)] || null;
}

async function languageStats(gitDir: string): Promise<Record<string, number>> {
  if (!(await hasCommit(gitDir))) return {};
  const output = await gitText(["--git-dir", gitDir, "ls-tree", "-r", "-l", "HEAD"]);
  const stats: Record<string, number> = {};

  for (const line of output.split("\n")) {
    if (!line) continue;
    const match = line.match(/^\d+ blob [0-9a-f]+\s+(\d+|-)\t(.+)$/);
    if (!match || match[1] === "-") continue;
    const language = languageForFile(match[2]);
    if (!language) continue;
    stats[language] = (stats[language] || 0) + Number.parseInt(match[1], 10);
  }

  return stats;
}

async function primaryLanguage(gitDir: string): Promise<string | null> {
  const stats = await languageStats(gitDir);
  return (
    Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    null
  );
}

async function repositorySummary(req: Request, owner: string, repo: string) {
  const gitDir = repoPath(owner, repo);
  const branch = await defaultBranch(gitDir);
  const baseUrl = publicBaseUrl(req);
  const commits = await commitCount(gitDir);
  const updatedAt = await lastUpdated(gitDir);

  return {
    id: `${owner}/${repo}`,
    name: repo,
    full_name: `${owner}/${repo}`,
    owner: {
      login: owner,
      avatar_url: avatarUrl(req, owner),
      html_url: `${baseUrl}/?user=${encodeURIComponent(owner)}`,
    },
    private: false,
    description: await readDescription(gitDir),
    html_url: `${baseUrl}/?repo=${encodeURIComponent(`${owner}/${repo}`)}`,
    clone_url: `${baseUrl}/${encodePathSegmented(owner)}/${encodeURIComponent(repo)}.git`,
    ssh_url: "",
    default_branch: branch,
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    language: await primaryLanguage(gitDir),
    size: 0,
    pushed_at: updatedAt,
    updated_at: updatedAt,
    created_at: (await fs.stat(gitDir)).birthtime.toISOString(),
    commit_count: commits,
    permissions: {
      admin: false,
      push: false,
      pull: true,
    },
    topics: ["self-hosted", "git"],
  };
}

async function listRepositories(req: Request) {
  await fs.mkdir(GIT_ROOT, { recursive: true });
  const owners = await fs.readdir(GIT_ROOT, { withFileTypes: true });
  const repos = [];

  for (const ownerEntry of owners) {
    if (!ownerEntry.isDirectory() || !SLUG_PATTERN.test(ownerEntry.name)) continue;
    const ownerPath = path.join(GIT_ROOT, ownerEntry.name);
    const repoEntries = await fs.readdir(ownerPath, { withFileTypes: true });
    for (const repoEntry of repoEntries) {
      if (!repoEntry.isDirectory() || !repoEntry.name.endsWith(".git")) continue;
      const repo = repoEntry.name.slice(0, -".git".length);
      if (!SLUG_PATTERN.test(repo)) continue;
      repos.push(await repositorySummary(req, ownerEntry.name, repo));
    }
  }

  return repos.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

function parseTreeEntry(line: string) {
  const match = line.match(/^(\d+) (\w+) ([0-9a-f]+)\s+(\d+|-)\t(.+)$/);
  if (!match) return null;
  return {
    mode: match[1],
    type: match[2],
    sha: match[3],
    size: match[4] === "-" ? 0 : Number.parseInt(match[4], 10),
    name: match[5],
  };
}

async function repoContents(req: Request, ref: RepositoryRef, requestedPath: string) {
  const branch = validateRef(String(req.query.ref || (await defaultBranch(ref.gitDir))));
  if (!(await hasCommit(ref.gitDir, branch))) return requestedPath ? null : [];

  const treeish = requestedPath ? `${branch}:${requestedPath}` : branch;
  const type = requestedPath
    ? await gitText(["--git-dir", ref.gitDir, "cat-file", "-t", treeish], 404)
    : "tree";

  if (type === "tree") {
    const output = await gitBuffer(["--git-dir", ref.gitDir, "ls-tree", "-z", "-l", treeish]);
    const baseUrl = publicBaseUrl(req);
    return output
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .map(parseTreeEntry)
      .filter((entry): entry is NonNullable<ReturnType<typeof parseTreeEntry>> =>
        Boolean(entry),
      )
      .map((entry) => {
        const entryPath = requestedPath
          ? `${requestedPath}/${entry.name}`
          : entry.name;
        const isDirectory = entry.type === "tree";
        return {
          name: entry.name,
          path: entryPath,
          sha: entry.sha,
          size: entry.size,
          type: isDirectory ? "dir" : "file",
          url: `${baseUrl}/api/v1/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/contents/${encodePathSegmented(entryPath)}`,
          download_url: isDirectory
            ? null
            : `${baseUrl}/api/v1/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/raw/${encodeURIComponent(branch)}/${encodePathSegmented(entryPath)}`,
        };
      });
  }

  if (type !== "blob") {
    throw new HttpError(415, "Only tree and blob objects can be displayed.");
  }

  const size = Number.parseInt(
    await gitText(["--git-dir", ref.gitDir, "cat-file", "-s", treeish]),
    10,
  );
  if (size > MAX_API_BLOB_BYTES) {
    throw new HttpError(413, `File is larger than ${MAX_API_BLOB_BYTES} bytes.`);
  }
  const content = await gitBuffer(["--git-dir", ref.gitDir, "show", treeish]);
  const name = path.posix.basename(requestedPath);
  const baseUrl = publicBaseUrl(req);

  return {
    name,
    path: requestedPath,
    sha: await gitText(["--git-dir", ref.gitDir, "rev-parse", treeish]),
    size,
    type: "file",
    encoding: "base64",
    content: content.toString("base64"),
    download_url: `${baseUrl}/api/v1/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/raw/${encodeURIComponent(branch)}/${encodePathSegmented(requestedPath)}`,
  };
}

async function repoCommits(ref: RepositoryRef, perPage: number, revision = "HEAD") {
  const safeRevision = validateRef(revision);
  if (!(await hasCommit(ref.gitDir, safeRevision))) return [];
  const count = Math.min(Math.max(perPage || 30, 1), 100);
  const output = await gitText([
    "--git-dir",
    ref.gitDir,
    "log",
    `-${count}`,
    "--format=%H%x1f%an%x1f%ae%x1f%aI%x1f%s%x1e",
    safeRevision,
  ]);

  return output
    .split("\x1e")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [sha, name, email, date, subject] = entry.split("\x1f");
      return {
        sha,
        html_url: "",
        commit: {
          message: subject || "",
          author: { name, email, date },
          committer: { name, email, date },
        },
        author: {
          login: name || email || "unknown",
          avatar_url: "",
        },
      };
    });
}

async function repoBranches(ref: RepositoryRef) {
  const output = await gitText([
    "--git-dir",
    ref.gitDir,
    "for-each-ref",
    "--format=%(refname:short)%x1f%(objectname)%x1f%(committerdate:iso-strict)",
    "refs/heads",
  ]);

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, sha, date] = line.split("\x1f");
      return {
        name,
        commit: { sha, url: "" },
        protected: false,
        updated_at: date || null,
      };
    });
}

async function repoTags(ref: RepositoryRef) {
  const output = await gitText([
    "--git-dir",
    ref.gitDir,
    "for-each-ref",
    "--format=%(refname:short)%x1f%(objectname)",
    "refs/tags",
  ]);

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, sha] = line.split("\x1f");
      return {
        name,
        commit: { sha, url: "" },
        zipball_url: "",
        tarball_url: "",
      };
    });
}

async function repoContributors(ref: RepositoryRef) {
  if (!(await hasCommit(ref.gitDir))) return [];
  const output = await gitText(["--git-dir", ref.gitDir, "shortlog", "-sne", "HEAD"]);
  return output
    .split("\n")
    .map((line) => line.match(/^\s*(\d+)\s+(.+?)(?:\s+<(.+)>)?$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match, index) => ({
      id: index + 1,
      login: match[2],
      html_url: "",
      avatar_url: "",
      contributions: Number.parseInt(match[1], 10),
    }));
}

function safeProxyUrl(value: unknown): URL {
  if (typeof value !== "string") throw new HttpError(400, "Missing url parameter.");
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new HttpError(400, "Only http and https proxy targets are supported.");
  }
  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".local")
  ) {
    throw new HttpError(400, "Proxying local network targets is not allowed.");
  }
  return url;
}

function isGitWrite(req: Request): boolean {
  return (
    req.query.service === "git-receive-pack" ||
    req.path.endsWith("/git-receive-pack")
  );
}

function sendAuthChallenge(res: Response, message: string): void {
  res.set("WWW-Authenticate", 'Basic realm="Google Hub Git"');
  res.status(401).send(`${message}\n`);
}

async function handleGitHttp(req: Request, res: Response): Promise<void> {
  let ref: RepositoryRef;
  try {
    ref = repositoryFromParams(req);
    if (!existsSync(ref.gitDir)) {
      res.status(404).send("Repository not found.\n");
      return;
    }
    if (isGitWrite(req) && !(await isAdminRequest(req))) {
      sendAuthChallenge(
        res,
        (await hasAdminUser())
          ? "Admin username and password required for Git pushes."
          : "No admin user exists. Create one inside the container first.",
      );
      return;
    }
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 400;
    res.status(status).send(`${(error as Error).message}\n`);
    return;
  }

  const query = req.originalUrl.includes("?")
    ? req.originalUrl.slice(req.originalUrl.indexOf("?") + 1)
    : "";
  const credentials = basicCredentials(req);
  const child = spawn("git", ["http-backend"], {
    env: {
      ...process.env,
      GIT_PROJECT_ROOT: GIT_ROOT,
      GIT_HTTP_EXPORT_ALL: "1",
      PATH_INFO: req.path,
      REQUEST_METHOD: req.method,
      QUERY_STRING: query,
      CONTENT_TYPE: req.get("content-type") || "",
      CONTENT_LENGTH: req.get("content-length") || "",
      REMOTE_USER: credentials?.username || "",
      REMOTE_ADDR: req.ip,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  let pending = Buffer.alloc(0);
  let cgiHeadersSent = false;

  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString("utf8");
  });

  child.stdout.on("data", (chunk: Buffer) => {
    if (cgiHeadersSent) {
      res.write(chunk);
      return;
    }

    pending = Buffer.concat([pending, chunk]);
    const headerEnd = findHeaderEnd(pending);
    if (headerEnd === -1) return;

    const headerBlock = pending.subarray(0, headerEnd.offset).toString("utf8");
    const body = pending.subarray(headerEnd.end);
    writeCgiHeaders(res, headerBlock);
    cgiHeadersSent = true;
    if (body.length > 0) res.write(body);
  });

  child.on("error", (error) => {
    if (!res.headersSent) res.status(500).send(`Git backend failed: ${error.message}\n`);
  });

  child.on("close", (code) => {
    if (!cgiHeadersSent && !res.headersSent) {
      res.status(code === 0 ? 204 : 500).send(stderr || "Git backend failed.\n");
      return;
    }
    res.end();
  });

  req.pipe(child.stdin);
}

function findHeaderEnd(buffer: Buffer): { offset: number; end: number } | -1 {
  const crlf = buffer.indexOf("\r\n\r\n");
  if (crlf !== -1) return { offset: crlf, end: crlf + 4 };
  const lf = buffer.indexOf("\n\n");
  if (lf !== -1) return { offset: lf, end: lf + 2 };
  return -1;
}

function writeCgiHeaders(res: Response, headerBlock: string): void {
  for (const line of headerBlock.replace(/\r\n/g, "\n").split("\n")) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key.toLowerCase() === "status") {
      res.status(Number.parseInt(value, 10) || 200);
    } else {
      res.append(key, value);
    }
  }
}

function registerApiRoutes(app: express.Express): void {
  app.get("/api/v1/health", async (_req, res, next) => {
    let adminReady = false;
    try {
      adminReady = await hasAdminUser();
    } catch (error) {
      next(error);
      return;
    }
    res.json({
      ok: true,
      service: "google-hub-git",
      git_root: GIT_ROOT,
      user_store: getUserStorePath(),
      admin_ready: adminReady,
      writes_enabled: adminReady,
    });
  });

  app.get("/api/v1/avatar/:username", (req, res) => {
    const username = validateSlug("owner", req.params.username);
    const label = username.slice(0, 2).toUpperCase();
    res.type("image/svg+xml").send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#21262d"/><text x="64" y="74" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="42" font-weight="700" fill="#e6edf3">${label}</text></svg>`,
    );
  });

  app.get(
    "/api/v1/repos",
    asyncRoute(async (req, res) => {
      res.json(await listRepositories(req));
    }),
  );

  app.post(
    "/api/v1/repos",
    asyncRoute(async (req, res) => {
      await requireAdmin(req);
      const owner = validateSlug("owner", req.body?.owner);
      const repo = validateSlug("repository", req.body?.name);
      const description =
        typeof req.body?.description === "string"
          ? req.body.description.trim().slice(0, 500)
          : "";
      const gitDir = repoPath(owner, repo);

      if (existsSync(gitDir)) {
        throw new HttpError(409, "Repository already exists.");
      }

      await fs.mkdir(path.dirname(gitDir), { recursive: true });
      try {
        await gitText(["init", "--bare", "--initial-branch=main", gitDir]);
        await gitText(["--git-dir", gitDir, "config", "http.receivepack", "true"]);
        await fs.writeFile(
          path.join(gitDir, "description"),
          description ? `${description}\n` : "Unnamed repository\n",
          "utf8",
        );
      } catch (error) {
        await fs.rm(gitDir, { force: true, recursive: true });
        throw error;
      }

      res.status(201).json(await repositorySummary(req, owner, repo));
    }),
  );

  app.get(
    "/api/v1/users/:username",
    asyncRoute(async (req, res) => {
      const username = validateSlug("owner", req.params.username);
      const repos = (await listRepositories(req)).filter(
        (repo) => repo.owner.login === username,
      );
      if (repos.length === 0) throw new HttpError(404, "User not found.");
      res.json({
        id: username,
        login: username,
        name: username,
        avatar_url: avatarUrl(req, username),
        html_url: `${publicBaseUrl(req)}/?user=${encodeURIComponent(username)}`,
        bio: "Local Git namespace",
        followers: 0,
        following: 0,
        public_repos: repos.length,
        created_at: repos.at(-1)?.created_at || new Date().toISOString(),
      });
    }),
  );

  app.get(
    "/api/v1/users/:username/repos",
    asyncRoute(async (req, res) => {
      const username = validateSlug("owner", req.params.username);
      const repos = (await listRepositories(req)).filter(
        (repo) => repo.owner.login === username,
      );
      res.json(repos);
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await repositorySummary(req, ref.owner, ref.repo));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/contents",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await repoContents(req, ref, ""));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/contents/*",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      const requestedPath = validateRepoFilePath(req.params[0]);
      const contents = await repoContents(req, ref, requestedPath);
      if (contents === null) throw new HttpError(404, "Path not found.");
      res.json(contents);
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/raw/:ref/*",
    asyncRoute(async (req, res) => {
      const repoRef = repositoryFromParams(req);
      await assertRepoExists(repoRef);
      const branch = validateRef(req.params.ref);
      const filePath = validateRepoFilePath(req.params[0]);
      const treeish = `${branch}:${filePath}`;
      const type = await gitText(
        ["--git-dir", repoRef.gitDir, "cat-file", "-t", treeish],
        404,
      );
      if (type !== "blob") throw new HttpError(404, "File not found.");

      const child = spawn("git", ["--git-dir", repoRef.gitDir, "show", treeish], {
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stderr = "";
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", (error) => {
        if (!res.headersSent) res.status(500).send(error.message);
      });
      child.on("close", (code) => {
        if (code !== 0 && !res.headersSent) {
          res.status(500).send(stderr || "Unable to read file.");
        }
      });
      res.type("text/plain");
      child.stdout.pipe(res);
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/commits",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      const revision = String(req.query.sha || req.query.ref || "HEAD");
      res.json(await repoCommits(ref, Number(req.query.per_page || 30), revision));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/branches",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await repoBranches(ref));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/tags",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await repoTags(ref));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/languages",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await languageStats(ref.gitDir));
    }),
  );

  app.get(
    "/api/v1/repos/:owner/:repo/contributors",
    asyncRoute(async (req, res) => {
      const ref = repositoryFromParams(req);
      await assertRepoExists(ref);
      res.json(await repoContributors(ref));
    }),
  );

  for (const endpoint of [
    "issues",
    "pulls",
    "releases",
    "events",
    "actions/runs",
    "projects",
    "discussions",
    "dependabot/alerts",
  ]) {
    app.get(`/api/v1/repos/:owner/:repo/${endpoint}`, (_req, res) => {
      res.json([]);
    });
  }
}

function registerProxyRoute(app: express.Express): void {
  app.use(
    "/api/proxy",
    asyncRoute(async (req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        throw new HttpError(405, "Proxy supports GET and HEAD only.");
      }
      const targetUrl = safeProxyUrl(req.query.url);
      const headers: Record<string, string> = {
        "User-Agent": "Google-Hub-Git",
        Accept: "application/json,text/plain,*/*",
      };

      if (targetUrl.hostname === "api.github.com" && process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        headers.Accept = "application/vnd.github.v3+json";
      }

      const targetRes = await fetch(targetUrl, {
        method: req.method,
        headers,
      });

      targetRes.headers.forEach((val, key) => {
        if (
          ![
            "content-encoding",
            "content-length",
            "connection",
            "transfer-encoding",
          ].includes(key.toLowerCase())
        ) {
          res.set(key, val);
        }
      });
      res.status(targetRes.status);
      res.set("Access-Control-Allow-Origin", "*");
      res.send(Buffer.from(await targetRes.arrayBuffer()));
    }),
  );
}

function registerErrorHandler(app: express.Express): void {
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof HttpError ? error.status : 500;
    if (status >= 500) console.error("[Server Error]", error);
    res.status(status).json({ message: error.message || "Internal server error." });
  });
}

async function registerFrontend(app: express.Express): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    return;
  }

  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function startServer() {
  const app = express();

  await fs.mkdir(GIT_ROOT, { recursive: true });
  app.set("trust proxy", true);
  app.use(cors());
  app.all(
    "/:owner/:repo.git",
    asyncRoute(async (req, res) => {
      await handleGitHttp(req, res);
    }),
  );
  app.all(
    "/:owner/:repo.git/*",
    asyncRoute(async (req, res) => {
      await handleGitHttp(req, res);
    }),
  );
  app.use(express.json({ limit: JSON_LIMIT }));

  registerApiRoutes(app);
  registerProxyRoute(app);
  registerErrorHandler(app);
  await registerFrontend(app);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Google Hub Git running on http://localhost:${PORT}`);
    console.log(`Git repositories: ${GIT_ROOT}`);
    console.log(`Admin users file: ${getUserStorePath()}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
