// Reusable hero band for standalone pages (How it works, Why us,
// Privacy, Terms). Same navy gradient + radial-bloom backdrop as
// the country page hero, but with a tighter centred layout so it
// works for both marketing copy and dry legal pages.
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  /** Optional date stamp shown after the subtitle — used by legal pages. */
  effectiveDate?: string;
}

export const PageHero: React.FC<Props> = ({ eyebrow, title, subtitle, effectiveDate }) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
    <div
      aria-hidden
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          'radial-gradient(circle at 80% -10%, rgba(83,136,255,0.55), transparent 50%), radial-gradient(circle at 10% 110%, rgba(245,166,35,0.18), transparent 45%)',
      }}
    />
    <div className="relative mx-auto max-w-3xl px-6 pt-16 pb-20 text-center text-white">
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white/90 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-accent-400" />
          {eyebrow}
        </span>
      ) : null}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-[1.05]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-6 text-lg text-white/75 leading-relaxed">{subtitle}</p>
      ) : null}
      {effectiveDate ? (
        <p className="mt-4 text-xs uppercase tracking-widest text-white/50">
          Effective {effectiveDate}
        </p>
      ) : null}
    </div>
  </section>
);
