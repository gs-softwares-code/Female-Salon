import { getDb } from "@/db";
import { packages, specialOffers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function PackagesManagementPage() {
  const db = getDb();
  const [allPackages, allOffers] = await Promise.all([
    db.select().from(packages),
    db.select().from(specialOffers),
  ]);

  async function updatePackagePrice(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const origPrice = parseInt(formData.get("originalPrice") as string, 10);
    if (id && !isNaN(price)) {
      await getDb().update(packages).set({ price, originalPrice: origPrice }).where(eq(packages.id, id));
      revalidatePath("/cms/packages");
      revalidatePath("/packages");
      revalidatePath("/");
    }
  }

  async function toggleOffer(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const isActive = formData.get("isActive") === "true";
    if (id) {
      await getDb().update(specialOffers).set({ isActive: !isActive }).where(eq(specialOffers.id, id));
      revalidatePath("/cms/packages");
      revalidatePath("/");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Specialty & Promos</p>
        <h1 className="mt-1 font-serif text-4xl font-light">Packages & Offers Management</h1>
        <p className="mt-1 text-xs text-muted-foreground">Adjust bridal package pricing, inclusions, and active first-visit promotions.</p>
      </div>

      {/* Packages List */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-serif text-2xl font-light">Bridal & Special Packages ({allPackages.length})</h3>
        <div className="space-y-4">
          {allPackages.map((pkg) => (
            <form
              key={pkg.id}
              action={updatePackagePrice}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/20 transition"
            >
              <input type="hidden" name="id" value={pkg.id} />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {pkg.badge || "Standard"}
                  </span>
                  <p className="font-medium text-foreground">{pkg.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pkg.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Price ($):</span>
                  <input
                    type="number"
                    name="price"
                    defaultValue={pkg.price}
                    className="w-24 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Original ($):</span>
                  <input
                    type="number"
                    name="originalPrice"
                    defaultValue={pkg.originalPrice}
                    className="w-24 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  Save
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>

      {/* Special Offers Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-serif text-2xl font-light">Active Special Offers & Coupon Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Code</th>
                <th className="pb-3 font-medium">Title & Description</th>
                <th className="pb-3 font-medium">Discount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-muted/30 transition">
                  <td className="py-4 font-mono text-xs font-semibold text-primary">{offer.code}</td>
                  <td className="py-4">
                    <p className="font-medium text-foreground">{offer.title}</p>
                    <p className="text-xs text-muted-foreground">{offer.description}</p>
                  </td>
                  <td className="py-4 font-serif text-sm font-light text-foreground">{offer.discountPercent}%</td>
                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                        offer.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {offer.isActive ? "ACTIVE" : "PAUSED"}
                    </span>
                  </td>
                  <td className="py-4">
                    <form action={toggleOffer}>
                      <input type="hidden" name="id" value={offer.id} />
                      <input type="hidden" name="isActive" value={String(offer.isActive)} />
                      <button
                        type="submit"
                        className="rounded-lg border border-border px-3 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition"
                      >
                        {offer.isActive ? "Pause Offer" : "Activate"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
