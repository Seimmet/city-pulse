import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { pool } from "../src/db/pool";


async function run() {
  const dir = join(process.cwd(), "migrations");
  const files = readdirSync(dir)
    .filter((f) => /^\d+_.+\.sql$/.test(f))
    .sort();


  // Create migrations table if not exists
  await pool.query(`
    create table if not exists migrations (
      id serial primary key,
      name text not null unique,
      applied_at timestamptz not null default now()
    );
  `);

  // Check if we need to backfill 0001_init.sql
  const { rows: existingTables } = await pool.query(
    "select to_regclass('public.users') as exists"
  );
  if (existingTables[0]?.exists) {
    await pool.query(
      "insert into migrations (name) values ($1) on conflict (name) do nothing",
      ["0001_init.sql"]
    );
  }

  const { rows: applied } = await pool.query("select name from migrations");

  const appliedNames = new Set(applied.map((r) => r.name));

  for (const f of files) {
    if (appliedNames.has(f)) {
      console.log(`Skipping already applied: ${f}`);
      continue;
    }
    
    const sql = readFileSync(join(dir, f), "utf8");
    console.log(`Applying migration: ${f}`);
    try {
      await pool.query("BEGIN");
      await pool.query(sql);
      await pool.query("insert into migrations (name) values ($1)", [f]);
      await pool.query("COMMIT");
    } catch (e) {
      await pool.query("ROLLBACK");
      throw e;
    }
  }
  await pool.end();
  console.log("Migrations complete");
}


run().catch((err) => {
  console.error(err);
  process.exit(1);
});
