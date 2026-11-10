import { getDb } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function ServicesManagementPage() {
  const db = getDb();
  const allServices = await db.select().from(services);

  async function updatePriceAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const duration = parseInt(formData.get("duration") as string, 10);
    const isFeatured = formData.get("isFeatured") === "on";

    if (id && !isNaN(price)) {
      await getDb().update(services).set({
        price,
        durationMins: duration || 60,
        isFeatured,
      }).where(eq(services.id, id));
      revalidatePath("/cms/services");
      revalidatePath("/services");
      revalidatePath("/");
    }
  }

  async function createNewService(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const category = formData.get("category") as "HAIR" | "SKIN" | "MAKEUP" | "NAILS" | "GROOMING";
    const price = parseInt(formData.get("price") as string, 10);
    const durationMins = parseInt(formData.get("durationMins") as string, 10);
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (name && price) {
      await getDb().insert(services).values({
        id: `srv_${crypto.randomUUID().slice(0, 8)}`,
        salonId: "salon_soho_01",
        name,
        category,
        price,
        durationMins: durationMins || 60,
        description,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
        currency: "USD",
        status: "ACTIVE",
        isFeatured: false,
        isBestSeller: false,
      });
      revalidatePath("/cms/services");
      revalidatePath("/services");
      revalidatePath("/");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Menu Engineering</p>
        <h1 className="mt-1 font-serif text-4xl font-light">Services & Pricing Management</h1>
        <p className="mt-1 text-xs text-muted-foreground">Modify prices, duration, descriptions, and feature statuses across all salon rituals.</p>
      </div>

      {/* Add New Service Form */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-2xl font-light mb-4">Add New Ritual to Menu</h3>
        <form action={createNewService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Ritual Name</label>
            <input
              name="name"
              required
              placeholder="e.g. 24K Gold Cellular Peel"
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Category</label>
            <select
              name="category"
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            >
              <option value="HAIR">HAIR</option>
              <option value="SKIN">SKIN</option>
              <option value="MAKEUP">MAKEUP</option>
              <option value="NAILS">NAILS</option>
              <option value="GROOMING">GROOMING</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Price ($ USD)</label>
              <input
                type="number"
                name="price"
                required
                placeholder="195"
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Duration (Min)</label>
              <input
                type="number"
                name="durationMins"
                required
                defaultValue="60"
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Description</label>
            <input
              name="description"
              placeholder="Describe ritual technique and formulation benefits..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Photo URL</label>
            <input
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-wider font-medium text-primary-foreground hover:bg-[#855333] transition"
            >
              Publish Ritual
            </button>
          </div>
        </form>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-2xl font-light mb-4">Current Ritual Directory ({allServices.length})</h3>
        <div className="space-y-4">
          {allServices.map((service) => (
            <form
              key={service.id}
              action={updatePriceAction}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/20 transition"
            >
              <input type="hidden" name="id" value={service.id} />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/20 text-primary">
                    {service.category}
                  </span>
                  <p className="font-medium text-foreground">{service.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">{service.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Price ($):</span>
                  <input
                    type="number"
                    name="price"
                    defaultValue={service.price}
                    className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Mins:</span>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={service.durationMins}
                    className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={service.isFeatured}
                    className="rounded border-border text-primary focus:ring-0"
                  />
                  <span>Featured</span>
                </label>

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
    </div>
  );
}
