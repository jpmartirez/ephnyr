"use client";

import { Bot } from "lucide-react";

interface ChatWelcomeStateProps {
	roomName: string;
	onSelectPrompt: (promptText: string) => void;
}

export function ChatWelcomeState({ roomName, onSelectPrompt }: ChatWelcomeStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-md">
				<Bot className="h-7 w-7" />
			</div>
			<h2 className="mt-4 text-xl font-extrabold text-zinc-950 sm:text-2xl">
				Query {roomName}
			</h2>
			<p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-600">
				Ask questions grounded strictly on the ingested documents. Responses are generated with low latency using pgvector similarity lookups.
			</p>

			<div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left max-w-lg w-full">
				<button
					onClick={() => onSelectPrompt("Summarize the key points of the ingested documents.")}
					className="rounded-lg border border-zinc-200 bg-white p-3 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
				>
					💡 Summarize key document insights
				</button>
				<button
					onClick={() => onSelectPrompt("What are the main technical requirements discussed?")}
					className="rounded-lg border border-zinc-200 bg-white p-3 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
				>
					🔍 Explain technical specifications
				</button>
			</div>
		</div>
	);
}
