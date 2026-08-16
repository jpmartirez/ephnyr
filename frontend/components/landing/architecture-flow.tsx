import { Badge } from "@/components/ui/badge";

export function LandingArchitectureFlow() {
	return (
		<section
			id="architecture"
			className="border-b border-zinc-200/80 bg-zinc-50/70 py-24"
		>
			<div className="mx-auto max-w-5xl px-6">
				<div className="mb-16">
					<span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
						System Data Flow
					</span>
					<h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950">
						End-to-End Technical Workflow
					</h2>
					<p className="mt-2 text-sm text-zinc-600">
						From document upload to SSE streaming and zero-trace ephemerality.
					</p>
				</div>

				<div className="space-y-4 text-xs font-medium">
					{/* Step 1 */}
					<div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
								01
							</span>
							<div>
								<div className="font-semibold text-zinc-950">
									Authentication &amp; Session Guard
								</div>
								<div className="font-sans text-xs text-zinc-500">
									Supabase Auth (@supabase/ssr) validates JWT cookies across
									Next.js Server Actions.
								</div>
							</div>
						</div>
						<Badge
							variant="outline"
							className="w-fit border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-700"
						>
							JWT / Cookie RLS
						</Badge>
					</div>

					{/* Step 2 */}
					<div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
								02
							</span>
							<div>
								<div className="font-semibold text-zinc-950">
									Parsing &amp; Semantic Chunking
								</div>
								<div className="font-sans text-xs text-zinc-500">
									FastAPI backend processes PDF, DOCX, TXT into 1000-character
									chunks with 150-char overlap.
								</div>
							</div>
						</div>
						<Badge
							variant="outline"
							className="w-fit border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-700"
						>
							PyPDF / FastEmbed
						</Badge>
					</div>

					{/* Step 3 */}
					<div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
								03
							</span>
							<div>
								<div className="font-semibold text-zinc-950">
									Vector Cosine Similarity RPC
								</div>
								<div className="font-sans text-xs text-zinc-500">
									FastEmbed queries match_document_chunks RPC in Supabase
									pgvector filtering by room_id.
								</div>
							</div>
						</div>
						<Badge
							variant="outline"
							className="w-fit border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-700"
						>
							pgvector (HNSW)
						</Badge>
					</div>

					{/* Step 4 */}
					<div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
								04
							</span>
							<div>
								<div className="font-semibold text-zinc-950">
									Grounded Inference &amp; SSE Stream
								</div>
								<div className="font-sans text-xs text-zinc-500">
									Groq Llama 3.3 generates grounded responses with source
									document citations.
								</div>
							</div>
						</div>
						<Badge
							variant="outline"
							className="w-fit border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-700"
						>
							Groq LPU / LCEL
						</Badge>
					</div>
				</div>
			</div>
		</section>
	);
}
