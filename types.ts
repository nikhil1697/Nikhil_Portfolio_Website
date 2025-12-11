
export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  description: string[];
}

export interface Project {
  name: string;
  role: string;
  techStack: string[];
  description: string[];
  type: string; // e.g., Open Source, Enterprise
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Metric {
  label: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    role: string;
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
    location: string;
    status: string;
    languages: string[];
    avatar?: string;
  };
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  metrics: Metric[];
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  certifications: string[];
}
