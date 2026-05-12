import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/config';
import ProjectsPageContent from '@/components/ProjectsPageContent';

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my collection of projects showcasing full-stack development, design, and innovation across various technologies.',
  keywords: ['projects', 'portfolio', 'web development', 'full-stack'],
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Explore my collection of projects showcasing full-stack development, design, and innovation across various technologies.',
    type: 'website',
    url: `${SITE_CONFIG.url}/projects`,
  },
};

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
