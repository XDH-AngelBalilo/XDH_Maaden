import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const db =
  globalForDb.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://cde:cde_local_dev@localhost:5432/maaden_cde",
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = db;

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const res = await db.query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
