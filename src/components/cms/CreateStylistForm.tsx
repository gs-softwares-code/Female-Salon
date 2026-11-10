"use client";

import { useState } from "react";
import { createStylistAction } from "@/app/actions/cms";

export function CreateStylistForm() {
  const [message, setMessage] = useState("");
  return <form className="space-y-3 rounded-xl border border-border bg-card p-5" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await createStylistAction({ salonId: String(form.get("salonId")), userId: String(form.get("userId")), name: String(form.get("name")), bio: String(form.get("bio") ?? ""), commissionRate: Number(form.get("commissionRate")) }); setMessage("Stylist added."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save stylist."); } }}>
    <h2 className="font-serif text-xl">Add a stylist</h2>
    {['salonId', 'userId', 'name', 'commissionRate'].map((field) => <input key={field} name={field} required placeholder={field[0].toUpperCase() + field.slice(1)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />)}
    <textarea name="bio" placeholder="Bio" className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /><button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Add stylist</button>{message && <p className="text-sm text-muted-foreground">{message}</p>}
  </form>;
}
