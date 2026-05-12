'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import { Experience } from '@/types/portfolio';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import portfolioStore from '@/utils/portfolioStore';
import { Button } from '@/components/ui/button';

const INITIAL_EXPERIENCE: Experience[] = [
  {
    period: '2023 - Present',
    title: 'Senior Frontend Developer',
    company: 'HR Success Sdn Bhd',
    details: 'Led development of HR management system using Next.js and React. Implemented real-time features and improved performance by 40%.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    period: '2022 - 2023',
    title: 'Full Stack Developer',
    company: 'Masterscaff Solutions',
    details: 'Developed and maintained web applications for scaffolding management. Built REST APIs and optimized database queries.',
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
  },
  {
    period: '2021 - 2022',
    title: 'Junior Developer',
    company: 'PETRONAS',
    details: 'Collaborated on internal tools and dashboards. Participated in agile development and code reviews.',
    tags: ['Python', 'JavaScript', 'SQL', 'Flask'],
  },
];

export default function ExperienceAdmin() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('/admin/experience');
  const [experienceList, setExperienceList] = useState<Experience[]>(INITIAL_EXPERIENCE);
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [formData, setFormData] = useState<Experience>({
    period: '',
    title: '',
    company: '',
    details: '',
    tags: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.period || !formData.title || !formData.company || !formData.details) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const next = experienceList.map((exp, idx) => (idx === parseInt(editingId) ? formData : exp));
      setExperienceList(next);
      await portfolioStore.setExperience(next);
      setEditingId(null);
    } else {
      const next = [...experienceList, formData];
      setExperienceList(next);
      await portfolioStore.setExperience(next);
    }

    setFormData({ period: '', title: '', company: '', details: '', tags: [] });
    setTagInput('');
  };

  const handleEdit = (index: number) => {
    setFormData(experienceList[index]);
    setEditingId(index.toString());
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this experience entry?')) {
      const next = experienceList.filter((_, idx) => idx !== index);
      setExperienceList(next);
      await portfolioStore.setExperience(next);
    }
  };

  const handleCancel = () => {
    setFormData({
      period: '',
      title: '',
      company: '',
      details: '',
      tags: [],
    });
    setTagInput('');
    setEditingId(null);
  };

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => {
      setExperienceList(s.experience);
      setMiniAvatar(s.profile?.miniAvatar || s.profile?.avatar || '/avatar-placeholder.jpg');
    });
    return () => {
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
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="period"
                  placeholder="Period (e.g., 2023 - Present)"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <textarea
                name="details"
                placeholder="Details about the experience"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />

              {/* Tags Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold">Skills/Technologies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill and press button or Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag} className="h-12">
                    Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-sm"
                      >
                        {tag}
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTag(tag)} className="h-5 w-5">
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
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

          {/* Experience List Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Experience Entries</h2>

            {experienceList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
                No experience entries yet. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {experienceList.map((experience, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-cyan-400">{experience.period}</span>
                          <h3 className="text-xl font-bold">{experience.title}</h3>
                        </div>
                        <p className="text-white/70 mb-3">{experience.company}</p>
                        <p className="text-white/60 mb-4">{experience.details}</p>
                        {experience.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {experience.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
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
