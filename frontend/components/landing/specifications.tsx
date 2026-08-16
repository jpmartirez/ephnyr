import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function LandingSpecifications() {
	return (
		<section id="specs" className="border-b border-zinc-200/80 bg-white py-24">
			<div className="mx-auto max-w-5xl px-6">
				<div className="mb-16">
					<span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
						Engineering Specification
					</span>
					<h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950">
						Free Tier Architecture &amp; System Quotas
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Card className="border-zinc-200 bg-zinc-50/40 shadow-none">
						<CardHeader>
							<CardTitle className="text-base font-bold text-zinc-950">
								Resource Quota Limits
							</CardTitle>
							<CardDescription className="text-xs text-zinc-500">
								Enforced strictly via Supabase RLS and Next.js Server Actions.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 text-xs">
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Max Active Rooms</span>
								<span className="font-bold text-zinc-950">3 Rooms / User</span>
							</div>
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Single File Max Size</span>
								<span className="font-bold text-zinc-950">10 MB / File</span>
							</div>
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Total Room Storage</span>
								<span className="font-bold text-zinc-950">30 MB / Room</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-zinc-600">Embedding Dimensions</span>
								<span className="font-bold text-zinc-950">
									384 (BAAI/bge-small)
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-zinc-200 bg-zinc-50/40 shadow-none">
						<CardHeader>
							<CardTitle className="text-base font-bold text-zinc-950">
								Security &amp; Shareability
							</CardTitle>
							<CardDescription className="text-xs text-zinc-500">
								Public share links and isolation parameters.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 text-xs">
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Public Share URL</span>
								<span className="font-bold text-zinc-950">/share/[slug]</span>
							</div>
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Guest Authentication</span>
								<span className="font-bold text-zinc-950">Not Required</span>
							</div>
							<div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
								<span className="text-zinc-600">Grounding Policy</span>
								<span className="font-bold text-zinc-950">
									Strict Context Only
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-zinc-600">Cascade Cleanup</span>
								<span className="font-bold text-zinc-950">
									Zero-Trace Purge
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
