"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputBarProps {
	roomName: string;
	inputValue: string;
	isSending: boolean;
	onInputChange: (value: string) => void;
	onSubmit: (e?: React.FormEvent) => void;
}

export function ChatInputBar({
	roomName,
	inputValue,
	isSending,
	onInputChange,
	onSubmit,
}: ChatInputBarProps) {
	return (
		<footer className="border-t border-zinc-200 bg-white p-4">
			<form onSubmit={onSubmit} className="mx-auto flex max-w-4xl items-center gap-2">
				<Input
					type="text"
					placeholder={`Ask ${roomName} anything...`}
					value={inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					disabled={isSending}
					className="flex-1 border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-xs text-zinc-900 focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950/20"
				/>
				<Button
					type="submit"
					disabled={!inputValue.trim() || isSending}
					className="bg-zinc-950 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 shrink-0"
				>
					<Send className="h-4 w-4" />
				</Button>
			</form>
		</footer>
	);
}
