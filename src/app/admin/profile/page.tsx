"use client";

import { useEffect, useRef, useState } from 'react';
import PillNav from '@/components/PillNav';
import { Button } from '@/components/ui/button';
import portfolioStore from '@/utils/portfolioStore';
import { storageService } from '@/utils/storage';
import type { Skill, UserProfile, VisualIdentityCard } from '@/types/portfolio';

const DEFAULT_VISUAL_CARDS: VisualIdentityCard[] = [
  { imageSrc: '/avatar-placeholder.jpg' },
  { imageSrc: '/lanyard.png' },
  { imageSrc: '/avatar-placeholder.jpg' },
  { imageSrc: '/lanyard.png' },
  { imageSrc: '/avatar-placeholder.jpg' },
  { imageSrc: '/lanyard.png' },
];

const DEFAULT_SKILLS: Skill[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'] },
  { category: 'Backend & Tools', items: ['Node.js', 'SQL', 'APIs', 'Git', 'DevOps'] },
  { category: 'Design & UX', items: ['Figma', 'Interaction Design', 'UI/UX', 'Animation', 'Accessibility'] },
  { category: '3D & Graphics', items: ['three.js', 'WebGL', 'GLSL', 'Canvas', 'SVG'] },
];

const blankProfile = (): UserProfile => ({
  avatar: '/avatar-placeholder.jpg',
  miniAvatar: '/avatar-placeholder.jpg',
  visualIdentity: '/avatar-placeholder.jpg',
  visualIdentityCards: DEFAULT_VISUAL_CARDS,
});

