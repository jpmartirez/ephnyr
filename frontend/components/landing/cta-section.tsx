import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCtaSection() {
	return (
		<section id="ephemerality" className="bg-zinc-950 py-20 text-white">
			<div className="mx-auto max-w-4xl px-6 text-center">
				<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
					Ready to spin up your ephemeral knowledge pod?
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
					Create isolated RAG rooms, upload documents, query with sub-500ms
					latency, and purge everything when finished.
				</p>
				<div className="mt-8">
					<Link href="/dashboard">
						<Button
							size="lg"
							className="h-12 bg-white px-8 font-semibold text-zinc-950 hover:bg-zinc-200"
						>
							Launch Dashboard Now
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
