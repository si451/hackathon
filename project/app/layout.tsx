import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'CreatorConnect',
  description: 'Connect with creators and grow your brand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} bg-cc-black min-h-screen`}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,148,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,255,148,0.05),transparent_70%)]"></div>
        <ThemeProvider defaultTheme="dark">
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}