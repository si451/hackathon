"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("mb-8", className)}
    >
      {breadcrumbs && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <a 
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </a>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5"
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          )}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-3xl font-bold tracking-tight"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-1 text-lg text-muted-foreground"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>
        
        {actions && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}