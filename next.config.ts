import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Surfaced via `process.env.NEXT_PUBLIC_API_BASE_URL` to client
  // code AND server components. Defaults to local Railway dev URL.
  env: {
    // Intentionally repeated here so a missing env at boot
    // surfaces in the Next.js startup log rather than 500ing
    // a checkout request later.
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  },
};

export default config;
