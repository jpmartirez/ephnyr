"use client";

import { Globe, Lock, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface RoomSettingsTabProps {
	name: string;
	description: string;
	isPublic: boolean;
	systemPrompt: string;
	isSaving: boolean;
	setName: (val: string) => void;
	setDescription: (val: string) => void;
	setIsPublic: (val: boolean) => void;
	setSystemPrompt: (val: string) => void;
	onSave: (e: React.FormEvent) => void;
}

export function RoomSettingsTab({
	name,
	description,
	isPublic,
	systemPrompt,
	isSaving,
	setName,
	setDescription,
	setIsPublic,
	setSystemPrompt,
	onSave,
}: RoomSettingsTabProps) {
	return (
		<Card className="border-zinc-200 bg-white shadow-2xs">
			<CardHeader className="p-4 sm:p-6 pb-4">
				<CardTitle className="text-base font-bold text-zinc-950">
					Knowledge Pod Settings
				</CardTitle>
				<CardDescription className="text-xs text-zinc-500">
					Update metadata, visibility, and system grounding directives for this pod.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-4 sm:p-6 pt-0">
				<form onSubmit={onSave} className="space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="edit-name" className="text-xs font-medium text-zinc-700">
							Knowledge Pod Name <span className="text-red-500">*</span>
						</label>
						<Input
							id="edit-name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border-zinc-200 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="edit-desc" className="text-xs font-medium text-zinc-700">
							Description
						</label>
						<Input
							id="edit-desc"
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="border-zinc-200 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="edit-prompt" className="text-xs font-medium text-zinc-700">
							System Grounding Prompt
						</label>
						<textarea
							id="edit-prompt"
							rows={3}
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
							className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
						/>
						<p className="text-[10px] text-zinc-400">
							Defines how LLM responses are formatted and constrained during queries.
						</p>
					</div>

					<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								{isPublic ? (
									<Globe className="h-5 w-5 text-emerald-600 shrink-0" />
								) : (
									<Lock className="h-5 w-5 text-zinc-600 shrink-0" />
								)}
								<div>
									<div className="text-xs font-semibold text-zinc-900">
										{isPublic ? "Public Share URL Active" : "Private Pod"}
									</div>
									<div className="text-[11px] text-zinc-500">
										{isPublic
											? "Anyone with the share link can view and query this pod."
											: "Only you can query this pod when logged in."}
									</div>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsPublic(!isPublic)}
								className="w-full sm:w-auto border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100"
							>
								Toggle Status
							</Button>
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							disabled={isSaving}
							className="w-full sm:w-auto bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
						>
							{isSaving ? (
								<>
									<RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...
								</>
							) : (
								<>
									<Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
