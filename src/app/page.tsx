'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false, loading: () => null });
import DockNav from "@/components/DockNav";
import ProfileCard from "@/components/ProfileCard";
import LogoLoop from "@/components/LogoLoop";
import MagicBento from "@/components/MagicBento";
import TextPressureWrapper from "@/components/TextPressureWrapper";
import SpotlightCard from "@/components/SpotlightCard";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPostgresql, SiFigma } from 'react-icons/si';
import portfolioStore from '@/utils/portfolioStore';
import type { Skill, UserProfile } from '@/types/portfolio';

type HomeProfile = UserProfile;

const fallbackSkills: Skill[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'] },
  { category: 'Backend & Tools', items: ['Node.js', 'SQL', 'APIs', 'Git', 'DevOps'] },
  { category: 'Design & UX', items: ['Figma', 'Interaction Design', 'UI/UX', 'Animation', 'Accessibility'] },
  { category: '3D & Graphics', items: ['three.js', 'WebGL', 'GLSL', 'Canvas', 'SVG'] },
];

export default function Home() {
  const [profile, setProfile] = useState<HomeProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((state) => {
      setProfile(state.profile ?? null);
      setSkills(state.skills?.length ? state.skills : fallbackSkills);
    });
    return () => {
      unsub();
    };
  }, []);

  const visualCards = profile?.visualIdentityCards?.length
    ? profile.visualIdentityCards
    : [
        { imageSrc: profile?.visualIdentity || '/avatar-placeholder.jpg' },
        { imageSrc: '/lanyard.png' },
        { imageSrc: '/avatar-placeholder.jpg' },
        { imageSrc: '/lanyard.png' },
        { imageSrc: '/avatar-placeholder.jpg' },
        { imageSrc: '/lanyard.png' },
      ];

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05060a] text-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .fade-in-up-1 { animation-delay: 0.1s; }
        .fade-in-up-2 { animation-delay: 0.2s; }
        .fade-in-up-3 { animation-delay: 0.3s; }
        .fade-in-up-4 { animation-delay: 0.4s; }

        @media (prefers-reduced-motion: reduce) {
          .fade-in-up {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(106,76,255,0.36),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(255,142,219,0.18),transparent_28%),linear-gradient(180deg,#090a11_0%,#05060a_55%,#030409_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      <LiquidEther
        className="absolute inset-0 hidden lg:block opacity-40 xl:opacity-60"
        colors={["#5f2cff", "#ff8edb", "#bca7ff"] as string[]}
        mouseForce={18}
        cursorSize={96}
        isViscous={false}
        viscous={30}
        iterationsViscous={4}
        iterationsPoisson={6}
        resolution={0.25}
        isBounce={false}
        BFECC={false}
        autoDemo={true}
        autoSpeed={0.45}
        autoIntensity={2.1}
        takeoverDuration={0.25}
        autoResumeDelay={2500}
        autoRampDuration={0.6}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-28 lg:px-10 lg:py-8 lg:pb-32">

        <section id="education" className="py-6 lg:py-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start grid-cols-1">
            <div className="space-y-12 w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
              {/* Greeting / Hook */}
              <div className="space-y-4 fade-in-up fade-in-up-1">
                <p className="text-xs uppercase tracking-[0.34em] text-white/45">HELLO, I'M HIFZHAN FAUZI</p>
                <TextPressureWrapper text={"Full-Stack Developer &\nCreative Technologies"} />
              </div>

              {/* Now Section */}
              <div className="fade-in-up fade-in-up-2">
                <SpotlightCard className="rounded-2xl bg-white/[0.05] p-6" spotlightColor="rgba(125, 190, 255, 0.22)">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/45">Currently</p>
                      <p className="mt-2 text-base leading-6 text-white/80">
                        Currently pursuing a Bachelor of Computer Science (Software Development) at Universiti Teknikal Malaysia Melaka (UTeM).
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              {/* About Me */}
              <div className="fade-in-up fade-in-up-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white mb-4">About me</h3>
                <div className="space-y-4 text-sm leading-7 text-white/70">
                  <p>
                    I'm a passionate developer with a deep love for creating elegant, user-focused digital experiences. My journey spans from design fundamentals to complex full-stack architecture, with a particular focus on motion, performance, and developer experience.
                  </p>
                  <p>
                    When I'm not coding, I'm exploring creative tools, contributing to open-source projects, or experimenting with new interaction patterns. I believe great digital products are built at the intersection of thoughtful design and solid engineering.
                  </p>
                </div>
              </div>

              {/* removed skills (moved to right column) */}

              {/* Contact removed per request */}
            </div>

            {/* Profile Card - Right Side */}
            <div className="flex justify-center w-full lg:sticky lg:top-0 fade-in-up fade-in-up-4">
              <div className="w-full max-w-xs sm:max-w-sm lg:w-auto">
                <ProfileCard
                  name="Zhandev"
                  title="Full-Stack Developer"
                  handle="zhandev"
                  status="Online"
                  contactText="GitHub"
                  contactUrl="https://github.com/hifzh4n"
                  showUserInfo={true}
                  showHeader={false}
                  enableTilt={true}
                  enableMobileTilt={false}
                  behindGlowColor="rgba(125, 190, 255, 0.67)"
                  behindGlowSize="50%"
                  behindGlowEnabled={true}
                  innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 fade-in-up fade-in-up-4">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white mb-6">Visual Identity</h3>
            <MagicBento
              cards={visualCards}
              imageOnly
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
            />
          </div>

          {/* Skills full-width below About and ProfileCard */}
          <div className="mt-12 fade-in-up fade-in-up-4">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white mb-6">Skills & expertise</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((group) => (
                <SpotlightCard key={group.category} className="rounded-xl bg-white/5 p-4" spotlightColor="rgba(255, 255, 255, 0.18)">
                  <h4 className="mb-3 text-sm font-semibold text-white/90">{group.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {skill}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Logo Loop below Skills */}
          <div className="mt-16 fade-in-up fade-in-up-4">
            <LogoLoop
              logos={[
                { node: <SiReact />, title: "React", href: "https://react.dev" },
                { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
                { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
                { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
                { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
                { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
                { node: <SiFigma />, title: "Figma", href: "https://figma.com" },
              ]}
              speed={100}
              direction="left"
              logoHeight={48}
              gap={48}
              pauseOnHover={true}
              scaleOnHover={true}
              fadeOut={false}
              ariaLabel="Technology stack"
            />
          </div>

        </section>

        {/* Removed experience, achievements, projects, services, and contact sections per user request */}
      </div>

      <DockNav />
    </main>
  );
}
