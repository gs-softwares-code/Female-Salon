export type NativeObjectStorage = {
  put(key: string, value: ArrayBuffer | ArrayBufferView | ReadableStream | string, options?: { httpMetadata?: Record<string, string> }): Promise<unknown>;
  get(key: string): Promise<unknown | null>;
  delete(key: string): Promise<void>;
};

declare global { var __BEAUTY_R2__: NativeObjectStorage | undefined; }

export async function uploadSalonAsset(key: string, body: ArrayBuffer | ArrayBufferView | ReadableStream | string, contentType: string) {
  const storage = globalThis.__BEAUTY_R2__;
  if (!storage) throw new Error("Native R2 storage binding is unavailable.");
  await storage.put(key, body, { httpMetadata: { "content-type": contentType } });
  return { key };
}

export async function getSalonAsset(key: string) { return globalThis.__BEAUTY_R2__?.get(key) ?? null; }
export async function deleteSalonAsset(key: string) { if (!globalThis.__BEAUTY_R2__) throw new Error("Native R2 storage binding is unavailable."); await globalThis.__BEAUTY_R2__.delete(key); }
