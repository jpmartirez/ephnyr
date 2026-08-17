/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";
const BACKEND_URL = rawBackendUrl.endsWith("/api/v1")
	? rawBackendUrl
	: `${rawBackendUrl.replace(/\/$/, "")}/api/v1`;

export interface RoomData {
	id: string;
	user_id?: string;
	name: string;
	description?: string;
	slug: string;
	is_public: boolean;
	system_prompt?: string;
	docCount?: number;
	created_at?: string;
	updated_at?: string;
}

export interface RoomsResult {
	success: boolean;
	rooms: RoomData[];
	total: number;
	max_allowed: number;
	error?: string;
}

/**
 * Fetch all rooms for the authenticated user from FastAPI backend.
 * Falls back to Supabase directly if FastAPI server is unreachable.
 */
export async function getUserRooms(): Promise<RoomsResult> {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, rooms: [], total: 0, max_allowed: 3, error: "Unauthorized session." };
	}

	try {
		// Call FastAPI Backend
		const res = await fetch(`${BACKEND_URL}/rooms`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (res.ok) {
			const data = await res.json();
			return {
				success: true,
				rooms: data.rooms || [],
				total: data.total || 0,
				max_allowed: data.max_allowed || 3,
			};
		}
	} catch (e) {
		console.warn("FastAPI backend unreachable, falling back to Supabase direct query:", e);
	}

	// Fallback to direct Supabase query
	const { data: user } = await supabase.auth.getUser();
	if (!user.user) {
		return { success: false, rooms: [], total: 0, max_allowed: 3, error: "User not found." };
	}

	const { data, error, count } = await supabase
		.from("rooms")
		.select("*", { count: "exact" })
		.eq("user_id", user.user.id)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, rooms: [], total: 0, max_allowed: 3, error: error.message };
	}

	// Fetch document counts per room in fallback
	const roomIds = (data || []).map((r) => r.id);
	const docCounts: Record<string, number> = {};

	if (roomIds.length > 0) {
		const { data: docs } = await supabase
			.from("documents")
			.select("room_id")
			.in("room_id", roomIds);

		(docs || []).forEach((d) => {
			if (d.room_id) {
				docCounts[d.room_id] = (docCounts[d.room_id] || 0) + 1;
			}
		});
	}

	const roomsWithDocs = (data || []).map((r) => ({
		...r,
		docCount: docCounts[r.id] || 0,
	}));

	return {
		success: true,
		rooms: roomsWithDocs,
		total: count || (data ? data.length : 0),
		max_allowed: 3,
	};
}

export async function createRoom(payload: {
	name: string;
	description?: string;
	is_public?: boolean;
	system_prompt?: string;
}) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	if (!payload.name || !payload.name.trim()) {
		return { success: false, error: "Room name is required." };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/rooms`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: payload.name.trim(),
				description: payload.description || "",
				is_public: payload.is_public ?? true,
				system_prompt: payload.system_prompt || "You are an AI assistant strictly grounded on the provided context.",
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			return {
				success: false,
				error: data.error || data.detail || "Failed to create room.",
			};
		}

		revalidatePath("/dashboard");
		return { success: true, room: data };
	} catch (e: any) {
		console.warn("FastAPI backend failed, attempting direct Supabase fallback:", e);

		// Supabase direct fallback
		const { data: user } = await supabase.auth.getUser();
		if (!user.user) return { success: false, error: "User not found." };

		// Ensure public.users row exists before inserting into rooms
		if (user.user.email) {
			await supabase.from("users").upsert(
				{
					id: user.user.id,
					email: user.user.email,
					full_name: user.user.user_metadata?.full_name || "",
				},
				{ onConflict: "id" }
			);
		}

		const { count } = await supabase
			.from("rooms")
			.select("*", { count: "exact", head: true })
			.eq("user_id", user.user.id);

		if (count && count >= 3) {
			return {
				success: false,
				error: "Free tier limit reached (Max 3 rooms). Delete an existing room to create a new one.",
			};
		}

		const cleanName = payload.name.trim();
		const slug = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

		const { data: inserted, error } = await supabase
			.from("rooms")
			.insert({
				user_id: user.user.id,
				name: cleanName,
				description: payload.description || "",
				slug,
				is_public: payload.is_public ?? true,
				system_prompt: payload.system_prompt || "You are an AI assistant strictly grounded on the provided context.",
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };

		revalidatePath("/dashboard");
		return { success: true, room: inserted };
	}
}

export async function deleteRoom(roomId: string) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			revalidatePath("/dashboard");
			return { success: true };
		}
	} catch (e) {
		console.warn("FastAPI delete failed, attempting direct Supabase deletion:", e);
	}

	// Supabase fallback deletion
	const { error } = await supabase.from("rooms").delete().eq("id", roomId);
	if (error) return { success: false, error: error.message };

	revalidatePath("/dashboard");
	return { success: true };
}

/**
 * Fetch a single Knowledge Pod (Room) by ID.
 */
export async function getRoomById(roomId: string): Promise<{ success: boolean; room?: RoomData; error?: string }> {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (res.ok) {
			const data = await res.json();
			return { success: true, room: data };
		}
	} catch (e) {
		console.warn("FastAPI get room by ID failed, falling back to direct Supabase query:", e);
	}

	// Supabase direct fallback
	const { data, error } = await supabase
		.from("rooms")
		.select("*")
		.eq("id", roomId)
		.single();

	if (error || !data) {
		return { success: false, error: error?.message || "Room not found." };
	}

	return { success: true, room: data };
}

/**
 * Update room metadata (name, description, is_public, system_prompt).
 */
export async function updateRoom(
	roomId: string,
	payload: { name?: string; description?: string; is_public?: boolean; system_prompt?: string }
) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (res.ok) {
			const data = await res.json();
			revalidatePath(`/dashboard/room/${roomId}`);
			revalidatePath("/dashboard");
			return { success: true, room: data };
		}
	} catch (e) {
		console.warn("FastAPI update room failed, attempting direct Supabase update:", e);
	}

	// Direct Supabase fallback update
	const { data, error } = await supabase
		.from("rooms")
		.update(payload)
		.eq("id", roomId)
		.select()
		.single();

	if (error) return { success: false, error: error.message };

	revalidatePath(`/dashboard/room/${roomId}`);
	revalidatePath("/dashboard");
	return { success: true, room: data };
}
