import { Menu, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
	title: string;
	description?: string;
	onOpenCreateModal?: () => void;
	onToggleMobileSidebar?: () => void;
	showCreateButton?: boolean;
}

export function DashboardHeader({
	title,
	description,
	onOpenCreateModal,
	onToggleMobileSidebar,
	showCreateButton = true,
}: DashboardHeaderProps) {
	return (
		<header className="sticky top-0 z-30 flex min-h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 md:px-8">
			<div className="flex items-center gap-3">
				{/* Mobile Menu Toggle Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleMobileSidebar}
					className="h-9 w-9 text-zinc-700 hover:bg-zinc-100 md:hidden"
					title="Open Navigation Menu"
				>
					<Menu className="h-5 w-5" />
				</Button>

				<div className="flex flex-col">
					<h1 className="text-base font-bold tracking-tight text-zinc-950 sm:text-lg">
						{title}
					</h1>
					{description && (
						<p className="hidden text-xs text-zinc-500 sm:block">{description}</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 sm:gap-3">
				<Badge
					variant="outline"
					className="hidden border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700 sm:inline-flex"
				>
					<Sparkles className="mr-1 h-3 w-3 text-emerald-600" />
					384-Dim pgvector Ready
				</Badge>

				{showCreateButton && (
					<Button
						onClick={onOpenCreateModal}
						size="sm"
						className="bg-zinc-950 px-3 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 sm:px-4"
					>
						<Plus className="mr-1.5 h-3.5 w-3.5" />
						<span className="hidden sm:inline">Create Room</span>
						<span className="sm:hidden">New Pod</span>
					</Button>
				)}
			</div>
		</header>
	);
}
