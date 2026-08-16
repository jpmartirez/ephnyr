import { Database, Trash2, Zap } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function LandingFeatures() {
	return (
		<section id="features" className="border-b border-zinc-200/80 bg-white py-24">
			<div className="mx-auto max-w-5xl px-6">
				<div className="mb-16 text-center">
					<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
						Engineering Core
					</h2>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
						Designed for Speed, Isolation, and Clean Teardown.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Card 1 */}
					<Card className="border-zinc-200 bg-zinc-50/50 shadow-none transition-all hover:border-zinc-300 hover:bg-white">
						<CardHeader>
							<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-2xs">
								<Database className="h-5 w-5" />
							</div>
							<CardTitle className="text-lg font-bold text-zinc-950">
								Unified pgvector
							</CardTitle>
							<CardDescription className="text-xs leading-relaxed text-zinc-600">
								Co-locates user metadata, documents, and 384-dimensional vector
								embeddings in a single PostgreSQL database with HNSW cosine
								indexing. No distributed vector DB sync issues.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Card 2 */}
					<Card className="border-zinc-200 bg-zinc-50/50 shadow-none transition-all hover:border-zinc-300 hover:bg-white">
						<CardHeader>
							<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-2xs">
								<Zap className="h-5 w-5" />
							</div>
							<CardTitle className="text-lg font-bold text-zinc-950">
								Groq LPU Inference
							</CardTitle>
							<CardDescription className="text-xs leading-relaxed text-zinc-600">
								Pairs Groq&apos;s Llama 3.3 70B engine with FastEmbed local
								embeddings to deliver streaming Server-Sent Events (SSE)
								responses with sub-500ms time-to-first-token.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Card 3 */}
					<Card className="border-zinc-200 bg-zinc-50/50 shadow-none transition-all hover:border-zinc-300 hover:bg-white">
						<CardHeader>
							<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-2xs">
								<Trash2 className="h-5 w-5 text-zinc-900" />
							</div>
							<CardTitle className="text-lg font-bold text-zinc-950">
								Atomic Teardown
							</CardTitle>
							<CardDescription className="text-xs leading-relaxed text-zinc-600">
								Deleting a room triggers a single PostgreSQL{" "}
								<code className="text-[11px] font-semibold text-zinc-900">
									ON DELETE CASCADE
								</code>{" "}
								transaction that instantly wipes all documents, vector chunks, and
								chat logs.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		</section>
	);
}
