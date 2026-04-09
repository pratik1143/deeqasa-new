import Link from 'next/link';

const footerLinks = {
  Company: [
    { name: 'About DEEQASA TECH', href: '/about' },
    { name: 'Infrastructure Solutions', href: '/infrastructure' },
    { name: 'Careers', href: '/careers' },
    { name: 'Newsroom', href: '/newsroom' },
  ],
  Enterprise: [
    { name: 'Cloud Services', href: '/services/cloud' },
    { name: 'Cybersecurity', href: '/services/cybersecurity' },
    { name: 'Data Center', href: '/services/data-center' },
    { name: 'Managed Services', href: '/services/managed-services' },
  ],
  Support: [
    { name: 'Partner Portal', href: '/support/portal' },
    { name: 'Documentation', href: '/support/docs' },
    { name: 'Status Page', href: '/support/status' },
    { name: 'Training', href: '/support/training' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Compliance', href: '/legal/compliance' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 relative z-20">
      <div className="container-enterprise py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="block">
              <span className="text-3xl font-black tracking-tighter text-black uppercase font-[Outfit]">
                DEEQASA TECH
              </span>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-2">HP CONNECT PARTNER</p>
            </Link>
            <p className="text-lg text-slate-500 max-w-sm leading-relaxed font-bold italic">
              Architecting secure, sustainable, and intelligent digital infrastructure for the global enterprise.
            </p>
            <div className="flex gap-4">
               {['LinkedIn', 'Twitter', 'GitHub'].map(social => (
                 <Link key={social} href="#" className="h-12 w-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-tighter">{social[0]}</span>
                 </Link>
               ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black border-b border-slate-100 pb-4">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-50 bg-slate-50/30">
        <div className="container-enterprise py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} DEEQASA TECHNOLOGY PRIVATE LIMITED.
            </p>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">All Systems Nominal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">
             <span className="hover:text-primary cursor-default transition-colors">ISO 27001:2022</span>
             <span className="hover:text-primary cursor-default transition-colors">SOC2 TYPE II</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
