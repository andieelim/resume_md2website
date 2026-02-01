import fs from 'fs';
import path from 'path';
import type { ParsedContent, Profile, ExperienceEntry, Project, Publication, Education, Certification } from './models';

// Cache for parsed markdown text to avoid re-processing
const markdownCache = new Map<string, string>();

function stripHtmlComments(text: string): string {
  if (!text) return '';
  return text.replace(/<!--[\s\S]*?-->/g, '').trim();
}

// Helper function to parse markdown formatting
function parseMarkdownText(text: string): string {
  if (!text) return '';
  
  const cleanedText = stripHtmlComments(text);
  if (!cleanedText) return '';

  // Check cache first
  if (markdownCache.has(cleanedText)) {
    return markdownCache.get(cleanedText)!;
  }
  
  let result = cleanedText;
  
  // Convert **bold** to <strong>
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert `code` to <code>
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Cache the result (limit cache size to prevent memory leaks)
  if (markdownCache.size > 1000) {
    const firstKey = markdownCache.keys().next().value;
    if (firstKey !== undefined) {
      markdownCache.delete(firstKey);
    }
  }
  markdownCache.set(cleanedText, result);
  
  return result;
}

// Cache for parsed content to avoid re-parsing the entire resume
const contentCache = new Map<string, ParsedContent>();

