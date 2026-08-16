import { FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingProductMockup() {
	return (
		<section className="border-b border-zinc-200/80 bg-zinc-50/50 py-16">
			<div className="mx-auto max-w-5xl px-6">
				<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
					{/* Wireframe Top Header */}
					<div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/70 px-4 py-3">
						<div className="flex items-center gap-2">
							<div className="h-3 w-3 rounded-full bg-zinc-300"></div>
							<div className="h-3 w-3 rounded-full bg-zinc-300"></div>
							<div className="h-3 w-3 rounded-full bg-zinc-300"></div>
							<span className="ml-2 text-xs font-medium text-zinc-500">
								ephnyr-pod // quantum-rag-research
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="border-emerald-200 bg-emerald-50 text-[10px] font-medium text-emerald-700"
							>
								● PUBLIC LINK ACTIVE
							</Badge>
							<Badge
								variant="outline"
								className="border-zinc-300 bg-white text-[10px] font-medium text-zinc-600"
							>
								2 / 3 ROOMS
							</Badge>
						</div>
					</div>

					{/* Wireframe Main Content Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3">
						{/* Left Sidebar: Document Ingestion */}
						<div className="border-r border-zinc-200 bg-zinc-50/40 p-4">
							<div className="flex items-center justify-between pb-3">
								<span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
									Ingested Docs
								</span>
								<span className="text-xs text-zinc-400">
									3 Files (14.2 MB)
								</span>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between min-w-0 rounded-md border border-zinc-200 bg-white p-2.5 shadow-2xs">
									<div className="flex items-center gap-2 min-w-0">
										<FileText className="h-4 w-4 shrink-0 text-zinc-500" />
										<span className="truncate text-xs text-zinc-800">
											llama_3_3_architecture.pdf
										</span>
									</div>
									<Badge
										variant="secondary"
										className="bg-zinc-100 text-[9px] font-medium text-zinc-600"
									>
										READY
									</Badge>
								</div>
								<div className="flex items-center justify-between min-w-0 rounded-md border border-zinc-200 bg-white p-2.5 shadow-2xs">
									<div className="flex items-center gap-2 min-w-0">
										<FileText className="h-4 w-4 shrink-0 text-zinc-500" />
										<span className="truncate text-xs text-zinc-800">
											vector_benchmarks.md
										</span>
									</div>
									<Badge
										variant="secondary"
										className="bg-zinc-100 text-[9px] font-medium text-zinc-600"
									>
										READY
									</Badge>
								</div>
								<div className="flex items-center justify-between min-w-0 rounded-md border border-zinc-200 bg-white p-2.5 shadow-2xs">
									<div className="flex items-center gap-2 min-w-0">
										<FileText className="h-4 w-4 shrink-0 text-zinc-500" />
										<span className="truncate text-xs text-zinc-800">
											system_prompts.docx
										</span>
									</div>
									<Badge
										variant="secondary"
										className="bg-zinc-100 text-[9px] font-medium text-zinc-600"
									>
										READY
									</Badge>
								</div>
							</div>

							<div className="mt-6 rounded-md border border-dashed border-zinc-300 p-3 text-center">
								<span className="text-[11px] text-zinc-500">
									Drag &amp; Drop PDF / MD / DOCX
								</span>
							</div>
						</div>

						{/* Right Main Chat Panel */}
						<div className="col-span-2 flex flex-col p-5">
							{/* Chat Message Bubble User */}
							<div className="mb-4 flex justify-end">
								<div className="max-w-md rounded-lg bg-zinc-900 px-4 py-2.5 text-xs text-white">
									What is the measured TTFT latency when performing vector
									similarity retrieval in pgvector?
								</div>
							</div>

							{/* Chat Message Bubble Assistant */}
							<div className="mb-6 flex justify-start">
								<div className="max-w-lg rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800">
									<div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-zinc-500">
										<Sparkles className="h-3 w-3 text-zinc-700" />
										<span>EPHNYR AI • GROQ LLAMA 3.3 70B</span>
									</div>
									Based on{" "}
									<code className="rounded bg-zinc-200 px-1 py-0.5 text-[10px]">
										vector_benchmarks.md
									</code>{" "}
									(Page 3), cosine similarity lookups using the HNSW index on
									Supabase pgvector return top-5 chunks in <strong>112ms</strong>
									, yielding an overall end-to-end TTFT under{" "}
									<strong>460ms</strong>.
									<div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-200/80 pt-2.5">
										<span className="text-[10px] text-zinc-400">
											Sources:
										</span>
										<span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] text-zinc-600">
											📄 vector_benchmarks.md (p. 3)
										</span>
										<span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] text-zinc-600">
											📄 llama_3_3_architecture.pdf (p. 14)
										</span>
									</div>
								</div>
							</div>

							{/* Mock Input Line */}
							<div className="mt-auto flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
								<input
									type="text"
									disabled
									placeholder="Ask a question about your knowledge pod..."
									className="w-full bg-transparent text-xs text-zinc-400 outline-hidden"
								/>
								<Button
									size="sm"
									className="h-7 bg-zinc-950 px-3 text-[11px] text-white"
								>
									Send
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
