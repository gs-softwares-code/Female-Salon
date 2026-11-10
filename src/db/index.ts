import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

export type D1DatabaseBinding = Parameters<typeof drizzle>[0];
export type BeautyDatabase = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __BEAUTY_D1__: D1DatabaseBinding | undefined;
  var __LOCAL_SQLITE_INSTANCE__: DatabaseSync | undefined;
}

function createLocalD1Shim(): D1DatabaseBinding {
  if (!globalThis.__LOCAL_SQLITE_INSTANCE__) {
    const dbPath = path.resolve(process.cwd(), "salon.sqlite");
    const rawDb = new DatabaseSync(dbPath);
    // enable WAL mode for high concurrency
    rawDb.exec("PRAGMA journal_mode = WAL;");
    globalThis.__LOCAL_SQLITE_INSTANCE__ = rawDb;
  }
  const rawDb = globalThis.__LOCAL_SQLITE_INSTANCE__;

  return {
    prepare(query: string) {
      return {
        bind(...params: any[]) {
          // Normalize parameters (e.g. boolean to 0/1, Date to number/string if needed)
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
