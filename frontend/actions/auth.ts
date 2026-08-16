/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
	const supabase = createClient();

	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required." };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
	const supabase = createClient();

	const fullName = formData.get("fullName") as string;
	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required.", success: false };
	}

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				full_name: fullName || "",
			},
		},
	});

	if (error) {
		const isEmailExists =
			error.message.toLowerCase().includes("already registered") ||
			error.message.toLowerCase().includes("already exists") ||
			error.message.toLowerCase().includes("already in use") ||
			error.message.toLowerCase().includes("user_already_exists");

		if (isEmailExists) {
			return {
				error: "An account with this email address already exists. Please sign in instead.",
				isEmailExists: true,
				success: false,
			};
		}

		return { error: error.message, success: false };
	}

	
	if (data.user && data.user.identities && data.user.identities.length === 0) {
		return {
			error: "An account with this email address already exists. Please sign in instead.",
			isEmailExists: true,
			success: false,
		};
	}

	if (data.user && !data.session) {
		return {
			error: null,
			success: true,
			message:
				"Registration successful! Please check your email to verify your account before logging in.",
		};
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signout() {
	const supabase = createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	redirect("/login");
}
