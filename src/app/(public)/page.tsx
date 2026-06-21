export const runtime = 'edge';

// Home — premium landing experience.
// Sections (top → bottom):
//   1. Hero with search bar + animated phone mockup
//   2. Popular destinations strip (handpicked, horizontal scroll on mobile)
//   3. How it works (3 numbered steps)
//   4. Why us / feature grid
//   5. Stats / trust band
//   6. Full country grid
import { api, type Country } from '@/lib/api';
import { CountrySearch } from '@/components/CountrySearch';
import { CountryCard } from '@/components/CountryCard';
import { Hero } from '@/components/sections/Hero';
import { PopularStrip } from '@/components/sections/PopularStrip';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhyUs } from '@/components/sections/WhyUs';
import { Stats } from '@/components/sections/Stats';
import { CountryGrid } from '@/components/sections/CountryGrid';

export default async function HomePage() {
  let countries: Country[] = [];
  let error: string | null = null;
  try {
    countries = await api.countries();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <Hero countries={countries} />
      <PopularStrip countries={countries} />
      <HowItWorks />
      <WhyUs />
      <Stats countryCount={countries.length} />
      <CountryGrid countries={countries} error={error} />
    </>
  );
}
