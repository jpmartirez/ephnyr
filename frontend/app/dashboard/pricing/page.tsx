"use client";

import { DashboardHeader, PricingCards, useDashboard } from "@/components/dashboard";

export default function PricingPage() {
	const { toggleMobileSidebar } = useDashboard();

	return (
		<div className="flex flex-1 flex-col pb-16">
			{/* Top Header Bar */}
			<DashboardHeader
				title="Plans & Quotas"
				description="Overview of your free tier resource quotas, file limits, and upgrade path."
				onToggleMobileSidebar={toggleMobileSidebar}
				showCreateButton={false}
			/>

			{/* Main Container */}
			<main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
				<PricingCards />
			</main>
		</div>
	);
}
