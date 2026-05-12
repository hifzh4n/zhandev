'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import { Button } from '@/components/ui/button';
import portfolioStore from '@/utils/portfolioStore';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('/admin/dashboard');
  const [miniAvatar, setMiniAvatar] = useState('/avatar-placeholder.jpg');

  useEffect(() => {
    const unsub = portfolioStore.subscribe((state) => {
      setMiniAvatar(state.profile?.miniAvatar || state.profile?.avatar || '/avatar-placeholder.jpg');
    });

    return unsub;
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Achievement', href: '/admin/achievement' },
    { label: 'Project', href: '/admin/project' },
  ];

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to logout?');

    if (!shouldLogout) {
      return;
    }

    router.push('/admin/auth/signin');
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

        <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-20 pt-24">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Education Entries', value: '2', change: '+1 this month' },
                { title: 'Experience Entries', value: '3', change: '+0 this month' },
                { title: 'Projects', value: '2', change: '+1 this month' },
                { title: 'Achievements', value: '2', change: '+0 this month' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <p className="text-white/60 text-sm font-medium mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-cyan-400 text-sm">{stat.change}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-6">Portfolio Overview</h2>
                <div className="space-y-4">
                  {[
                    { action: 'Education section', details: '2 entries' },
                    { action: 'Work Experience', details: '3 entries' },
                    { action: 'Projects', details: '2 projects' },
                    { action: 'Achievements', details: '2 achievements' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
                      <span className="text-white/80">{item.action}</span>
                      <span className="text-white/40 text-sm">{item.details}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-6">Manage Portfolio</h2>
                <div className="space-y-3">
                  <a href="/admin/education" className="block w-full px-4 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-medium transition-all duration-200 text-center">
                    Edit Education
                  </a>
                  <a href="/admin/experience" className="block w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 text-center">
                    Edit Experience
                  </a>
                  <a href="/admin/project" className="block w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 text-center">
                    Edit Projects
                  </a>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full mt-4"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
