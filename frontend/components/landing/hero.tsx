import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
	onOpenAuthModal?: (tab: "login" | "signup") => void;
}

export function LandingHero({ onOpenAuthModal }: LandingHeroProps) {
	return (
		<section className="relative overflow-hidden border-b border-zinc-200/80 bg-white py-24 md:py-32">
			<div className="mx-auto max-w-5xl px-6 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-medium text-zinc-700">
					<span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
					<span className="text-[11px] font-medium">
						System Status: All Engines Operational
					</span>
				</div>

				<h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
					Ephemeral RAG Workspaces for Technical Teams.
				</h1>

				<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
					Spin up isolated knowledge pods, stream grounded LLM responses with
					sub-500ms latency via Groq, and purge document vector embeddings with
					zero-trace atomic cascading teardowns.
				</p>

				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button
						size="lg"
						onClick={() => onOpenAuthModal?.("signup")}
						className="h-12 w-full bg-zinc-950 px-7 text-base font-medium text-white shadow-md hover:bg-zinc-800 sm:w-auto"
					>
						Create Knowledge Pod
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
					<a href="#specs" className="w-full sm:w-auto">
						<Button
							size="lg"
							variant="outline"
							className="h-12 w-full border-zinc-300 bg-white px-7 text-base font-medium text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 sm:w-auto"
						>
							View Technical Spec
						</Button>
					</a>
				</div>

				{/* Metric Highlights */}
				<div className="mt-16 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-10 sm:grid-cols-4">
					<div className="flex flex-col items-center">
						<span className="text-2xl font-bold tracking-tight text-zinc-950">
							&lt; 500ms
						</span>
						<span className="mt-1 text-xs text-zinc-500">
							Groq TTFT Latency
						</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-2xl font-bold tracking-tight text-zinc-950">
							384-Dim
						</span>
						<span className="mt-1 text-xs text-zinc-500">
							pgvector Cosine Index
						</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-2xl font-bold tracking-tight text-zinc-950">
							O(1) SQL
						</span>
						<span className="mt-1 text-xs text-zinc-500">
							Atomic Cascade Delete
						</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-2xl font-bold tracking-tight text-zinc-950">
							100% Free
						</span>
						<span className="mt-1 text-xs text-zinc-500">
							Open-Source &amp; Cloud Tier
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
