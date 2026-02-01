import jsPDF from 'jspdf';
import type { ParsedContent, Profile, ExperienceEntry, Education, Project, SkillCategory } from './models';

export interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  resumeData?: ParsedContent;
}

function formatContactsForPDF(profile: Profile): { text: string; url?: string }[] {
  const contacts: { text: string; url?: string }[] = [];
  
  // Extract email with hyperlink
  const emailContact = profile.contacts.find(c => c.label.toLowerCase() === 'email');
  if (emailContact) {
    const email = emailContact.url.replace('mailto:', '');
    contacts.push({ text: email, url: emailContact.url });
  }
  
  // Extract phone and format with dashes
  const phoneContact = profile.contacts.find(c => c.label.toLowerCase() === 'phone');
  if (phoneContact) {
    const phoneDigits = phoneContact.url.replace('tel:', '').replace(/\D/g, '');
    const formattedPhone = phoneDigits.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    contacts.push({ text: formattedPhone, url: phoneContact.url });
  }
  
  // Extract LinkedIn with hyperlink
  const linkedInContact = profile.contacts.find(c => c.label.toLowerCase() === 'linkedin');
  if (linkedInContact) {
    const linkedinUrl = linkedInContact.url;
    const username = linkedinUrl.split('/in/')[1]?.replace('/', '') || linkedinUrl;
    contacts.push({ text: `linkedin.com/in/${username}`, url: linkedInContact.url });
  }
  
  // Extract location
  const locationContact = profile.contacts.find(c => c.label.toLowerCase() === 'location');
  if (locationContact) {
    const locationText = decodeURIComponent(locationContact.url.replace('https://maps.google.com/?q=', '').replace(/\+/g, ' '));
    contacts.push({ text: locationText, url: locationContact.url });
  }
  
  return contacts;
}

