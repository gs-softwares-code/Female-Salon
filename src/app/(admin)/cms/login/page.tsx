import { LoginForm } from "@/components/cms/LoginForm";

export default function LoginPage() { return <main className="flex min-h-screen items-center justify-center bg-background px-6"><div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"><p className="text-xs uppercase tracking-[0.25em] text-primary">Aegis Beauty</p><h1 className="mt-3 font-serif text-3xl">Control center</h1><p className="mb-8 mt-2 text-sm text-muted-foreground">Sign in to manage your network.</p><LoginForm /></div></main>; }
