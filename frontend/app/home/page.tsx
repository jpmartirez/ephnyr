import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
			<div className="flex flex-col items-center space-y-6 text-center">
				<Badge
					variant="outline"
					className="border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700"
				>
					● PROTECTED SESSION ACTIVE
				</Badge>

				<h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
					HomePage
				</h1>

				<p className="text-xs text-zinc-500 font-medium">
					Logged in as: <span className="font-bold text-zinc-900">{user.email}</span>
				</p>

				<form action={signout}>
					<Button
						type="submit"
						variant="outline"
						className="border-zinc-300 bg-white font-medium text-zinc-900 hover:bg-zinc-100"
					>
						Sign Out
					</Button>
				</form>
			</div>
		</div>
	);
}
