import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/config';
import ExperiencePageContent from '@/components/ExperiencePageContent';

export const metadata: Metadata = {
  title: 'Experience | Portfolio',
  description: 'My professional work experience including roles in tech companies and responsibilities that shaped my career.',
  keywords: ['experience', 'work', 'portfolio', 'professional'],
  openGraph: {
    title: 'Experience | Portfolio',
    description: 'My professional work experience and career journey.',
    type: 'website',
    url: `${SITE_CONFIG.url}/experience`,
  },
};

export default function ExperiencePage() {
  return <ExperiencePageContent />;
}