function parseWorkExperience(content: string): ExperienceEntry[] {
  const experience: ExperienceEntry[] = [];
  
  // Validate input
  if (!content || typeof content !== 'string') {
    console.warn('Invalid content provided to parseWorkExperience');
    return experience;
  }
  
  // Extract work experience section with more flexible pattern matching
  const workSection = content.match(/## (?:WORK )?EXPERIENCE\s*([\s\S]*?)(?=\n---|\n##|$)/i);
  if (!workSection || !workSection[1]) {
    console.warn('No work experience section found');
    return experience;
  }
  
  const workText = workSection[1].trim();
  if (!workText) {
    console.warn('Work experience section is empty');
    return experience;
  }
  
  // Split by company entries - look for **Company Name** pattern at start of line
  const companyBlocks = workText.split(/(?=^\*\*[^*]+\*\*\s*$)/gm).filter(block => block.trim());
  
  for (const companyBlock of companyBlocks) {
    try {
      const lines = companyBlock.trim().split('\n');
      
      // Extract company name from first line with validation
      const companyMatch = lines[0]?.match(/^\*\*([^*]+)\*\*\s*$/);
      if (!companyMatch || !companyMatch[1]) {
        console.warn('Invalid company format in block:', lines[0]);
        continue;
      }
      const employer = companyMatch[1].trim();
      
      // Validate employer name
      if (!employer || employer.length < 2) {
        console.warn('Invalid employer name:', employer);
        continue;
      }
      
      // Find all positions within this company
      let currentPosition: Partial<ExperienceEntry> | null = null;
      let bulletPoints: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        // Check if this is a position title line (format: _**Title**_)
        if (line.match(/^_\*\*([^*]+)\*\*_$/)) {
          // Save previous position if exists and is valid
          if (currentPosition && isValidPosition(currentPosition, bulletPoints)) {
            currentPosition.achievements = bulletPoints
              .filter(bullet => bullet.trim())
              .map(bullet => parseMarkdownText(bullet));
            experience.push(currentPosition as ExperienceEntry);
            bulletPoints = [];
          }
          
          // Start new position
          const titleMatch = line.match(/^_\*\*([^*]+)\*\*_$/);
          if (titleMatch && titleMatch[1]?.trim()) {
            currentPosition = {
              employer,
              title: titleMatch[1].trim(),
              timeframe: '',
              location: '',
              summary: '',
              achievements: []
            };
          }
        }
        // Check if this is a date/location line (format: *Date | Location*)
        else if (line.match(/^\*([^*]+)\*$/)) {
          if (currentPosition) {
            const dateLocationMatch = line.match(/^\*([^*]+)\*$/);
            if (dateLocationMatch && dateLocationMatch[1]) {
              const dateLocationStr = dateLocationMatch[1].trim();
              const parts = dateLocationStr.split('|').map(p => p.trim());
              currentPosition.timeframe = parts[0] || '';
              currentPosition.location = parts[1] || '';
              
              // Validate timeframe format
              if (currentPosition.timeframe && !isValidTimeframe(currentPosition.timeframe)) {
                console.warn('Invalid timeframe format:', currentPosition.timeframe);
              }
            }
          }
        }
        // Check if this is a summary line (format: **Summary:** text)
        else if (line.match(/^\*\*Summary:\*\*\s*(.+)$/)) {
          if (currentPosition) {
            const summaryMatch = line.match(/^\*\*Summary:\*\*\s*(.+)$/);
            if (summaryMatch && summaryMatch[1]?.trim()) {
              currentPosition.summary = parseMarkdownText(summaryMatch[1].trim());
            }
          }
        }
        // Check if this is a bullet point (format: - text)
        else if (line.startsWith('- ')) {
          let bulletText = line.substring(2).trim();
          
          // Handle multi-line bullet points with improved logic
          let j = i + 1;
          while (j < lines.length && lines[j]?.trim()) {
            const nextLine = lines[j].trim();
            
            // Stop if we hit another bullet point or section marker
            if (nextLine.startsWith('- ') || 
                nextLine.match(/^_\*\*([^*]+)\*\*_$/) ||
                nextLine.match(/^\*([^*]+)\*$/) ||
                nextLine.match(/^\*\*Summary:\*\*/)) {
              break;
            }
            
            bulletText += ' ' + nextLine;
            j++;
          }
          i = j - 1; // Skip processed lines
          
          // Validate bullet point content
          if (bulletText.trim() && bulletText.length >= 10) {
            bulletPoints.push(bulletText);
          } else if (bulletText.trim()) {
            console.warn('Bullet point too short, may be invalid:', bulletText);
          }
        }
      }
      
      // Don't forget the last position in the company
      if (currentPosition && isValidPosition(currentPosition, bulletPoints)) {
        if (bulletPoints.length > 0) {
          currentPosition.achievements = bulletPoints
            .filter(bullet => bullet.trim())
            .map(bullet => parseMarkdownText(bullet));
        }
        
        // Ensure summary is set with improved logic
        if (!currentPosition.summary || currentPosition.summary.trim() === '') {
          if (currentPosition.achievements && currentPosition.achievements.length > 0) {
            const rawSummary = currentPosition.achievements[0].replace(/<[^>]+>/g, '').trim();
            if (rawSummary.length > 150) {
              // Find a good break point (sentence end or word boundary)
              const breakPoint = rawSummary.indexOf('.', 120);
              const cutoff = breakPoint > 0 ? breakPoint + 1 : 150;
              currentPosition.summary = parseMarkdownText(rawSummary.substring(0, cutoff).trim() + '...');
            } else {
              currentPosition.summary = currentPosition.achievements[0];
            }
          } else {
            currentPosition.summary = `${currentPosition.title} role at ${employer}.`;
          }
        }
        
        experience.push(currentPosition as ExperienceEntry);
      }
    } catch (error) {
      console.warn('Error parsing company block:', error);
      continue; // Skip this block but continue with others
    }
  }
  
  return experience;
}

// Helper function to validate position data
function isValidPosition(position: Partial<ExperienceEntry>, bulletPoints: string[]): boolean {
  return !!(
    position &&
    position.employer &&
    position.title &&
    position.employer.trim().length >= 2 &&
    position.title.trim().length >= 2 &&
    (bulletPoints.length > 0 || position.summary)
  );
}

