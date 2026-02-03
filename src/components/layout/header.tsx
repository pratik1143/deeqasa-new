"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search, LogIn, LogOut } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";

const baseNavLinks = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Industries", href: "#industries" },
  { name: "Sustainability", href: "https://www.hp.com/in-en/sustainable-impact.html" },
  { name: "About", href: "#about" },
];

const protectedLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Quotation Builder", href: "/quotation-builder" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  // Combine links based on authentication status
  const navLinks = user 
    ? [...baseNavLinks.slice(0, 2), ...protectedLinks, ...baseNavLinks.slice(2)]
    : baseNavLinks;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print",
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
            <Button asChild className="bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/50 transition-shadow duration-300 rounded-full">
              <a href="https://www.hp.com/in-en/shop/laptops-tablets/business-laptops.html" target="_blank" rel="noopener noreferrer">
                View Product
              </a>
            </Button>
            
            {isUserLoading ? (
              <Button variant="ghost" size="icon" disabled>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </Button>
            ) : user ? (
              <Button variant="ghost" className="flex items-center gap-2" onClick={handleSignOut} aria-label="Sign Out">
                <span className="hidden sm:inline">Sign Out</span>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" className="flex items-center gap-2" onClick={handleSignIn} aria-label="Sign In">
                <span className="hidden sm:inline">Admin Login</span>
                <LogIn className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="icon">
                <Search />
            </Button>
        </div>
      </div>
    </header>
  );
}