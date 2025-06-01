"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}