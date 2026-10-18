import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";

loadEnvConfig(process.cwd());

const scryptCost = 32_768;
const scryptBlockSize = 8;
const scryptParallelization = 1;
const saltBytes = 16;
const derivedKeyBytes = 64;

class SeedConfigurationError extends Error {}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      derivedKeyBytes,
      {
        N: scryptCost,
        r: scryptBlockSize,
        p: scryptParallelization,
        maxmem: 64 * 1024 * 1024,
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

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new SeedConfigurationError(
      `${name} must be set in .env.local before seeding.`,
    );
  }
  return value;
}

async function hashPassword(password: string): Promise<string> {
  if (password.length < 14) {
    throw new SeedConfigurationError(
      "SUPER_ADMIN_PASSWORD must be at least 14 characters.",
    );
  }

  const salt = randomBytes(saltBytes);
  const derivedKey = await deriveKey(password, salt);

  return [
    "scrypt",
    scryptCost,
    scryptBlockSize,
    scryptParallelization,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

async function seedSuperAdmin(): Promise<void> {
  const databaseUrl = requiredEnvironmentVariable("DATABASE_URL");
  const displayName = requiredEnvironmentVariable("SUPER_ADMIN_DISPLAY_NAME");
  const loginName = requiredEnvironmentVariable("SUPER_ADMIN_LOGIN_NAME");
  const password = requiredEnvironmentVariable("SUPER_ADMIN_PASSWORD");
  const passwordHash = await hashPassword(password);
  const sql = neon(databaseUrl);

  const existingSuperAdmin =
    await sql`select id from users where role = 'super_admin' limit 1`;
  if (existingSuperAdmin.length > 0) {
    throw new SeedConfigurationError(
      "A Super Admin already exists. The one-time seed will not create another.",
    );
  }

  const existingLogin =
    await sql`select id from users where lower(btrim(login_name)) = lower(btrim(${loginName})) limit 1`;
  if (existingLogin.length > 0) {
    throw new SeedConfigurationError("That login name is already in use.");
  }

  await sql`
    insert into users (role, parent_user_id, display_name, login_name, password_hash)
    values ('super_admin', null, ${displayName}, ${loginName}, ${passwordHash})
  `;

  console.log("Super Admin created successfully.");
}

seedSuperAdmin().catch((error: unknown) => {
  if (error instanceof SeedConfigurationError) {
    console.error(`Super Admin seed failed: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "unknown";
  const message = `Database operation failed (code: ${code}). Check the connection and schema.`;
  console.error(`Super Admin seed failed: ${message}`);
  process.exitCode = 1;
});
