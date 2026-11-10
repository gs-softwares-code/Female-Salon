import { getCache } from "@/lib/cache";

export type FeatureFlag = "medical-aesthetics" | "new-booking-flow" | "pro-orders";

export async function isFeatureEnabled(flag: FeatureFlag, region: string, fallback = false) {
  const configured = await getCache<Record<string, boolean>>(`feature-flags:${region.toUpperCase()}`);
  return configured?.[flag] ?? fallback;
}

export async function isMedicalAestheticsEnabled(region: string) {
  return isFeatureEnabled("medical-aesthetics", region, false);
}
