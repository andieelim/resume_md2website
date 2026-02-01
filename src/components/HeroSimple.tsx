"use client";

import type { Profile, ParsedContent } from '@/lib/models';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Download, ArrowDown, BarChart3, Sparkles, LineChart } from 'lucide-react';
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
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Snapshot</div>
                      <div className="text-lg font-semibold">Performance Overview</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-xs">
                    Updated today
                  </span>
                </div>

                {/* Profile Summary */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-gradient">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-primary text-sm font-medium">{profile.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">Alliance Health System</p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(profile.highlights || []).slice(0, 4).map((highlight, index) => (
                    <div key={index} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="text-xs text-muted-foreground">{highlight.label}</div>
                      <div className="text-lg font-semibold text-primary mt-1">{highlight.value}</div>
                    </div>
                  ))}
                </div>

                {/* Mini Trend */}
                <div className="rounded-xl border border-border/50 p-4 bg-muted/30 mb-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Campaign momentum</span>
                    <span className="text-primary">+12% MoM</span>
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    {[30, 42, 28, 60, 48, 70, 58].map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-full bg-primary/30"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Tool Stack */}
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-card border border-border/60 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
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
