export function LandingFooter() {
	return (
		<footer className="border-t border-zinc-200 bg-white py-10">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
				<div className="flex items-center gap-2 text-xs text-zinc-500">
					<span className="font-bold text-zinc-900">EPHNYR AI</span> • Ephemeral
					Knowledge Pods
				</div>
				<div className="flex items-center gap-6 text-xs text-zinc-500 font-medium">
					<span>Next.js 14</span>
					<span>FastAPI + uv</span>
					<span>Supabase pgvector</span>
					<span>Groq LPU</span>
				</div>
			</div>
		</footer>
	);
}
