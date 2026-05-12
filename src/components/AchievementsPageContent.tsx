'use client';

import { useEffect, useState } from 'react';
import DockNav from '@/components/DockNav';
import TrueFocus from '@/components/TrueFocus';
import ShinyText from '@/components/ShinyText';
import MagicBento from '@/components/MagicBento';
import LiquidEtherBackground from '@/components/LiquidEtherBackground';
import type { Achievement } from '@/types/portfolio';
import portfolioStore from '@/utils/portfolioStore';

export default function AchievementsPageContent() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => setAchievements(s.achievements || []));
    return () => {
      unsub();
    };
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05060a] text-white" id="achievements">
      <LiquidEtherBackground />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-28 lg:px-10 lg:py-8 lg:pb-32">
        <div className="max-w-3xl text-left">
          <p className="text-xs uppercase tracking-[0.34em] text-white/45">Achievements</p>
          <div className="mt-4 text-left">
            <TrueFocus
              sentence="Certifications and awards"
              manualMode={false}
              blurAmount={5}
              borderColor="#5227FF"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
          </div>
          <div className="mt-4 max-w-2xl text-left">
            <ShinyText
              text="A space for certificates, awards, and other recognition. Replace these image placeholders with your own achievement images whenever you are ready."
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="text-sm leading-7 sm:text-base"
            />
          </div>
        </div>

        <div className="mt-12">
          <MagicBento
            cards={achievements}
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
            imageOnly={false}
          />
        </div>
      </div>

      <DockNav />
    </main>
  );
}
