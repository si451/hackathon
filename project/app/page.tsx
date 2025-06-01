import { HeroSection } from "@/components/home/hero-section";
import { FeatureSection } from "@/components/home/feature-section";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}