import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const USERNAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const PASSWORD_MIN_LENGTH = 12;
const SCRYPT_PARAMS = {
  N: 16_384,
  r: 8,
  p: 1,
  keyLength: 64,
  maxmem: 64 * 1024 * 1024,
};

function derivePassword(
  password: string,
  salt: string,
  params: typeof SCRYPT_PARAMS,
) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      params.keyLength,
      {
        N: params.N,
        r: params.r,
        p: params.p,
        maxmem: params.maxmem,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

export type StoredUser = {
  username: string;
  role: "admin";
  passwordHash: string;
  salt: string;
  scrypt: typeof SCRYPT_PARAMS;
  createdAt: string;
  disabled?: boolean;
};

type UserStore = {
  version: 1;
  users: StoredUser[];
};

export function getUserStorePath() {
  if (process.env.USER_STORE_PATH) return path.resolve(process.env.USER_STORE_PATH);
  const configRoot = path.resolve(
    process.env.CONFIG_ROOT || path.join(process.cwd(), "data", "config"),
  );
  return path.join(configRoot, "users.json");
}

export function validateUsername(username: string) {
  if (!USERNAME_PATTERN.test(username)) {
    throw new Error(
      "Invalid username. Use letters, numbers, dots, underscores, or hyphens.",
    );
  }
  if (username === "." || username === "..") {
    throw new Error("Invalid username.");
  }
}

export function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }
}

async function hashPassword(password: string, salt = randomBytes(24).toString("base64url")) {
  const derived = await derivePassword(password, salt, SCRYPT_PARAMS);

  return {
    salt,
    passwordHash: derived.toString("base64url"),
    scrypt: SCRYPT_PARAMS,
  };
}

async function loadUserStore(): Promise<UserStore> {
  try {
    const raw = await fs.readFile(getUserStorePath(), "utf8");
    const parsed = JSON.parse(raw) as UserStore;
    if (parsed.version !== 1 || !Array.isArray(parsed.users)) {
      throw new Error("Unsupported users file format.");
    }
    return parsed;
  } catch (error: any) {
    if (error?.code === "ENOENT") return { version: 1, users: [] };
    throw error;
  }
}

async function saveUserStore(store: UserStore) {
  const filePath = getUserStorePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(tempPath, filePath);
  await fs.chmod(filePath, 0o600);
}

export async function createAdminUser(username: string, password: string) {
  validateUsername(username);
  validatePassword(password);

  const store = await loadUserStore();
  if (
    store.users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    )
  ) {
    throw new Error(`User "${username}" already exists.`);
  }

  const passwordData = await hashPassword(password);
  const user: StoredUser = {
    username,
    role: "admin",
    ...passwordData,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  await saveUserStore(store);
  return user;
}

export async function listUsers() {
  const store = await loadUserStore();
  return store.users.map(({ passwordHash, salt, scrypt, ...safeUser }) => safeUser);
}

export async function hasAdminUser() {
  const store = await loadUserStore();
  return store.users.some((user) => user.role === "admin" && !user.disabled);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const store = await loadUserStore();
  const user = store.users.find(
    (candidate) =>
      candidate.role === "admin" &&
      !candidate.disabled &&
      candidate.username.toLowerCase() === username.toLowerCase(),
  );

  if (!user) return false;

  const derived = await derivePassword(password, user.salt, user.scrypt);
  const stored = Buffer.from(user.passwordHash, "base64url");

  return stored.length === derived.length && timingSafeEqual(stored, derived);
}
