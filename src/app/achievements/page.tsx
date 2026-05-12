import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/config';
import AchievementsPageContent from '@/components/AchievementsPageContent';

export const metadata: Metadata = {
  title: 'Achievements | Portfolio',
  description: 'My certifications, awards, and recognitions including academic honors and professional achievements.',
  keywords: ['achievements', 'awards', 'certifications', 'portfolio'],
  openGraph: {
    title: 'Achievements | Portfolio',
    description: 'My certifications, awards, and recognitions.',
    type: 'website',
    url: `${SITE_CONFIG.url}/achievements`,
  },
};

export default function AchievementsPage() {
  return <AchievementsPageContent />;
}
