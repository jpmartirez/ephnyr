/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";

const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";
const BACKEND_URL = rawBackendUrl.endsWith("/api/v1")
	? rawBackendUrl
	: `${rawBackendUrl.replace(/\/$/, "")}/api/v1`;

export interface ChatMessageItem {
	role: "user" | "assistant";
	content: string;
	sources?: Array<{
		file_name: string;
		content: string;
		similarity: number;
	}>;
}

export interface ChatRoomInfo {
	id: string;
	name: string;
	description?: string;
	slug: string;
	is_public: boolean;
	is_owner: boolean;
}

export async function getChatRoomInfo(slug: string): Promise<{
	success: boolean;
	room?: ChatRoomInfo;
	isPrivate?: boolean;
	error?: string;
}> {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (session?.access_token) {
		headers["Authorization"] = `Bearer ${session.access_token}`;
	}

	try {
		const res = await fetch(`${BACKEND_URL}/chat/room/${slug}`, {
			method: "GET",
			headers,
			cache: "no-store",
		});

		const data = await res.json();

		if (res.status === 403) {
			return {
				success: false,
				isPrivate: true,
				error: data.detail || "This Knowledge Pod is private. Only the owner can interact with this chatbot.",
			};
		}

		if (!res.ok) {
			return {
				success: false,
				error: data.detail || data.error || "Knowledge Pod not found.",
			};
		}

		return { success: true, room: data };
	} catch (e) {
		console.warn("FastAPI chat room info failed, executing Supabase fallback query:", e);
	}

	// Supabase Fallback query
	const { data: user } = await supabase.auth.getUser();

	const { data: room, error } = await supabase
		.from("rooms")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error || !room) {
		return { success: false, error: "Knowledge Pod not found." };
	}

	const isOwner = user.user ? user.user.id === room.user_id : false;

	if (!room.is_public && !isOwner) {
		return {
			success: false,
			isPrivate: true,
			error: "This Knowledge Pod is private. Only the owner can interact with this chatbot.",
		};
	}

	return {
		success: true,
		room: {
			id: room.id,
			name: room.name,
			description: room.description,
			slug: room.slug,
			is_public: room.is_public,
			is_owner: isOwner,
		},
	};
}

export async function sendChatMessage(payload: {
	slug: string;
	message: string;
	history: Array<{ role: string; content: string }>;
}): Promise<{
	success: boolean;
	reply?: string;
	sources?: Array<{ file_name: string; content: string; similarity: number }>;
	error?: string;
}> {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (session?.access_token) {
		headers["Authorization"] = `Bearer ${session.access_token}`;
	}

	try {
		const res = await fetch(`${BACKEND_URL}/chat/query`, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (res.status === 403) {
			return {
				success: false,
				error: data.detail || "This Knowledge Pod is private. Only the owner can interact with this chatbot.",
			};
		}

		if (!res.ok) {
			return {
				success: false,
				error: data.detail || data.error || "Failed to generate RAG response.",
			};
		}

		return {
			success: true,
			reply: data.reply,
			sources: data.sources || [],
		};
	} catch (e: any) {
		console.error("FastAPI chat query error:", e);
		return {
			success: false,
			error: "Service temporarily unavailable. Ensure backend server is running.",
		};
	}
}
