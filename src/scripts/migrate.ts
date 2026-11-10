import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const db = new DatabaseSync("salon.sqlite");
const drizzleDir = path.resolve(process.cwd(), "drizzle");
const sqlFiles = fs.readdirSync(drizzleDir).filter(f => f.endsWith(".sql")).sort();

console.log("Applying migrations:", sqlFiles);
for (const file of sqlFiles) {
  const sql = fs.readFileSync(path.join(drizzleDir, file), "utf8");
  const stmts = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    try {
      db.exec(s);
    } catch (e: any) {
      console.error(`Error in ${file}:`, e.message);
    }
  }
}

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("All tables currently in database:", tables.map(r => (r as any).name));
