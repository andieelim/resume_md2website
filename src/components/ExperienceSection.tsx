"use client";

import type { ExperienceEntry } from '@/lib/models';
import { motion } from 'framer-motion';
import { Building2, Calendar, MapPin, ArrowUpRight } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceEntry[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  // Helper to determine if this is the current/most recent position
  const isCurrentPosition = (timeframe: string) => {
    return timeframe.toLowerCase().includes('present');
  };

  return (
    <section id="experience" className="py-24 bg-background relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-secondary/50 to-transparent" />
            <span className="font-mono text-sm text-secondary">02</span>
            <div className="h-px flex-1 bg-gradient-to-l from-secondary/50 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center">Experience</h2>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            My journey across data analytics and marketing, from dashboards to strategic insights
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

          <div className="space-y-12">
            {experience.map((exp, index) => (
              <motion.div
                key={`${exp.employer}-${exp.title}-${index}`}
                variants={itemVariants}
                className={`relative grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:text-right'}`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 z-10 ${
                  isCurrentPosition(exp.timeframe)
                    ? 'bg-primary shadow-lg shadow-primary/50' 
                    : 'bg-muted border-2 border-border'
                }`}>
                  {isCurrentPosition(exp.timeframe) && (
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                  )}
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:order-1 md:pr-12' : 'md:order-2 md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      isCurrentPosition(exp.timeframe)
                        ? 'bg-card border-primary/30 shadow-lg shadow-primary/5' 
                        : 'bg-card/50 border-border/50 hover:border-border'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">
                        {exp.timeframe}
                      </span>
                      {isCurrentPosition(exp.timeframe) && (
                        <span className="px-2 py-1 rounded bg-primary/10 text-xs font-mono text-primary">
                          Current
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    
                    <div className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {exp.employer}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {exp.summary}
                    </p>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {exp.achievements.slice(0, 3).map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: achievement }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Spacer for timeline alignment */}
                <div className={`hidden md:block ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
