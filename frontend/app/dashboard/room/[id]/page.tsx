/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
	ArrowLeft,
	Copy,
	Check,
	ExternalLink,
	FileText,
	Globe,
	Lock,
	Trash2,
	Upload,
	Settings,
	Share2,
	Save,
	RefreshCw,
	Sparkles,
	Bot,
	FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { getRoomById, updateRoom, type RoomData } from "@/actions/rooms";
import {
	getRoomDocuments,
	uploadDocument,
	deleteDocument,
	type DocumentItem,
} from "@/actions/documents";

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

	const fileInputRef = useRef<HTMLInputElement>(null);

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
		// Validate Max 10MB per file client-side
		if (file.size > 10 * 1024 * 1024) {
			toast.error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 10 MB limit.`);
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
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		toast.success(`Ingested ${file.name} successfully!`, { id: "doc-upload" });
		setIsUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
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

	// Storage calculations
	const usedMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);
	const storagePercentage = Math.min(100, (totalSizeBytes / (30 * 1024 * 1024)) * 100);

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
			{/* Top Room Banner / Header */}
			<header className="border-b border-zinc-200/80 bg-white px-4 sm:px-6 md:px-8 py-5">
				<div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
						>
							<ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Pods
						</Link>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
								{room.name}
							</h1>
							{room.is_public ? (
								<Badge
									variant="outline"
									className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700"
								>
									<Globe className="mr-1 h-3 w-3" /> Public Link Active
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="border-zinc-200 bg-zinc-100 text-[10px] font-semibold text-zinc-600"
								>
									<Lock className="mr-1 h-3 w-3" /> Private Pod
								</Badge>
							)}
						</div>
						<p className="text-xs text-zinc-500 line-clamp-1">
							{room.description || "No description set for this knowledge pod."}
						</p>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={loadRoomData}
							className="border-zinc-300 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100"
						>
							<RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
						</Button>
						<Button
							size="sm"
							onClick={handleCopyShareUrl}
							className="bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
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

			{/* Main Workspace Container */}
			<main className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6">
				{/* Storage Capacity Bar */}
				<div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
					<div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
						<span className="flex items-center gap-2">
							<FileCheck2 className="h-4 w-4 text-zinc-700" />
							Room Storage Quota
						</span>
						<span className="text-zinc-600">
							<strong>{usedMb} MB</strong> / 30 MB
						</span>
					</div>
					<div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
						<div
							className={`h-full transition-all ${
								storagePercentage >= 90 ? "bg-amber-500" : "bg-zinc-950"
							}`}
							style={{ width: `${storagePercentage}%` }}
						/>
					</div>
					<div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
						<span>Max single file size: 10 MB</span>
						<span>Accepted types: PDF, DOCX, TXT, MD</span>
					</div>
				</div>

				{/* Workspace Main Tabs */}
				<Tabs defaultValue="documents" className="w-full">
					<TabsList className="grid w-full grid-cols-3 max-w-md bg-zinc-100 p-1">
						<TabsTrigger value="documents" className="text-xs font-medium">
							<FileText className="mr-1.5 h-3.5 w-3.5" /> Documents ({documents.length})
						</TabsTrigger>
						<TabsTrigger value="settings" className="text-xs font-medium">
							<Settings className="mr-1.5 h-3.5 w-3.5" /> Pod Settings
						</TabsTrigger>
						<TabsTrigger value="share" className="text-xs font-medium">
							<Share2 className="mr-1.5 h-3.5 w-3.5" /> Chatbot Link
						</TabsTrigger>
					</TabsList>

					{/* TAB 1: DOCUMENT MANAGEMENT */}
					<TabsContent value="documents" className="mt-6 space-y-6">
						{/* Upload Zone */}
						<Card className="border-2 border-dashed border-zinc-300 bg-white p-6 shadow-none text-center">
							<div className="flex flex-col items-center justify-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
									<Upload className="h-6 w-6" />
								</div>
								<h3 className="mt-3 text-sm font-bold text-zinc-950">
									Ingest New Documents
								</h3>
								<p className="mt-1 text-xs text-zinc-500 max-w-md">
									Upload your PDF, Markdown, Word (.docx), or plain text files. Documents will be chunked and indexed into Supabase pgvector for sub-500ms RAG lookups.
								</p>

								<input
									ref={fileInputRef}
									type="file"
									accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
									onChange={handleFileUpload}
									className="hidden"
									id="room-file-upload"
								/>

								<Button
									disabled={isUploading}
									onClick={() => fileInputRef.current?.click()}
									className="mt-4 bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
								>
									{isUploading ? (
										<>
											<RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Ingesting File...
										</>
									) : (
										<>
											<Upload className="mr-1.5 h-3.5 w-3.5" /> Select File to Ingest
										</>
									)}
								</Button>
							</div>
						</Card>

						{/* Document List */}
						<Card className="border-zinc-200 bg-white shadow-2xs">
							<CardHeader className="p-5 pb-3">
								<CardTitle className="text-base font-bold text-zinc-950">
									Ingested Knowledge Base ({documents.length})
								</CardTitle>
								<CardDescription className="text-xs text-zinc-500">
									List of all active documents available for similarity grounding in this pod.
								</CardDescription>
							</CardHeader>

							<CardContent className="p-5 pt-0">
								{documents.length > 0 ? (
									<div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
										{documents.map((doc) => {
											const fileMb = (doc.file_size_bytes / (1024 * 1024)).toFixed(2);
											return (
												<div
													key={doc.id}
													className="flex items-center justify-between p-3 text-xs transition-colors hover:bg-zinc-50/80"
												>
													<div className="flex items-center gap-3 min-w-0">
														<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 font-bold">
															<FileText className="h-4 w-4" />
														</div>
														<div className="min-w-0">
															<div className="truncate font-semibold text-zinc-950">
																{doc.file_name}
															</div>
															<div className="flex items-center gap-2 text-[10px] text-zinc-500">
																<span>{fileMb} MB</span>
																<span>•</span>
																{doc.chunk_count ? (
																	<>
																		<span className="font-semibold text-emerald-700">
																			{doc.chunk_count} Chunks
																		</span>
																		<span>•</span>
																	</>
																) : null}
																<span className="truncate max-w-[200px]">{doc.storage_path}</span>
															</div>
														</div>
													</div>

													<div className="flex items-center gap-3">
														<Badge
															variant="outline"
															className={`text-[10px] font-semibold ${
																doc.status === "READY"
																	? "border-emerald-200 bg-emerald-50 text-emerald-700"
																	: doc.status === "PROCESSING"
																	? "border-amber-200 bg-amber-50 text-amber-700"
																	: "border-red-200 bg-red-50 text-red-700"
															}`}
														>
															{doc.status === "PROCESSING" ? (
																<span className="flex items-center gap-1">
																	<RefreshCw className="h-3 w-3 animate-spin" /> PROCESSING
																</span>
															) : (
																doc.status
															)}
														</Badge>

														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleDeleteDoc(doc.id, doc.file_name)}
															className="h-8 w-8 text-zinc-400 hover:bg-red-50 hover:text-red-600"
															title="Purge Document"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
										<FileText className="mx-auto h-8 w-8 text-zinc-400" />
										<p className="mt-2 text-xs font-semibold text-zinc-700">
											No documents uploaded yet
										</p>
										<p className="text-[11px] text-zinc-500">
											Upload your first document above to enable RAG similarity search.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* TAB 2: ROOM SETTINGS */}
					<TabsContent value="settings" className="mt-6">
						<Card className="border-zinc-200 bg-white shadow-2xs">
							<CardHeader className="p-6 pb-4">
								<CardTitle className="text-base font-bold text-zinc-950">
									Knowledge Pod Settings
								</CardTitle>
								<CardDescription className="text-xs text-zinc-500">
									Update metadata, visibility, and system grounding directives for this pod.
								</CardDescription>
							</CardHeader>

							<CardContent className="p-6 pt-0">
								<form onSubmit={handleSaveSettings} className="space-y-4">
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

									<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												{isPublic ? (
													<Globe className="h-5 w-5 text-emerald-600" />
												) : (
													<Lock className="h-5 w-5 text-zinc-600" />
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
												className="border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100"
											>
												Toggle Status
											</Button>
										</div>
									</div>

									<div className="flex justify-end pt-2">
										<Button
											type="submit"
											disabled={isSavingSettings}
											className="bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
										>
											{isSavingSettings ? (
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
					</TabsContent>

					{/* TAB 3: CHATBOT SHARE LINK WIDGET */}
					<TabsContent value="share" className="mt-6">
						<Card className="border-zinc-200 bg-white shadow-2xs">
							<CardHeader className="p-6 pb-4">
								<div className="flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
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

							<CardContent className="p-6 pt-0 space-y-6">
								<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
									<label className="text-xs font-medium text-zinc-700">
										Shareable Chatbot URL
									</label>
									<div className="mt-2 flex items-center gap-2">
										<Input
											readOnly
											value={shareUrl}
											className="border-zinc-300 bg-white text-xs font-mono"
										/>
										<Button
											onClick={handleCopyShareUrl}
											className="bg-zinc-950 text-xs font-medium text-white hover:bg-zinc-800 shrink-0"
										>
											{copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
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

								{/* Upcoming Phase Notice Banner */}
								<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
									<Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
									<div className="space-y-1">
										<div className="font-bold text-amber-950">
											Next Development Phase: Live Streaming RAG Chatbot
										</div>
										<p className="leading-relaxed text-amber-800">
											This public link is ready. The full interactive streaming chatbot interface (powered by Groq LPU Llama 3.3 70B &amp; LangChain vector lookups) will be activated in the upcoming phase!
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
