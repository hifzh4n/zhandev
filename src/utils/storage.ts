import { supabase } from './supabase';

function getStorageObjectPath(bucket: string, imageUrl?: string | null) {
  if (!imageUrl) return null;

  try {
    const parsed = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return parsed.pathname.slice(index + marker.length);
  } catch {
    return null;
  }
}

async function requireAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('You must sign in before uploading images.');
  }

  return data.user;
}

export const storageService = {
  async uploadProjectImage(file: File, projectId: string, previousUrl?: string | null): Promise<string> {
    await requireAuthenticatedUser();
    const fileName = `${projectId}/${Date.now()}_${file.name}`;

    const previousPath = getStorageObjectPath('project-images', previousUrl);
    if (previousPath) {
      await this.deleteImage('project-images', previousPath);
    }

    const { error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async uploadAchievementImage(file: File, achievementId: string, previousUrl?: string | null): Promise<string> {
    await requireAuthenticatedUser();
    const fileName = `${achievementId}/${Date.now()}_${file.name}`;

    const previousPath = getStorageObjectPath('achievement-images', previousUrl);
    if (previousPath) {
      await this.deleteImage('achievement-images', previousPath);
    }

    const { error } = await supabase.storage
      .from('achievement-images')
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data } = supabase.storage
      .from('achievement-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async uploadEducationLogo(file: File, educationId: string, previousUrl?: string | null): Promise<string> {
    await requireAuthenticatedUser();
    const fileName = `${educationId}/${Date.now()}_${file.name}`;

    const previousPath = getStorageObjectPath('education-logos', previousUrl);
    if (previousPath) {
      await this.deleteImage('education-logos', previousPath);
    }

    const { error } = await supabase.storage
      .from('education-logos')
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    const { data } = supabase.storage
      .from('education-logos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async uploadProfileImage(file: File, previousUrl?: string | null): Promise<string> {
    await requireAuthenticatedUser();
    const fileName = `profile/${Date.now()}_${file.name}`;

    const previousPath = getStorageObjectPath('profile-images', previousUrl);
    if (previousPath) {
      await this.deleteImage('profile-images', previousPath);
    }

    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteImage(bucket: string, filePath: string): Promise<void> {
    await requireAuthenticatedUser();
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  },
};
