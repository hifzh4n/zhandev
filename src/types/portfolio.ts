export type Project = {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  tech: string[];
  image: string;
  github: string;
  liveDemo?: string;
  role: 'Full-stack' | 'Frontend' | 'Backend' | 'Design';
  featured?: boolean;
};

export type Experience = {
  period: string;
  title: string;
  company: string;
  details: string;
  tags: string[];
};

export type Education = {
  year: string;
  title: string;
  school: string;
  details: string;
  logoUrl?: string;
};

export type Achievement = {
  title: string;
  label: string;
  description: string;
  imageSrc?: string;
};

export type Skill = {
  category: string;
  items: string[];
};

export type SocialPlatform = 'whatsapp' | 'facebook' | 'instagram' | 'threads' | 'tiktok';

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
};

export type UserProfile = {
  avatar?: string;
  miniAvatar?: string;
  visualIdentity?: string;
  visualIdentityCards?: VisualIdentityCard[];
};

export type VisualIdentityCard = {
  imageSrc: string;
};
