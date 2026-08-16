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

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
			<LandingNavbar />
			<main className="flex-1">
				<LandingHero />
				<LandingProductMockup />
				<LandingFeatures />
				<LandingArchitectureFlow />
				<LandingSpecifications />
				<LandingCtaSection />
			</main>
			<LandingFooter />
		</div>
	);
}
