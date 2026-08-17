"use client";

interface FormattedTextProps {
	content: string;
}

export function FormattedText({ content }: FormattedTextProps) {
	if (!content) return null;

	const paragraphs = content.split(/\n\n+/);

	return (
		<div className="space-y-2">
			{paragraphs.map((para, pIdx) => {
				const lines = para.split("\n");
				return (
					<p key={pIdx} className="leading-relaxed">
						{lines.map((line, lIdx) => {
							const cleanLine = line.replace(/^[\*\-]\s+/, "• ");
							const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

							return (
								<span key={lIdx}>
									{parts.map((part, ptIdx) => {
										if (part.startsWith("**") && part.endsWith("**")) {
											return (
												<strong key={ptIdx} className="font-bold text-zinc-950">
													{part.slice(2, -2)}
												</strong>
											);
										}
										if (part.startsWith("*") && part.endsWith("*")) {
											return (
												<span key={ptIdx} className="font-semibold italic">
													{part.slice(1, -1)}
												</span>
											);
										}
										return part.replace(/\*/g, "");
									})}
									{lIdx < lines.length - 1 && <br />}
								</span>
							);
						})}
					</p>
				);
			})}
		</div>
	);
}
