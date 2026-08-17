/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileText, Settings, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getRoomById, updateRoom, type RoomData } from "@/actions/rooms";
import {
	getRoomDocuments,
	uploadDocument,
	deleteDocument,
	type DocumentItem,
} from "@/actions/documents";

import { RoomHeader } from "@/components/room/room-header";
import { StorageQuotaBar } from "@/components/room/storage-quota-bar";
import { DocumentUploadZone } from "@/components/room/document-upload-zone";
import { DocumentList } from "@/components/room/document-list";
import { RoomSettingsTab } from "@/components/room/room-settings-tab";
import { ChatbotShareTab } from "@/components/room/chatbot-share-tab";

export default function RoomDetailPage() {
	const params = useParams();
	const router = useRouter();
	const roomId = params.id as string;

	const [room, setRoom] = useState<RoomData | null>(null);
	const [documents, setDocuments] = useState<DocumentItem[]>([]);
	const [totalSizeBytes, setTotalSizeBytes] = useState<number>(0);

	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [isSavingSettings, setIsSavingSettings] = useState(false);
	const [copiedLink, setCopiedLink] = useState(false);

	// Settings Form State
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [systemPrompt, setSystemPrompt] = useState("");

	// Fetch Room Data & Documents
	const loadRoomData = useCallback(async () => {
		if (!roomId) return;
		setIsLoading(true);
		try {
			const [roomRes, docRes] = await Promise.all([
				getRoomById(roomId),
				getRoomDocuments(roomId),
			]);

			if (roomRes.success && roomRes.room) {
				setRoom(roomRes.room);
				setName(roomRes.room.name);
				setDescription(roomRes.room.description || "");
				setIsPublic(roomRes.room.is_public ?? true);
				setSystemPrompt(
					roomRes.room.system_prompt ||
						"You are an AI assistant strictly grounded on the provided context."
				);
			} else {
				toast.error(roomRes.error || "Knowledge Pod not found.");
				router.push("/dashboard");
				return;
			}

			if (docRes.success) {
				setDocuments(docRes.documents || []);
				setTotalSizeBytes(docRes.total_size_bytes || 0);
			}
		} catch (e: any) {
			console.error("Failed to load room data:", e);
			toast.error("Failed to load room details.");
		} finally {
			setIsLoading(false);
		}
	}, [roomId, router]);

	useEffect(() => {
		loadRoomData();
	}, [loadRoomData]);

	// Auto-poll room documents every 3s while any document is PROCESSING
	useEffect(() => {
		const hasProcessing = documents.some((d) => d.status === "PROCESSING");
		if (!hasProcessing) return;

		const interval = setInterval(() => {
			getRoomDocuments(roomId).then((res) => {
				if (res.success) {
					setDocuments(res.documents || []);
					setTotalSizeBytes(res.total_size_bytes || 0);
				}
			});
		}, 3000);

		return () => clearInterval(interval);
	}, [documents, roomId]);

	// Handle File Selection and Ingestion Upload
	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		// Validate Max 5MB per file client-side
		if (file.size > 5 * 1024 * 1024) {
			toast.error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit.`);
			return;
		}

		setIsUploading(true);
		toast.loading(`Uploading & Ingesting ${file.name}...`, { id: "doc-upload" });

		const formData = new FormData();
		formData.append("file", file);

		const result = await uploadDocument(roomId, formData);

		if (!result.success) {
			toast.error(result.error || "Failed to upload document.", { id: "doc-upload" });
			setIsUploading(false);
			e.target.value = "";
			return;
		}

		toast.success(`Ingested ${file.name} successfully!`, { id: "doc-upload" });
		setIsUploading(false);
		e.target.value = "";
		await loadRoomData();
	};

	// Handle Document Purge
	const handleDeleteDoc = async (docId: string, fileName: string) => {
		toast.loading(`Purging ${fileName}...`, { id: "doc-delete" });
		const res = await deleteDocument(docId, roomId);

		if (!res.success) {
			toast.error(res.error || "Failed to delete document.", { id: "doc-delete" });
			return;
		}

		toast.success(`Purged ${fileName} successfully!`, { id: "doc-delete" });
		await loadRoomData();
	};

	// Handle Settings Update
	const handleSaveSettings = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Knowledge Pod name is required.");
			return;
		}

		setIsSavingSettings(true);
		toast.loading("Saving Pod Configuration...", { id: "room-update" });

		const res = await updateRoom(roomId, {
			name: name.trim(),
			description: description.trim(),
			is_public: isPublic,
			system_prompt: systemPrompt.trim(),
		});

		if (!res.success) {
			toast.error(res.error || "Failed to update room settings.", { id: "room-update" });
			setIsSavingSettings(false);
			return;
		}

		toast.success("Pod settings updated successfully!", { id: "room-update" });
		setIsSavingSettings(false);
		await loadRoomData();
	};

	// Copy Public Chatbot Share Link
	const shareUrl = typeof window !== "undefined" && room?.slug ? `${window.location.origin}/share/${room.slug}` : `/share/${room?.slug || ""}`;

	const handleCopyShareUrl = () => {
		if (!room?.slug) return;
		navigator.clipboard.writeText(shareUrl);
		setCopiedLink(true);
		toast.success("Public shareable link copied to clipboard!");
		setTimeout(() => setCopiedLink(false), 2000);
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col p-6 sm:p-8">
				<div className="mx-auto w-full max-w-5xl space-y-6">
					<div className="h-8 w-48 animate-pulse rounded-md bg-zinc-200" />
					<div className="h-24 w-full animate-pulse rounded-xl bg-zinc-100" />
					<div className="h-64 w-full animate-pulse rounded-xl bg-zinc-100" />
				</div>
			</div>
		);
	}

	if (!room) return null;

	return (
		<div className="flex flex-1 flex-col pb-16">
			{/* Top Room Header */}
			<RoomHeader
				room={room}
				copiedLink={copiedLink}
				onRefresh={loadRoomData}
				onCopyShareUrl={handleCopyShareUrl}
			/>

			{/* Main Workspace Container */}
			<main className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6">
				{/* Storage Capacity Bar */}
				<StorageQuotaBar totalSizeBytes={totalSizeBytes} />

				{/* Workspace Main Tabs */}
				<Tabs defaultValue="documents" className="w-full">
					<TabsList className="grid w-full grid-cols-3 sm:max-w-md bg-zinc-100 p-1">
						<TabsTrigger value="documents" className="text-[11px] sm:text-xs font-medium px-1 sm:px-3">
							<FileText className="mr-1 sm:mr-1.5 h-3.5 w-3.5 shrink-0" /> <span className="truncate">Docs ({documents.length})</span>
						</TabsTrigger>
						<TabsTrigger value="settings" className="text-[11px] sm:text-xs font-medium px-1 sm:px-3">
							<Settings className="mr-1 sm:mr-1.5 h-3.5 w-3.5 shrink-0" /> <span className="truncate">Settings</span>
						</TabsTrigger>
						<TabsTrigger value="share" className="text-[11px] sm:text-xs font-medium px-1 sm:px-3">
							<Share2 className="mr-1 sm:mr-1.5 h-3.5 w-3.5 shrink-0" /> <span className="truncate">Share</span>
						</TabsTrigger>
					</TabsList>

					{/* TAB 1: DOCUMENT MANAGEMENT */}
					<TabsContent value="documents" className="mt-6 space-y-6">
						<DocumentUploadZone
							isUploading={isUploading}
							onFileUpload={handleFileUpload}
						/>

						<DocumentList
							documents={documents}
							onDeleteDoc={handleDeleteDoc}
						/>
					</TabsContent>

					{/* TAB 2: ROOM SETTINGS */}
					<TabsContent value="settings" className="mt-6">
						<RoomSettingsTab
							name={name}
							description={description}
							isPublic={isPublic}
							systemPrompt={systemPrompt}
							isSaving={isSavingSettings}
							setName={setName}
							setDescription={setDescription}
							setIsPublic={setIsPublic}
							setSystemPrompt={setSystemPrompt}
							onSave={handleSaveSettings}
						/>
					</TabsContent>

					{/* TAB 3: CHATBOT SHARE LINK WIDGET */}
					<TabsContent value="share" className="mt-6">
						<ChatbotShareTab
							shareUrl={shareUrl}
							copiedLink={copiedLink}
							onCopyLink={handleCopyShareUrl}
						/>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
