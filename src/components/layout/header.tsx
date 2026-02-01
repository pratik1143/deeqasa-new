import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-headline font-bold tracking-tighter text-foreground transition-colors hover:text-primary">
            DEEQASA
          </h1>
        </Link>
      </div>
    </header>
  );
}