export default function ProfileAdmin() {
  const [activeNav] = useState('/admin/profile');
  const [profile, setProfile] = useState<UserProfile>(blankProfile());
  const [avatarPreview, setAvatarPreview] = useState('/avatar-placeholder.jpg');
  const [miniPreview, setMiniPreview] = useState('/avatar-placeholder.jpg');
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [visualCards, setVisualCards] = useState<VisualIdentityCard[]>(DEFAULT_VISUAL_CARDS);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [skillCategory, setSkillCategory] = useState('');
  const [skillItemsText, setSkillItemsText] = useState('');
  const [skillEditingIndex, setSkillEditingIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Achievement', href: '/admin/achievement' },
    { label: 'Project', href: '/admin/project' },
    { label: 'Social', href: '/admin/social' },
    { label: 'Profile', href: '/admin/profile' },
  ];

  useEffect(() => {
    const unsub = portfolioStore.subscribe((state) => {
      const nextProfile = state.profile || blankProfile();
      setProfile(nextProfile);
      setAvatarPreview(nextProfile.avatar || '/avatar-placeholder.jpg');
      setMiniPreview(nextProfile.miniAvatar || '/avatar-placeholder.jpg');
      setMiniAvatar(nextProfile.miniAvatar || nextProfile.avatar || '/avatar-placeholder.jpg');
      setVisualCards(nextProfile.visualIdentityCards?.length ? nextProfile.visualIdentityCards : DEFAULT_VISUAL_CARDS);
      setSkills(state.skills?.length ? state.skills : DEFAULT_SKILLS);
    });
    return () => {
      unsub();
    };
  }, []);

  const readFileAsDataUrl = (file?: File) =>
    new Promise<string | null>((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const persistProfile = async (nextProfile: UserProfile, message: string) => {
    await portfolioStore.setProfile(nextProfile);
    showToast(message);
  };

  const persistSkills = async (nextSkills: Skill[], message: string) => {
    setSkills(nextSkills);
    await portfolioStore.setSkills(nextSkills);
    showToast(message);
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const data = await readFileAsDataUrl(file);
      if (data) setAvatarPreview(data);

      // Upload to Supabase storage
      const imageUrl = await storageService.uploadProfileImage(file, profile.avatar || avatarPreview || null);
      
      const nextProfile = buildNextProfile(visualCards, imageUrl, miniPreview);
      await persistProfile(nextProfile, 'Avatar updated');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  const handleMiniFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const data = await readFileAsDataUrl(file);
      if (data) setMiniPreview(data);

      // Upload to Supabase storage
      const imageUrl = await storageService.uploadProfileImage(file, profile.miniAvatar || miniPreview || null);
      
      const nextProfile = buildNextProfile(visualCards, avatarPreview, imageUrl);
      await persistProfile(nextProfile, 'Mini avatar updated');
    } catch (err) {
      console.error('Mini avatar upload failed:', err);
      alert('Failed to upload mini avatar. Please try again.');
    }
  };

  const handleVisualFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const data = await readFileAsDataUrl(file);
      if (data) {
        setVisualCards((prev) => prev.map((card, cardIndex) => (cardIndex === index ? { ...card, imageSrc: data } : card)));
      }

      // Upload to Supabase storage
      const previousImage = visualCards[index]?.imageSrc || null;
      const imageUrl = await storageService.uploadProfileImage(file, previousImage);
      
      const nextCards = visualCards.map((card, cardIndex) => 
        cardIndex === index ? { ...card, imageSrc: imageUrl } : card
      );
      setVisualCards(nextCards);
      await persistProfile(buildNextProfile(nextCards), 'Visual card updated');
    } catch (err) {
      console.error('Visual card upload failed:', err);
      alert('Failed to upload visual card. Please try again.');
    }
  };

  const buildNextProfile = (cards: VisualIdentityCard[], avatar = avatarPreview, mini = miniPreview): UserProfile => ({
    avatar: avatar || '/avatar-placeholder.jpg',
    miniAvatar: mini || '/avatar-placeholder.jpg',
    visualIdentity: cards[0]?.imageSrc || '/avatar-placeholder.jpg',
    visualIdentityCards: cards,
  });

  const handleApplyAvatarToAll = async () => {
    const src = avatarPreview || miniPreview || '/avatar-placeholder.jpg';
    const nextCards = visualCards.map((card, index) => ({
      ...card,
      imageSrc: src,
    }));
    setVisualCards(nextCards);
    await persistProfile(buildNextProfile(nextCards, src, miniPreview || src), 'Applied avatar to all visual identity cards');
  };

  const handleSave = async () => {
    await persistProfile(buildNextProfile(visualCards), 'Saved to local storage');
  };

  const resetSkillForm = () => {
    setSkillCategory('');
    setSkillItemsText('');
    setSkillEditingIndex(null);
  };

  const handleSkillSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const items = skillItemsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!skillCategory.trim() || items.length === 0) {
      showToast('Add a category and at least one skill');
      return;
    }

    const nextSkill: Skill = { category: skillCategory.trim(), items };

    if (skillEditingIndex === null) {
      await persistSkills([...skills, nextSkill], 'Added skill group');
    } else {
      const nextSkills = skills.map((skill, index) => (index === skillEditingIndex ? nextSkill : skill));
      await persistSkills(nextSkills, 'Updated skill group');
    }

    resetSkillForm();
  };

  const handleEditSkill = (index: number) => {
    const skill = skills[index];
    setSkillCategory(skill.category);
    setSkillItemsText(skill.items.join(', '));
    setSkillEditingIndex(index);
  };

  const handleDeleteSkill = async (index: number) => {
    const nextSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    await persistSkills(nextSkills, 'Deleted skill group');
    if (skillEditingIndex === index) resetSkillForm();
  };

  const handleRevert = async () => {
    const nextProfile = blankProfile();
    setAvatarPreview(nextProfile.avatar || '/avatar-placeholder.jpg');
    setMiniPreview(nextProfile.miniAvatar || '/avatar-placeholder.jpg');
    setVisualCards(nextProfile.visualIdentityCards || DEFAULT_VISUAL_CARDS);
    await persistProfile(nextProfile, 'Reverted to placeholders');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#05060a] via-[#0a0b14] to-[#05060a] text-white">
      <PillNav
        logo={miniAvatar}
        items={navItems}
        activeHref={activeNav}
        logoHref="/admin/profile"
        baseColor="#ffffff"
        pillColor="#000000"
        hoveredPillTextColor="#000000"
        pillTextColor="#000000"
        ease="power3.easeOut"
        initialLoadAnimation={true}
        onMobileMenuClick={() => {}}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 pt-32 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold">Profile images</h2>
            <p className="mb-6 text-sm text-white/70">
              Avatar is displayed in 3:4. Mini avatar is 1:1 and round. Visual identity uses 6 image cards.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-semibold">Avatar</label>
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/30 bg-white/30">
                  <img src={avatarPreview || '/avatar-placeholder.jpg'} alt="Avatar preview" className="h-full w-full object-cover" />
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarFile} className="w-full text-sm" />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold">Mini avatar</label>
                <div className="aspect-square w-32 overflow-hidden rounded-full border border-white/30 bg-white/30">
                  <img src={miniPreview || '/avatar-placeholder.jpg'} alt="Mini avatar preview" className="h-full w-full object-cover" />
                </div>
                <input type="file" accept="image/*" onChange={handleMiniFile} className="w-full text-sm" />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleApplyAvatarToAll} variant="cool">
                Apply avatar to all visual identity cards
              </Button>
              <Button onClick={handleSave} variant="outline">
                Save
              </Button>
              <Button onClick={handleRevert} variant="destructive">
                Revert to placeholder
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold">Visual identity cards</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visualCards.map((card, index) => (
                <div key={`card-${index}`} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="block text-sm font-semibold">Card {index + 1} image</label>
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/30 bg-white/30">
                    <img src={card.imageSrc} alt={`Visual identity card ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleVisualFile(index, e)}
                    className="w-full text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold">Skills & expertise</h2>
            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <input
                  type="text"
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  placeholder="Category e.g. Frontend"
                  className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
                />
                <input
                  type="text"
                  value={skillItemsText}
                  onChange={(e) => setSkillItemsText(e.target.value)}
                  placeholder="Skills separated by commas"
                  className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="cool">
                  {skillEditingIndex === null ? 'Add skill group' : 'Update skill group'}
                </Button>
                {skillEditingIndex !== null && (
                  <Button type="button" onClick={resetSkillForm} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((group, index) => (
                <div key={`${group.category}-${index}`} className="rounded-xl border border-white/30 bg-white/30 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white/90">{group.category}</h3>
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => handleEditSkill(index)} variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button type="button" onClick={() => handleDeleteSkill(index)} variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/75">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-black/80 px-4 py-2 text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
