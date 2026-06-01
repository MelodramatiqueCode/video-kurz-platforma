import fs from "node:fs";
import path from "node:path";

const authPath = path.join(
  process.env.HOME,
  "Library/Application Support/com.vercel.cli/auth.json",
);
const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
const token = auth.token;
const teamId = "team_bOJtLLj40lqzq20YGFjp7IlS";
const projectId = "prj_72iteRLusodnY2iwOsUFLGFsCWMa";

function readEnvValue(file, key) {
  const line = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .find((row) => row.startsWith(`${key}=`));
  if (!line) throw new Error(`Missing ${key} in ${file}`);
  return line.slice(key.length + 1).replace(/^"|"$/g, "");
}

const mapEnv = path.join(process.env.HOME, "Projects/mamymimodavu-mapa/.env");
const radioEnv = path.join(process.env.HOME, "Projects/webove-radio/.env.local");

const vars = {
  DATABASE_URL: readEnvValue(mapEnv, "DATABASE_URL"),
  NEXT_PUBLIC_SUPABASE_URL: "https://rdulzfcijhjlgxmkmqse.supabase.co",
  NEXT_PUBLIC_APP_URL: "https://video-kurz-platforma.vercel.app",
  ADMIN_EMAILS: "finance@melodramatique.sk,ceo@melodramatique.sk,mamy.mimo.davu@gmail.com",
  BLOB_READ_WRITE_TOKEN: readEnvValue(radioEnv, "BLOB_READ_WRITE_TOKEN"),
};

const projectEnv = path.join(process.env.HOME, "Projects/video-kurz-platforma/.env");

function readOptionalEnv(key) {
  if (process.env[key]) return process.env[key];
  try {
    return readEnvValue(projectEnv, key);
  } catch {
    return null;
  }
}

for (const optional of [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "MUX_TOKEN_ID",
  "MUX_TOKEN_SECRET",
  "MUX_SIGNING_KEY",
  "MUX_PRIVATE_KEY",
]) {
  const value = readOptionalEnv(optional);
  if (value) vars[optional] = value;
}

async function listEnvs() {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  return data.envs || [];
}

async function deleteEnv(id) {
  await fetch(`https://api.vercel.com/v10/projects/${projectId}/env/${id}?teamId=${teamId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function createEnv(key, value) {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    },
  );
  if (!res.ok) throw new Error(`POST ${key}: ${await res.text()}`);
  console.log(`Created ${key}`);
}

const existing = await listEnvs();
for (const item of existing) {
  if (Object.hasOwn(vars, item.key)) {
    await deleteEnv(item.id);
  }
}

for (const [key, value] of Object.entries(vars)) {
  await createEnv(key, value);
}
