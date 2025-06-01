"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-cc-black/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-cc-white font-mono font-bold text-xl flex items-center">
              <span className="text-cc-green">Creator</span>
              Connect
              <Sparkles className="ml-2 h-4 w-4 text-cc-green" />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/discover">Discover</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            
            <Button className="ml-4 bg-gradient-to-r from-cc-green to-cc-green-dark text-cc-black hover:shadow-[0_0_15px_rgba(0,255,148,0.4)] transition-all duration-300">
              Get Started
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-cc-white hover:text-cc-green transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-cc-black border-t border-cc-gray shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <MobileNavLink href="/discover" onClick={() => setIsMenuOpen(false)}>Discover</MobileNavLink>
              <MobileNavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
              
              <Button 
                className="mt-3 w-full bg-gradient-to-r from-cc-green to-cc-green-dark text-cc-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="relative px-3 py-2 text-cc-white hover:text-cc-green font-medium rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="px-3 py-2 text-cc-white hover:text-cc-green font-medium block border-b border-cc-gray-light/20"
    >
      {children}
    </Link>
  );
}