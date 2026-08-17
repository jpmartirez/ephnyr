"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, CreditCard, LogOut, ShieldCheck, Plus, X } from "lucide-react";
import { signout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardSidebarProps {
	userEmail?: string;
	activeRooms?: number;
	maxRooms?: number;
	onOpenCreateModal?: () => void;
	isOpen?: boolean;
	onClose?: () => void;
}

export function DashboardSidebar({
	userEmail = "user@ephnyr.ai",
	activeRooms = 0,
	maxRooms = 3,
	onOpenCreateModal,
	isOpen = false,
	onClose,
}: DashboardSidebarProps) {
	const pathname = usePathname();

	const isRoomsActive = pathname === "/dashboard" || pathname === "/dashboard/rooms";
	const isPricingActive = pathname === "/dashboard/pricing";

	const remaining = Math.max(0, maxRooms - activeRooms);
	const percentage = Math.min(100, Math.max(0, (activeRooms / maxRooms) * 100));

	return (
		<>
			{/* Mobile Backdrop Overlay */}
			{isOpen && (
				<div
					onClick={onClose}
					className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-xs transition-opacity md:hidden"
				/>
			)}

			{/* Sidebar Panel */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Brand Logo Header */}
				<div className="flex h-16 items-center justify-between border-b border-zinc-200/80 px-6">
					<Link
						href="/dashboard"
						onClick={onClose}
						className="flex items-center gap-2 text-lg font-bold tracking-tighter text-zinc-950"
					>
						<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
							E
						</span>
						EPHNYR
					</Link>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-600">
							FREE TIER
						</Badge>
						{/* Close button for mobile */}
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 md:hidden"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Main Quick Action */}
				<div className="p-4">
					<Button
						onClick={() => {
							onClose?.();
							onOpenCreateModal?.();
						}}
						className="w-full bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
					>
						<Plus className="mr-1.5 h-3.5 w-3.5" />
						New Knowledge Pod
					</Button>
				</div>

				{/* Navigation Links */}
				<nav className="flex-1 space-y-1 px-3 py-2">
					<Link
						href="/dashboard"
						onClick={onClose}
						className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
							isRoomsActive
								? "bg-zinc-100 text-zinc-950"
								: "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
						}`}
					>
						<FolderKanban className="h-4 w-4 text-zinc-700" />
						Knowledge Pods
					</Link>

					<Link
						href="/dashboard/pricing"
						onClick={onClose}
						className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
							isPricingActive
								? "bg-zinc-100 text-zinc-950"
								: "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
						}`}
					>
						<CreditCard className="h-4 w-4 text-zinc-700" />
						Plans &amp; Quotas
					</Link>
				</nav>

				{/* Quota Summary Box */}
				<div className="m-3 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3">
					<div className="flex items-center justify-between text-xs">
						<span className="font-semibold text-zinc-700">Room Quota</span>
						<span className="font-bold text-zinc-950">{activeRooms} / {maxRooms}</span>
					</div>
					<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
						<div
							className={`h-full transition-all ${
								activeRooms >= maxRooms ? "bg-amber-500" : "bg-zinc-900"
							}`}
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<p className="mt-2 text-[10px] font-medium text-zinc-500">
						{activeRooms >= maxRooms
							? "Max quota reached on Free Tier."
							: `${remaining} room${remaining === 1 ? "" : "s"} remaining on Free Tier.`}
					</p>
				</div>

				{/* User Profile & Sign Out Footer */}
				<div className="border-t border-zinc-200 p-3">
					<div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-50">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-800">
								{userEmail.charAt(0).toUpperCase()}
							</div>
							<div className="flex flex-col min-w-0">
								<span className="truncate text-xs font-semibold text-zinc-900">
									{userEmail}
								</span>
								<span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
									<ShieldCheck className="h-3 w-3" /> Active Session
								</span>
							</div>
						</div>

						<form action={signout}>
							<Button
								type="submit"
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-950"
								title="Sign Out"
							>
								<LogOut className="h-3.5 w-3.5" />
							</Button>
						</form>
					</div>
				</div>
			</aside>
		</>
	);
}
