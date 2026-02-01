"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Zap, Database, Eye, Sparkles } from 'lucide-react';
import { Project } from '@/lib/models';

interface ProjectsSectionProps {
  projects?: Project[];
}

// Image mapping based on title keywords
const imageMapping: Record<string, string> = {
};

// Default image if no match found
const defaultImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzU3ODI2OTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Determine status based on category or other factors
const getStatus = (category?: string): "Research" | "Production" | "Beta" => {
  if (category?.includes("Research")) return "Research";
  return "Production";
};

// Get image for project
const getProjectImage = (title: string): string => {
  const key = Object.keys(imageMapping).find(k => title.toLowerCase().includes(k.toLowerCase()));
  return key ? imageMapping[key] : defaultImage;
};

// Get category icon
const getCategoryIcon = (category?: string) => {
  if (!category) return Sparkles;
  if (category.toLowerCase().includes("manufacturing")) return Zap;
  if (category.toLowerCase().includes("data")) return Database;
  if (category.toLowerCase().includes("laboratory")) return Eye;
  if (category.toLowerCase().includes("predictive")) return Sparkles;
  return Zap;
};

export function ProjectsSection({ projects: markdownProjects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter out projects without categories
  const validProjects = (markdownProjects || []).filter(proj => proj.category);

  // Extract unique categories dynamically from projects
  const categories = ["All", ...Array.from(new Set(validProjects.map(proj => proj.category).filter(Boolean)))].filter((cat): cat is string => Boolean(cat));

  // Filter projects by category
  const filteredProjects = selectedCategory === "All" 
    ? validProjects 
    : validProjects.filter((project) => project.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Production": return "bg-primary/20 text-primary border-primary/30";
      case "Beta": return "bg-secondary/20 text-secondary border-secondary/30";
      case "Research": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <section id="projects" className="py-24 bg-background relative">
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
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <span className="font-mono text-sm text-primary">03</span>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center">Featured Projects</h2>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            From research prototypes to production systems serving thousands
          </p>
        </motion.div>

        {/* Category Filter - Dynamically generated from projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const status = getStatus(project.category);
              const image = project.image || getProjectImage(project.title);
              const CategoryIcon = getCategoryIcon(project.category);
              
              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="h-full bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/80 backdrop-blur-sm border border-border/30 flex items-center gap-1">
                          <CategoryIcon className="w-4 h-4" />
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {project.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.metrics.slice(0, 2).map((metric) => (
                            <span 
                              key={metric} 
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs font-mono"
                            >
                              <ArrowUpRight className="w-3 h-3 text-primary" />
                              {metric}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-1 rounded-md bg-muted/50 text-xs border border-border/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-1 rounded-md bg-muted/50 text-xs border border-border/30">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-2 pt-2">
                        {project.link?.includes('github.com') && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.link && !project.link.includes('github.com') && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
