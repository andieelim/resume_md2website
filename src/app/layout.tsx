import type { Metadata } from 'next'
import './globals.css'
import { NavSimple } from '@/components/NavSimple'
import { SkipNavigation } from '@/components/SkipNavigation'
import { parseResumeMarkdown } from '@/lib/parseResumeMarkdown'

export const metadata: Metadata = {
  title: 'Clarisse Lim — Data Analyst',
  description: 'Data Analyst and Marketing Analyst focused on analytics, dashboards, and data-driven insights for business growth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Parse resume data on server to pass to components
  const resumeData = parseResumeMarkdown()
  
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SkipNavigation />
        <header>
          <NavSimple resumeData={resumeData} />
        </header>
        <main id="main-content" role="main">{children}</main>
        <footer className="border-t border-border bg-muted/30" role="contentinfo">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground font-mono">
                <span className="text-primary">&gt;</span> clarisse.lim416@gmail.com
              </p>
              <p className="text-sm text-muted-foreground">
                © 2026 Clarisse Lim
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
