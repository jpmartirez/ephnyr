"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Lock, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ChatRoomInfo } from "@/actions/chat";

interface ChatHeaderProps {
	room: ChatRoomInfo;
	hasMessages: boolean;
	onClearSession: () => void;
}

export function ChatHeader({ room, hasMessages, onClearSession }: ChatHeaderProps) {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
				<div className="flex items-center gap-3 min-w-0">
					<Link
						href="/dashboard"
						className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
						title="Back to Dashboard"
					>
						<ArrowLeft className="h-4 w-4" />
					</Link>

					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<h1 className="truncate text-base font-bold text-zinc-950">
								{room.name}
							</h1>
							{room.is_public ? (
								<Badge
									variant="outline"
									className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700"
								>
									<Globe className="mr-1 h-3 w-3" /> Public Pod
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-700"
								>
									<Lock className="mr-1 h-3 w-3" /> Owner Access Only
								</Badge>
							)}
						</div>
						<p className="truncate text-[11px] text-zinc-500">
							Sub-500ms Streaming RAG via Groq Llama 3.3 70B
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearSession}
						disabled={!hasMessages}
						className="text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
						title="Clear Conversation"
					>
						<Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear Chat
					</Button>
				</div>
			</header>

			{/* Ephemeral Notice Banner */}
			<div className="flex items-center justify-center gap-2 border-b border-zinc-200/80 bg-zinc-100/70 px-4 py-1.5 text-[11px] font-medium text-zinc-600">
				<Clock className="h-3.5 w-3.5 text-zinc-500" />
				<span>Ephemeral Session: Chat messages are temporary and automatically erased when closing browser tab.</span>
			</div>
		</>
	);
}
