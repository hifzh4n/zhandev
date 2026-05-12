import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/config';
import EducationPageContent from '@/components/EducationPageContent';

export const metadata: Metadata = {
  title: 'Education | Portfolio',
  description: 'My educational journey from primary school through bachelor degree, showing technical development and academic achievements.',
  keywords: ['education', 'portfolio', 'academic'],
  openGraph: {
    title: 'Education | Portfolio',
    description: 'My educational journey from primary school through bachelor degree.',
    type: 'website',
    url: `${SITE_CONFIG.url}/education`,
  },
};

export default function EducationPage() {
  return <EducationPageContent />;
}
