"use client";

import { useState, createContext, useContext } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

interface DashboardContextType {
	isMobileSidebarOpen: boolean;
	openMobileSidebar: () => void;
	closeMobileSidebar: () => void;
	toggleMobileSidebar: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
	isMobileSidebarOpen: false,
	openMobileSidebar: () => {},
	closeMobileSidebar: () => {},
	toggleMobileSidebar: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

interface DashboardClientWrapperProps {
	children: React.ReactNode;
	userEmail: string;
}

export function DashboardClientWrapper({
	children,
	userEmail,
}: DashboardClientWrapperProps) {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	const openMobileSidebar = () => setIsMobileSidebarOpen(true);
	const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
	const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

	return (
		<DashboardContext.Provider
			value={{
				isMobileSidebarOpen,
				openMobileSidebar,
				closeMobileSidebar,
				toggleMobileSidebar,
			}}
		>
			<div className="flex min-h-screen bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
				{/* Responsive Left Navigation Sidebar */}
				<DashboardSidebar
					userEmail={userEmail}
					isOpen={isMobileSidebarOpen}
					onClose={closeMobileSidebar}
				/>

				{/* Main Content Area: pl-0 on mobile, md:pl-64 on desktop */}
				<div className="flex flex-1 flex-col pl-0 md:pl-64 transition-all">
					{children}
				</div>
			</div>
		</DashboardContext.Provider>
	);
}
