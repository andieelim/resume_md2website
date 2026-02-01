"use client";

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Github, Linkedin, Send, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import type { Profile } from '@/lib/models';

interface ContactFormProps {
  profile: Profile;
}

export function ContactForm({ profile }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const formatContactValue = (label: string, url: string) => {
    const lower = label.toLowerCase();
    if (lower === 'email') return url.replace('mailto:', '');
    if (lower === 'phone') {
      const digits = url.replace('tel:', '').replace(/\D/g, '');
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    }
    if (lower === 'location') {
      return decodeURIComponent(url.replace('https://maps.google.com/?q=', '').replace(/\+/g, ' '));
    }
    return url.replace('https://', '');
  };

  const contactInfo = useMemo(() => {
    const colorMap: Record<string, string> = {
      email: 'text-primary',
      linkedin: 'text-secondary',
      github: 'text-accent',
      phone: 'text-secondary',
      location: 'text-accent'
    };
    const iconMap: Record<string, ComponentType<{ className?: string }>> = {
      email: Mail,
      linkedin: Linkedin,
      github: Github,
      phone: Phone,
      location: MapPin
    };
    const order = ['email', 'linkedin', 'github', 'phone', 'location'];
    return profile.contacts
      .filter(contact => order.includes(contact.label.toLowerCase()))
      .sort((a, b) => order.indexOf(a.label.toLowerCase()) - order.indexOf(b.label.toLowerCase()))
      .map(contact => {
        const key = contact.label.toLowerCase();
        const Icon = iconMap[key] || Mail;
        return {
          icon: Icon,
          label: contact.label,
          value: formatContactValue(contact.label, contact.url),
          href: contact.url,
          color: colorMap[key] || 'text-primary'
        };
      });
  }, [profile.contacts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const emailContact = profile.contacts.find(contact => contact.label.toLowerCase() === 'email');
    const to = emailContact ? emailContact.url.replace('mailto:', '') : 'clarisse.lim416@gmail.com';
    const subject = encodeURIComponent(formData.subject.trim() || `Message from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    
    // Use anchor element for better mailto compatibility
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${to}?subject=${subject}&body=${body}`;
    mailtoLink.click();
    
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    const emailContact = profile.contacts.find(contact => contact.label.toLowerCase() === 'email');
    const email = emailContact ? emailContact.url.replace('mailto:', '') : 'clarisse.lim416@gmail.com';
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-background relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-secondary/50 to-transparent" />
            <span className="font-mono text-sm text-secondary">05</span>
            <div className="h-px flex-1 bg-gradient-to-l from-secondary/50 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center">Get In Touch</h2>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            Let's discuss analytics, marketing insights, or data-driven projects
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're interested in analytics support, marketing insights, or a data-driven project, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith('mailto:') || info.href.startsWith('tel:') ? '_self' : '_blank'}
                    rel={info.href.startsWith('mailto:') || info.href.startsWith('tel:') ? '' : 'noopener noreferrer'}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${info.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-mono">{info.label}</div>
                      <div className="font-medium group-hover:text-primary transition-colors">{info.value}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Copy Email Button */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prefer to copy email?</p>
                  <p className="font-mono text-sm">
                    {formatContactValue('email', profile.contacts.find(contact => contact.label.toLowerCase() === 'email')?.url || 'mailto:clarisse.lim416@gmail.com')}
                  </p>
                </div>
                <motion.button
                  onClick={copyEmail}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-lg hover:border-primary/30 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
            </div>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-sm text-primary">Available for new projects</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting consulting opportunities and research collaborations
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <div className="p-8 rounded-2xl bg-card border border-border/50 h-full">
              <form onSubmit={handleSubmit} className="h-full flex flex-col gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-mono">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-sm font-medium text-muted-foreground font-mono">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full flex-1 px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none min-h-0"
                    placeholder="Tell me about your project, collaboration ideas, or any questions..."
                  />
                </div>

                <div className="mt-auto space-y-6">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all glow-cyan"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>

                <p className="text-center text-xs text-muted-foreground">
                  Opens your default email client (Gmail, Outlook, etc.) with pre-filled message
                </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
