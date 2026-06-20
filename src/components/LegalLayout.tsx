// Shared chrome for legal pages (Privacy, Terms). Renders a
// sticky table-of-contents alongside the main body so long
// pages remain navigable. Section anchors flow from `headings`.
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  title: string;
}

interface Props {
  toc: LegalSection[];
  children: ReactNode;
}

export const LegalLayout: React.FC<Props> = ({ toc, children }) => (
  <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-[1fr_2.5fr] gap-10">
    {/* Sticky TOC */}
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="rounded-3xl border border-ink-100 bg-white p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">
          On this page
        </h3>
        <ul className="space-y-1.5 text-sm">
          {toc.map(s => (
            <li key={s.id}>
              <Link
                href={`#${s.id}`}
                className="text-ink-600 hover:text-brand-600 transition">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-ink-100 bg-ink-50/50 p-5 mt-4 text-xs text-ink-500">
        Questions? Email{' '}
        <a href="mailto:sales@sinaitaxi.com" className="font-semibold text-ink-700 hover:text-brand-600">
          sales@sinaitaxi.com
        </a>
        {' '}— we usually respond within one business day.
      </div>
    </aside>

    {/* Body — legal prose tuned for readability */}
    <article className="
      [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:first:mt-0
      [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
      [&_p]:text-ink-700 [&_p]:leading-relaxed [&_p]:mb-4
      [&_strong]:text-ink-900
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ul]:text-ink-700 [&_ul]:leading-relaxed
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:mb-4 [&_ol]:text-ink-700 [&_ol]:leading-relaxed
      [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-700
      [&_code]:font-mono [&_code]:text-sm [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
      max-w-prose">
      {children}
    </article>
  </div>
);
