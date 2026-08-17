"use client";

import { FileText, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DocumentItem } from "@/actions/documents";

interface DocumentListProps {
	documents: DocumentItem[];
	onDeleteDoc: (docId: string, fileName: string) => void;
}

export function DocumentList({ documents, onDeleteDoc }: DocumentListProps) {
	return (
		<Card className="border-zinc-200 bg-white shadow-2xs">
			<CardHeader className="p-4 sm:p-5 pb-3">
				<CardTitle className="text-base font-bold text-zinc-950">
					Ingested Knowledge Base ({documents.length})
				</CardTitle>
				<CardDescription className="text-xs text-zinc-500">
					List of all active documents available for similarity grounding in this pod.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-4 sm:p-5 pt-0">
				{documents.length > 0 ? (
					<div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
						{documents.map((doc) => {
							const fileMb = (doc.file_size_bytes / (1024 * 1024)).toFixed(2);
							return (
								<div
									key={doc.id}
									className="flex flex-col sm:flex-row sm:items-center justify-between p-3 text-xs gap-3 transition-colors hover:bg-zinc-50/80"
								>
									<div className="flex items-center gap-3 min-w-0">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 font-bold">
											<FileText className="h-4 w-4" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="truncate font-semibold text-zinc-950 max-w-[200px] sm:max-w-xs md:max-w-md">
												{doc.file_name}
											</div>
											<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] text-zinc-500">
												<span>{fileMb} MB</span>
												<span>•</span>
												{doc.chunk_count ? (
													<>
														<span className="font-semibold text-emerald-700">
															{doc.chunk_count} Chunks
														</span>
														<span>•</span>
													</>
												) : null}
												<span className="truncate max-w-[140px] sm:max-w-[200px]">{doc.storage_path}</span>
											</div>
										</div>
									</div>

									<div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
										<Badge
											variant="outline"
											className={`text-[10px] font-semibold ${
												doc.status === "READY"
													? "border-emerald-200 bg-emerald-50 text-emerald-700"
													: doc.status === "PROCESSING"
													? "border-amber-200 bg-amber-50 text-amber-700"
													: "border-red-200 bg-red-50 text-red-700"
											}`}
										>
											{doc.status === "PROCESSING" ? (
												<span className="flex items-center gap-1">
													<RefreshCw className="h-3 w-3 animate-spin" /> PROCESSING
												</span>
											) : (
												doc.status
											)}
										</Badge>

										<Button
											variant="ghost"
											size="icon"
											onClick={() => onDeleteDoc(doc.id, doc.file_name)}
											className="h-8 w-8 text-zinc-400 hover:bg-red-50 hover:text-red-600"
											title="Purge Document"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-6 sm:p-8 text-center">
						<FileText className="mx-auto h-8 w-8 text-zinc-400" />
						<p className="mt-2 text-xs font-semibold text-zinc-700">
							No documents uploaded yet
						</p>
						<p className="text-[11px] text-zinc-500">
							Upload your first document above to enable RAG similarity search.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
