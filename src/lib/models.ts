export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  bio: string;
  skills: string[];
  skillCategories: SkillCategory[];
  highlights: Array<{
    value: string;
    label: string;
  }>;
  contacts: Array<{
    label: string;
    url: string;
  }>;
}

export interface ExperienceEntry {
  employer: string;
  title: string;
  timeframe: string;
  location: string;
  summary: string;
  achievements: string[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  image?: string;
  category?: string;
  metrics?: string[];
  technologies?: string[];
}

export interface Publication {
  title: string;
  authors?: string;
  venue?: string;
  year?: number;
  link?: string;
  category?: string;
}

export interface Education {
  institution: string;
  degree: string;
  timeframe: string;
  location: string;
  details?: string[];
}

export interface Certification {
  title: string;
  institution: string;
  date: string;
}

export interface ParsedContent {
  profile: Profile;
  experience: ExperienceEntry[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
}
