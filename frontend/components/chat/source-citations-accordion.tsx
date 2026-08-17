"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SourceItem {
	file_name: string;
	content: string;
	similarity: number;
}

interface SourceCitationsAccordionProps {
	sources: SourceItem[];
}

export function SourceCitationsAccordion({ sources }: SourceCitationsAccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!sources || sources.length === 0) return null;

	return (
		<div className="pt-2 border-t border-zinc-100 mt-2">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
			>
				<FileText className="h-3.5 w-3.5 text-zinc-500" />
				<span>Grounded on {sources.length} document chunk{sources.length === 1 ? "" : "s"}</span>
				{isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
			</button>

			{isOpen && (
				<div className="mt-2.5 space-y-2">
					{sources.map((src, sIdx) => (
						<div
							key={sIdx}
							className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-2.5 text-[11px] text-zinc-700 space-y-1"
						>
							<div className="flex items-center justify-between font-bold text-zinc-950">
								<span className="truncate">{src.file_name}</span>
								<Badge
									variant="outline"
									className="border-emerald-300 bg-emerald-50 text-[9px] font-bold text-emerald-700 shrink-0"
								>
									{(src.similarity * 100).toFixed(0)}% match
								</Badge>
							</div>
							<p className="line-clamp-3 text-zinc-600 italic">
								&quot;{src.content}&quot;
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
