"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  User 
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  
  const getIcon = (icon: string) => {
    switch (icon) {
      case "search":
        return <Search className="h-5 w-5" />;
      case "layout-dashboard":
        return <LayoutDashboard className="h-5 w-5" />;
      case "message-square":
        return <MessageSquare className="h-5 w-5" />;
      case "bar-chart":
        return <BarChart className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full grid-cols-5">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "transition-colors duration-300",
                isActive 
                  ? "text-[#00FFFF]" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className="flex items-center justify-center">
                {getIcon(item.icon)}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}