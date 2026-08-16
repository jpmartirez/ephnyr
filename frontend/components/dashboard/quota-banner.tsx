import { ShieldAlert, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuotaBannerProps {
	activeRooms: number;
	maxRooms?: number;
}

export function QuotaBanner({
	activeRooms,
	maxRooms = 3,
}: QuotaBannerProps) {
	const isLimitReached = activeRooms >= maxRooms;
	const remaining = maxRooms - activeRooms;

	return (
		<div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs sm:p-5 md:flex-row md:items-center">
			<div className="flex items-start gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-2xs">
					<Zap className="h-4 w-4" />
				</div>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-sm font-bold text-zinc-950">
							Free Tier Quotas &amp; Isolation
						</h3>
						<Badge
							variant="outline"
							className="border-zinc-200 bg-zinc-100 text-[10px] font-medium text-zinc-700"
						>
							100% OPEN SOURCE
						</Badge>
					</div>
					<p className="mt-1 text-xs text-zinc-500 leading-relaxed">
						Max 3 rooms per user account • 10 MB single file limit • 30 MB room storage cap.
					</p>
				</div>
			</div>

			<div className="flex w-full items-center justify-between gap-3 border-t border-zinc-100 pt-3 md:w-auto md:border-0 md:pt-0 md:justify-end">
				<div className="flex flex-col items-start md:items-end">
					<div className="text-xs font-semibold text-zinc-900">
						{activeRooms} / {maxRooms} Rooms Used
					</div>
					<span className="text-[10px] text-zinc-500 font-medium">
						{isLimitReached ? (
							<span className="text-amber-600 font-semibold flex items-center gap-1">
								<ShieldAlert className="h-3 w-3" /> Max Quota Reached
							</span>
						) : (
							`${remaining} remaining`
						)}
					</span>
				</div>
				<div className="h-7 w-20 sm:w-24 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 p-0.5">
					<div
						className={`h-full rounded-full transition-all ${
							isLimitReached ? "bg-amber-500" : "bg-zinc-900"
						}`}
						style={{ width: `${(activeRooms / maxRooms) * 100}%` }}
					></div>
				</div>
			</div>
		</div>
	);
}
