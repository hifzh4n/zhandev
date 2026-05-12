'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import { Education } from '@/types/portfolio';
import { Trash2, Edit2, Plus } from 'lucide-react';
import portfolioStore from '@/utils/portfolioStore';
import { Button } from '@/components/ui/button';

const INITIAL_EDUCATION: Education[] = [
  {
    year: '2021 - 2025',
    title: 'Information Technology',
    school: 'Universiti Teknologi PETRONAS',
    details: 'Bachelor of Science in Information Technology with specialization in Software Engineering',
  },
  {
    year: '2018 - 2019',
    title: 'Diploma in Information Technology',
    school: 'Kolej Profesional MARA Kuching',
    details: 'Diploma in Information Technology with focus on Web Development and Database Management',
  },
];

export default function EducationAdmin() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('/admin/education');
  const [educationList, setEducationList] = useState<Education[]>(INITIAL_EDUCATION);
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [formData, setFormData] = useState<Education>({
    year: '',
    title: '',
    school: '',
    details: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.year || !formData.title || !formData.school || !formData.details) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      if (editingId) {
        // Update existing
        const next = educationList.map((edu, idx) => (idx === parseInt(editingId) ? formData : edu));
        setEducationList(next);
        await portfolioStore.setEducation(next);
        setEditingId(null);
        setMessage({ type: 'success', text: 'Education entry updated successfully!' });
      } else {
        // Add new
        const next = [...educationList, formData];
        setEducationList(next);
        await portfolioStore.setEducation(next);
        setMessage({ type: 'success', text: 'Education entry added successfully!' });
      }

      setFormData({ year: '', title: '', school: '', details: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving education:', error);
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleEdit = (index: number) => {
    setFormData(educationList[index]);
    setEditingId(index.toString());
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      try {
        const next = educationList.filter((_, idx) => idx !== index);
        setEducationList(next);
        await portfolioStore.setEducation(next);
        setMessage({ type: 'success', text: 'Education entry deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting education:', error);
        setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    }
  };

  // keep in sync if storage changes elsewhere
  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => {
      setEducationList(s.education);
      setMiniAvatar(s.profile?.miniAvatar || s.profile?.avatar || '/avatar-placeholder.jpg');
    });
    return unsub;
  }, []);

  const handleCancel = () => {
    setFormData({
      year: '',
      title: '',
      school: '',
      details: '',
    });
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
      />

      <div className="pt-32 px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
              {message.text}
            </div>
          )}

          {/* Form Section */}
          <div className="mb-12 p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Education' : 'Add Education'}
            </h2>
            
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="year"
                  placeholder="Year (e.g., 2021 - 2025)"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Degree/Qualification Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <input
                type="text"
                name="school"
                placeholder="School/University Name"
                value={formData.school}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <textarea
                name="details"
                placeholder="Details about the education"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
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

          {/* Education List Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Education Entries</h2>
            
            {educationList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
                No education entries yet. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {educationList.map((education, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-cyan-400">{education.year}</span>
                          <h3 className="text-xl font-bold">{education.title}</h3>
                        </div>
                        <p className="text-white/70 mb-3">{education.school}</p>
                        <p className="text-white/60">{education.details}</p>
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
