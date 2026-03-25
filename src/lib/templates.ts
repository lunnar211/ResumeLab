import type { Template } from '@/types/cv'

export const templates: Template[] = [
  { id: 'classic-professional', name: 'Classic Professional', category: 'standard', thumbnailUrl: '', isPremium: false, description: 'A timeless, clean professional layout' },
  { id: 'modern-minimal', name: 'Modern Minimal', category: 'standard', thumbnailUrl: '', isPremium: false, description: 'Clean and modern with subtle accents' },
  { id: 'executive-blue', name: 'Executive Blue', category: 'executive', thumbnailUrl: '', isPremium: false, description: 'Bold executive design with navy accents' },
  { id: 'ats-optimized', name: 'ATS Optimized', category: 'ats', thumbnailUrl: '', isPremium: false, description: 'Plain formatting, ATS-friendly' },
  { id: 'creative-colorful', name: 'Creative Colorful', category: 'creative', thumbnailUrl: '', isPremium: true, description: 'Bold, colorful creative design' },
  { id: 'academic-scholar', name: 'Academic Scholar', category: 'academic', thumbnailUrl: '', isPremium: false, description: 'Academic format with publications support' },
  { id: 'technical-developer', name: 'Technical Developer', category: 'technical', thumbnailUrl: '', isPremium: false, description: 'Perfect for developers with GitHub links' },
  { id: 'europass-eu', name: 'Europass', category: 'europass', thumbnailUrl: '', isPremium: false, description: 'Official EU Europass format' },
  { id: 'student-entry', name: 'Student Entry Level', category: 'entry-level', thumbnailUrl: '', isPremium: false, description: 'Perfect for students and fresh graduates' },
  { id: 'international-global', name: 'International', category: 'international', thumbnailUrl: '', isPremium: true, description: 'Adaptable for global job markets' },
]

export const getTemplateById = (id: string) => templates.find((t) => t.id === id)
export const freeTemplates = templates.filter((t) => !t.isPremium)
export const premiumTemplates = templates.filter((t) => t.isPremium)
