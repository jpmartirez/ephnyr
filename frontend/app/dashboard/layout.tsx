import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClientWrapper } from "@/components/dashboard";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/?auth=login");
	}

	// Fetch initial room count for authenticated user
	const { count } = await supabase
		.from("rooms")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	return (
		<DashboardClientWrapper
			userEmail={user.email || "user@ephnyr.ai"}
			initialActiveRooms={count || 0}
		>
			{children}
		</DashboardClientWrapper>
	);
}
