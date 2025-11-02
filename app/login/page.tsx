"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const router = useRouter();
	const params = useSearchParams();
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const redirect = params.get("redirect") || "/admin";

	async function handleLogin() {
		setError(null);
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});
		if (!res.ok) {
			setError("Invalid password");
			return;
		}
		router.push(redirect);
	}

	return (
		<div className="container mx-auto px-4 py-10 max-w-md">
			<h1 className="text-2xl font-bold mb-4">Admin Login</h1>
			{error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
			<div className="space-y-3">
				<Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<Button onClick={handleLogin}>Login</Button>
			</div>
			<p className="text-xs text-muted-foreground mt-4">Set env var ADMIN_PASSWORD to customize.</p>
		</div>
	);
}







