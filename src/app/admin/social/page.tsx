'use client'

import { useEffect, useState } from 'react';
import PillNav from '@/components/PillNav';
import { Button } from '@/components/ui/button';
import portfolioStore from '@/utils/portfolioStore';
import type { SocialLink, SocialPlatform } from '@/types/portfolio';
import { Edit2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaThreads, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

const platformOptions: Array<{ value: SocialPlatform; label: string; placeholder: string; icon: typeof FaWhatsapp }> = [
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/60123456789', icon: FaWhatsapp },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/your-profile', icon: FaFacebookF },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-profile', icon: FaInstagram },
  { value: 'threads', label: 'Threads', placeholder: 'https://threads.net/@your-profile', icon: FaThreads },
  { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@your-profile', icon: FaTiktok },
];

const initialSocialLinks: SocialLink[] = platformOptions.map((platform) => ({
  platform: platform.value,
  label: platform.label,
  url: platform.placeholder,
  enabled: true,
}));

const blankSocialLink = (): SocialLink => ({
  platform: 'whatsapp',
  label: 'WhatsApp',
  url: '',
  enabled: true,
});

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Education', href: '/admin/education' },
  { label: 'Experience', href: '/admin/experience' },
  { label: 'Achievement', href: '/admin/achievement' },
  { label: 'Project', href: '/admin/project' },
  { label: 'Social', href: '/admin/social' },
];

export default function SocialAdmin() {
  const [activeNav] = useState('/admin/social');
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [socialList, setSocialList] = useState<SocialLink[]>(initialSocialLinks);
  const [formData, setFormData] = useState<SocialLink>(blankSocialLink());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsub = portfolioStore.subscribe((state) => {
      setSocialList(state.socialLinks?.length ? state.socialLinks : initialSocialLinks);
      setMiniAvatar(state.profile?.miniAvatar || state.profile?.avatar || '/avatar-placeholder.jpg');
    });

    return () => {
      unsub();
    };
  }, []);

  const selectedPlatform = platformOptions.find((platform) => platform.value === formData.platform) || platformOptions[0];

  const setTemporaryMessage = (nextMessage: { type: 'success' | 'error'; text: string }) => {
    setMessage(nextMessage);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePlatformChange = (platform: SocialPlatform) => {
    const nextPlatform = platformOptions.find((item) => item.value === platform) || platformOptions[0];
    setFormData((prev) => ({
      ...prev,
      platform,
      label: prev.label && prev.label !== selectedPlatform.label ? prev.label : nextPlatform.label,
    }));
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label.trim() || !formData.url.trim()) {
      setTemporaryMessage({ type: 'error', text: 'Please fill in the label and URL' });
      return;
    }

    try {
      const nextItem = {
        ...formData,
        label: formData.label.trim(),
        url: formData.url.trim(),
      };

      const next = editingId
        ? socialList.map((social, index) => (index === parseInt(editingId) ? nextItem : social))
        : [...socialList, nextItem];

      setSocialList(next);
      await portfolioStore.setSocialLinks(next);
      setFormData(blankSocialLink());
      setEditingId(null);
      setTemporaryMessage({ type: 'success', text: editingId ? 'Social link updated successfully!' : 'Social link added successfully!' });
    } catch (error) {
      console.error('Error saving social link:', error);
      setTemporaryMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleEdit = (index: number) => {
    setFormData(socialList[index]);
    setEditingId(index.toString());
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {
      const next = socialList.filter((_, itemIndex) => itemIndex !== index);
      setSocialList(next);
      await portfolioStore.setSocialLinks(next);
      setTemporaryMessage({ type: 'success', text: 'Social link deleted successfully!' });
    } catch (error) {
      console.error('Error deleting social link:', error);
      setTemporaryMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleToggleEnabled = async (index: number) => {
    try {
      const next = socialList.map((social, itemIndex) => (
        itemIndex === index ? { ...social, enabled: !social.enabled } : social
      ));
      setSocialList(next);
      await portfolioStore.setSocialLinks(next);
    } catch (error) {
      console.error('Error updating social link status:', error);
      setTemporaryMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleCancel = () => {
    setFormData(blankSocialLink());
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060a] via-[#0a0b14] to-[#05060a] text-white overflow-hidden">
      <PillNav
        logo={miniAvatar}
        items={navItems}
        activeHref={activeNav}
        baseColor="#ffffff"
        pillColor="#000000"
        hoveredPillTextColor="#000000"
        pillTextColor="#000000"
        ease="power3.easeOut"
        initialLoadAnimation={true}
        onMobileMenuClick={() => {}}
      />

      <div className="pt-32 px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-12 p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Social Account' : 'Add Social Account'}</h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={formData.platform}
                  onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform.value} value={platform.value} className="bg-[#0a0b14] text-white">
                      {platform.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Display label"
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />

                <label className="flex items-center gap-3 rounded-lg bg-white/20 border border-white/20 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-white/80">Show on landing page</span>
                </label>
              </div>

              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder={selectedPlatform.placeholder}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="cool" className="flex-1 justify-center">
                  <Plus size={18} />
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Social Accounts</h2>

            {socialList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
                No social accounts yet. Add one to get started!
              </div>
            ) : (
              <div className="grid gap-4">
                {socialList.map((social, index) => {
                  const platform = platformOptions.find((item) => item.value === social.platform) || platformOptions[0];
                  const Icon = platform.icon;

                  return (
                    <div
                      key={`${social.platform}-${index}`}
                      className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold">{social.label}</h3>
                              <span className={`rounded-full px-2 py-0.5 text-xs ${social.enabled ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/50'}`}>
                                {social.enabled ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                            <a href={social.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-2 truncate text-sm text-white/55 hover:text-white">
                              <span className="truncate">{social.url}</span>
                              <ExternalLink size={14} className="shrink-0" />
                            </a>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:ml-4">
                          <Button type="button" onClick={() => handleToggleEnabled(index)} variant="outline">
                            {social.enabled ? 'Hide' : 'Show'}
                          </Button>
                          <Button type="button" onClick={() => handleEdit(index)} variant="outline" size="icon" title="Edit">
                            <Edit2 size={18} />
                          </Button>
                          <Button type="button" onClick={() => handleDelete(index)} variant="destructive" size="icon" title="Delete">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
