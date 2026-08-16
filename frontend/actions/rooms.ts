"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRoom(formData: FormData) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthorized");

	// Enforce Max 3 Rooms on Free Tier
	const { count } = await supabase
		.from("rooms")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	if (count && count >= 3) {
		throw new Error(
			"Free tier limit reached (Max 3 rooms). Delete an existing room to create a new one.",
		);
	}

	const name = formData.get("name") as string;
	if (!name || typeof name !== "string" || !name.trim()) {
		throw new Error("Room name is required.");
	}

	const cleanName = name.trim();
	const slug = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

	const { error } = await supabase.from("rooms").insert({
		user_id: user.id,
		name: cleanName,
		slug,
	});

	if (error) throw new Error(error.message);
	revalidatePath("/dashboard");
}
