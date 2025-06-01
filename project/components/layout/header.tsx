"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Zap, Search, BarChart2, Users, MessageSquare, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/creators", label: "Creators", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Zap className="h-6 w-6 text-[#00FF94]" />
              <span className="font-bold text-xl font-mono text-white hidden sm:inline-block">
                {APP_NAME}
              </span>
            </Link>
          </div>

          {!isHomePage && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors font-mono",
                      pathname === item.href
                        ? "bg-[#1A1A1A] text-[#00FF94]"
                        : "text-white hover:text-[#00FF94] hover:bg-[#1A1A1A]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isHomePage && (
              <Link href="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#00FF94]"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-xs font-mono">JD</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}