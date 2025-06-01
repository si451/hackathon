import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-transparent" />
      <div className="container relative flex flex-col items-center justify-center space-y-8 py-16 md:py-24 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-10 w-10 text-[#00FF94]" />
            <h1 className="text-4xl font-extrabold tracking-tight font-mono text-white sm:text-5xl md:text-6xl">
              {APP_NAME}
            </h1>
          </div>
          <h2 className="text-3xl font-bold tracking-tight font-mono text-white sm:text-4xl">
            AI-Powered Influencer Marketing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#00FF94] font-mono md:text-xl">
            Automate the entire campaign lifecycle from discovery to reporting,
            powered by artificial intelligence.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-[#00FF94] text-black hover:bg-[#00FF94]/90 font-mono">
              Browse Creators
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-[#00FF94]/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-[#00FF94]/5 blur-3xl" />
      </div>
    </div>
  );
}