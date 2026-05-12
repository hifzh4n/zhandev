'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import { Achievement } from '@/types/portfolio';
import { Trash2, Edit2, Plus } from 'lucide-react';
import portfolioStore from '@/utils/portfolioStore';
import { storageService } from '@/utils/storage';
import { Button } from '@/components/ui/button';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Best Developer Award',
    label: 'Excellence in Code',
    description: 'Recognized for outstanding contributions to the open-source community and innovative solutions.',
    imageSrc: '/avatar-placeholder.jpg',
  },
  {
    title: 'Tech Innovation Prize',
    label: 'Innovation',
    description: 'Awarded for developing an innovative solution that improved team productivity by 50%.',
    imageSrc: '/avatar-placeholder.jpg',
  },
];

export default function AchievementAdmin() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('/admin/achievement');
  const [achievementList, setAchievementList] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [formData, setFormData] = useState<Achievement>({
    title: '',
    label: '',
    description: '',
    imageSrc: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Achievement', href: '/admin/achievement' },
    { label: 'Project', href: '/admin/project' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase storage
      const achievementId = editingId || `achievement-${Date.now()}`;
      const imageUrl = await storageService.uploadAchievementImage(file, achievementId, formData.imageSrc || imagePreview || null);
      
      setFormData((prev) => ({
        ...prev,
        imageSrc: imageUrl,
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.label || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const next = achievementList.map((ach, idx) => (idx === parseInt(editingId) ? formData : ach));
      setAchievementList(next);
      await portfolioStore.setAchievements(next);
      setEditingId(null);
    } else {
      const next = [...achievementList, formData];
      setAchievementList(next);
      await portfolioStore.setAchievements(next);
    }

    setFormData({ title: '', label: '', description: '', imageSrc: '' });
    setImagePreview('');
  };

  const handleEdit = (index: number) => {
    setFormData(achievementList[index]);
    setImagePreview(achievementList[index].imageSrc || '');
    setEditingId(index.toString());
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this achievement entry?')) {
      const next = achievementList.filter((_, idx) => idx !== index);
      setAchievementList(next);
      await portfolioStore.setAchievements(next);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      label: '',
      description: '',
      imageSrc: '',
    });
    setImagePreview('');
    setEditingId(null);
  };

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => {
      setAchievementList(s.achievements);
      setMiniAvatar(s.profile?.miniAvatar || s.profile?.avatar || '/avatar-placeholder.jpg');
    });
    return () => {
      // Ensure cleanup returns void (ignore any boolean returned by unsub)
      unsub();
    };
  }, []);

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
          {/* Form Section */}
          <div className="mb-12 p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Achievement' : 'Add Achievement'}
            </h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Achievement Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="text"
                  name="label"
                  placeholder="Label/Category"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <textarea
                name="description"
                placeholder="Description of the achievement"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Achievement Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 transition-colors"
                />
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/30 bg-white/30">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setFormData((prev) => ({
                          ...prev,
                          imageSrc: '',
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

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

          {/* Achievement List Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Achievement Entries</h2>

            {achievementList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
                No achievement entries yet. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {achievementList.map((achievement, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                            {achievement.label}
                          </span>
                          <h3 className="text-xl font-bold">{achievement.title}</h3>
                        </div>
                        <p className="text-white/60 mb-4">{achievement.description}</p>
                        {achievement.imageSrc && (
                          <div className="mb-4 w-full h-40 rounded-lg overflow-hidden border border-white/10">
                            <img
                              src={achievement.imageSrc}
                              alt={achievement.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Button
                          type="button"
                          onClick={() => handleEdit(index)}
                          variant="outline"
                          size="icon"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDelete(index)}
                          variant="destructive"
                          size="icon"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
