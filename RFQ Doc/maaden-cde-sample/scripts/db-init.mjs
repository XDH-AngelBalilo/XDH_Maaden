// Build the database on first boot, and never again.
//
// db-reset.mjs is the deliberate, destructive command: it drops the schema and
// reloads the seed, which is what you want while developing and emphatically
// not what you want on container restart. But a hosted demo that needs somebody
// to SSH in and run a command before it shows anything is a demo that will be
// found empty by the person it was hosted for. So the container calls this on
// start: it looks for the schema, and only if there is none does it apply
// db/schema.sql and db/seed/seed.sql.
//
// Idempotent by inspection, not by hope — `to_regclass` returns null for a
// table that does not exist, and that single check is the whole guard.
//
// Deliberately imports nothing but `pg`. dotenv is a devDependency and the
// production standalone tree does not contain it; DATABASE_URL arrives from
// the compose environment.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url =
  process.env.DATABASE_URL ||
  "postgresql://cde:cde_local_dev@localhost:5432/maaden_cde";

/**
 * Compose gates this container on the database's healthcheck, so Postgres is
 * accepting connections before we start. It is not always ready to answer on
 * the very first attempt after a cold volume initialise, hence a short retry
 * rather than an immediate give-up.
 */
async function connect(attempts = 15, waitMs = 2000) {
  for (let i = 1; i <= attempts; i++) {
    const client = new pg.Client({ connectionString: url });
    try {
      await client.connect();
      return client;
    } catch (err) {
      await client.end().catch(() => {});
      if (i === attempts) throw err;
      console.log(`db-init: database not ready (${err.code || err.message}), retry ${i}/${attempts}`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
}

const client = await connect();
try {
  const { rows } = await client.query("SELECT to_regclass('cde.assets') AS t");
  if (rows[0].t) {
    console.log("db-init: schema already present, leaving the data alone");
  } else {
    console.log("db-init: empty database, applying schema + seed");
    await client.query(readFileSync(join(root, "db", "schema.sql"), "utf8"));
    await client.query(readFileSync(join(root, "db", "seed", "seed.sql"), "utf8"));
    const { rows: c } = await client.query(
      `SELECT
         (SELECT count(*) FROM cde.assets)         AS assets,
         (SELECT count(*) FROM cde.data_templates) AS templates,
         (SELECT count(*) FROM cde.standards)      AS standards`
    );
    console.log("db-init: seeded", c[0]);
  }
} catch (err) {
  // Do not take the app down. A running app that reports a database error on
  // every page is diagnosable; a crash-looping container is a blank screen and
  // no logs anybody thinks to look for.
  console.error("db-init FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
