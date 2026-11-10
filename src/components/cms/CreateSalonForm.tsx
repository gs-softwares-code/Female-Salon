"use client";

import { useState } from "react";
import { createSalonAction } from "@/app/actions/cms";

export function CreateSalonForm() {
  const [message, setMessage] = useState("");
  return <form className="space-y-3 rounded-xl border border-border bg-card p-5" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await createSalonAction({ name: String(form.get("name")), slug: String(form.get("slug")), address: String(form.get("address")), lat: Number(form.get("lat")), lng: Number(form.get("lng")), brandId: String(form.get("brandId")) }); setMessage("Salon saved as draft."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save salon."); } }}>
    <h2 className="font-serif text-xl">Add a salon</h2>
    {['name', 'slug', 'address', 'brandId', 'lat', 'lng'].map((field) => <input key={field} name={field} required placeholder={field === 'brandId' ? 'Brand ID' : field[0].toUpperCase() + field.slice(1)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />)}
    <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Save draft</button>{message && <p className="text-sm text-muted-foreground">{message}</p>}
  </form>;
}
