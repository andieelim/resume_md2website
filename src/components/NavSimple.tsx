"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { downloadResumePDF } from '@/lib/pdfGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ParsedContent } from '@/lib/models';

const navigationItems = [
  { name: 'About', href: '#about', number: '01' },
  { name: 'Experience', href: '#experience', number: '02' },
  { name: 'Projects', href: '#projects', number: '03' },
  { name: 'Skills', href: '#skills', number: '04' },
  { name: 'Contact', href: '#contact', number: '05' },
];

interface NavSimpleProps {
  resumeData: ParsedContent;
}

export function NavSimple({ resumeData }: NavSimpleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section
      const sections = navigationItems.map(item => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <a href="#" className="group flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors" />
                  <span className="text-base font-bold text-gradient-cyan-lime tracking-tight leading-none">CAL</span>
                </div>
                <span className="hidden sm:block text-sm text-muted-foreground">
                  Data Analyst
                </span>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                    activeSection === item.href.slice(1)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="font-mono text-xs text-primary/60 mr-1">{item.number}</span>
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
              
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-border">
                <ThemeToggle />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => downloadResumePDF(resumeData)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Resume</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-20 left-4 right-4 bg-card border border-border rounded-2xl p-6 shadow-2xl"
            >
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="font-mono text-xs text-primary">{item.number}</span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    downloadResumePDF(resumeData);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
                
                <div className="flex justify-center gap-4 mt-6">
                  <a href="https://github.com/andieelim" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg hover:bg-muted transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/clarissealim/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg hover:bg-muted transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="mailto:clarisse.lim416@gmail.com" className="p-3 rounded-lg hover:bg-muted transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
