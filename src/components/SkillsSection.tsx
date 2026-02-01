"use client";

import { motion } from 'framer-motion';
import type { SkillCategory } from '@/lib/models';

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
  isStandalone?: boolean;
}

// Dynamic styling based on category index
const getCategoryStyle = (index: number) => {
  const styles = [
    { color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
    { color: "text-secondary", bgColor: "bg-secondary/10", borderColor: "border-secondary/30" },
    { color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/30" },
    { color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/30" },
    { color: "text-secondary", bgColor: "bg-secondary/10", borderColor: "border-secondary/30" },
    { color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/30" },
  ];
  return styles[index % styles.length];
};

export function SkillsSection({ skillCategories, isStandalone = false }: SkillsSectionProps) {
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
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="skills" className="py-24 bg-background relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
            <span className="font-mono text-sm text-accent">04</span>
            <div className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
          </div>
          {isStandalone ? (
            <h1 className="text-4xl md:text-5xl font-bold text-center">Skills</h1>
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold text-center">Skills</h2>
          )}
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            A focused toolkit for analytics, dashboards, and data-driven marketing insights
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {skillCategories.map((category, index) => {
            const style = getCategoryStyle(index);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${style.bgColor} flex items-center justify-center border ${style.borderColor}`}>
                    <span className={`text-lg font-bold ${style.color}`}>
                      {category.category.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{category.category}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: skillIndex * 0.03 }}
                      viewport={{ once: true }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-default ${style.bgColor} ${style.borderColor} hover:${style.color}`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
