// npm run setup — creates .env from .env.example with a fresh auth secret
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { userInfo } from "node:os";

if (existsSync(".env")) {
  console.log("✅ .env already exists — leaving it alone.");
} else {
  const secret = randomBytes(32).toString("base64");
  const user = userInfo().username;
  const env = readFileSync(".env.example", "utf8")
    .replace(/^BETTER_AUTH_SECRET=.*$/m, `BETTER_AUTH_SECRET=${secret}`)
    .replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=postgres://${user}@localhost:5432/saas_starter`);
  writeFileSync(".env", env);
  console.log("✅ Created .env with a new BETTER_AUTH_SECRET.");
  console.log(`   DATABASE_URL points to a local Postgres database "saas_starter" (user: ${user}).`);
  console.log("   Using Railway/Neon instead? Paste its connection string into DATABASE_URL in .env.");
}
