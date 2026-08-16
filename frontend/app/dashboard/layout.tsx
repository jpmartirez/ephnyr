import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClientWrapper } from "@/components/dashboard/client-wrapper";

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

	return (
		<DashboardClientWrapper userEmail={user.email || "user@ephnyr.ai"}>
			{children}
		</DashboardClientWrapper>
	);
}
