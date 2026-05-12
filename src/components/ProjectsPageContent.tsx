 'use client';

import { useEffect, useState } from 'react';
import DockNav from '@/components/DockNav';
import ShinyText from '@/components/ShinyText';
import SplitText from '@/components/SplitText';
import type { Project } from '@/types/portfolio';
import ProjectsGrid from '@/components/ProjectsGrid';
import LiquidEtherBackground from '@/components/LiquidEtherBackground';
import portfolioStore from '@/utils/portfolioStore';

function useProjects() {
  const [data, setData] = useState<Project[]>([]);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => setData(s.projects));
    return unsub;
  }, []);

  return data;
}

export default function ProjectsPageContent() {
  const projects = useProjects();

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05060a] text-white" id="projects">
      <LiquidEtherBackground />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 lg:px-10 lg:py-10 lg:pb-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.34em] text-white/45">Projects</p>
          <SplitText
            text="My projects"
            className="text-2xl sm:text-4xl lg:text-6xl font-semibold tracking-[-0.05em] text-white mt-4"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            tag="h1"
          />
        </div>

        <div className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          <ShinyText
            text="A collection of projects I've built, combining design, functionality, and innovation."
            speed={2}
            delay={0}
            color="#b5b5b5"
          />
        </div>

        <ProjectsGrid projects={projects} />

        <DockNav />
      </div>
    </main>
  );
}
