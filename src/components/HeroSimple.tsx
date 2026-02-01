"use client";

import type { Profile, ParsedContent } from '@/lib/models';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Download, ArrowDown, Terminal, Cpu, Network } from 'lucide-react';
import { downloadResumePDF } from '@/lib/pdfGenerator';

interface HeroSimpleProps {
  profile: Profile;
  resumeData: ParsedContent;
}

export function HeroSimple({ profile, resumeData }: HeroSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-50" />
      
      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-32 h-32 border border-primary/20 rounded-lg opacity-40"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-10 w-24 h-24 border border-secondary/20 rounded-full opacity-40"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-secondary rounded-full"
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]"
        >
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-mono text-primary">Available for opportunities</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Data-Driven</span>
                <br />
                <span className="text-gradient">Marketing</span>
                <br />
                <span className="text-foreground">Insights</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                {profile.headline}
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-8 py-4">
              {profile.highlights && profile.highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="space-y-1">
                  <div className={`text-3xl font-bold font-mono ${
                    index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : 'text-accent'
                  }`}>
                    {highlight.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{highlight.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadResumePDF(resumeData)}
                className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all glow-cyan"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToAbout}
                className="flex items-center gap-3 px-8 py-4 border-2 border-border hover:border-primary rounded-xl font-semibold text-lg transition-all"
              >
                View My Work
                <ArrowDown className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative">
              {/* Main Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm text-muted-foreground">system.profile</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-secondary/50" />
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                  </div>
                </div>

                {/* Profile Content */}
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl font-bold text-gradient">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Cpu className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                      <p className="text-primary font-mono text-sm">{profile.title.toUpperCase().replace(/\s+/g, '_')}</p>
                      <p className="text-muted-foreground text-sm mt-1">{profile.highlights && profile.highlights[0]?.label.includes('Active') ? 'Alliance Health System' : 'Data & Marketing Analytics'}</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {profile.skills && profile.skills.slice(0, 4).map((skill, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <Network className={`w-4 h-4 mb-2 ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`} />
                        <div className="text-xs text-muted-foreground font-mono">{skill.split(' ')[0]}</div>
                        <div className="text-sm font-medium">{skill.split(' ').slice(1).join(' ') || skill}</div>
                      </div>
                    ))}
                  </div>

                  {/* Status Bar */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-mono">Status</span>
                      <span className="flex items-center gap-2 text-primary">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Elements */}
              {profile.highlights && profile.highlights[3] && (
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-mono text-xs shadow-lg"
                >
                  98.59% Accuracy
                </motion.div>
              )}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-mono text-xs shadow-lg"
              >
                MCP Connected
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-xs font-mono">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-5 h-5 group-hover:text-primary transition-colors" />
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
