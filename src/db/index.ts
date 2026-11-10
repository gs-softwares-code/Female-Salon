import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

export type D1DatabaseBinding = Parameters<typeof drizzle>[0];
export type BeautyDatabase = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __BEAUTY_D1__: D1DatabaseBinding | undefined;
  var __LOCAL_SQLITE_INSTANCE__: DatabaseSync | undefined;
}

function getDatabasePath(): string {
  // In serverless environments (e.g. AWS Lambda / Vercel), current working directory is read-only.
  // Copying the bundled salon.sqlite to os.tmpdir() provides read/write access.
  const bundledPath = path.resolve(process.cwd(), "salon.sqlite");
  
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join(os.tmpdir(), "salon.sqlite");
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledPath)) {
      try {
        fs.copyFileSync(bundledPath, tmpDbPath);
      } catch (e) {
        console.warn("Could not copy sqlite to tmpdir, using bundledPath fallback:", e);
        return bundledPath;
      }
    }
    return fs.existsSync(tmpDbPath) ? tmpDbPath : bundledPath;
  }

  return bundledPath;
}

function createLocalD1Shim(): D1DatabaseBinding {
  if (!globalThis.__LOCAL_SQLITE_INSTANCE__) {
    const dbPath = getDatabasePath();
    let rawDb: DatabaseSync;
    try {
      rawDb = new DatabaseSync(dbPath);
      try {
        rawDb.exec("PRAGMA journal_mode = WAL;");
      } catch {
        // WAL pragma might be restricted in some read-only sandboxes
      }
    } catch {
      // Fallback to read-only mode if read-write fails
      rawDb = new DatabaseSync(dbPath, { readOnly: true });
    }
    globalThis.__LOCAL_SQLITE_INSTANCE__ = rawDb;
  }
  const rawDb = globalThis.__LOCAL_SQLITE_INSTANCE__;

  return {
    prepare(query: string) {
      return {
        bind(...params: any[]) {
          const normalized = params.map(p => {
            if (p instanceof Date) return p.getTime();
            if (typeof p === "boolean") return p ? 1 : 0;
            return p;
          });

          return {
            async all() {
              const stmt = rawDb.prepare(query);
              const results = stmt.all(...normalized);
              return { results, success: true, meta: {} };
            },
            async run() {
              const stmt = rawDb.prepare(query);
              const info = stmt.run(...normalized);
              return { success: true, meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) } };
            },
            async first(col?: string) {
              const stmt = rawDb.prepare(query);
              const res = stmt.get(...normalized) as Record<string, any> | undefined;
              if (!res) return null;
              return col ? res[col] : res;
            },
            async raw() {
              const stmt = rawDb.prepare(query);
              const rows = stmt.all(...normalized) as Record<string, any>[];
              return rows.map(r => Object.values(r));
            }
          };
        },
        async all() {
          const stmt = rawDb.prepare(query);
          const results = stmt.all();
          return { results, success: true, meta: {} };
        },
        async run() {
          const stmt = rawDb.prepare(query);
          const info = stmt.run();
          return { success: true, meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) } };
        },
        async first(col?: string) {
          const stmt = rawDb.prepare(query);
          const res = stmt.get() as Record<string, any> | undefined;
          if (!res) return null;
          return col ? res[col] : res;
        },
        async raw() {
          const stmt = rawDb.prepare(query);
          const rows = stmt.all() as Record<string, any>[];
          return rows.map(r => Object.values(r));
        }
      };
    },
    async exec(query: string) {
      rawDb.exec(query);
      return { count: 1, duration: 0 };
    },
    async batch(statements: any[]) {
      const res = [];
      for (const s of statements) {
        res.push(await s.all());
      }
      return res;
    }
  } as any;
}

export function getDb(binding: D1DatabaseBinding = globalThis.__BEAUTY_D1__) {
  const activeBinding = binding ?? createLocalD1Shim();
  return drizzle(activeBinding, { schema });
}

export { schema };
