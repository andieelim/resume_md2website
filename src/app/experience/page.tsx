import { parseResumeMarkdown } from '@/lib/parseResumeMarkdown';
import { ExperienceSection } from '@/components/ExperienceSection';

export const metadata = {
  title: 'Experience | Clarisse Lim',
  description: 'View Clarisse Lim\'s professional experience in data and marketing analytics.',
};

export default function ExperiencePage() {
  const { experience } = parseResumeMarkdown();
  
  return (
    <div className="bg-background text-foreground">
      <ExperienceSection experience={experience} />
    </div>
  );
}