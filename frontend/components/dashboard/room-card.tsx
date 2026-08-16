"use client";

import { useState } from "react";
import {
	Copy,
	Check,
	ExternalLink,
	FileText,
	Globe,
	Lock,
	MoreVertical,
	Trash2,
	MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RoomItem {
	id: string;
	name: string;
	description?: string;
	slug: string;
	is_public: boolean;
	docCount?: number;
	created_at?: string;
}

interface RoomCardProps {
	room: RoomItem;
	onDelete?: (id: string) => void;
	onOpen?: (room: RoomItem) => void;
}

export function RoomCard({ room, onDelete, onOpen }: RoomCardProps) {
	const [copied, setCopied] = useState(false);

	const publicUrl = `http://localhost:3000/share/${room.slug}`;

	const handleCopyShareLink = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(publicUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card
			onClick={() => onOpen?.(room)}
			className="group relative cursor-pointer border-zinc-200 bg-white shadow-2xs transition-all hover:border-zinc-300 hover:shadow-md"
		>
			<CardHeader className="p-5 pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-2xs group-hover:bg-zinc-950 group-hover:text-white transition-colors">
							<MessageSquare className="h-4 w-4" />
						</div>
						<div className="min-w-0">
							<CardTitle className="truncate text-base font-bold text-zinc-950 group-hover:text-zinc-900">
								{room.name}
							</CardTitle>
							<div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
								<span>/share/{room.slug}</span>
							</div>
						</div>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger
							onClick={(e) => e.stopPropagation()}
							className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
						>
							<MoreVertical className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-48 border-zinc-200 bg-white p-1 text-xs shadow-md"
						>
							<DropdownMenuItem
								onClick={handleCopyShareLink}
								className="flex items-center gap-2 px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
							>
								{copied ? (
									<Check className="h-3.5 w-3.5 text-emerald-600" />
								) : (
									<Copy className="h-3.5 w-3.5 text-zinc-500" />
								)}
								{copied ? "Link Copied!" : "Copy Share Link"}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									window.open(publicUrl, "_blank");
								}}
								className="flex items-center gap-2 px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
							>
								<ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
								Preview Share View
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-zinc-100" />
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									onDelete?.(room.id);
								}}
								className="flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Delete Knowledge Pod
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<CardDescription className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
					{room.description || "No description provided."}
				</CardDescription>
			</CardHeader>

			<CardContent className="px-5 py-2">
				<div className="flex items-center gap-4 text-xs text-zinc-500">
					<div className="flex items-center gap-1.5">
						<FileText className="h-3.5 w-3.5 text-zinc-400" />
						<span>{room.docCount ?? 0} Ingested Docs</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-[11px] text-zinc-500">
				<div className="flex items-center gap-1.5">
					{room.is_public ? (
						<Badge
							variant="outline"
							className="border-emerald-200 bg-emerald-50 text-[10px] font-medium text-emerald-700"
						>
							<Globe className="mr-1 h-3 w-3" /> Public Link
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="border-zinc-200 bg-zinc-100 text-[10px] font-medium text-zinc-600"
						>
							<Lock className="mr-1 h-3 w-3" /> Private Pod
						</Badge>
					)}
				</div>

				<span className="text-[10px] font-medium text-zinc-400">
					Created {room.created_at || "Recently"}
				</span>
			</CardFooter>
		</Card>
	);
}
