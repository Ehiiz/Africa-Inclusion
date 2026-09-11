import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import Hero from "@/components/site/Hero";
import Challenge from "@/components/site/Challenge";
import WhyAfri from "@/components/site/WhyAfri";
import Expertise from "@/components/site/Expertise";
import UsageGap from "@/components/site/UsageGap";
import Audiences from "@/components/site/Audiences";
import Research from "@/components/site/Research";
import Process from "@/components/site/Process";
import Outcomes from "@/components/site/Outcomes";
import InsightsSection from "@/components/site/InsightsSection";
import Belief from "@/components/site/Belief";
import ClosingCta from "@/components/site/ClosingCta";

// The Insights section reads from the database on every request.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Challenge />
        <WhyAfri />
        <Expertise />
        <UsageGap />
        <Audiences />
        <Research />
        <Process />
        <Outcomes />
        <InsightsSection />
        <Belief />
        <ClosingCta />
      </main>
      <SiteFooter />
      <Reveal />
    </>
  );
}
