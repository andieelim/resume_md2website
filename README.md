# Resume-to-Website Project

A modern, responsive personal website generated from a structured resume markdown file. The site renders all core content dynamically from markdown, supports a neo-brutalist visual system with light/dark themes, and can be deployed as a static export on GitHub Pages.

## Project Overview

This project transforms a resume markdown file into a professional website with automated content extraction and responsive design. The parser turns resume sections into typed data models, which are rendered across multiple pages and sections:

- Home: hero, highlights, experience, projects, skills, and contact
- Experience: full professional timeline with summaries and achievements
- Projects: project cards with categories, metrics, and technology tags
- About: profile bio, skills, and contact links

## Live Demo

Production website: https://vibz28.github.io/resume_md2website

## Current Features

- Fully dynamic content rendering from markdown (no hard-coded profile data)
- Neo-brutalist redesign with light/dark theme support and motion
- Parsing for highlights, experience, education, skills, projects, courses, and publications
- Publications section component available but not wired by default
- Project taxonomy fields (category, metrics, technologies)
- PDF export using resume data (contacts, phone, and location included)
- Responsive navigation with mobile menu and section scroll tracking
- Accessibility foundations (skip navigation, ARIA labels, semantic HTML)
- Automated GitHub Pages deployment with GitHub Actions

## Technology Stack

- Framework: Next.js 16.x with App Router
- Language: TypeScript 5.x
- Styling: Tailwind CSS 3.4 with custom tokens and utilities
- UI: Radix UI primitives and Lucide icons
- Animation: Framer Motion
- PDF: jsPDF and html2canvas
- Testing: Playwright (configured, optional)
- Deployment: GitHub Pages via GitHub Actions

## Project Structure

```
resume_md2website/
|-- .github/
|   `-- workflows/
|       `-- nextjs.yml         # CI/CD deployment pipeline
|-- frontend-design/           # Design notes and assets
|-- src/
|   |-- app/                   # Next.js App Router
|   |   |-- page.tsx           # Home page (all sections)
|   |   |-- layout.tsx         # Root layout and navigation
|   |   |-- globals.css        # Global styles and theme tokens
|   |   |-- about/page.tsx     # About page
|   |   |-- experience/page.tsx# Experience page
|   |   `-- projects/page.tsx  # Projects page
|   |-- components/            # UI components and sections
|   |-- hooks/                 # Custom hooks
|   `-- lib/                   # Models, parser, and PDF generator
|-- docs/                      # Static export output (optional)
|-- next.config.js             # Next.js configuration
|-- package.json               # Dependencies and scripts
|-- tailwind.config.js         # Tailwind customization
|-- postcss.config.js          # PostCSS configuration
|-- resume_clarisse_lim_2026.md  # Resume data source
`-- README.md
```

## Architecture Overview

### Data Flow

```
Resume Markdown -> parseResumeMarkdown.ts -> Typed Models -> React Components -> Static HTML -> GitHub Pages
```

### Core Data Models

Models are defined in `src/lib/models.ts` and include the following major sections:

- Profile: name, title, headline, bio, skills, skill categories, highlights, contacts
- Experience: employer, title, timeframe, location, summary, achievements
- Projects: title, description, link, category, metrics, technologies
- Education, Courses, Publications

## Resume Markdown Structure Requirements

The parser expects a consistent structure. If you change the file name, update the path in `src/lib/parseResumeMarkdown.ts`.

### Required Header

```markdown
# Full Name
**Professional Title**

[email](mailto:email@domain.com) | (555)-555-5555 | [linkedin.com/in/username](https://www.linkedin.com/in/username/) | City, State

**Headline:** One-line positioning statement

---
```

### Highlights

```markdown
## HIGHLIGHTS

- **5,000+** Active users impacted
- **40%** Efficiency gain delivered
```

### Work Experience

```markdown
## WORK EXPERIENCE

**Company Name**
_**Position Title**_
*Date Range | Location*

**Summary:** Role overview and key responsibilities.

- Achievement with **bold formatting** for emphasis
- Multi-line achievement that continues
  seamlessly on the next line
```

Multiple roles at the same company should repeat the position and date blocks under the same company header.

### Education

```markdown
## EDUCATION

**Institution Name** - *Degree Name*
Date Range | Location
```

### Skills

```markdown
## SKILLS

**Category:** Skill1, Skill2, Skill3
**Another Category:** Framework1, Framework2, Tool1
```

### Projects

Each project must include a markdown link in the title to be parsed.

```markdown
## PROJECTS

**[Project Name](https://project-link.com)**
**Category:** Category label
**Metrics:** Metric 1, Metric 2
**Technologies:** Tech 1, Tech 2, Tech 3
- One-line description of the project
```

### Courses

```markdown
## COURSES

**Course Title** - Provider Name
Month Year
```

### Publications

```markdown
## PUBLICATIONS

**[Publication Title](https://link-to-paper.com)** *Venue* 2024 - Author list
```

### Key Parsing Rules

- Company headers must be `**Company Name**` on their own line
- Position titles must use `_**Title**_`
- Date and location must be in `*Date | Location*` format
- Summaries use `**Summary:**` and are optional (fallback uses the first bullet)
- Project titles must be markdown links to be detected
- Skills must use `**Category:**` format

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm (bundled with Node.js)
- Git

### Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/Vibz28/resume_md2website.git
cd resume_md2website

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Static export to out/ and copy to docs/

npm run test         # Playwright tests (optional)
npm run test:ui      # Playwright UI runner
npm run test:report  # Playwright report viewer
```

## GitHub Actions Deployment

The workflow in `.github/workflows/nextjs.yml` builds on pushes to `main` and `production-deploy`, and deploys only when the `main` branch is updated. It uses the GitHub Pages artifact workflow to publish the `out/` directory.

### Next.js Configuration for Static Export

`next.config.js` is optimized for GitHub Pages static export:

```javascript
const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  output: isExport ? 'export' : undefined,
  trailingSlash: true,
  images: { unoptimized: true }
}
```

### Manual Export (Local)

```bash
npm run export
```

This command performs a static export and copies the `out/` directory to `docs/` for convenience.

## Content Updates

To update site content, modify the resume markdown file and re-run the app or export:

```bash
# Edit the resume data
code resume_clarisse_lim_2026.md

# Preview locally
npm run dev

# Export static site
npm run export
```

## Theming and Customization

- Global design tokens and gradients live in `src/app/globals.css`
- Tailwind theme extensions are in `tailwind.config.js`
- Section layouts are in `src/components/`
- Update navigation or page composition in `src/app/page.tsx`

If you want to change the visual system, update CSS variables and section components while keeping the markdown parser intact.

## Extending the Parser

To add a new content section:

1. Add a new interface in `src/lib/models.ts`
2. Extend `src/lib/parseResumeMarkdown.ts` with parsing logic
3. Create a new component in `src/components/`
4. Render the component in `src/app/page.tsx`

## Contributing

- Use TypeScript strict mode and Next.js lint rules
- Keep all content dynamic from markdown where possible
- Update README when adding new sections or fields

### Commit Message Convention

```bash
feat: add new feature
fix: resolve bug
chore: maintenance
refactor: code improvements
docs: update documentation
```

## License

This project is open source and available under the MIT License.

## About

Built by Clarisse Lim
Senior Manager, AI Solution Architect at Bristol Myers Squibb

Last Updated: January 31, 2026
