import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { pool } from "../src/db/pool";
async function run() {
    const dir = join(process.cwd(), "migrations");
    const files = readdirSync(dir)
        .filter((f) => /^\d+_.+\.sql$/.test(f))
        .sort();
    for (const f of files) {
        const sql = readFileSync(join(dir, f), "utf8");
        console.log(`Applying migration: ${f}`);
        await pool.query(sql);
    }
    await pool.end();
    console.log("Migrations complete");
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
