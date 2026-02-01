import { parseResumeMarkdown } from '@/lib/parseResumeMarkdown';
import { AboutSection } from '@/components/AboutSection';

export const metadata = {
  title: 'About | Clarisse Lim',
  description: 'Learn about Clarisse Lim\'s background, expertise, and professional journey in data science and marketing analytics.',
};

export default function AboutPage() {
  const { profile, education } = parseResumeMarkdown();

  return (
    <div className="bg-background text-foreground">
      <AboutSection profile={profile} education={education} isStandalone={true} />
    </div>
  );
}
