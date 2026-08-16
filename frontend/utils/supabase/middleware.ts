import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const path = request.nextUrl.pathname;
	const authQuery = request.nextUrl.searchParams.get("auth");

	const isProtectedPath =
		path.startsWith("/dashboard") ||
		path.startsWith("/home") ||
		path.startsWith("/rooms");
	const isAuthPage = path === "/login" || path === "/signup";

	// Redirect unauthenticated user accessing protected path to /?auth=login
	if (!user && isProtectedPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		url.searchParams.set("auth", "login");
		return NextResponse.redirect(url);
	}

	// Redirect authenticated user attempting to access auth page or ?auth= to /dashboard
	if (user && (isAuthPage || authQuery)) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard";
		url.searchParams.delete("auth");
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
