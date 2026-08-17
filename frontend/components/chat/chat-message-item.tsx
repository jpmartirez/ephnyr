"use client";

import { User, Bot } from "lucide-react";
import { FormattedText } from "./formatted-text";
import { SourceCitationsAccordion } from "./source-citations-accordion";
import type { ChatMessageItem as ChatMessageType } from "@/actions/chat";

interface ChatMessageItemProps {
	message: ChatMessageType;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
	const isUser = message.role === "user";

	return (
		<div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
			<div
				className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
					isUser ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-800"
				}`}
			>
				{isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
			</div>

			<div
				className={`flex flex-col space-y-2 max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
					isUser
						? "bg-zinc-950 text-white rounded-tr-xs"
						: "bg-white border border-zinc-200 text-zinc-900 rounded-tl-xs"
				}`}
			>
				<FormattedText content={message.content} />

				{!isUser && message.sources && (
					<SourceCitationsAccordion sources={message.sources} />
				)}
			</div>
		</div>
	);
}
