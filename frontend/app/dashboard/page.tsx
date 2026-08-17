/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, FolderPlus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
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
import { getUserRooms, createRoom, deleteRoom } from "@/actions/rooms";

export default function DashboardPage() {
	const { toggleMobileSidebar } = useDashboard();
	const [rooms, setRooms] = useState<RoomItem[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchRooms = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getUserRooms();
			if (res.success) {
				const mapped: RoomItem[] = (res.rooms || []).map((r) => ({
					id: r.id,
					name: r.name,
					description: r.description || "",
					slug: r.slug,
					is_public: r.is_public ?? true,
					docCount: r.docCount || 0,
					created_at: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recently",
				}));
				setRooms(mapped);
			} else if (res.error) {
				toast.error(res.error);
			}
		} catch (e: any) {
			console.error("Failed to load rooms:", e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRooms();
	}, [fetchRooms]);

	const handleCreateRoom = async (name: string, description: string) => {
		toast.loading("Creating Knowledge Pod...", { id: "create-room" });
		const result = await createRoom({ name, description });

		if (!result.success) {
			toast.error(result.error || "Failed to create room.", { id: "create-room" });
			return;
		}

		toast.success("Knowledge Pod created successfully!", { id: "create-room" });
		await fetchRooms();
	};

	const handleDeleteRoom = async (id: string) => {
		toast.loading("Purging Knowledge Pod...", { id: "delete-room" });
		const result = await deleteRoom(id);

		if (!result.success) {
			toast.error(result.error || "Failed to delete room.", { id: "delete-room" });
			return;
		}

		toast.success("Knowledge Pod purged successfully!", { id: "delete-room" });
		await fetchRooms();
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

					<div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-500 font-medium">
						<span>Showing {filteredRooms.length} of {rooms.length} Pods</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={fetchRooms}
							disabled={isLoading}
							className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
							title="Refresh Rooms"
						>
							<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
						</Button>
					</div>
				</div>

				{/* Room Cards Grid or Empty State */}
				{isLoading ? (
					/* Loading Skeleton State */
					<div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
						{[1, 2].map((i) => (
							<div
								key={i}
								className="h-44 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100/60"
							/>
						))}
					</div>
				) : filteredRooms.length > 0 ? (
					/* Active Rooms Grid */
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
					/* Empty State - No fetches if 0 rooms */
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
