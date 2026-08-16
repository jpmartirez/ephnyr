"use client";

import { useState } from "react";
import { Plus, Search, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DashboardHeader,
	QuotaBanner,
	RoomCard,
	CreateRoomModal,
	useDashboard,
	type RoomItem,
} from "@/components/dashboard";

const INITIAL_ROOMS: RoomItem[] = [
	{
		id: "room-1",
		name: "Quantum RAG Research",
		description:
			"Benchmarking vector cosine lookups using pgvector HNSW index against Llama 3.3 70B.",
		slug: "quantum-rag-research",
		is_public: true,
		docCount: 3,
		created_at: "Today at 2:15 PM",
	},
];

export default function DashboardPage() {
	const { toggleMobileSidebar } = useDashboard();
	const [rooms, setRooms] = useState<RoomItem[]>(INITIAL_ROOMS);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleCreateRoom = (name: string, description: string) => {
		const newRoom: RoomItem = {
			id: `room-${Date.now()}`,
			name,
			description,
			slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") + "-pod",
			is_public: true,
			docCount: 0,
			created_at: "Just now",
		};
		setRooms([newRoom, ...rooms]);
	};

	const handleDeleteRoom = (id: string) => {
		setRooms(rooms.filter((r) => r.id !== id));
	};

	const filteredRooms = rooms.filter(
		(r) =>
			r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	return (
		<div className="flex flex-1 flex-col pb-16">
			{/* Top Header Bar */}
			<DashboardHeader
				title="Knowledge Pods"
				description="Manage your isolated RAG rooms, document stores, and public share links."
				onOpenCreateModal={() => setIsCreateModalOpen(true)}
				onToggleMobileSidebar={toggleMobileSidebar}
			/>

			{/* Main Container */}
			<main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
				{/* Quota Indicator Banner */}
				<QuotaBanner activeRooms={rooms.length} maxRooms={3} />

				{/* Search & Filter Toolbar */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative w-full sm:max-w-sm">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
						<Input
							type="text"
							placeholder="Search rooms by title or description..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border-zinc-200 bg-white pl-9 text-xs"
						/>
					</div>

					<div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-zinc-500 font-medium">
						<span>Showing {filteredRooms.length} of {rooms.length} Pods</span>
					</div>
				</div>

				{/* Room Cards Grid */}
				{filteredRooms.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredRooms.map((room) => (
							<RoomCard
								key={room.id}
								room={room}
								onDelete={handleDeleteRoom}
								onOpen={(r) => console.log("Open room:", r.name)}
							/>
						))}
					</div>
				) : (
					/* Empty State */
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-8 sm:p-12 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
							<FolderPlus className="h-6 w-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-zinc-950">
							No Knowledge Pods Found
						</h3>
						<p className="mt-1 max-w-sm text-xs text-zinc-500">
							{searchQuery
								? `No rooms matched your query "${searchQuery}".`
								: "Create your first RAG room to start ingesting PDFs, TXT, or Markdown documents."}
						</p>
						{!searchQuery && (
							<Button
								onClick={() => setIsCreateModalOpen(true)}
								size="sm"
								className="mt-6 bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
							>
								<Plus className="mr-1.5 h-3.5 w-3.5" />
								Create First Pod
							</Button>
						)}
					</div>
				)}
			</main>

			{/* Create Room Modal Dialog */}
			<CreateRoomModal
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				onSubmitPreview={handleCreateRoom}
			/>
		</div>
	);
}
