import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function PricingCards() {
	return (
		<div className="mx-auto max-w-5xl space-y-10">
			{/* Page Header */}
			<div className="text-center">
				<Badge
					variant="outline"
					className="border-zinc-300 bg-zinc-100 text-xs font-semibold text-zinc-700"
				>
					FLEXIBLE INFRASTRUCTURE
				</Badge>
				<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
					Simple, Transparent Quota Plans.
				</h2>
				<p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
					Ephnyr is designed to be 100% free tier open-source for developers, researchers, and technical teams.
				</p>
			</div>

			{/* Pricing Grid */}
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* Free Tier Card */}
				<Card className="flex flex-col border-2 border-zinc-950 bg-white shadow-md">
					<CardHeader className="p-6 pb-4">
						<div className="mb-3 flex items-center justify-between">
							<Badge className="bg-zinc-950 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
								CURRENT ACTIVE PLAN
							</Badge>
							<div className="text-2xl font-extrabold text-zinc-950">
								$0 <span className="text-xs font-normal text-zinc-500">/ month</span>
							</div>
						</div>
						<CardTitle className="text-xl font-bold text-zinc-950">
							Developer Free Tier
						</CardTitle>
						<CardDescription className="text-xs text-zinc-600">
							Everything you need to run high-speed RAG queries on Supabase pgvector.
						</CardDescription>
					</CardHeader>

					<CardContent className="flex-1 space-y-3 px-6 pt-2 text-xs">
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span><strong>3 Active Knowledge Pods (Rooms)</strong></span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span><strong>10 MB</strong> Max Single File Upload Size</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span><strong>30 MB</strong> Total Room Document Storage</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span>Sub-500ms Streaming RAG via <strong>Groq LPU Engine</strong></span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span>Public Shareable URL Slug (<strong>/share/[slug]</strong>)</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-800">
							<Check className="h-4 w-4 text-emerald-600 shrink-0" />
							<span>Atomic Zero-Trace PostgreSQL Cascade Teardown</span>
						</div>
					</CardContent>

					<CardFooter className="border-t border-zinc-100 p-6 pt-4">
						<Button
							disabled
							className="w-full bg-zinc-100 font-semibold text-zinc-700 cursor-default"
						>
							Your Active Plan
						</Button>
					</CardFooter>
				</Card>

				{/* Pro Tier Card */}
				<Card className="flex flex-col border border-zinc-200 bg-zinc-50/60 shadow-none">
					<CardHeader className="p-6 pb-4">
						<div className="mb-3 flex items-center justify-between">
							<Badge
								variant="outline"
								className="border-amber-300 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 uppercase tracking-wider"
							>
								COMING SOON
							</Badge>
							<div className="text-2xl font-extrabold text-zinc-950">
								$19 <span className="text-xs font-normal text-zinc-500">/ month</span>
							</div>
						</div>
						<CardTitle className="text-xl font-bold text-zinc-950">
							Pro Team Tier
						</CardTitle>
						<CardDescription className="text-xs text-zinc-600">
							Designed for heavy engineering teams &amp; enterprise knowledge bases.
						</CardDescription>
					</CardHeader>

					<CardContent className="flex-1 space-y-3 px-6 pt-2 text-xs">
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span><strong>Unlimited Active Knowledge Pods</strong></span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span><strong>50 MB</strong> Single File Upload Limit</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span><strong>500 MB</strong> Room Storage Limit</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span>Priority Groq LPU LLM Inference Queue</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span>Custom Domain &amp; Password-Protected Pods</span>
						</div>
						<div className="flex items-center gap-2.5 text-zinc-700">
							<Check className="h-4 w-4 text-zinc-400 shrink-0" />
							<span>Dedicated Support &amp; SLA Guarantee</span>
						</div>
					</CardContent>

					<CardFooter className="border-t border-zinc-200/80 p-6 pt-4">
						<Button
							variant="outline"
							disabled
							className="w-full border-zinc-300 bg-white font-medium text-zinc-500 cursor-not-allowed"
						>
							Available in v2.0
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
