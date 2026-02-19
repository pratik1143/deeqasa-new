import Link from 'next/link';

const footerLinks = {
  Company: [
    { name: 'About DEEQASA TECH', href: '#' },
    { name: 'Infrastructure Solutions', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Newsroom', href: '#' },
  ],
  Enterprise: [
    { name: 'Cloud Services', href: '#' },
    { name: 'Cybersecurity', href: '#' },
    { name: 'Data Center', href: '#' },
    { name: 'Managed Services', href: '#' },
  ],
  Support: [
    { name: 'Partner Portal', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Status Page', href: '#' },
    { name: 'Training', href: '#' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Compliance', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 mt-24">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          <div className="col-span-2">
            <Link href="/" className="block mb-6">
              <span className="text-2xl font-black tracking-[0.25em] text-white uppercase whitespace-nowrap">
                DEEQASA TECH
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Smart. Secure. Sustainable. Infrastructure solutions designed for the modern enterprise era.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} DEEQASA TECH. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Operational
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
