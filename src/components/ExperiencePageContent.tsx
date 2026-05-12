 'use client';

import { useEffect, useState } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import ShinyText from '@/components/ShinyText';
import DockNav from '@/components/DockNav';
import LiquidEtherBackground from '@/components/LiquidEtherBackground';

import type { Experience } from '@/types/portfolio';
import portfolioStore from '@/utils/portfolioStore';

type ExperienceCardProps = Experience;

function ExperienceCard({ period, title, company, details, tags }: ExperienceCardProps) {
  return (
    <SpotlightCard className="rounded-3xl bg-white/[0.05]" spotlightColor="rgba(255, 255, 255, 0.18)">
      <article>
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">{period}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-cyan-300/90">{company}</p>
        <p className="mt-4 text-sm leading-7 text-white/72">{details}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </SpotlightCard>
  );
}

function useExperienceData() {
  const [data, setData] = useState<Experience[]>([]);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => setData(s.experience));
    return () => {
      unsub();
    };
  }, []);

  return data;
}

export default function ExperiencePageContent() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05060a] text-white" id="experience">
      <LiquidEtherBackground />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 lg:px-10 lg:py-10 lg:pb-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.34em] text-white/45">Experience</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-6xl">
            Work experience
          </h1>
        </div>

        <div className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          <ShinyText
            text="A concise view of the work, responsibilities, and technical focus that shaped my work journey."
            speed={2}
            delay={0}
            color="#b5b5b5"
          />
        </div>

        <section className="mt-12 space-y-6">
          {useExperienceData().map((item, index) => (
            <ExperienceCard
              key={`${item.company}-${index}`}
              period={item.period}
              title={item.title}
              company={item.company}
              details={item.details}
              tags={item.tags}
            />
          ))}
        </section>
      </div>

      <DockNav />
    </main>
  );
}
