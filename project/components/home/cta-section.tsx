import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <div className="container py-16 md:py-24">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#121212] via-[#121212] to-[#1F1F1F] p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            Ready to transform your influencer marketing?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Join thousands of brands and creators using CreatorConnect to streamline campaigns and boost ROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/search" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#00FFFF] text-black hover:bg-[#00DDDD]">
                Browse Creators
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract gradient shapes */}
        <div className="absolute top-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-[#00FFFF]/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-0 -z-10 h-48 w-48 rounded-full bg-[#FF00FF]/20 blur-3xl" />
      </div>
    </div>
  );
}