// Helper function to validate timeframe format
function isValidTimeframe(timeframe: string): boolean {
  if (!timeframe) return false;
  
  // Check for common patterns like:
  // "Jan 2020 – Present", "2020 – 2021", "Jul 2020 – Dec 2021"
  const patterns = [
    /^\w{3} \d{4} – Present$/i,
    /^\d{4} – \d{4}$/,
    /^\w{3} \d{4} – \w{3} \d{4}$/i,
    /^Present$/i
  ];
  
  return patterns.some(pattern => pattern.test(timeframe.trim()));
}

function parseProjects(content: string): Project[] {
  const projects: Project[] = [];
  
  const projectsSection = content.match(/## PROJECTS\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
  if (!projectsSection) return projects;
  
  const projectText = projectsSection[1];
  
  // Split by double newlines to get individual project blocks
  const projectBlocks = projectText.split(/\n\n+/).filter(block => block.trim());
  
  for (const block of projectBlocks) {
    // Match **[Title](Link)** pattern
    const titleMatch = block.match(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/);
    if (!titleMatch) continue;
    
    const title = titleMatch[1].trim();
    const link = titleMatch[2].trim();
    
    // Parse additional fields
    const lines = block.split('\n');
    let description = '';
    let category = '';
    let image = '';
    let metrics: string[] = [];
    let technologies: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('**Category:**')) {
        category = trimmedLine.replace(/\*\*Category:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('**Image:**')) {
        image = trimmedLine.replace(/\*\*Image:\*\*/, '').trim();
      } else if (trimmedLine.startsWith('**Metrics:**')) {
        const metricsText = trimmedLine.replace(/\*\*Metrics:\*\*/, '').trim();
        metrics = metricsText.split(',').map(m => m.trim()).filter(m => m.length > 0);
      } else if (trimmedLine.startsWith('**Technologies:**')) {
        const techText = trimmedLine.replace(/\*\*Technologies:\*\*/, '').trim();
        technologies = techText.split(',').map(t => t.trim()).filter(t => t.length > 0);
      } else if (trimmedLine.startsWith('- ')) {
        description = trimmedLine.substring(2).trim();
      }
    }
    
    if (title && description) {
      projects.push({
        title,
        description,
        link,
        image: image || undefined,
        category,
        metrics,
        technologies
      });
    }
  }
  
  return projects;
}

function parseSkills(content: string): { allSkills: string[]; categories: Array<{category: string; skills: string[]}> } {
  const allSkills: string[] = [];
  const categories: Array<{category: string; skills: string[]}> = [];
  
  const skillsSection = content.match(/## SKILLS\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
  if (!skillsSection) return { allSkills, categories };
  
  const skillsText = skillsSection[1];
  const skillLines = skillsText.split('\n').filter(line => line.startsWith('**'));
  
  skillLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const categoryName = line.substring(2, colonIndex).replace(/\*\*/g, '').trim();
      // Get content after colon and split by comma
      const skillsContent = line.substring(colonIndex + 1).trim();
      const skillsInLine = skillsContent.split(',');
      // Filter out empty strings, trim, and remove any "**" markdown formatting
      const categorySkills = skillsInLine
        .map(s => s.trim().replace(/^\*\*\s*/, '').replace(/\*\*$/, ''))
        .filter(s => s && s.length > 0);
      
      if (categoryName && categorySkills.length > 0) {
        categories.push({
          category: categoryName,
          skills: categorySkills
        });
        allSkills.push(...categorySkills);
      }
    }
  });
  
  return { allSkills, categories };
}

