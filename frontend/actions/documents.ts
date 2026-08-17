/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createDirectClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";
const BACKEND_URL = rawBackendUrl.endsWith("/api/v1")
	? rawBackendUrl
	: `${rawBackendUrl.replace(/\/$/, "")}/api/v1`;

function getAdminStorageClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (url && serviceKey) {
		return createDirectClient(url, serviceKey, {
			auth: { persistSession: false },
		});
	}
	return null;
}

export interface DocumentItem {
	id: string;
	room_id: string;
	file_name: string;
	file_type: string;
	file_size_bytes: number;
	storage_path: string;
	status: "PROCESSING" | "READY" | "FAILED";
	chunk_count?: number;
	created_at?: string;
}

export interface DocumentListResult {
	success: boolean;
	documents: DocumentItem[];
	total: number;
	total_size_bytes: number;
	error?: string;
}

/**
 * Fetch all documents uploaded to a specific Knowledge Pod (Room).
 */
export async function getRoomDocuments(roomId: string): Promise<DocumentListResult> {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, documents: [], total: 0, total_size_bytes: 0, error: "Unauthorized session." };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/documents/room/${roomId}`, {
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
				documents: data.documents || [],
				total: data.total || 0,
				total_size_bytes: data.total_size_bytes || 0,
			};
		}
	} catch (e) {
		console.warn("FastAPI documents fetch failed, falling back to direct Supabase query:", e);
	}

	// Supabase direct fallback
	const { data, error } = await supabase
		.from("documents")
		.select("*")
		.eq("room_id", roomId)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, documents: [], total: 0, total_size_bytes: 0, error: error.message };
	}

	const docs: DocumentItem[] = data || [];
	const totalSize = docs.reduce((acc, d) => acc + (d.file_size_bytes || 0), 0);

	return {
		success: true,
		documents: docs,
		total: docs.length,
		total_size_bytes: totalSize,
	};
}

/**
 * Upload raw file to Supabase Storage bucket and register document metadata in FastAPI backend.
 */
export async function uploadDocument(roomId: string, formData: FormData) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	const file = formData.get("file") as File;
	if (!file || typeof file === "string") {
		return { success: false, error: "No file provided for upload." };
	}

	// 1. Client & Server 10MB per file limit validation
	const maxBytesPerFile = 10 * 1024 * 1024; // 10MB
	if (file.size > maxBytesPerFile) {
		return {
			success: false,
			error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 10 MB per file.`,
		};
	}

	// 2. Allowed MIME types validation
	const allowedMimes = [
		"application/pdf",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"text/plain",
		"text/markdown",
	];
	const isAllowedExt = /\.(pdf|docx|txt|md)$/i.test(file.name);

	if (!allowedMimes.includes(file.type) && !isAllowedExt) {
		return {
			success: false,
			error: "Invalid file type. Only PDF, DOCX, TXT, and Markdown (.md) files are accepted.",
		};
	}

	// 3. Upload file bytes to Supabase Storage bucket 'room-documents'
	const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
	const storagePath = `${roomId}/${Date.now()}_${cleanFileName}`;

	const fileBuffer = await file.arrayBuffer();

	const adminClient = getAdminStorageClient();
	const storageClient = adminClient || supabase;

	if (adminClient) {
		try {
			await adminClient.storage.createBucket("room-documents", { public: true });
		} catch {}
	}

	const { error: storageError } = await storageClient.storage
		.from("room-documents")
		.upload(storagePath, fileBuffer, {
			contentType: file.type || "application/octet-stream",
			upsert: true,
		});

	if (storageError) {
		return { success: false, error: `Storage Upload Failed: ${storageError.message}` };
	}

	// 4. Register document in FastAPI backend
	try {
		const res = await fetch(`${BACKEND_URL}/documents`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				room_id: roomId,
				file_name: file.name,
				file_type: file.type || "application/octet-stream",
				file_size_bytes: file.size,
				storage_path: storagePath,
			}),
		});

		const data = await res.json();
		if (!res.ok) {
			// Rollback storage file on metadata registration failure
			await storageClient.storage.from("room-documents").remove([storagePath]);
			return { success: false, error: data.error || data.detail || "Failed to register document." };
		}

		revalidatePath(`/dashboard/room/${roomId}`);
		return { success: true, document: data };
	} catch (e: any) {
		console.warn("FastAPI document registration failed, completing via direct Supabase insert:", e);

		// Direct Supabase fallback registration
		const { data: inserted, error: dbError } = await supabase
			.from("documents")
			.insert({
				room_id: roomId,
				file_name: file.name,
				file_type: file.type || "application/octet-stream",
				file_size_bytes: file.size,
				storage_path: storagePath,
				status: "READY",
			})
			.select()
			.single();

		if (dbError) {
			await storageClient.storage.from("room-documents").remove([storagePath]);
			return { success: false, error: dbError.message };
		}

		revalidatePath(`/dashboard/room/${roomId}`);
		return { success: true, document: inserted };
	}
}

/**
 * Delete a document and purge raw storage files.
 */
export async function deleteDocument(docId: string, roomId: string) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return { success: false, error: "Unauthorized session." };
	}

	const adminClient = getAdminStorageClient();
	const storageClient = adminClient || supabase;

	try {
		const res = await fetch(`${BACKEND_URL}/documents/${docId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			revalidatePath(`/dashboard/room/${roomId}`);
			return { success: true };
		}
	} catch (e) {
		console.warn("FastAPI document deletion failed, executing direct Supabase purge:", e);
	}

	// Supabase fallback deletion
	const { data: doc } = await supabase
		.from("documents")
		.select("storage_path")
		.eq("id", docId)
		.single();

	if (doc?.storage_path) {
		await storageClient.storage.from("room-documents").remove([doc.storage_path]);
	}

	const { error } = await supabase.from("documents").delete().eq("id", docId);
	if (error) return { success: false, error: error.message };

	revalidatePath(`/dashboard/room/${roomId}`);
	return { success: true };
}
