'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import { Project } from '@/types/portfolio';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import portfolioStore from '@/utils/portfolioStore';
import { storageService } from '@/utils/storage';
import { Button } from '@/components/ui/button';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'HR Management System',
    description: 'Comprehensive HR solution for employee management',
    fullDescription: 'A full-featured HR management system built with Next.js and React, featuring real-time updates, advanced analytics, and integration with various HR tools.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    image: '/avatar-placeholder.jpg',
    github: 'https://github.com/example/hr-system',
    liveDemo: 'https://hr-system.example.com',
    role: 'Full-stack',
    featured: true,
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Modern e-commerce platform with payment integration',
    fullDescription: 'An e-commerce platform featuring product listings, shopping cart, secure checkout, and admin dashboard for inventory management.',
    tech: ['Node.js', 'React', 'MongoDB', 'Stripe'],
    image: '/avatar-placeholder.jpg',
    github: 'https://github.com/example/ecommerce',
    liveDemo: 'https://ecommerce.example.com',
    role: 'Full-stack',
    featured: true,
  },
];

export default function ProjectAdmin() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('/admin/project');
  const [projectList, setProjectList] = useState<Project[]>(INITIAL_PROJECTS);
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');
  const [formData, setFormData] = useState<Project>({
    id: '',
    title: '',
    description: '',
    fullDescription: '',
    tech: [],
    image: '',
    github: '',
    liveDemo: '',
    role: 'Full-stack',
    featured: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [techInput, setTechInput] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Achievement', href: '/admin/achievement' },
    { label: 'Project', href: '/admin/project' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
      const projectId = formData.id || 'new-project';
      const imageUrl = await storageService.uploadProjectImage(file, projectId, formData.image || imagePreview || null);
      
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== techToRemove),
    }));
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.github || formData.tech.length === 0) {
      alert('Please fill in all required fields and add at least one technology');
      return;
    }

    if (editingId) {
      const next = projectList.map((proj) => (proj.id === editingId ? formData : proj));
      setProjectList(next);
      await portfolioStore.setProjects(next);
      setEditingId(null);
    } else {
      const newProject = { ...formData, id: Date.now().toString() };
      const next = [...projectList, newProject];
      setProjectList(next);
      await portfolioStore.setProjects(next);
    }

    setFormData({ id: '', title: '', description: '', fullDescription: '', tech: [], image: '', github: '', liveDemo: '', role: 'Full-stack', featured: false });
    setImagePreview('');
    setTechInput('');
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setImagePreview(project.image);
    setEditingId(project.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const next = projectList.filter((proj) => proj.id !== id);
      setProjectList(next);
      await portfolioStore.setProjects(next);
    }
  };

    const handleDeleteWithErrorHandling = async (id: string) => {
      if (confirm('Are you sure you want to delete this project?')) {
        let previous = projectList;
        try {
          const next = projectList.filter((proj) => proj.id !== id);
          // Optimistic update
          setProjectList(next);

          // Call the dedicated delete method so DB row is removed
          await portfolioStore.deleteProject(id);

          setMessage({ type: 'success', text: 'Project deleted successfully!' });
          setTimeout(() => setMessage(null), 3000);
        } catch (error) {
          console.error('Error deleting project:', error);
          // Revert optimistic update on failure
          setProjectList(previous);
          setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
        }
      }
    };
  const handleCancel = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      fullDescription: '',
      tech: [],
      image: '',
      github: '',
      liveDemo: '',
      role: 'Full-stack',
      featured: false,
    });
    setImagePreview('');
    setTechInput('');
    setEditingId(null);
  };

  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => {
      setProjectList(s.projects);
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
            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                {message.text}
              </div>
            )}

          {/* Form Section */}
          <div className="mb-12 p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Project' : 'Add Project'}
            </h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/20 text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="Full-stack" className="bg-[#0a0b14] text-white">Full-stack</option>
                  <option value="Frontend" className="bg-[#0a0b14] text-white">Frontend</option>
                  <option value="Backend" className="bg-[#0a0b14] text-white">Backend</option>
                  <option value="Design" className="bg-[#0a0b14] text-white">Design</option>
                </select>
              </div>

              <input
                type="text"
                name="description"
                placeholder="Short Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <textarea
                name="fullDescription"
                placeholder="Full Description (optional)"
                value={formData.fullDescription || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  name="github"
                  placeholder="GitHub URL"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="url"
                  name="liveDemo"
                  placeholder="Live Demo URL (optional)"
                  value={formData.liveDemo || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              {/* Tech Stack Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold">Technologies Used</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a technology and press button or Enter"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/30 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTech} className="h-12">
                    Add
                  </Button>
                </div>

                {formData.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tech.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-sm"
                      >
                        {tech}
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTech(tech)} className="h-5 w-5">
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Project Image</label>
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
                          image: '',
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/30 border border-white/30">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label className="text-sm font-semibold cursor-pointer">Mark as Featured</label>
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

          {/* Project List Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Projects</h2>

            {projectList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
                No projects yet. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {projectList.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                            {project.role}
                          </span>
                          {project.featured && (
                            <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 mb-3">{project.description}</p>
                        {project.fullDescription && (
                          <p className="text-white/50 text-sm mb-4">{project.fullDescription}</p>
                        )}
                        {project.image && (
                          <div className="mb-4 w-full h-48 rounded-lg overflow-hidden border border-white/10">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4 text-sm">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              GitHub
                            </a>
                          )}
                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Button
                          type="button"
                          onClick={() => handleEdit(project)}
                          variant="outline"
                          size="icon"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteWithErrorHandling(project.id)}
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
