import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
import { GalleryViewer } from "@/components/gallery/GalleryViewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Transformation & Aesthetic Gallery | Aegis Maison de Beauté",
  description: "Browse high-definition transformations, couture hair balayage, editorial bridal makeup, Russian nail extensions, and before & after comparisons.",
};

export default async function GalleryPage() {
  const db = getDb();
  const items = await db.select().from(galleryItems);

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Visual Journal & Metamorphosis</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">The Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Explore authentic hair transformations, radiant bridal and evening makeup looks, refined nail sculptures, and our serene SoHo salon interiors. Click any piece to inspect details in the high-resolution lightbox.
          </p>
        </div>
      </section>

      {/* Interactive Gallery Viewer */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <GalleryViewer items={items} />
      </section>
    </main>
  );
}