function parseEducation(content: string): Education[] {
  const education: Education[] = [];
  
  const educationSection = content.match(/## EDUCATION\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
  if (!educationSection) return education;
  
  const educationText = educationSection[1];
  
  // Split by double newlines to get individual education entries
  const eduBlocks = educationText.split(/\n\n+/).filter(block => block.trim());
  
  for (const block of eduBlocks) {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;
    
    // Parse first line: **Institution** — *Degree*
    const firstLine = lines[0];
    const institutionMatch = firstLine.match(/^\*\*([^*]+)\*\*\s*—\s*\*([^*]+)\*/);
    if (!institutionMatch) continue;
    
    const institution = institutionMatch[1].trim();
    const degree = institutionMatch[2].trim();
    
    // Parse second line: Timeframe | Location
    let timeframe = '';
    let location = '';
    if (lines.length > 1) {
      const secondLine = lines[1];
      const parts = secondLine.split('|').map(p => p.trim());
      timeframe = parts[0] || '';
      location = parts[1] || '';
    }
    
    const details = lines
      .slice(2)
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.replace(/^- /, '').trim())
      .filter(line => line.length > 0);

    education.push({
      institution,
      degree,
      timeframe,
      location,
      details: details.length > 0 ? details : undefined
    });
  }
  
  return education;
}

function parseCertifications(content: string): Certification[] {
  const certifications: Certification[] = [];
  
  const certSection = content.match(/## CERTIFICATIONS\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
  if (!certSection) return certifications;
  
  const certText = certSection[1];
  
  // Split by double newlines to get individual certification entries
  const certBlocks = certText.split(/\n\n+/).filter(block => block.trim());
  
  for (const block of certBlocks) {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;
    
    // Parse first line: **Title** — Institution
    const firstLine = lines[0];
    const titleMatch = firstLine.match(/^\*\*([^*]+)\*\*\s*—\s*(.+)$/);
    if (!titleMatch) continue;
    
    const title = titleMatch[1].trim();
    const institution = titleMatch[2].trim();
    
    // Parse second line: Date
    let date = '';
    if (lines.length > 1) {
      date = lines[1].trim();
    }
    
    certifications.push({
      title,
      institution,
      date
    });
  }
  
  return certifications;
}

function parsePublications(content: string): Publication[] {
  const publications: Publication[] = [];
  
  const publicationsSection = content.match(/## PUBLICATIONS\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
  if (!publicationsSection) return publications;
  
  const publicationsText = publicationsSection[1];
  
  // Look for publication patterns:
  // **Title** - Authors (Year). *Venue*. [Link](URL)
  // or simpler: **Title** - Description/Authors/Venue info
  const publicationLines = publicationsText.split('\n').filter(line => line.trim() && line.startsWith('**'));
  
  for (const line of publicationLines) {
    // Extract title from **Title** 
    const titleMatch = line.match(/^\*\*([^*]+)\*\*/);
    if (!titleMatch) continue;
    
    const title = titleMatch[1].trim();
    let authors = '';
    let venue = '';
    let year: number | undefined = undefined;
    let link: string | undefined = undefined;
    
    // Extract link if present: [text](url)
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      link = linkMatch[2];
    }
    
    // Extract year if present (4 digits)
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[0]);
    }
    
    // Extract venue from italic text *venue*
    const venueMatch = line.match(/\*([^*]+)\*/);
    if (venueMatch) {
      venue = venueMatch[1].trim();
    }
    
    // The remaining text after title could be authors/venue info
    const remainingText = line.replace(/^\*\*[^*]+\*\*/, '').replace(/\[([^\]]+)\]\(([^)]+)\)/, '').replace(/\*([^*]+)\*/, '').trim();
    if (remainingText.startsWith(' - ')) {
      authors = remainingText.substring(3).trim();
    }
    
    publications.push({
      title,
      authors: authors || undefined,
      venue: venue || undefined,
      year,
      link
    });
  }
  
  return publications;
}

