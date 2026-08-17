"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ChatPrivateScreen() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans selection:bg-zinc-900 selection:text-white">
			<Card className="w-full max-w-md border-zinc-200 bg-white p-6 shadow-md text-center">
				<CardHeader className="p-0 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
						<Lock className="h-6 w-6" />
					</div>
					<Badge
						variant="outline"
						className="mx-auto mt-4 border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 uppercase"
					>
						PRIVATE POD ACCESS RESTRICTED
					</Badge>
					<CardTitle className="mt-3 text-xl font-bold text-zinc-950">
						Private Knowledge Pod
					</CardTitle>
					<CardDescription className="mt-2 text-xs leading-relaxed text-zinc-600">
						This Knowledge Pod is private. Only the pod owner can interact with this chatbot interface.
					</CardDescription>
				</CardHeader>

				<CardFooter className="mt-6 flex flex-col gap-3 p-0 pt-2">
					<Button
						onClick={() => router.push("/?auth=login")}
						className="w-full bg-zinc-950 text-xs font-semibold text-white hover:bg-zinc-800"
					>
						Sign In to Verify Ownership
					</Button>
					<Link
						href="/dashboard"
						className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
					>
						Return to Dashboard
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
