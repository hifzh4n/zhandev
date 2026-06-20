 'use client';

import { useEffect, useState } from 'react';
import DockNav from '@/components/DockNav';
import ScrollVelocity from '@/components/ScrollVelocity';
import SpotlightCard from '@/components/SpotlightCard';
import type { Education } from '@/types/portfolio';
import LiquidEtherBackground from '@/components/LiquidEtherBackground';
import portfolioStore from '@/utils/portfolioStore';

function EducationStage({ year, title, school, details, logoUrl }: Education) {
  return (
    <SpotlightCard className="rounded-3xl bg-white/[0.05]" spotlightColor="rgba(255, 255, 255, 0.18)">
      <article className="flex gap-4">
        {logoUrl && (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/90">
            <img src={logoUrl} alt={`${school} logo`} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">{year}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-cyan-300/90">{school}</p>
        <p className="mt-4 text-sm leading-7 text-white/72">{details}</p>
        </div>
      </article>
    </SpotlightCard>
  );
}


function useEducationStages() {
  const [stages, setStages] = useState<Education[]>([]);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => setStages(s.education));
    return () => {
      unsub();
    };
  }, []);

  return stages;
}

export default function EducationPageContent() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05060a] text-white">
      <LiquidEtherBackground />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 lg:px-10 lg:py-10 lg:pb-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.34em] text-white/45">Education route</p>
          <h1 className="sr-only">My education background and flow</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            A simple timeline from primary school to bachelor degree, showing how each stage shaped my discipline, curiosity,
            and technical direction.
          </p>
        </div>

        <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3">
          <ScrollVelocity
            texts={['EDUCATION BACKGROUND']}
            velocity={100}
            className="education-scroll-text"
            numCopies={6}
            damping={50}
            stiffness={400}
          />
        </div>

        <section className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-300/30 via-cyan-300/50 to-cyan-300/30 lg:block"
          />

          <div className="space-y-6 lg:space-y-12">
            {useEducationStages().map((stage, index) => (
              <div
                key={`${stage.year}-${index}`}
                className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8"
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="hidden lg:block" />
                    <div className="flex justify-center">
                      <div className="h-3.5 w-3.5 rounded-full border-4 border-cyan-300 bg-cyan-300/20" aria-hidden="true" />
                    </div>
                    <EducationStage year={stage.year} title={stage.title} school={stage.school} details={stage.details} logoUrl={stage.logoUrl} />
                  </>
                ) : (
                  <>
                    <EducationStage year={stage.year} title={stage.title} school={stage.school} details={stage.details} logoUrl={stage.logoUrl} />
                    <div className="flex justify-center">
                      <div className="h-3.5 w-3.5 rounded-full border-4 border-cyan-300 bg-cyan-300/20" aria-hidden="true" />
                    </div>
                    <div className="hidden lg:block" />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <DockNav />
    </main>
  );
}
