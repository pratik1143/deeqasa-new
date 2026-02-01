"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Dashboard", href: "/dashboard"},
  { name: "Industries", href: "#industries" },
  { name: "Sustainability", href: "#sustainability" },
  { name: "Insights", href: "#insights" },
  { name: "About", href: "#about" },
  { name: "Partners", href: "#partners" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-card/80 backdrop-blur-sm border-b border-border" : "bg-transparent",
      "p-4"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-2xl font-headline font-bold tracking-tighter text-foreground transition-colors hover:text-primary">
              DEEQASA
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-2 border-l border-border pl-4">
              <span className="text-xs font-bold tracking-wider text-muted-foreground">HP CONNECT PARTNER</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden md:inline-flex">Contact Sales</Button>
            <Button className="bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/50 transition-shadow rounded-full">Client Portal</Button>
            <Button variant="ghost" size="icon">
                <Search />
            </Button>
            {/* Hamburger menu for mobile would go here */}
        </div>
      </div>
    </header>
  );
}
