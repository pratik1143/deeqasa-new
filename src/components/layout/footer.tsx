import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  Company: [
    { name: 'About DeeQasa', href: '#' },
    { name: 'Leadership Team', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Newsroom', href: '#' },
  ],
  Solutions: [
    { name: 'Cloud Services', href: '#' },
    { name: 'Cybersecurity', href: '#' },
    { name: 'Data Center', href: '#' },
    { name: 'Managed Services', href: '#' },
    { name: 'AI Solutions', href: '#' },
  ],
  Resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Library', href: '#' },
    { name: 'Status Page', href: '#' },
    { name: 'Support Portal', href: '#' },
    { name: 'Training', href: '#' },
  ],
  'Legal & Social': [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Compliance Certifications', href: '#' },
    { name: 'LinkedIn | Twitter | GitHub', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Image 
              src="/logo_hp.png" 
              alt="DEEQASA TECH" 
              width={140} 
              height={35} 
              className="h-8 w-auto object-contain mb-4"
            />
            <p className="mt-2 text-sm text-muted-foreground">Smart. Secure. Sustainable.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-headline text-md font-semibold">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deeqasa Tech. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Official HP Partner</span>
            <span className="h-4 w-px bg-border" />
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
