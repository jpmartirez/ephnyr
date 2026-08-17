"use client";

import { useState, createContext, useContext } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

interface DashboardContextType {
	isMobileSidebarOpen: boolean;
	activeRooms: number;
	setActiveRooms: (count: number) => void;
	openMobileSidebar: () => void;
	closeMobileSidebar: () => void;
	toggleMobileSidebar: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
	isMobileSidebarOpen: false,
	activeRooms: 0,
	setActiveRooms: () => {},
	openMobileSidebar: () => {},
	closeMobileSidebar: () => {},
	toggleMobileSidebar: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

interface DashboardClientWrapperProps {
	children: React.ReactNode;
	userEmail: string;
	initialActiveRooms?: number;
}

export function DashboardClientWrapper({
	children,
	userEmail,
	initialActiveRooms = 0,
}: DashboardClientWrapperProps) {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [activeRooms, setActiveRooms] = useState(initialActiveRooms);

	const openMobileSidebar = () => setIsMobileSidebarOpen(true);
	const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
	const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

	return (
		<DashboardContext.Provider
			value={{
				isMobileSidebarOpen,
				activeRooms,
				setActiveRooms,
				openMobileSidebar,
				closeMobileSidebar,
				toggleMobileSidebar,
			}}
		>
			<div className="flex min-h-screen bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
				{/* Responsive Left Navigation Sidebar */}
				<DashboardSidebar
					userEmail={userEmail}
					activeRooms={activeRooms}
					maxRooms={3}
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