export function parseResumeMarkdown(): ParsedContent {
  try {
    const resumePath = path.join(process.cwd(), 'resume_clarisse_lim_2026.md');
    const rawContent = fs.readFileSync(resumePath, 'utf-8');
    const content = stripHtmlComments(rawContent);
    
    // Check cache first (use file content as cache key)
    const cacheKey = content.length + '_' + content.substring(0, 100).replace(/\s/g, '');
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey)!;
    }

    // Parse profile information
    const lines = content.split('\n');
    const name = lines[0].replace('# ', '').trim();
    const title = lines[1].replace(/\*\*/g, '').trim();
    
    // Extract headline
    const headlineLine = lines.find(line => line.startsWith('**Headline:**'));
    const headline = headlineLine ? headlineLine.replace('**Headline:**', '').trim() : `${name} — ${title}`;
    
    // Extract contact information
    const contactLine = lines.find(line => line.includes('mailto:'));
    const contacts = [];
    if (contactLine) {
      // Email
      const emailMatch = contactLine.match(/\[([^\]]+)\]\(mailto:([^)]+)\)/);
      if (emailMatch) {
        contacts.push({ label: 'Email', url: `mailto:${emailMatch[2]}` });
      }
      
      // Phone - match pattern like (765)-637-1295
      const phoneMatch = contactLine.match(/\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/);
      if (phoneMatch) {
        const phone = phoneMatch[0].replace(/\D/g, '');
        contacts.push({ label: 'Phone', url: `tel:${phone}` });
      }
      
      // LinkedIn
      const linkedinMatch = contactLine.match(/\[([^\]]+)\]\(https:\/\/[^)]*linkedin[^)]*\)/);
      if (linkedinMatch) {
        contacts.push({ label: 'LinkedIn', url: linkedinMatch[0].match(/https:\/\/[^)]*/)?.[0] || '' });
      }
      
      // GitHub
      const githubMatch = contactLine.match(/\[([^\]]+)\]\(https:\/\/[^)]*github[^)]*\)/);
      if (githubMatch) {
        contacts.push({ label: 'GitHub', url: githubMatch[0].match(/https:\/\/[^)]*/)?.[0] || '' });
      }
      
      // Location - text after LinkedIn or at end of line
      const locationMatch = contactLine.match(/\|\s*([^|]+)$/);
      if (locationMatch) {
        const location = locationMatch[1].trim();
        if (location && !location.includes('linkedin') && !location.includes('@')) {
          contacts.push({ label: 'Location', url: `https://maps.google.com/?q=${encodeURIComponent(location)}` });
        }
      }
    }

    // Parse highlights
    const highlights: Array<{value: string, label: string}> = [];
    const highlightsSection = content.match(/## HIGHLIGHTS\s*\n\n?([\s\S]*?)(?=\n---|\n##|$)/);
    if (highlightsSection) {
      const highlightLines = highlightsSection[1].split('\n').filter(line => line.trim().startsWith('- '));
      highlightLines.forEach(line => {
        const match = line.match(/- \*\*([^*]+)\*\*\s*(.+)/);
        if (match) {
          highlights.push({
            value: match[1].trim(),
            label: match[2].trim()
          });
        }
      });
    }

    // Parse skills
    const { allSkills: skills, categories: skillCategories } = parseSkills(content);

    // Create bio from resume content (avoid hard-coded content)
    const bio = headline;

    const profile: Profile = {
      name,
      title,
      headline,
      bio,
      skills: skills.slice(0, 15), // Get more skills for better display
      skillCategories,
      highlights,
      contacts
    };

    // Parse experience, education, projects, certifications, and publications
    const experience = parseWorkExperience(content);
    const education = parseEducation(content);
    const projects = parseProjects(content);
    const certifications = parseCertifications(content);
    const publications = parsePublications(content);

    const result = {
      profile,
      experience,
      education,
      projects,
      certifications,
      publications
    };

    // Cache the result (limit cache size to prevent memory leaks)
    if (contentCache.size > 50) {
      const firstKey = contentCache.keys().next().value;
      if (firstKey !== undefined) {
        contentCache.delete(firstKey);
      }
    }
    contentCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error parsing resume:', error);
    
    // Fallback data (empty to avoid injecting unrelated content)
    return {
      profile: {
        name: '',
        title: '',
        headline: '',
        bio: '',
        skills: [],
        skillCategories: [],
        highlights: [],
        contacts: []
      },
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      publications: []
    };
  }
}
