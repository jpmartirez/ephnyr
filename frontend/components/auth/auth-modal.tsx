/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { login, signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultTab?: "login" | "signup";
}

export function AuthModal({
	open,
	onOpenChange,
	defaultTab = "login",
}: AuthModalProps) {
	const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);

	useEffect(() => {
		setActiveTab(defaultTab);
	}, [defaultTab]);

	const [loginState, loginAction, isLoginPending] = useActionState(
		login,
		null,
	);
	const [signupState, signupAction, isSignupPending] = useActionState(
		signup,
		null,
	);

	// Handle React Hot Toast notification upon registration requiring email verification or existing email
	useEffect(() => {
		if (signupState?.success && signupState?.message) {
			toast.success(signupState.message, {
				duration: 8000,
				icon: "✉️",
				style: {
					background: "#09090b",
					color: "#fafafa",
					border: "1px border #27272a",
					fontSize: "12px",
				},
			});
			// Switch tab to login after registration success
			setActiveTab("login");
		} else if (signupState?.error) {
			toast.error(signupState.error, {
				duration: 6000,
				style: {
					background: "#09090b",
					color: "#ef4444",
					border: "1px border #27272a",
					fontSize: "12px",
				},
			});
			if (signupState?.isEmailExists) {
				setActiveTab("login");
			}
		}
	}, [signupState]);

	useEffect(() => {
		if (loginState?.error) {
			toast.error(loginState.error, {
				style: {
					background: "#09090b",
					color: "#ef4444",
					border: "1px border #27272a",
					fontSize: "12px",
				},
			});
		}
	}, [loginState]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md border-zinc-200 bg-white p-6 shadow-lg sm:max-w-md">
				<DialogHeader className="flex flex-col items-center text-center">
					<div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-zinc-950">
						<span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-950 text-sm font-bold text-white">
							E
						</span>
						EPHNYR
					</div>
					<DialogTitle className="mt-2 text-lg font-bold text-zinc-950">
						Welcome to Ephnyr
					</DialogTitle>
					<DialogDescription className="text-xs text-zinc-500">
						Access your ephemeral knowledge pods and streaming RAG engine.
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(val) => setActiveTab(val as "login" | "signup")}
					className="mt-4 w-full"
				>
					<TabsList className="grid w-full grid-cols-2 bg-zinc-100 p-1">
						<TabsTrigger
							value="login"
							className="text-xs font-medium data-active:bg-white data-active:text-zinc-950"
						>
							Sign In
						</TabsTrigger>
						<TabsTrigger
							value="signup"
							className="text-xs font-medium data-active:bg-white data-active:text-zinc-950"
						>
							Create Account
						</TabsTrigger>
					</TabsList>

					{/* Sign In Tab */}
					<TabsContent value="login" className="mt-4 space-y-4">
						<form action={loginAction} className="space-y-4">
							{loginState?.error && (
								<div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600">
									{loginState.error}
								</div>
							)}

							<div className="space-y-1.5">
								<label
									htmlFor="login-email"
									className="text-xs font-medium text-zinc-700"
								>
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
									<Input
										id="login-email"
										name="email"
										type="email"
										required
										placeholder="user@ephnyr.ai"
										className="border-zinc-200 pl-9 text-xs focus-visible:ring-zinc-950"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="login-password"
									className="text-xs font-medium text-zinc-700"
								>
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
									<Input
										id="login-password"
										name="password"
										type="password"
										required
										placeholder="••••••••"
										className="border-zinc-200 pl-9 text-xs focus-visible:ring-zinc-950"
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoginPending}
								className="w-full bg-zinc-950 font-medium text-white hover:bg-zinc-800"
							>
								{isLoginPending ? "Signing in..." : "Sign In"}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</form>
					</TabsContent>

					{/* Create Account Tab */}
					<TabsContent value="signup" className="mt-4 space-y-4">
						<form action={signupAction} className="space-y-4">
							{signupState?.error && (
								<div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600">
									{signupState.error}
								</div>
							)}

							{signupState?.message && (
								<div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
									{signupState.message}
								</div>
							)}

							<div className="space-y-1.5">
								<label
									htmlFor="signup-fullName"
									className="text-xs font-medium text-zinc-700"
								>
									Full Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
									<Input
										id="signup-fullName"
										name="fullName"
										type="text"
										placeholder="Alex Mercer"
										className="border-zinc-200 pl-9 text-xs focus-visible:ring-zinc-950"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="signup-email"
									className="text-xs font-medium text-zinc-700"
								>
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
									<Input
										id="signup-email"
										name="email"
										type="email"
										required
										placeholder="user@ephnyr.ai"
										className="border-zinc-200 pl-9 text-xs focus-visible:ring-zinc-950"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="signup-password"
									className="text-xs font-medium text-zinc-700"
								>
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
									<Input
										id="signup-password"
										name="password"
										type="password"
										required
										placeholder="••••••••"
										className="border-zinc-200 pl-9 text-xs focus-visible:ring-zinc-950"
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isSignupPending}
								className="w-full bg-zinc-950 font-medium text-white hover:bg-zinc-800"
							>
								{isSignupPending ? "Creating account..." : "Sign Up"}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
