import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LandingNavbarProps {
	onOpenAuthModal?: (tab: "login" | "signup") => void;
}

export function LandingNavbar({ onOpenAuthModal }: LandingNavbarProps) {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="flex items-center gap-2 text-lg font-bold tracking-tighter text-zinc-950"
					>
						<span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-bold text-white">
							E
						</span>
						EPHNYR
					</Link>
					<Badge
						variant="outline"
						className="hidden border-zinc-300 bg-zinc-100 text-[10px] font-medium text-zinc-600 sm:inline-flex"
					>
						v1.0 • RAG PLATFORM
					</Badge>
				</div>

				<nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
					<a href="#features" className="transition-colors hover:text-zinc-950">
						Features
					</a>
					<a
						href="#architecture"
						className="transition-colors hover:text-zinc-950"
					>
						Architecture
					</a>
					<a href="#specs" className="transition-colors hover:text-zinc-950">
						Engineering Spec
					</a>
					<a
						href="#ephemerality"
						className="transition-colors hover:text-zinc-950"
					>
						Ephemerality
					</a>
				</nav>

				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onOpenAuthModal?.("login")}
						className="font-medium text-zinc-700 hover:bg-zinc-200/60 hover:text-zinc-950"
					>
						Sign In
					</Button>
					<Button
						size="sm"
						onClick={() => onOpenAuthModal?.("signup")}
						className="bg-zinc-950 font-medium text-white shadow-sm hover:bg-zinc-800"
					>
						Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
