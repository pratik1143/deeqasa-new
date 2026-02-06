"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search, LogIn, LogOut, Menu } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";

const baseNavLinks = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
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
  const pathname = usePathname();

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

  const navLinks = user 
    ? [...baseNavLinks, ...protectedLinks]
    : baseNavLinks;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print h-20 flex items-center border-b",
      isScrolled || pathname !== '/' 
        ? "bg-black/95 border-white/10 shadow-2xl backdrop-blur-md" 
        : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="group transition-transform duration-250 hover:scale-[1.03] flex items-center">
            <span className="text-xl font-black tracking-[0.15em] text-white uppercase">
              DEEQA SA TECH
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-8 h-8">
              <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Enterprise Infrastructure</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "relative h-full flex items-center text-sm font-semibold tracking-tight transition-colors duration-200 py-2",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 scale-x-0 group-hover:scale-x-100",
                  isActive && "scale-x-100"
                )} />
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden xl:inline-flex text-muted-foreground font-bold hover:bg-white/5 hover:text-white">
              Contact Sales
            </Button>
            
            {isUserLoading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            ) : user ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-white/10 hover:bg-white/5 font-bold" 
                onClick={handleSignOut}
              >
                <span className="hidden sm:inline">Sign Out</span>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-white/10 hover:bg-white/5 font-bold" 
                onClick={handleSignIn}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Access</span>
              </Button>
            )}

            <Button size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 w-10 transition-shadow hover:shadow-lg hover:shadow-primary/20">
                <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
        </div>
      </div>
    </header>
  );
}