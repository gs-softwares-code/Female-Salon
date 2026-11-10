import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { stylists } from "@/db/schema";
import { CreateStylistForm } from "@/components/cms/CreateStylistForm";

export const dynamic = "force-dynamic";

export default async function StylistsPage() {
  let rows: typeof stylists.$inferSelect[] = [];
  try { rows = await getDb().select().from(stylists).orderBy(desc(stylists.createdAt)); } catch { /* D1 is injected at runtime. */ }
  return <div className="mx-auto max-w-6xl"><div className="mb-8"><p className="text-xs uppercase tracking-[0.25em] text-primary">Team operations</p><h1 className="mt-2 font-serif text-4xl">Stylist directory</h1></div><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><div className="overflow-hidden rounded-xl border border-border bg-card"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted"><tr><th className="px-4 py-3">Stylist</th><th className="px-4 py-3">Salon</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{rows.map((stylist) => <tr key={stylist.id} className="border-b border-border last:border-0"><td className="px-4 py-4"><p className="font-medium">{stylist.name}</p><p className="text-xs text-muted-foreground">{stylist.commissionRate}% commission</p></td><td className="px-4 py-4 text-muted-foreground">{stylist.salonId}</td><td className="px-4 py-4"><span className="rounded-full bg-muted px-2 py-1 text-xs">{stylist.status}</span></td></tr>)}{rows.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">No stylists loaded yet.</td></tr>}</tbody></table></div><CreateStylistForm /></div></div>;
}
