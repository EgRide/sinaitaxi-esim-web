// Per-country OG image. Renders the flag emoji + country name +
// "from €X" so a link shared on social or in chat carries enough
// information to be clickable on its own.
import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

export const runtime = 'edge';
export const alt = 'Travel eSIM for this destination';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const flag = (code: string): string => {
  if (code.length !== 2) return '🌍';
  const A = 0x1F1E6;
  return String.fromCodePoint(A + code.charCodeAt(0) - 65, A + code.charCodeAt(1) - 65);
};

// Same deterministic per-country palette used on the tiles + hero,
// so the OG card matches the visual identity of the page it links to.
const PALETTE: [string, string, string][] = [
  ['#1E3A8A', '#3B82F6', '#60A5FA'],
  ['#7C2D12', '#EA580C', '#FB923C'],
  ['#064E3B', '#10B981', '#34D399'],
  ['#581C87', '#A855F7', '#C084FC'],
  ['#155E75', '#06B6D4', '#22D3EE'],
  ['#7F1D1D', '#DC2626', '#F87171'],
  ['#1E40AF', '#0EA5E9', '#7DD3FC'],
  ['#4C1D95', '#7C3AED', '#A78BFA'],
  ['#9D174D', '#EC4899', '#F472B6'],
  ['#365314', '#65A30D', '#A3E635'],
  ['#78350F', '#D97706', '#FBBF24'],
  ['#1F2937', '#0F766E', '#14B8A6'],
];
const gradientFor = (code: string): [string, string, string] => {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
};

export default async function CountryOgImage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(upper) ?? upper;

  let planCount = 0;
  let lowestEur: number | null = null;
  try {
    const pkgs = await api.packages(upper);
    planCount = pkgs.length;
    lowestEur = pkgs.reduce((m, p) => (p.retailPrice > 0 && p.retailPrice < m ? p.retailPrice : m), Infinity);
    if (!Number.isFinite(lowestEur)) lowestEur = null;
  } catch { /* fall through */ }

  const [c1, c2, c3] = gradientFor(upper);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 64,
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
          position: 'relative',
        }}>
        {/* Radial highlight */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            right: -260,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
          }}
        />

        {/* Top eyebrow */}
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            zIndex: 1,
          }}>
          Travel eSIM for
        </div>

        {/* Hero — flag + country name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            marginTop: 24,
            zIndex: 1,
          }}>
          <div
            style={{
              width: 156,
              height: 156,
              borderRadius: 78,
              background: 'rgba(255,255,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 96,
            }}>
            {flag(upper)}
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 108,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 0.95,
              maxWidth: 800,
            }}>
            {name}
          </div>
        </div>

        {/* Mid stats */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
            zIndex: 1,
          }}>
          {lowestEur != null ? (
            <Chip text={`From €${lowestEur.toFixed(2)}`} bold />
          ) : null}
          <Chip text={`${planCount || 'Multiple'} plans`} />
          <Chip text="Pay in EUR" />
          <Chip text="Instant activation" />
        </div>

        {/* Footer brand */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'auto',
            zIndex: 1,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: 28,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <path d="M9 13h6M9 17h6M9 9h3" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: 'white', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
                Sinai<span style={{ color: 'rgba(255,255,255,0.7)' }}>Taxi</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', marginTop: 2 }}>
                eSIM
              </div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 700 }}>
            esim.sinaitaxi.com/destinations/{code.toLowerCase()}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

const Chip: React.FC<{ text: string; bold?: boolean }> = ({ text, bold }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 22px',
      borderRadius: 999,
      background: bold ? 'white' : 'rgba(255,255,255,0.18)',
      color: bold ? '#0A1733' : 'white',
      fontSize: 24,
      fontWeight: bold ? 800 : 600,
      letterSpacing: -0.3,
    }}>
    {text}
  </div>
);
