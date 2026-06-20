'use client';

// Trust band — dark gradient with three big animated counters.
// Real numbers where we can quote them.
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
  countryCount: number;
}

export const Stats: React.FC<Props> = ({ countryCount }) => (
  <section className="relative">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
    <div
      aria-hidden
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          'radial-gradient(circle at 80% 30%, rgba(83,136,255,0.35), transparent 50%)',
      }}
    />
    <div className="relative mx-auto max-w-6xl px-6 py-20 grid sm:grid-cols-3 gap-10 text-white">
      <Counter target={countryCount} suffix="+" label="Destinations supported" />
      <Counter target={60} suffix="s"   label="Average activation time" />
      <Counter target={99.9} decimals={1} suffix="%" label="Network uptime" />
    </div>
  </section>
);

const Counter: React.FC<{
  target: number;
  suffix?: string;
  decimals?: number;
  label: string;
}> = ({ target, suffix = '', decimals = 0, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="text-5xl lg:text-6xl font-extrabold tracking-tightest leading-none">
        {v.toFixed(decimals)}{suffix}
      </motion.div>
      <div className="mt-3 text-sm text-white/70">{label}</div>
    </div>
  );
};
