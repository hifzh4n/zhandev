'use client';

import { useState } from 'react';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import type { Project } from '@/types/portfolio';
import SkeletonLoader from '@/components/SkeletonLoader';

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    Object.fromEntries(projects.map(p => [p.id, true]))
  );

  const handleImageLoad = (id: string) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  return (
    <section className="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:gap-8" aria-label="Projects grid">
      {projects.map((project) => (
        <SpotlightCard key={project.id} className="rounded-3xl bg-white/[0.05] group overflow-hidden">
          <div className="p-6 h-full flex flex-col">
            <div className="mb-4 w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-white/5 relative">
              {loadingImages[project.id] && (
                <SkeletonLoader className="absolute inset-0" borderRadius="1rem" />
              )}
              {
                (() => {
                  const src = project.image && project.image !== '/project-placeholder.jpg' ? project.image : '/avatar-placeholder.jpg';
                  return (
                    <Image
                      src={src}
                      alt={`${project.title} project preview`}
                      width={400}
                      height={224}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onLoad={() => handleImageLoad(project.id)}
                      priority={project.featured}
                    />
                  );
                })()
              }
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.04em] text-white flex-1">
                  {project.title}
                </h2>
                <span 
                  className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap"
                  aria-label={`Role: ${project.role}`}
                >
                  {project.role}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">{project.description}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 mb-6">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 flex-1 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-300"
                aria-label={`View ${project.title} on GitHub`}
              >
                <FiGithub size={16} aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
                <span className="sm:hidden">Code</span>
              </a>
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-sm font-medium transition-all duration-300"
                  aria-label={`View ${project.title} live demo`}
                >
                  <FiExternalLink size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">Demo</span>
                  <span className="sm:hidden">Live</span>
                </a>
              )}
            </div>
          </div>
        </SpotlightCard>
      ))}
    </section>
  );
}
