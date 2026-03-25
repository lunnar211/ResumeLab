export type CVFormat =
  | 'standard'
  | 'academic'
  | 'working'
  | 'ats'
  | 'europass'
  | 'creative'
  | 'entry-level'
  | 'executive'
  | 'technical'
  | 'international'

export interface PersonalInfo {
  fullName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
  photoUrl?: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Skill {
  id: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category?: string
}

export interface Language {
  id: string
  name: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  date: string
  url?: string
  description: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate: string
}

export interface VolunteerWork {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description: string
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface CustomSection {
  id: string
  label: string
  content: string
}

export interface CVContent {
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  publications: Publication[]
  projects: Project[]
  volunteerWork: VolunteerWork[]
  awards: Award[]
  references: Reference[]
  customSections: CustomSection[]
  showReferences: boolean
  sectionOrder: string[]
}

export interface CV {
  id: string
  userId: string
  title: string
  format: CVFormat
  templateId: string
  content: CVContent
  isPublic: boolean
  publicSlug?: string
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  category: string
  thumbnailUrl: string
  isPremium: boolean
  description?: string
}

export const defaultCVContent: CVContent = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    photoUrl: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  publications: [],
  projects: [],
  volunteerWork: [],
  awards: [],
  references: [],
  customSections: [],
  showReferences: false,
  sectionOrder: [
    'personalInfo',
    'summary',
    'workExperience',
    'education',
    'skills',
    'languages',
    'certifications',
    'projects',
    'publications',
    'volunteerWork',
    'awards',
    'references',
    'customSections',
  ],
}
