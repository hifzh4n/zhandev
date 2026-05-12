'use client';

import { supabase } from './supabase';
import type { Project, Experience, Education, Achievement, UserProfile, VisualIdentityCard, Skill } from '@/types/portfolio';

export type PortfolioState = {
  projects: Project[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  skills: Skill[];
  profile?: UserProfile;
};

// In-memory cache
let cache: PortfolioState = {
  projects: [],
  experience: [],
  education: [],
  achievements: [],
  skills: [],
  profile: undefined,
};

const listeners = new Set<(s: PortfolioState) => void>();

function notify(state: PortfolioState) {
  cache = state;
  listeners.forEach((cb) => {
    try {
      cb(state);
    } catch (e) {
      console.error('Error in portfolio store listener:', e);
    }
  });
}

// Helper functions to fetch data
async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    fullDescription: p.full_description,
    tech: p.tech || [],
    // Normalize missing or placeholder images to a safe existing placeholder
    image: p.image && p.image !== '/project-placeholder.jpg' ? p.image : '/avatar-placeholder.jpg',
    github: p.github,
    liveDemo: p.live_demo,
    role: p.role,
    featured: p.featured,
  }));
}

async function fetchExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching experience:', error);
    return [];
  }

  return (data || []).map((e: any) => ({
    period: e.period,
    title: e.title,
    company: e.company,
    details: e.details,
    tags: e.tags || [],
  }));
}

async function fetchEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching education:', error);
    return [];
  }

  return (data || []).map((e: any) => ({
    year: e.year,
    title: e.title,
    school: e.school,
    details: e.details,
  }));
}

async function fetchAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return (data || []).map((a: any) => ({
    title: a.title,
    label: a.label,
    description: a.description,
    imageSrc: a.image_src,
  }));
}

async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    category: s.category,
    items: s.items || [],
  }));
}

async function fetchProfile(): Promise<UserProfile | undefined> {
  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    // PGRST116 is "no rows found"
    console.error('Error fetching profile:', profileError);
    return undefined;
  }

  if (!profileData) return undefined;

  const { data: cardsData, error: cardsError } = await supabase
    .from('visual_identity_cards')
    .select('*')
    .eq('profile_id', profileData.id)
    .order('display_order', { ascending: true });

  if (cardsError) {
    console.error('Error fetching visual identity cards:', cardsError);
  }

  return {
    avatar: profileData.avatar,
    miniAvatar: profileData.mini_avatar,
    visualIdentity: profileData.avatar,
    visualIdentityCards: (cardsData || []).map((c: any) => ({
      imageSrc: c.image_src,
    })),
  };
}

// Sync all data
async function syncAllData() {
  const [projects, experience, education, achievements, skills, profile] = await Promise.all([
    fetchProjects(),
    fetchExperience(),
    fetchEducation(),
    fetchAchievements(),
    fetchSkills(),
    fetchProfile(),
  ]);

  const state: PortfolioState = {
    projects,
    experience,
    education,
    achievements,
    skills,
    profile,
  };

  notify(state);
}

