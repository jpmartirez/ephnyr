/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Bot, Sparkles, ShieldAlert } from "lucide-react";

import {
	getChatRoomInfo,
	sendChatMessage,
	type ChatRoomInfo,
	type ChatMessageItem as ChatMessageType,
} from "@/actions/chat";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatWelcomeState } from "@/components/chat/chat-welcome-state";
import { ChatMessageItem } from "@/components/chat/chat-message-item";
import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { ChatPrivateScreen } from "@/components/chat/chat-private-screen";

export default function ChatbotSharePage() {
	const params = useParams();
	const slug = params.slug as string;

	const [room, setRoom] = useState<ChatRoomInfo | null>(null);
	const [isPrivate, setIsPrivate] = useState(false);
	const [isLoadingRoom, setIsLoadingRoom] = useState(true);

	const [messages, setMessages] = useState<ChatMessageType[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isSending, setIsSending] = useState(false);

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

	// Load & Save Ephemeral Session Messages from sessionStorage
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

	useEffect(() => {
		if (typeof window !== "undefined" && slug && messages.length > 0) {
			sessionStorage.setItem(`ephnyr_chat_${slug}`, JSON.stringify(messages));
		}
	}, [messages, slug]);

	// Auto-scroll to bottom of chat
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isSending]);

	// Clear Session Handler
	const handleClearSession = () => {
		setMessages([]);
		if (typeof window !== "undefined" && slug) {
			sessionStorage.removeItem(`ephnyr_chat_${slug}`);
		}
		toast.success("Chat session cleared.");
	};

	// Send Query Message Handler
	const handleSendMessage = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!inputValue.trim() || isSending) return;

		const userQuery = inputValue.trim();
		setInputValue("");

		const userMsg: ChatMessageType = { role: "user", content: userQuery };
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

		const assistantMsg: ChatMessageType = {
			role: "assistant",
			content: res.reply || "No answer returned.",
			sources: res.sources || [],
		};

		setMessages((prev) => [...prev, assistantMsg]);
		setIsSending(false);
	};

	// 1. Loading State Screen
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

	// 2. Private Pod Restricted Screen
	if (isPrivate) {
		return <ChatPrivateScreen />;
	}

	// 3. Not Found Screen
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
			<ChatHeader
				room={room}
				hasMessages={messages.length > 0}
				onClearSession={handleClearSession}
			/>

			{/* Main Conversation Container */}
			<main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
				{messages.length === 0 ? (
					<ChatWelcomeState
						roomName={room.name}
						onSelectPrompt={(text) => setInputValue(text)}
					/>
				) : (
					messages.map((msg, index) => (
						<ChatMessageItem key={index} message={msg} />
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
			<ChatInputBar
				roomName={room.name}
				inputValue={inputValue}
				isSending={isSending}
				onInputChange={setInputValue}
				onSubmit={handleSendMessage}
			/>
		</div>
	);
}
