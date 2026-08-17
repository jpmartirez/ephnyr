"use client";

import { useRef } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DocumentUploadZoneProps {
	isUploading: boolean;
	onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentUploadZone({
	isUploading,
	onFileUpload,
}: DocumentUploadZoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<Card className="border-2 border-dashed border-zinc-300 bg-white p-4 sm:p-6 shadow-none text-center">
			<div className="flex flex-col items-center justify-center">
				<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
					<Upload className="h-5 w-5 sm:h-6 sm:w-6" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-zinc-950">
					Ingest New Documents
				</h3>
				<p className="mt-1 text-xs text-zinc-500 max-w-md">
					Upload your PDF, Markdown, Word (.docx), or plain text files. Documents will be chunked and indexed into Supabase pgvector for sub-500ms RAG lookups.
				</p>

				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
					onChange={onFileUpload}
					className="hidden"
					id="room-file-upload"
				/>

				<Button
					disabled={isUploading}
					onClick={() => fileInputRef.current?.click()}
					className="mt-4 w-full sm:w-auto bg-zinc-950 text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
				>
					{isUploading ? (
						<>
							<RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Ingesting File...
						</>
					) : (
						<>
							<Upload className="mr-1.5 h-3.5 w-3.5" /> Select File to Ingest
						</>
					)}
				</Button>
			</div>
		</Card>
	);
}
