import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/cms/AdminSidebar";
import { getCurrentSession } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/cms/login");
  const cookieRole = ((await cookies()).get("session_role")?.value ?? "SALON_MANAGER") as UserRole;
  return <div className="flex min-h-screen bg-background"><AdminSidebar role={cookieRole} /><main className="min-w-0 flex-1 p-8">{children}</main></div>;
}
