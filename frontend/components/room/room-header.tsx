"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Lock, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RoomData } from "@/actions/rooms";

interface RoomHeaderProps {
	room: RoomData;
	copiedLink: boolean;
	onRefresh: () => void;
	onCopyShareUrl: () => void;
}

export function RoomHeader({
	room,
	copiedLink,
	onRefresh,
	onCopyShareUrl,
}: RoomHeaderProps) {
	return (
		<header className="border-b border-zinc-200/80 bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-5">
			<div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1 min-w-0">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
					>
						<ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Pods
					</Link>
					<div className="flex flex-wrap items-center gap-2 sm:gap-3">
						<h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 truncate max-w-full">
							{room.name}
						</h1>
						{room.is_public ? (
							<Badge
								variant="outline"
								className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700 shrink-0"
							>
								<Globe className="mr-1 h-3 w-3" /> Public Link Active
							</Badge>
						) : (
							<Badge
								variant="outline"
								className="border-zinc-200 bg-zinc-100 text-[10px] font-semibold text-zinc-600 shrink-0"
							>
								<Lock className="mr-1 h-3 w-3" /> Private Pod
							</Badge>
						)}
					</div>
					<p className="text-xs text-zinc-500 line-clamp-2 sm:line-clamp-1">
						{room.description || "No description set for this knowledge pod."}
					</p>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
					<Button
						variant="outline"
						size="sm"
						onClick={onRefresh}
						className="flex-1 sm:flex-none border-zinc-300 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100"
					>
						<RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
					</Button>
					<Button
						size="sm"
						onClick={onCopyShareUrl}
						className="flex-1 sm:flex-none bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
					>
						{copiedLink ? (
							<Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
						) : (
							<Copy className="mr-1.5 h-3.5 w-3.5" />
						)}
						{copiedLink ? "Copied Link!" : "Copy Share Link"}
					</Button>
				</div>
			</div>
		</header>
	);
}
