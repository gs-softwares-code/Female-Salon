import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { UserRole } from "@/lib/auth";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  Image as ImageIcon,
  Tag,
  MessageSquare,
  TrendingUp,
  LogOut,
  Building,
} from "lucide-react";

const items = [
  { href: "/cms/dashboard", label: "Overview & Analytics", icon: LayoutDashboard, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/appointments", label: "Bookings & Schedules", icon: CalendarDays, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER", "STYLIST"] },
  { href: "/cms/services", label: "Services & Pricing", icon: Sparkles, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/stylists", label: "Stylists & Staff", icon: Users, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/packages", label: "Bridal & Packages", icon: Tag, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/inquiries", label: "Customer Inquiries", icon: MessageSquare, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/gallery", label: "Gallery Management", icon: ImageIcon, roles: ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"] },
  { href: "/cms/salons", label: "Location Settings", icon: Building, roles: ["CORPORATE_ADMIN", "FRANCHISEE"] },
];

export function AdminSidebar({ role }: { role: UserRole }) {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-border bg-[#FAF7F2] p-5">
      <div className="mb-8">
        <Link href="/" className="font-serif text-xl font-medium tracking-wider text-foreground">
          AEGIS MAISON
        </Link>
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary mt-0.5">Management Suite</p>
      </div>

      <nav className="space-y-1.5 flex-1">
        {items
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-xs transition"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-white border border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed In As</p>
          <p className="text-xs font-semibold text-foreground truncate">{role.replaceAll("_", " ")}</p>
        </div>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-destructive hover:bg-red-50 transition">
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
