"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() { const router = useRouter(); const [error, setError] = useState(""); return <form className="space-y-4" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const result = await loginAction({ email: String(form.get("email")), password: String(form.get("password")) }); if (!result.success) setError(result.error); else router.push("/cms/dashboard"); }}><input name="email" type="email" required placeholder="Work email" className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm" /><input name="password" type="password" required placeholder="Password" className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm" /><button className="w-full rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground">Sign in</button>{error && <p className="text-sm text-destructive">{error}</p>}</form>; }
