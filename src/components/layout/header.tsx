"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LogOut, Menu, Sun, Moon, User as UserIcon } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/solutions" },
  { name: "Industries", href: "/industries" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Resources", href: "/resources" },
  { name: "Support", href: "/support" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Hidden Access States
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      document.documentElement.classList.add("light");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Keyboard Shortcut Trigger: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/login');
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  // Hidden Logo Click Logic (Triple Click)
  const handleLogoClick = () => {
    logoClickCount.current += 1;
    
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    
    if (logoClickCount.current === 3) {
      logoClickCount.current = 0;
      router.push('/login');
      return;
    }

    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1000); // Reset after 1 second of inactivity
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print h-20 flex items-center border-b bg-background border-white/10 shadow-lg",
      isScrolled && "shadow-primary/5 border-primary/10"
    )}>
      <div className="container-enterprise flex justify-between items-center h-full">
        <div className="flex items-center">
          <div 
            onClick={handleLogoClick}
            className="flex flex-col justify-center cursor-default select-none active:scale-[0.98] transition-transform"
          >
            <Link href="/" className="pointer-events-none">
              <span className="text-2xl font-black tracking-tight text-foreground uppercase whitespace-nowrap leading-none">
                DEEQASA TECH
              </span>
            </Link>
            <span className="text-[9px] font-black tracking-[0.4em] text-primary uppercase mt-1.5 ml-0.5 pointer-events-none">
              HP CONNECT
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "relative h-full flex items-center text-xs font-bold uppercase tracking-widest transition-colors duration-200 py-2",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
            <Button 
              variant="ghost" 
              className="hidden xl:inline-flex text-muted-foreground font-bold hover:bg-white/5 hover:text-foreground"
              onClick={() => router.push('/contact')}
            >
              Contact Sales
            </Button>
            
            {isUserLoading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            ) : user && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="hidden sm:flex items-center gap-2 border-primary/30 text-primary bg-primary/5 font-bold h-10 px-4 text-xs" 
                  onClick={() => router.push('/dashboard')}
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Admin Terminal</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-white/10 w-[300px] p-0 font-body">
                <SheetHeader className="p-6 border-b border-white/5 bg-white/5">
                  <SheetTitle className="text-left">
                    <span className="text-xl font-black tracking-tight text-foreground uppercase whitespace-nowrap leading-none block">
                      DEEQASA TECH
                    </span>
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-2">HP CONNECT</p>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-6 space-y-6">
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "text-sm font-bold uppercase tracking-[0.2em] py-2 transition-colors",
                          pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <Button 
                      className="w-full h-12 bg-white/5 border border-white/10 text-muted-foreground font-bold hover:bg-white/10 hover:text-foreground justify-start px-4"
                      onClick={() => { setIsMenuOpen(false); router.push('/contact'); }}
                    >
                      Contact Sales
                    </Button>
                    
                    {user && (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full h-12 flex items-center gap-2 border-primary/30 text-primary bg-primary/5 font-bold justify-start px-4" 
                          onClick={() => { setIsMenuOpen(false); router.push('/dashboard'); }}
                        >
                          <UserIcon className="h-3.5 w-3.5" />
                          <span>Admin Terminal</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full h-12 flex items-center gap-2 text-muted-foreground font-bold justify-start px-4" 
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-8 left-6 right-6">
                  <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] text-center">
                    Secure Terminal v4.0.1
                  </p>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
