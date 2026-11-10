import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { salons } from "@/db/schema";
import { CreateSalonForm } from "@/components/cms/CreateSalonForm";

export const dynamic = "force-dynamic";

export default async function SalonsPage() {
  let rows: typeof salons.$inferSelect[] = [];
  try { rows = await getDb().select().from(salons).orderBy(desc(salons.createdAt)); } catch { /* D1 is injected at runtime. */ }
  return <div className="mx-auto max-w-6xl"><div className="mb-8"><p className="text-xs uppercase tracking-[0.25em] text-primary">A — Authority & governance</p><h1 className="mt-2 font-serif text-4xl">Salon portfolio</h1></div><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><div className="overflow-hidden rounded-xl border border-border bg-card"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted"><tr><th className="px-4 py-3">Salon</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{rows.map((salon) => <tr key={salon.id} className="border-b border-border last:border-0"><td className="px-4 py-4"><p className="font-medium">{salon.name}</p><p className="text-xs text-muted-foreground">/{salon.slug}</p></td><td className="px-4 py-4 text-muted-foreground">{salon.address}</td><td className="px-4 py-4"><span className="rounded-full bg-muted px-2 py-1 text-xs">{salon.status}</span></td></tr>)}{rows.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">No salons loaded yet. Connect the native D1 binding to view records.</td></tr>}</tbody></table></div><CreateSalonForm /></div></div>;
}
