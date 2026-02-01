import { parseResumeMarkdown } from '@/lib/parseResumeMarkdown';
import { ProjectsSection } from '@/components/ProjectsSection';

export const metadata = {
  title: 'Projects | Clarisse Lim',
  description: 'Explore key projects and technical achievements by Clarisse Lim.',
};

export default function ProjectsPage() {
  const { projects } = parseResumeMarkdown();
  
  return (
    <div className="bg-background text-foreground">
      <ProjectsSection projects={projects} />
    </div>
  );
}