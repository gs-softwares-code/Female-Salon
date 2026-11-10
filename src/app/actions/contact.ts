"use server";

import { z } from "zod";
import { getDb } from "@/db";
import { customerInquiries } from "@/db/schema";
import { revalidatePath } from "next/cache";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Please provide a detailed inquiry message"),
});

export async function submitContactInquiry(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const data = contactSchema.parse(formData);
  const db = getDb();

  const inquiryId = `inq_${crypto.randomUUID().slice(0, 8)}`;
  await db.insert(customerInquiries).values({
    id: inquiryId,
    salonId: "salon_soho_01",
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject || "General Atelier Inquiry",
    message: data.message,
    status: "UNREAD",
  });

  revalidatePath("/cms/dashboard");
  return { success: true, inquiryId };
}