export function generateResumePDF(options: PDFOptions = {}) {
  const {
    filename = 'Clarisse_Lim_Resume.pdf',
    format = 'a4',
    orientation = 'portrait',
    resumeData
  } = options;

  try {
    // Use provided resume data or fallback to static data
    const parsedData: ParsedContent = resumeData || getFallbackResumeData();
    const { profile, experience, education, projects, certifications } = parsedData;
    
    // Format contacts for PDF display
    const contactStrings = formatContactsForPDF(profile);

    // Create new PDF document
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Set fonts and colors (pink + neutral to match site)
    const primaryColor: [number, number, number] = [255, 91, 166]; // Pink
    const textColor: [number, number, number] = [31, 41, 55]; // Slate-800
    const lightGray: [number, number, number] = [148, 163, 184]; // Slate-400

    let currentY = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      for (let i = 0; i < lines.length; i++) {
        if (y + (i * lineHeight) > 280) { // Check if we need a new page
          doc.addPage();
          y = 20;
        }
        doc.text(lines[i], x, y + (i * lineHeight));
      }
      return y + (lines.length * lineHeight);
    };

    // Header Section
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text(profile.name, margin, currentY);
    
    currentY += 8;
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.text(profile.title, margin, currentY);

    // Contact Information  
    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    
    // Add contact information with hyperlinks
    let contactX = margin;
    contactStrings.forEach((contact, index) => {
      if (index > 0) {
        doc.text(' | ', contactX, currentY);
        contactX += doc.getTextWidth(' | ');
      }
      
      const contactWidth = doc.getTextWidth(contact.text);
      doc.text(contact.text, contactX, currentY);
      
      // Add hyperlink if URL exists
      if (contact.url) {
        doc.link(contactX, currentY - 3, contactWidth, 5, { url: contact.url });
      }
      
      contactX += contactWidth;
    });
    currentY += 6;

    // Horizontal line
    currentY += 8;
    doc.setDrawColor(...lightGray);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // Experience Section
    currentY += 10;
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Professional Experience', margin, currentY);

    for (const exp of experience) {
      currentY += 10;
      
      // Company and Title
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text(exp.title, margin, currentY);
      
      currentY += 6;
      doc.setFontSize(10);
      doc.setTextColor(...lightGray);
      doc.text(`${exp.employer} | ${exp.timeframe} | ${exp.location}`, margin, currentY);

      // Achievements (full content, no summaries)
      if (exp.achievements && exp.achievements.length > 0) {
        currentY += 8;
        for (const achievement of exp.achievements) {
          currentY += 6;
          // Remove HTML tags and markdown formatting from achievement text
          const cleanText = achievement.replace(/<[^>]*>/g, '').replace(/\*\*/g, '');
          doc.setTextColor(...textColor);
          currentY = addWrappedText(`• ${cleanText}`, margin + 5, currentY, contentWidth - 10, 5);
          
          // Check for page break
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }
        }
      }
    }

    // Education Section
    if (education.length > 0) {
      currentY += 15;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Education', margin, currentY);

      for (const edu of education) {
        currentY += 10;
        
        // Institution and Degree
        doc.setFontSize(12);
        doc.setTextColor(...textColor);
        doc.text(`${edu.institution} — ${edu.degree}`, margin, currentY);
        
        currentY += 6;
        doc.setFontSize(10);
        doc.setTextColor(...lightGray);
        doc.text(`${edu.timeframe} | ${edu.location}`, margin, currentY);

        if (edu.details && edu.details.length > 0) {
          for (const detail of edu.details) {
            currentY += 5;
            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            currentY = addWrappedText(`• ${detail}`, margin + 5, currentY, contentWidth - 10, 4);

            if (currentY > 270) {
              doc.addPage();
              currentY = 20;
            }
          }
        }
      }
    }

    // Skills Section (Categorized)
    if (profile.skillCategories && profile.skillCategories.length > 0) {
      currentY += 15;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Skills', margin, currentY);

      currentY += 8;
      for (const category of profile.skillCategories) {
        currentY += 6;
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        doc.text(`${category.category}:`, margin, currentY);
        
        currentY += 4;
        doc.setTextColor(...textColor);
        doc.setFontSize(9);
        const skillsText = category.skills.join(', ');
        currentY = addWrappedText(skillsText, margin + 5, currentY, contentWidth - 10, 4);
        
        // Check for page break
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
      }
    }

    // Projects Section - Show only first 3 projects without categories/metrics/technologies
    if (projects.length > 0) {
      currentY += 15;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Projects', margin, currentY);

      // Only show first 3 projects
      const projectsToShow = projects.slice(0, 3);
      
      for (const project of projectsToShow) {
        currentY += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        currentY = addWrappedText(project.title, margin, currentY, contentWidth);
        
        currentY += 6;
        doc.setFontSize(9);
        currentY = addWrappedText(project.description, margin, currentY, contentWidth, 4);
      }
    }

    // Certifications Section
    if (certifications.length > 0) {
      currentY += 15;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Certifications', margin, currentY);

      for (const certification of certifications) {
        currentY += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.text(`${certification.title} — ${certification.institution}`, margin, currentY);
        
        currentY += 4;
        doc.setTextColor(...lightGray);
        doc.text(certification.date, margin, currentY);
      }
    }

    // Save the PDF
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

export function downloadResumePDF(resumeData?: ParsedContent) {
  const fallbackFilename = 'Resume.pdf';
  const profileName = resumeData?.profile?.name?.trim();
  const sanitizedName = profileName ? profileName.replace(/[^\w-]+/g, '_') : '';
  const filename = sanitizedName ? `${sanitizedName}_Resume.pdf` : fallbackFilename;

  const success = generateResumePDF({
    filename,
    format: 'a4',
    orientation: 'portrait',
    resumeData
  });
  
  if (!success) {
    // Fallback: try to open a pre-existing PDF or show an error
    console.error('Failed to generate PDF. Please try again.');
    
    // As a fallback, we could link to a pre-generated PDF
    // For now, we'll just show an alert
    alert('Unable to generate PDF at this time. Please contact me directly for a copy of my resume.');
  }
}

function getFallbackResumeData(): ParsedContent {
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
