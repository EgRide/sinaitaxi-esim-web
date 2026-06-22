import Link from 'next/link';
import { ShieldCheck, Globe2, Zap } from 'lucide-react';
import { AppStoreBadges } from './AppStoreBadges';

export const SiteFooter: React.FC = () => (
  <footer className="mt-32 bg-brand-950 text-ink-300">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="text-2xl font-extrabold tracking-tighter text-white">
            Sinai<span className="text-brand-400">Taxi</span> eSIM
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            Travel data for over 200 destinations. Instant activation,
            transparent pricing, no roaming surprises.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge icon={<Zap className="h-3.5 w-3.5" />} label="Instant activation" />
            <Badge icon={<Globe2 className="h-3.5 w-3.5" />} label="200+ countries" />
            <Badge icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Stripe secured" />
          </div>
          <div className="mt-7">
            <h3 className="text-white text-xs font-bold tracking-wide uppercase mb-3">Get the app</h3>
            <AppStoreBadges />
          </div>
          <p className="mt-6 text-xs text-ink-400">
            Network partner:{' '}
            <a href="https://www.airalo.com" target="_blank" rel="noreferrer" className="text-ink-200 hover:text-white">
              Airalo
            </a>
          </p>
        </div>
        <FooterCol
          title="Travel"
          links={[
            { label: 'All destinations', href: '/' },
            { label: 'How it works',    href: '/how-it-works' },
            { label: 'Why us',          href: '/why-us' },
            { label: 'Install an eSIM', href: '/install-esim' },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: 'Sinai Taxi rides', href: 'https://sinaitaxi.com' },
            { label: 'Support',          href: 'mailto:sales@sinaitaxi.com' },
            { label: 'Privacy',          href: '/privacy' },
            { label: 'Terms',            href: '/terms' },
            { label: 'Refunds',          href: '/refund-policy' },
          ]}
        />
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>© {new Date().getFullYear()} Sinai Taxi Ltd. All rights reserved.</span>
          <span>Built in 2026 with Next.js &amp; Stripe.</span>
        </div>
        <p className="text-ink-400 leading-relaxed">
          Sinai Taxi Ltd — registered in England &amp; Wales,
          company number 14825809. Registered office: 71-75
          Shelton Street, Covent Garden, London WC2H 9JQ, United
          Kingdom.
        </p>
      </div>
    </div>
  </footer>
);

const FooterCol: React.FC<{ title: string; links: { label: string; href: string }[] }> = ({ title, links }) => (
  <div>
    <h3 className="text-white text-sm font-bold tracking-wide uppercase mb-3">{title}</h3>
    <ul className="space-y-2">
      {links.map(l => (
        <li key={l.href}>
          <Link href={l.href} className="text-sm hover:text-white transition">{l.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Badge: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
    {icon} {label}
  </span>
);
