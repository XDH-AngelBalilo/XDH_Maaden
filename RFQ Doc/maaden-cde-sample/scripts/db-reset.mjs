// Drops and recreates the cde schema, then seeds the demo dataset.
// Usage: npm run db:reset
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import dotenv from "dotenv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const f of [".env.local", ".env"]) {
  const p = join(root, f);
  if (existsSync(p)) dotenv.config({ path: p });
}

const url =
  process.env.DATABASE_URL ||
  "postgresql://cde:cde_local_dev@localhost:5432/maaden_cde";

const client = new pg.Client({ connectionString: url });

const schema = readFileSync(join(root, "db", "schema.sql"), "utf8");
const seed = readFileSync(join(root, "db", "seed", "seed.sql"), "utf8");

try {
  await client.connect();
  console.log("Applying db/schema.sql ...");
  await client.query(schema);
  console.log("Applying db/seed/seed.sql ...");
  await client.query(seed);

  const { rows } = await client.query(
    `SELECT
       (SELECT count(*) FROM cde.assets)            AS assets,
       (SELECT count(*) FROM cde.data_templates)    AS templates,
       (SELECT count(*) FROM cde.standards)         AS standards,
       (SELECT count(*) FROM cde.validation_rules)  AS rules,
       (SELECT count(*) FROM cde.publish_targets)   AS targets,
       (SELECT count(*) FROM cde.users)             AS users`
  );
  console.log("Seed loaded:", rows[0]);
  console.log("db:reset OK");
} catch (err) {
  console.error("db:reset FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
