"use client";

import type { Profile, Education } from '@/lib/models';
import { motion } from 'framer-motion';
import { MapPin, Mail, Linkedin, GraduationCap, Briefcase, Github } from 'lucide-react';

interface AboutSectionProps {
  profile: Profile;
  education?: Education[];
  isStandalone?: boolean;
}

export function AboutSection({ profile, education = [], isStandalone = false }: AboutSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const getContactValue = (label: string) => {
    const contact = profile.contacts.find(item => item.label.toLowerCase() === label.toLowerCase());
    if (!contact) return '';
    if (label.toLowerCase() === 'email') {
      return contact.url.replace('mailto:', '');
    }
    if (label.toLowerCase() === 'phone') {
      const digits = contact.url.replace('tel:', '').replace(/\D/g, '');
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    }
    if (label.toLowerCase() === 'location') {
      return decodeURIComponent(contact.url.replace('https://maps.google.com/?q=', '').replace(/\+/g, ' '));
    }
    return contact.url.replace('https://', '');
  };

  const primaryEducation =
    education.find(item => item.degree.toLowerCase().includes('business analytics')) || education[0];
  const educationLabel = primaryEducation
    ? (primaryEducation.degree.match(/\bMS\b/i)
        ? primaryEducation.degree.replace(/Master of Science/i, 'MS')
        : 'MS, Business Analytics')
    : 'Education available on request';
  const currentRole = profile.title.split('|')[0].trim();
  const locationText = getContactValue('Location');

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern-dense opacity-20 dark:opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              <span className="font-mono text-sm text-primary">01</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
            </div>
            {isStandalone ? (
              <h1 className="text-4xl md:text-5xl font-bold text-center">About</h1>
            ) : (
              <h2 className="text-4xl md:text-5xl font-bold text-center">About</h2>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column - Main Info */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gradient-cyan-lime">Background</h3>
                <div className="prose prose-lg prose-invert max-w-none">
                  {profile.bio.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-card border border-border/50"
                >
                  <MapPin className="w-5 h-5 text-primary mb-2" />
                  <div className="font-mono text-xs text-muted-foreground">Location</div>
                  <div className="font-medium">{locationText || 'Location available on request'}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-card border border-border/50"
                >
                  <Briefcase className="w-5 h-5 text-secondary mb-2" />
                  <div className="font-mono text-xs text-muted-foreground">Current Role</div>
                  <div className="font-medium">{currentRole}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-card border border-border/50"
                >
                  <GraduationCap className="w-5 h-5 text-accent mb-2" />
                  <div className="font-mono text-xs text-muted-foreground">Education</div>
                  <div className="font-medium">{educationLabel}</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Connect */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
              {/* Contact Links */}
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  Connect
                </h3>
                <div className="space-y-3">
                  {profile.contacts
                    .filter(contact => ['email', 'linkedin', 'github'].includes(contact.label.toLowerCase()))
                    .map((contact, index) => {
                    const lowerLabel = contact.label.toLowerCase();
                    const Icon = lowerLabel === 'email' ? Mail : lowerLabel === 'linkedin' ? Linkedin : Github;
                    return (
                      <motion.a
                        key={index}
                        href={contact.url}
                        target={contact.url.startsWith('mailto:') ? '_self' : '_blank'}
                        rel={contact.url.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{contact.label}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {getContactValue(contact.label)}
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
