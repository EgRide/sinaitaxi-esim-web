// Default Open Graph image — used when a page doesn't ship its
// own opengraph-image.tsx. Next.js renders this on demand at
// the edge using the JSX → PNG pipeline (no static asset to ship).
//
// Inspired by Vercel and Linear's OG cards: navy gradient with
// soft accent bloom + bold display typography + a single icon.
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sinai Taxi eSIM — Travel data without roaming fees';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'linear-gradient(135deg, #0A1733 0%, #0F2C66 60%, #1A4DBF 100%)',
          position: 'relative',
        }}>
        {/* Radial bloom in the top right */}
        <div
          style={{
            position: 'absolute',
            top: -300,
            right: -300,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(83,136,255,0.55) 0%, transparent 70%)',
          }}
        />

        {/* Top: brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #5388FF 0%, #1E5EFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(83,136,255,0.45)',
            }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <path d="M9 13h6M9 17h6M9 9h3" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'white', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
              Sinai<span style={{ color: '#9FB8FF' }}>Taxi</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', marginTop: 4 }}>
              eSIM
            </div>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, zIndex: 1 }}>
          <div style={{ color: '#9FB8FF', fontSize: 18, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            Travel data · 200+ countries
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 0.98,
              maxWidth: 1000,
            }}>
            Travel without{'\n'}roaming surprises.
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.3,
              maxWidth: 880,
            }}>
            One QR code. Pay in euros. Land already connected.
          </div>
        </div>

        {/* Bottom: stat strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
            borderTop: '1px solid rgba(255,255,255,0.18)',
            paddingTop: 32,
          }}>
          <div style={{ display: 'flex', gap: 48 }}>
            <Stat value="215+" label="Destinations" />
            <Stat value="60s" label="Install" />
            <Stat value="EUR" label="Pricing" />
          </div>
          <div style={{ color: '#9FB8FF', fontSize: 22, fontWeight: 700 }}>
            esim.sinaitaxi.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ color: 'white', fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);
