"use client";

import { FileCheck2 } from "lucide-react";

interface StorageQuotaBarProps {
	totalSizeBytes: number;
}

export function StorageQuotaBar({ totalSizeBytes }: StorageQuotaBarProps) {
	const usedMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);
	const storagePercentage = Math.min(100, (totalSizeBytes / (10 * 1024 * 1024)) * 100);

	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-zinc-900 gap-1 sm:gap-0">
				<span className="flex items-center gap-2">
					<FileCheck2 className="h-4 w-4 text-zinc-700" />
					Room Storage Quota
				</span>
				<span className="text-zinc-600">
					<strong>{usedMb} MB</strong> / 10 MB
				</span>
			</div>
			<div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
				<div
					className={`h-full transition-all ${
						storagePercentage >= 90 ? "bg-amber-500" : "bg-zinc-950"
					}`}
					style={{ width: `${storagePercentage}%` }}
				/>
			</div>
			<div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 gap-0.5 sm:gap-0">
				<span>Max single file size: 5 MB</span>
				<span>Accepted types: PDF, DOCX, TXT, MD</span>
			</div>
		</div>
	);
}