const portfolioStore = {
  async getState(): Promise<PortfolioState> {
    await syncAllData();
    return cache;
  },

  async setState(next: Partial<PortfolioState>) {
    const current = cache;
    const updated = { ...current, ...next };
    notify(updated);
  },

  subscribe(cb: (s: PortfolioState) => void) {
    listeners.add(cb);
    // Immediately fetch and emit current state
    syncAllData().catch((e) => console.error('Error in initial sync:', e));
    return () => listeners.delete(cb);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return fetchProjects();
  },

    async setProjects(list: Project[]) {
      try {
        for (let i = 0; i < list.length; i++) {
          const project = list[i];
          const { error } = await supabase
            .from('projects')
            .upsert(
              {
                id: project.id,
                title: project.title,
                description: project.description,
                full_description: project.fullDescription,
                tech: project.tech,
                image: project.image,
                github: project.github,
                live_demo: project.liveDemo,
                role: project.role,
                featured: project.featured,
                display_order: i,
              },
              { onConflict: 'id' }
            );

          if (error) {
            console.error('Error upserting project:', error);
            throw new Error(`Failed to save project: ${error.message}`);
          }
        }
        await syncAllData();
      } catch (error) {
        console.error('Error in setProjects:', error);
        throw error;
      }
    },
  async addProject(project: Project) {
    const { error } = await supabase.from('projects').insert([
      {
        title: project.title,
        description: project.description,
        full_description: project.fullDescription,
        tech: project.tech,
        image: project.image,
        github: project.github,
        live_demo: project.liveDemo,
        role: project.role,
        featured: project.featured,
      },
    ]);

    if (error) {
      console.error('Error adding project:', error);
    }
    await syncAllData();
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    await syncAllData();
  },

  // Experience
  async getExperience(): Promise<Experience[]> {
    return fetchExperience();
  },

  async setExperience(list: Experience[]) {
    try {
      // Delete old entries
      const { error: deleteError } = await supabase.from('experience').delete().neq('id', 0);
      if (deleteError) {
        console.error('Error deleting experience entries:', deleteError);
        throw new Error(`Failed to delete experience entries: ${deleteError.message}`);
      }

      // Insert new ones
      for (let i = 0; i < list.length; i++) {
        const exp = list[i];
        const { error } = await supabase.from('experience').insert([
          {
            period: exp.period,
            title: exp.title,
            company: exp.company,
            details: exp.details,
            tags: exp.tags,
            display_order: i,
          },
        ]);

        if (error) {
          console.error('Error inserting experience:', error);
          throw new Error(`Failed to insert experience: ${error.message}`);
        }
      }
      
      await syncAllData();
    } catch (error) {
      console.error('Error in setExperience:', error);
      throw error;
    }
  },

  // Education
  async getEducation(): Promise<Education[]> {
    return fetchEducation();
  },

  async setEducation(list: Education[]) {
    try {
      // Delete old entries
      const { error: deleteError } = await supabase.from('education').delete().neq('id', 0);
      if (deleteError) {
        console.error('Error deleting education entries:', deleteError);
        throw new Error(`Failed to delete education entries: ${deleteError.message}`);
      }

      // Insert new ones
      for (let i = 0; i < list.length; i++) {
        const edu = list[i];
        const { error } = await supabase.from('education').insert([
          {
            year: edu.year,
            title: edu.title,
            school: edu.school,
            details: edu.details,
            display_order: i,
          },
        ]);

        if (error) {
          console.error('Error inserting education:', error);
          throw new Error(`Failed to insert education: ${error.message}`);
        }
      }
      
      await syncAllData();
    } catch (error) {
      console.error('Error in setEducation:', error);
      throw error;
    }
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return fetchAchievements();
  },

  async setAchievements(list: Achievement[]) {
    try {
      // Delete old entries
      const { error: deleteError } = await supabase.from('achievements').delete().neq('id', 0);
      if (deleteError) {
        console.error('Error deleting achievement entries:', deleteError);
        throw new Error(`Failed to delete achievement entries: ${deleteError.message}`);
      }

      // Insert new ones
      for (let i = 0; i < list.length; i++) {
        const ach = list[i];
        const { error } = await supabase.from('achievements').insert([
          {
            title: ach.title,
            label: ach.label,
            description: ach.description,
            image_src: ach.imageSrc,
            display_order: i,
          },
        ]);

        if (error) {
          console.error('Error inserting achievement:', error);
          throw new Error(`Failed to insert achievement: ${error.message}`);
        }
      }
      
      await syncAllData();
    } catch (error) {
      console.error('Error in setAchievements:', error);
      throw error;
    }
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    return fetchSkills();
  },

  async setSkills(list: Skill[]) {
    try {
      // Delete old entries
      const { error: deleteError } = await supabase.from('skills').delete().neq('id', 0);
      if (deleteError) {
        console.error('Error deleting skill entries:', deleteError);
        throw new Error(`Failed to delete skill entries: ${deleteError.message}`);
      }

      // Insert new ones
      for (let i = 0; i < list.length; i++) {
        const skill = list[i];
        const { error } = await supabase.from('skills').insert([
          {
            category: skill.category,
            items: skill.items,
            display_order: i,
          },
        ]);

        if (error) {
          console.error('Error inserting skill:', error);
          throw new Error(`Failed to insert skill: ${error.message}`);
        }
      }
      
      await syncAllData();
    } catch (error) {
      console.error('Error in setSkills:', error);
      throw error;
    }
  },

  // Profile
  async getProfile(): Promise<UserProfile | undefined> {
    return fetchProfile();
  },

  async setProfile(profile: UserProfile) {
    const { data: existingProfile } = await supabase.from('profile').select('id').limit(1).single();

    if (existingProfile) {
      const { error } = await supabase
        .from('profile')
        .update({
          avatar: profile.avatar,
          mini_avatar: profile.miniAvatar,
        })
        .eq('id', existingProfile.id);

      if (error) {
        console.error('Error updating profile:', error);
      }

      // Update visual identity cards
      if (profile.visualIdentityCards) {
        // Delete old cards
        await supabase.from('visual_identity_cards').delete().eq('profile_id', existingProfile.id);

        // Insert new ones
        for (let i = 0; i < profile.visualIdentityCards.length; i++) {
          const card = profile.visualIdentityCards[i];
          const { error: cardError } = await supabase.from('visual_identity_cards').insert([
            {
              profile_id: existingProfile.id,
              image_src: card.imageSrc,
              display_order: i,
            },
          ]);

          if (cardError) {
            console.error('Error inserting visual card:', cardError);
          }
        }
      }
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('profile')
        .insert([
          {
            avatar: profile.avatar,
            mini_avatar: profile.miniAvatar,
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return;
      }

      // Insert visual identity cards
      if (profile.visualIdentityCards && newProfile) {
        for (let i = 0; i < profile.visualIdentityCards.length; i++) {
          const card = profile.visualIdentityCards[i];
          const { error: cardError } = await supabase.from('visual_identity_cards').insert([
            {
              profile_id: newProfile.id,
              image_src: card.imageSrc,
              display_order: i,
            },
          ]);

          if (cardError) {
            console.error('Error inserting visual card:', cardError);
          }
        }
      }
    }

    await syncAllData();
  },
};

export default portfolioStore;
