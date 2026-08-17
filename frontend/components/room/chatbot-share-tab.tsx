"use client";

import { Bot, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ChatbotShareTabProps {
	shareUrl: string;
	copiedLink: boolean;
	onCopyLink: () => void;
}

export function ChatbotShareTab({
	shareUrl,
	copiedLink,
	onCopyLink,
}: ChatbotShareTabProps) {
	return (
		<Card className="border-zinc-200 bg-white shadow-2xs">
			<CardHeader className="p-4 sm:p-6 pb-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white shrink-0">
						<Bot className="h-4 w-4" />
					</div>
					<div>
						<CardTitle className="text-base font-bold text-zinc-950">
							Public Chatbot Share Link
						</CardTitle>
						<CardDescription className="text-xs text-zinc-500">
							Shareable link for users to query documents stored in this pod.
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4 sm:p-6 pt-0 space-y-6">
				<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
					<label className="text-xs font-medium text-zinc-700">
						Shareable Chatbot URL
					</label>
					<div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
						<Input
							readOnly
							value={shareUrl}
							className="border-zinc-300 bg-white text-xs font-mono w-full"
						/>
						<div className="flex items-center gap-2 w-full sm:w-auto">
							<Button
								onClick={onCopyLink}
								className="flex-1 sm:flex-none bg-zinc-950 text-xs font-medium text-white hover:bg-zinc-800 shrink-0"
							>
								{copiedLink ? (
									<>
										<Check className="mr-1.5 h-4 w-4 text-emerald-400" /> Copied!
									</>
								) : (
									<>
										<Copy className="mr-1.5 h-4 w-4" /> Copy Link
									</>
								)}
							</Button>
							<Button
								variant="outline"
								onClick={() => window.open(shareUrl, "_blank")}
								className="border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 shrink-0"
							>
								<ExternalLink className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				<div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 sm:p-4 text-xs text-emerald-900">
					<Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
					<div className="space-y-1">
						<div className="font-bold text-emerald-950">
							Interactive Streaming RAG Chatbot Activated
						</div>
						<p className="leading-relaxed text-emerald-800">
							This public chatbot link is active! Anyone visiting this link can query the document chunks stored in this pod using sub-500ms Groq Llama 3.3 70B vector lookups.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
