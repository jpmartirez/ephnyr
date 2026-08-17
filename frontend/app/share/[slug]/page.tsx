/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
	Send,
	Bot,
	User,
	Lock,
	Globe,
	Trash2,
	ChevronDown,
	ChevronUp,
	FileText,
	Sparkles,
	ArrowLeft,
	Clock,
	ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	getChatRoomInfo,
	sendChatMessage,
	type ChatRoomInfo,
	type ChatMessageItem,
} from "@/actions/chat";

export default function ChatbotSharePage() {
	const params = useParams();
	const router = useRouter();
	const slug = params.slug as string;

	const [room, setRoom] = useState<ChatRoomInfo | null>(null);
	const [isPrivate, setIsPrivate] = useState(false);
	const [isLoadingRoom, setIsLoadingRoom] = useState(true);

	const [messages, setMessages] = useState<ChatMessageItem[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isSending, setIsSending] = useState(false);

	const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load Chat Room Metadata & Access Permissions
	const loadRoomMetadata = useCallback(async () => {
		if (!slug) return;
		setIsLoadingRoom(true);
		try {
			const res = await getChatRoomInfo(slug);
			if (res.success && res.room) {
				setRoom(res.room);
				setIsPrivate(false);
			} else if (res.isPrivate) {
				setIsPrivate(true);
			} else {
				toast.error(res.error || "Knowledge Pod not found.");
			}
		} catch (e: any) {
			console.error("Failed to load chatbot room:", e);
		} finally {
			setIsLoadingRoom(false);
		}
	}, [slug]);

	// Load Ephemeral Session Messages from sessionStorage
	useEffect(() => {
		loadRoomMetadata();

		if (typeof window !== "undefined" && slug) {
			const storageKey = `ephnyr_chat_${slug}`;
			const saved = sessionStorage.getItem(storageKey);
			if (saved) {
				try {
					setMessages(JSON.parse(saved));
				} catch {}
			}
		}
	}, [loadRoomMetadata, slug]);

	// Save Ephemeral Session Messages to sessionStorage
	useEffect(() => {
		if (typeof window !== "undefined" && slug && messages.length > 0) {
			sessionStorage.setItem(`ephnyr_chat_${slug}`, JSON.stringify(messages));
		}
	}, [messages, slug]);

	// Auto-scroll to bottom of chat
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isSending]);

	// Clear Ephemeral Chat Session
	const handleClearSession = () => {
		setMessages([]);
		if (typeof window !== "undefined" && slug) {
			sessionStorage.removeItem(`ephnyr_chat_${slug}`);
		}
		toast.success("Chat session cleared.");
	};

	// Send Query Message
	const handleSendMessage = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!inputValue.trim() || isSending) return;

		const userQuery = inputValue.trim();
		setInputValue("");

		const userMsg: ChatMessageItem = { role: "user", content: userQuery };
		const updatedMessages = [...messages, userMsg];
		setMessages(updatedMessages);

		setIsSending(true);

		const historyPayload = updatedMessages.map((m) => ({
			role: m.role,
			content: m.content,
		}));

		const res = await sendChatMessage({
			slug,
			message: userQuery,
			history: historyPayload,
		});

		if (!res.success) {
			toast.error(res.error || "Failed to generate response.");
			setIsSending(false);
			return;
		}

		const assistantMsg: ChatMessageItem = {
			role: "assistant",
			content: res.reply || "No answer returned.",
			sources: res.sources || [],
		};

		setMessages((prev) => [...prev, assistantMsg]);
		setIsSending(false);
	};

	const toggleSourceAccordion = (index: number) => {
		setExpandedSources((prev) => ({ ...prev, [index]: !prev[index] }));
	};

	// 1. Loading State
	if (isLoadingRoom) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans">
				<div className="flex flex-col items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white font-bold animate-pulse">
						E
					</div>
					<p className="text-xs font-medium text-zinc-500">Loading Knowledge Pod Chatbot...</p>
				</div>
			</div>
		);
	}

	// 2. Private Knowledge Pod Access Blocked Screen
	if (isPrivate) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans selection:bg-zinc-900 selection:text-white">
				<Card className="w-full max-w-md border-zinc-200 bg-white p-6 shadow-md text-center">
					<CardHeader className="p-0 text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
							<Lock className="h-6 w-6" />
						</div>
						<Badge
							variant="outline"
							className="mx-auto mt-4 border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 uppercase"
						>
							PRIVATE POD ACCESS RESTRICTED
						</Badge>
						<CardTitle className="mt-3 text-xl font-bold text-zinc-950">
							Private Knowledge Pod
						</CardTitle>
						<CardDescription className="mt-2 text-xs leading-relaxed text-zinc-600">
							This Knowledge Pod is private. Only the pod owner can interact with this chatbot interface.
						</CardDescription>
					</CardHeader>

					<CardFooter className="mt-6 flex flex-col gap-3 p-0 pt-2">
						<Button
							onClick={() => router.push("/?auth=login")}
							className="w-full bg-zinc-950 text-xs font-semibold text-white hover:bg-zinc-800"
						>
							Sign In to Verify Ownership
						</Button>
						<Link
							href="/dashboard"
							className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
						>
							Return to Dashboard
						</Link>
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (!room) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans">
				<ShieldAlert className="h-10 w-10 text-zinc-400" />
				<h3 className="mt-3 text-base font-bold text-zinc-950">Knowledge Pod Not Found</h3>
				<p className="mt-1 text-xs text-zinc-500">The requested chatbot URL is invalid or has been deleted.</p>
				<Link href="/dashboard" className="mt-4 text-xs font-medium text-zinc-900 underline">
					Return to Dashboard
				</Link>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
			{/* Top Bar Header */}
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
						onClick={handleClearSession}
						disabled={messages.length === 0}
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

			{/* Main Conversation Container */}
			<main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
				{messages.length === 0 ? (
					/* Initial Welcome State */
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-md">
							<Bot className="h-7 w-7" />
						</div>
						<h2 className="mt-4 text-xl font-extrabold text-zinc-950 sm:text-2xl">
							Query {room.name}
						</h2>
						<p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-600">
							Ask questions grounded strictly on the ingested documents. Responses are generated with low latency using pgvector similarity lookups.
						</p>

						<div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left max-w-lg w-full">
							<button
								onClick={() => setInputValue("Summarize the key points of the ingested documents.")}
								className="rounded-lg border border-zinc-200 bg-white p-3 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
							>
								💡 Summarize key document insights
							</button>
							<button
								onClick={() => setInputValue("What are the main technical requirements discussed?")}
								className="rounded-lg border border-zinc-200 bg-white p-3 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
							>
								🔍 Explain technical specifications
							</button>
						</div>
					</div>
				) : (
					/* Messages List */
					messages.map((msg, index) => (
						<div
							key={index}
							className={`flex items-start gap-3 ${
								msg.role === "user" ? "flex-row-reverse" : "flex-row"
							}`}
						>
							<div
								className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
									msg.role === "user"
										? "bg-zinc-950 text-white"
										: "bg-zinc-200 text-zinc-800"
								}`}
							>
								{msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
							</div>

							<div
								className={`flex flex-col space-y-2 max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
									msg.role === "user"
										? "bg-zinc-950 text-white rounded-tr-xs"
										: "bg-white border border-zinc-200 text-zinc-900 rounded-tl-xs"
								}`}
							>
								<div className="whitespace-pre-wrap font-sans">
									{msg.content}
								</div>

								{/* Source Citations Accordion for Assistant Replies */}
								{msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
									<div className="pt-2 border-t border-zinc-100 mt-2">
										<button
											onClick={() => toggleSourceAccordion(index)}
											className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
										>
											<FileText className="h-3.5 w-3.5 text-zinc-500" />
											<span>Grounded on {msg.sources.length} document chunk{msg.sources.length === 1 ? "" : "s"}</span>
											{expandedSources[index] ? (
												<ChevronUp className="h-3.5 w-3.5" />
											) : (
												<ChevronDown className="h-3.5 w-3.5" />
											)}
										</button>

										{expandedSources[index] && (
											<div className="mt-2.5 space-y-2">
												{msg.sources.map((src, sIdx) => (
													<div
														key={sIdx}
														className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-2.5 text-[11px] text-zinc-700 space-y-1"
													>
														<div className="flex items-center justify-between font-bold text-zinc-950">
															<span className="truncate">{src.file_name}</span>
															<Badge
																variant="outline"
																className="border-emerald-300 bg-emerald-50 text-[9px] font-bold text-emerald-700 shrink-0"
															>
																{(src.similarity * 100).toFixed(0)}% match
															</Badge>
														</div>
														<p className="line-clamp-3 text-zinc-600 italic">
															&quot;{src.content}&quot;
														</p>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					))
				)}

				{/* Typing Loader Indicator */}
				{isSending && (
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-800 font-bold">
							<Bot className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-500">
							<Sparkles className="h-4 w-4 animate-spin text-zinc-700" />
							<span>Searching pgvector chunks &amp; generating response...</span>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</main>

			{/* Bottom Message Input Bar */}
			<footer className="border-t border-zinc-200 bg-white p-4">
				<form
					onSubmit={handleSendMessage}
					className="mx-auto flex max-w-4xl items-center gap-2"
				>
					<Input
						type="text"
						placeholder={`Ask ${room.name} anything...`}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						disabled={isSending}
						className="flex-1 border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-xs text-zinc-900 focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950/20"
					/>
					<Button
						type="submit"
						disabled={!inputValue.trim() || isSending}
						className="bg-zinc-950 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 shrink-0"
					>
						<Send className="h-4 w-4" />
					</Button>
				</form>
			</footer>
		</div>
	);
}
