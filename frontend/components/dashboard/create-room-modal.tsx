"use client";

import { useState } from "react";
import { ArrowRight, Globe, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateRoomModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmitPreview?: (name: string, description: string) => void;
}

export function CreateRoomModal({
	open,
	onOpenChange,
	onSubmitPreview,
}: CreateRoomModalProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [systemPrompt, setSystemPrompt] = useState(
		"You are an AI assistant strictly grounded on the provided context."
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmitPreview?.(name, description);
		setName("");
		setDescription("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg border-zinc-200 bg-white p-6 shadow-lg sm:max-w-lg">
				<DialogHeader>
					<div className="flex items-center gap-2 text-base font-bold text-zinc-950">
						<div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
							E
						</div>
						Create Knowledge Pod
					</div>
					<DialogTitle className="mt-1 text-lg font-bold text-zinc-950">
						New RAG Room Setup
					</DialogTitle>
					<DialogDescription className="text-xs text-zinc-500">
						Create an isolated pod to ingest PDFs, Markdown, or Word documents and query via Groq.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="room-name" className="text-xs font-medium text-zinc-700">
							Knowledge Pod Name <span className="text-red-500">*</span>
						</label>
						<Input
							id="room-name"
							type="text"
							required
							placeholder="e.g. Llama 3.3 Architecture Notes"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border-zinc-200 text-xs focus-visible:ring-zinc-950"
						/>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="room-desc" className="text-xs font-medium text-zinc-700">
							Description <span className="text-zinc-400">(Optional)</span>
						</label>
						<Input
							id="room-desc"
							type="text"
							placeholder="Brief overview of the documents stored in this room..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="border-zinc-200 text-xs focus-visible:ring-zinc-950"
						/>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="system-prompt" className="text-xs font-medium text-zinc-700">
							System Grounding Prompt
						</label>
						<Input
							id="system-prompt"
							type="text"
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
							className="border-zinc-200 text-xs focus-visible:ring-zinc-950"
						/>
						<p className="text-[10px] text-zinc-400">
							Directs LLM response behavior during similarity RAG queries.
						</p>
					</div>

					<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{isPublic ? (
									<Globe className="h-4 w-4 text-emerald-600" />
								) : (
									<Lock className="h-4 w-4 text-zinc-600" />
								)}
								<div>
									<div className="text-xs font-semibold text-zinc-900">
										{isPublic ? "Public Share URL Enabled" : "Private Pod Only"}
									</div>
									<div className="text-[10px] text-zinc-500">
										{isPublic
											? "Anyone with the share link /share/[slug] can query this pod."
											: "Only you can access this knowledge pod when logged in."}
									</div>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsPublic(!isPublic)}
								className="border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100"
							>
								Toggle
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onOpenChange(false)}
							className="text-xs font-medium text-zinc-600 hover:bg-zinc-100"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							className="bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
						>
							Create Pod <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
