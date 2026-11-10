import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("salon.sqlite");

db.prepare(`
  UPDATE gallery_items
  SET 
    before_image_url = '/transformations/hair_before.webp',
    after_image_url = '/transformations/hair_after.webp',
    image_url = '/transformations/hair_after.webp',
    title = 'French Honey Balayage & Silk Smoothing',
    description = 'Client arrived with unstyled, frizzy, dehydrated dark hair. Seamless dimensional honey-blonde ribboning with zero breakage, finished with high-shine smoothing.'
  WHERE id = 'gal_05';
`).run();

db.prepare(`
  UPDATE gallery_items
  SET 
    before_image_url = '/transformations/skin_before.webp',
    after_image_url = '/transformations/skin_after.webp',
    image_url = '/transformations/skin_after.webp',
    title = 'Hydra-Infusion Clinical Glass Skin Metamorphosis',
    description = 'Immediate reduction of facial dehydration lines, calmed redness, and deep dermal light bounce achieved with molecular hyaluronic acid and cold jade massage.'
  WHERE id = 'gal_08';
`).run();

const rows = db.prepare("SELECT id, title, before_image_url, after_image_url FROM gallery_items WHERE category = 'BEFORE_AFTER'").all();
console.log("Updated Before/After items:", rows);

