import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function GalleryManagementPage() {
  const db = getDb();
  const allGallery = await db.select().from(galleryItems);

  async function addGalleryItem(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const category = formData.get("category") as "HAIR" | "MAKEUP" | "NAILS" | "INTERIOR" | "BEFORE_AFTER";
    const imageUrl = formData.get("imageUrl") as string;
    const beforeImageUrl = formData.get("beforeImageUrl") as string;
    const afterImageUrl = formData.get("afterImageUrl") as string;
    const description = formData.get("description") as string;
    const stylistName = formData.get("stylistName") as string;

    if (title && imageUrl) {
      await getDb().insert(galleryItems).values({
        id: `gal_${crypto.randomUUID().slice(0, 8)}`,
        salonId: "salon_soho_01",
        title,
        category,
        imageUrl,
        beforeImageUrl: beforeImageUrl || null,
        afterImageUrl: afterImageUrl || null,
        description,
        stylistName,
        isFeatured: true,
      });
      revalidatePath("/cms/gallery");
      revalidatePath("/gallery");
      revalidatePath("/");
    }
  }

  async function deleteGalleryItem(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      await getDb().delete(galleryItems).where(eq(galleryItems.id, id));
      revalidatePath("/cms/gallery");
      revalidatePath("/gallery");
      revalidatePath("/");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Curation & Portfolio</p>
        <h1 className="mt-1 font-serif text-4xl font-light">Gallery Management</h1>
        <p className="mt-1 text-xs text-muted-foreground">Upload and curate transformation photos, before-and-after comparisons, and interior showcase media.</p>
      </div>

      {/* Add New Gallery Item */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-2xl font-light mb-4">Add Item to Gallery</h3>
        <form action={addGalleryItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Title</label>
            <input
              name="title"
              required
              placeholder="e.g. Copper Balayage & Silk Wave"
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
              <option value="MAKEUP">MAKEUP</option>
              <option value="NAILS">NAILS</option>
              <option value="INTERIOR">INTERIOR</option>
              <option value="BEFORE_AFTER">BEFORE & AFTER</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Stylist / Artisan</label>
            <input
              name="stylistName"
              placeholder="e.g. Clara Dubois"
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Primary Image URL</label>
            <input
              name="imageUrl"
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Before Image URL (Optional)</label>
            <input
              name="beforeImageUrl"
              placeholder="https://..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">After Image URL (Optional)</label>
            <input
              name="afterImageUrl"
              placeholder="https://..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Description</label>
            <input
              name="description"
              placeholder="Specific details of technique, pigments, or styling tools..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-wider font-medium text-primary-foreground hover:bg-[#855333] transition"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Existing Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allGallery.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] text-white">
                {item.category}
              </div>
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.stylistName || "Maison"}</p>
            </div>
            <div className="pt-2 flex justify-end">
              <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="text-xs text-destructive hover:underline"
                >
                  Remove Item
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

