import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Ephnyr — Ephemeral Knowledge Pods & RAG Workspaces",
	description:
		"Multi-tenant RAG platform powered by Supabase pgvector and Groq LPU engine. Ultra-low latency query responses with atomic zero-trace teardown.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
				{children}
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							background: "#09090b",
							color: "#fff",
							fontSize: "12px",
							fontFamily: "var(--font-jetbrains-mono), monospace",
							border: "1px solid #27272a",
						},
					}}
				/>
			</body>
		</html>
	);
}
