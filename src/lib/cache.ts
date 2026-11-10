type NativeKV = {
  get<T = unknown>(key: string, type?: "json" | "text"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
};

declare global { var __BEAUTY_KV__: NativeKV | undefined; }

const memory = new Map<string, { value: string; expiresAt: number }>();

function getKv() { return globalThis.__BEAUTY_KV__; }

export async function getCache<T>(key: string): Promise<T | null> {
  const kv = getKv();
  if (kv) return kv.get<T>(key, "json");
  const entry = memory.get(key);
  if (!entry || entry.expiresAt <= Date.now()) { memory.delete(key); return null; }
  return JSON.parse(entry.value) as T;
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 300) {
  const serialized = JSON.stringify(value);
  const kv = getKv();
  if (kv) return kv.put(key, serialized, { expirationTtl: ttlSeconds });
  memory.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function deleteCache(key: string) {
  const kv = getKv();
  if (kv) return kv.delete(key);
  memory.delete(key);
}

export async function acquireSlotLock(key: string, holder: string, ttlSeconds = 300) {
  if (await getCache(key)) return false;
  await setCache(key, { holder, lockedAt: Date.now() }, ttlSeconds);
  return true;
}

export { getKv };
