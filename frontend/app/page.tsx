/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import {
	LandingArchitectureFlow,
	LandingCtaSection,
	LandingFeatures,
	LandingFooter,
	LandingHero,
	LandingNavbar,
	LandingProductMockup,
	LandingSpecifications,
} from "@/components/landing";

function LandingPageContent() {
	const searchParams = useSearchParams();
	const authQuery = searchParams.get("auth");

	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">(
		"login",
	);

	useEffect(() => {
		if (authQuery === "login" || authQuery === "signup") {
			setAuthDefaultTab(authQuery);
			setAuthModalOpen(true);
		}
	}, [authQuery]);

	const handleOpenAuthModal = (tab: "login" | "signup") => {
		setAuthDefaultTab(tab);
		setAuthModalOpen(true);
	};

	return (
		<div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
			<LandingNavbar onOpenAuthModal={handleOpenAuthModal} />
			<main className="flex-1">
				<LandingHero onOpenAuthModal={handleOpenAuthModal} />
				<LandingProductMockup />
				<LandingFeatures />
				<LandingArchitectureFlow />
				<LandingSpecifications />
				<LandingCtaSection onOpenAuthModal={handleOpenAuthModal} />
			</main>
			<LandingFooter />

			<AuthModal
				open={authModalOpen}
				onOpenChange={setAuthModalOpen}
				defaultTab={authDefaultTab}
			/>
		</div>
	);
}

export default function Home() {
	return (
		<Suspense fallback={null}>
			<LandingPageContent />
		</Suspense>
	);
}
