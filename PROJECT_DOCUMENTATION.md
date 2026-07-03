# Pankaj Pratap Singh — Portfolio Project Documentation

> **Author:** Pankaj Pratap Singh  
> **Role:** Full Stack Developer · Co-Founder & CTO at CorpTube Solutions Pvt. Ltd.  
> **Repository:** [github.com/pratap26pps/pankajportfolio](https://github.com/pratap26pps/pankajportfolio)  
> **Last updated:** July 2026

---

## Table of Contents

1. [Project Idea & Definition](#1-project-idea--definition)
2. [High-Level Overview](#2-high-level-overview)
3. [Module Overview & Functionality](#3-module-overview--functionality)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Data Layer & Storage](#6-data-layer--storage)
7. [API Reference](#7-api-reference)
8. [Environment Variables](#8-environment-variables)
9. [Deployment](#9-deployment)
10. [Local Development](#10-local-development)

---

## 1. Project Idea & Definition

### What is this project?

This is a **personal portfolio and professional showcase website** built for **Pankaj Pratap Singh**, a Full Stack Developer based in Rohtak, Haryana, India. The site serves as a central hub to:

- Present professional identity, skills, and project work
- Document career journey (company, freelance, software development, qualifications)
- Offer freelance/development services with pricing packages
- Display certifications, internships, and academic credentials
- Collect client inquiries via a contact form and WhatsApp
- Allow the owner to **manage all dynamic content** through a password-protected admin dashboard

### Problem it solves

Instead of a static resume or scattered links across LinkedIn, GitHub, and Upwork, this project consolidates everything into one **interactive, animated, dark/light-themed** web experience that can be updated without redeploying code — projects, skills, testimonials, services, and certifications are stored in JSON files and edited via the admin panel.

### Target audience

| Audience | Purpose |
|----------|---------|
| Recruiters & hiring managers | Quick overview of skills, experience, and projects |
| Potential clients | Services, pricing, testimonials, and contact options |
| Collaborators & network | Journey timeline, CorpTube story, social links |
| Site owner (admin) | CRUD management of portfolio content |

### Core design principles

- **Single-page feel** on the home route with anchored sections (Projects, About, Testimonials, Skills, Contact)
- **Dedicated sub-pages** for deeper content (Journey, Services, Certifications)
- **File-based CMS** — no external database; content lives in `data/*.json` with image uploads to `public/`
- **Server-side API routes** for CRUD, auth, and email
- **Mobile-first responsive UI** with Framer Motion animations and Magic UI components

---

## 2. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC FRONTEND                          │
│  Home (/) · Journey (/about/journey) · Services · Certifications│
└────────────────────────────┬────────────────────────────────────┘
                             │ fetch()
┌────────────────────────────▼────────────────────────────────────┐
│                     Next.js API Routes                          │
│  /api/projects · /api/skills · /api/services · /api/contact    │
│  /api/testimonials · /api/certifications · /api/auth/*        │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
┌────────────▼────────────┐    ┌─────────────▼─────────────┐
│   JSON File Stores      │    │   External Services        │
│   data/*.json           │    │   Nodemailer (SMTP)        │
│   public/projects/      │    │   WhatsApp (client link)   │
│   public/certifications/│    └────────────────────────────┘
└─────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD (/admin)                           │
│  Protected by JWT cookie + middleware                           │
│  Tabs: Projects · Testimonials · Services · Skills · Certs    │
└─────────────────────────────────────────────────────────────────┘
```

### Routes map

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Hero + all main sections |
| `/about/journey` | Public | Detailed branching career timeline |
| `/services` | Public | Services catalog and pricing packages |
| `/certifications` | Public | Certificate gallery with lightbox |
| `/admin/login` | Public | Admin authentication |
| `/admin` | Protected | Content management dashboard |

---

## 3. Module Overview & Functionality

### 3.1 Home Page (`src/app/page.js`)

**Purpose:** First impression and entry point.

| Feature | Description |
|---------|-------------|
| Hero section | Gradient headline, typewriter effect highlighting CorpTube role |
| Background beams | Animated visual backdrop via `BackgroundBeams` |
| CTA button | Links to `/about/journey` — "Explore My Journey" |
| Section grid | Renders all portfolio sections below the fold via `GridBackgroundDemo` |

---

### 3.2 Projects Section (`src/app/project/card.js`)

**Purpose:** Showcase portfolio projects with 3D card hover effects.

| Feature | Description |
|---------|-------------|
| Data source | `GET /api/projects` (visible items only for public) |
| Card content | Title, description, tech icons (Iconify), image, date, live link |
| Interaction | Opens project URL in new tab |
| Admin control | Add/edit/delete projects, upload images, toggle visibility |

---

### 3.3 About / Journey Section

#### Home summary (`src/app/project/about.jsx`)
- Neon gradient card with box-reveal animation
- Highlights: CorpTube (Best Innovator Award), Ruhil Future Technologies, freelance projects, TEN internship, MDU B.Tech
- "View More" link to full journey page

#### Full journey page (`src/app/about/journey/`)
- Tabbed timeline: **Company · Freelance · Software Developer · Qualifications**
- Branching tree layout (desktop) / stacked layout (mobile)
- CorpTube section with image gallery and audience cards
- Freelance projects: Capital Solar Energy, Gridaneo Bharat, Shrami App, RO Technical Xperts
- Software projects: Gyansetu One World, HostelSetu
- Static content in `journeyData.js` (not admin-editable)

---

### 3.4 Testimonials Section (`src/app/project/testimonials.jsx`)

**Purpose:** Social proof from past clients.

| Feature | Description |
|---------|-------------|
| Data source | `GET /api/testimonials` |
| Display | Quote, client name, title, date, verified badge |
| Admin control | Full CRUD with visibility toggle |

---

### 3.5 Skills Section (`src/app/project/skills.jsx`)

**Purpose:** Technology stack display.

| Feature | Description |
|---------|-------------|
| Data source | `GET /api/skills` |
| Display | Icon (Iconify), name, short description in responsive grid |
| Configurable | Section title editable from admin |
| Default skills | HTML, CSS, JS, React, Next.js, Redux, Node.js, MongoDB, Express, Tailwind, Git |

---

### 3.6 Contact Section (`src/app/project/contact.jsx`)

**Purpose:** Lead capture and direct communication.

| Feature | Description |
|---------|-------------|
| Contact form | Name, phone, email, message with client + server validation |
| Email flow | Owner notification + auto-reply to sender via Nodemailer |
| Lottie animation | Decorative animation beside the form |
| WhatsApp button | Fixed floating button (`+91 8252590019`) site-wide |
| Toast feedback | Success/error via `react-hot-toast` |

---

### 3.7 Services Page (`src/app/services/`)

**Purpose:** Freelance/development service offerings.

| Feature | Description |
|---------|-------------|
| Services grid | Website Dev, Mobile Apps, E-commerce, Admin Panels, API & Backend, UI/UX |
| Pricing packages | Basic (₹15K–25K), Standard (₹30K–60K), Premium (₹80K+) |
| CTA | "Get a Quote" links to `/#contact` |
| Admin control | Edit services, packages, section titles, visibility |

---

### 3.8 Certifications Page (`src/app/certifications/`)

**Purpose:** Academic and professional credential showcase.

| Feature | Description |
|---------|-------------|
| Categories | Academic, Internship, Professional, Course Completion |
| Display | Image thumbnail, issuer, date, description |
| Lightbox | Click to view full certificate image |
| Admin control | CRUD + image upload to `public/certifications/` |

---

### 3.9 Site Layout & Navigation

| Component | File | Functionality |
|-----------|------|---------------|
| `SiteHeader` | `src/components/ui/SiteHeader.jsx` | Fixed header: profile tooltip, floating nav (desktop), mobile nav, social icons |
| `Footer` | `src/components/ui/Footer.jsx` | Quick links, social links, CorpTube link, copyright |
| `ThemeToggle` | `src/components/ui/ThemeToggle.jsx` | Dark/light mode (persisted in `localStorage`) |
| `ThemeProvider` | `src/components/providers/ThemeProvider.jsx` | Theme context wrapper |
| `WhatsAppButton` | `src/components/ui/WhatsAppButton.jsx` | Fixed WhatsApp chat link |
| Navigation config | `src/lib/siteNav.js` | Nav items, profile info, social icon links |

**Navigation items:** Projects · About · Services · Certifications · Skills · Contact

---

### 3.10 Admin Dashboard (`src/app/admin/`)

**Purpose:** Password-protected CMS for all dynamic content.

| Tab | Admin Component | Manages |
|-----|-----------------|---------|
| Projects | `AdminProjects.jsx` | Project cards + image upload |
| Testimonials | `AdminTestimonials.jsx` | Client quotes |
| Services | `AdminServices.jsx` | Services + pricing packages |
| Skills | `AdminSkills.jsx` | Tech skills list + section title |
| Certifications | `AdminCertifications.jsx` | Certificates + image upload |

**Authentication flow:**
1. User visits `/admin` → middleware checks `admin_token` cookie
2. Invalid/missing token → redirect to `/admin/login`
3. Login POST to `/api/auth/login` with password
4. On success → HMAC-signed JWT cookie (7-day expiry, httpOnly)
5. Logout POST to `/api/auth/logout` clears cookie

**Security:** `middleware.js` protects all `/admin/*` routes except `/admin/login`.

---

### 3.11 UI Component Library

Built with **shadcn/ui** (New York style) + **Magic UI** + custom components:

| Category | Components |
|----------|------------|
| Magic UI | `box-reveal`, `shine-border`, `neon-gradient-card`, `border-beam` |
| UI | `3d-card`, `typewritter`, `background`, `Gridbg`, `floatingnavbar`, `movingborder`, `animatedtooltip`, `button`, `card`, `input`, `label` |
| Animation | Framer Motion (`motion`), Lottie (`lottie-react`) |
| Icons | Lucide React, Tabler Icons, Iconify, React Icons |

---

## 4. Tech Stack

### Frontend

| Technology | Version | Usage |
|------------|---------|-------|
| **Next.js** | 15.x | App Router, SSR/SSG, API routes |
| **React** | 19.x | UI components |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | 12.x | Page/section animations |
| **shadcn/ui** | — | Accessible UI primitives (Radix-based) |
| **Iconify** | 6.x | Technology & service icons |
| **Lottie** | 2.x / 3.x | Contact section animation |
| **react-hot-toast** | 2.x | Toast notifications |

### Backend (within Next.js)

| Technology | Usage |
|------------|-------|
| **Next.js Route Handlers** | REST API at `src/app/api/*` |
| **Node.js `fs/promises`** | JSON file read/write |
| **Node.js `crypto`** | JWT signing/verification, UUID generation |
| **Nodemailer** | SMTP email for contact form |

### Data & Storage

| Storage | Location | Content |
|---------|----------|---------|
| JSON files | `data/` | projects, skills, services, testimonials, certifications |
| Uploaded images | `public/projects/`, `public/certifications/` | Admin-uploaded media |
| Static assets | `public/` | Icons, journey images, about logos |

> **Note:** No database (MongoDB, PostgreSQL, etc.) is used in this project. All CMS data is file-based.

### Tooling & Config

| Tool | Purpose |
|------|---------|
| PostCSS | Tailwind processing |
| jsconfig.json | `@/` path aliases |
| components.json | shadcn/ui configuration |
| middleware.js | Admin route protection |

---

## 5. Project Structure

```
latestportfolio/
├── data/                          # CMS JSON data stores
│   ├── projects.json
│   ├── skills.json
│   ├── services.json
│   ├── testimonials.json
│   └── certifications.json
├── public/                        # Static & uploaded assets
│   ├── about/                     # Company/org logos
│   ├── certifications/            # Certificate images
│   ├── journey/                   # CorpTube journey gallery
│   └── projects/                  # Admin-uploaded project images
├── src/
│   ├── app/
│   │   ├── page.js                # Home page
│   │   ├── layout.js              # Root layout (header, footer, theme)
│   │   ├── globals.css            # Global styles + Tailwind
│   │   ├── about/journey/         # Full journey timeline page
│   │   ├── services/              # Services & pricing page
│   │   ├── certifications/        # Certifications gallery page
│   │   ├── admin/                 # Admin dashboard + login
│   │   ├── project/               # Home page section components
│   │   └── api/                   # REST API route handlers
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── magicui/               # Animated UI effects
│   │   └── providers/             # Theme & toast providers
│   └── lib/
│       ├── auth.js                # JWT auth helpers
│       ├── mailer.js              # Nodemailer setup
│       ├── contactValidation.js   # Form validation
│       ├── *Store.js              # JSON CRUD stores
│       ├── siteNav.js             # Navigation config
│       └── utils.js               # cn() utility
├── middleware.js                  # Admin auth middleware
├── next.config.mjs
├── package.json
└── PROJECT_DOCUMENTATION.md       # This file
```

---

## 6. Data Layer & Storage

Each content type follows the same pattern via `*Store.js` files in `src/lib/`:

```
readFile() → parse JSON → CRUD operations → writeFile()
```

| Store file | Data file | Upload dir |
|------------|-----------|------------|
| `projectsStore.js` | `data/projects.json` | `public/projects/` |
| `skillsStore.js` | `data/skills.json` | — |
| `servicesStore.js` | `data/services.json` | — |
| `testimonialsStore.js` | `data/testimonials.json` | — |
| `certificationsStore.js` | `data/certifications.json` | `public/certifications/` |

All entities support a `visible` boolean for soft-hide without deletion.

---

## 7. API Reference

### Public endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List visible projects |
| `GET` | `/api/skills` | Skills data + section title |
| `GET` | `/api/services` | Services + packages |
| `GET` | `/api/testimonials` | Visible testimonials |
| `GET` | `/api/certifications` | Visible certifications |
| `POST` | `/api/contact` | Submit contact form |

### Admin endpoints (require `admin_token` cookie)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects?all=true` | All projects including hidden |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects` | Update project |
| `DELETE` | `/api/projects?id={id}` | Delete project |
| `POST` | `/api/projects/upload` | Upload project image |
| `POST/PUT/DELETE` | `/api/skills` | Skills CRUD |
| `POST/PUT/DELETE` | `/api/services` | Services CRUD |
| `POST/PUT/DELETE` | `/api/testimonials` | Testimonials CRUD |
| `POST/PUT/DELETE` | `/api/certifications` | Certifications CRUD |
| `POST` | `/api/certifications/upload` | Upload certificate image |

### Auth endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | `{ password }` → sets cookie |
| `POST` | `/api/auth/logout` | Clears admin cookie |

---

## 8. Environment Variables

Create a `.env.local` file in the project root:

```env
# Admin authentication (also used as login password)
JWT_SECRET=your-strong-secret-password

# SMTP email (contact form)
MAIL_HOST=smtp.gmail.com
MAIL_AUTH=your-email@gmail.com
MAIL_PASS=your-app-password
```

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Signs admin JWT tokens; also verified as login password |
| `MAIL_HOST` | Yes (for contact) | SMTP server hostname |
| `MAIL_AUTH` | Yes (for contact) | SMTP username / sender email |
| `MAIL_PASS` | Yes (for contact) | SMTP password or app password |

---

## 9. Deployment

This portfolio is designed to run as a **Next.js full-stack application**. It is deployed using **Vercel** (primary) and **Render** (alternative/backup).

### 9.1 Vercel (Primary — Recommended for Next.js)

Vercel is the native platform for Next.js and handles App Router, API routes, middleware, and edge functions optimally.

#### Setup steps

1. Push the repository to GitHub: `pratap26pps/pankajportfolio`
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the GitHub repository
4. Framework preset: **Next.js** (auto-detected)
5. Add environment variables:
   - `JWT_SECRET`
   - `MAIL_HOST`, `MAIL_AUTH`, `MAIL_PASS`
6. Deploy

#### Build settings (defaults)

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `.next` (automatic) |
| Install command | `npm install` |
| Node.js version | 18.x or 20.x |

#### Vercel considerations

| Topic | Notes |
|-------|-------|
| **File-based CMS** | JSON writes and image uploads persist on Vercel **only during the same serverless invocation**. For production CMS edits, prefer local admin → commit JSON changes → redeploy, or migrate to a database/blob storage. |
| **Serverless API routes** | All `/api/*` routes run as Node.js serverless functions (`runtime = "nodejs"`) |
| **Custom domain** | Add domain in Vercel project settings → DNS configuration |
| **Preview deployments** | Every PR gets a preview URL automatically |

#### Example deployed projects on Vercel

- E-commerce prototype: `embproto.vercel.app` (listed in portfolio projects)

---

### 9.2 Render (Alternative Deployment)

Render can host the Next.js app as a **Web Service** with a persistent filesystem, which is better suited for the file-based CMS (JSON edits and uploads survive restarts).

#### Setup steps

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Environment** | Node |
| **Build command** | `npm install && npm run build` |
| **Start command** | `npm start` |
| **Plan** | Free or Starter (Starter recommended for always-on) |

4. Add environment variables (same as Vercel section)
5. Deploy

#### Optional: `render.yaml` (Infrastructure as Code)

You can add this file to the repo root for reproducible Render deploys:

```yaml
services:
  - type: web
    name: pankaj-portfolio
    runtime: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        sync: false
      - key: MAIL_HOST
        sync: false
      - key: MAIL_AUTH
        sync: false
      - key: MAIL_PASS
        sync: false
```

#### Render vs Vercel — when to use which

| Aspect | Vercel | Render |
|--------|--------|--------|
| Next.js optimization | Excellent (native) | Good |
| Serverless cold starts | Yes | No (always-on instance) |
| Persistent file writes (CMS) | Limited | Yes (disk persists on paid plans) |
| Free tier | Generous for static/SSR | Free tier spins down after inactivity |
| Best for this project | Production frontend + API | Admin CMS with file uploads |

**Recommended strategy:**
- **Vercel** → Public portfolio site (fast CDN, preview deploys)
- **Render** → Staging or admin-heavy environment where JSON/image persistence matters

---

### 9.3 Deployment checklist

- [ ] Set all environment variables on the hosting platform
- [ ] Verify contact form sends email successfully
- [ ] Test admin login at `/admin/login`
- [ ] Confirm all API routes return data (`/api/projects`, `/api/skills`, etc.)
- [ ] Test dark/light theme toggle
- [ ] Verify WhatsApp button opens correct number
- [ ] Add custom domain (optional)
- [ ] Enable HTTPS (automatic on both Vercel and Render)

---

## 10. Local Development

### Prerequisites

- Node.js 18+ 
- npm

### Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production server locally
npm start

# Lint
npm run lint
```

### Admin access locally

1. Set `JWT_SECRET` in `.env.local`
2. Visit `http://localhost:3000/admin/login`
3. Enter the same value as `JWT_SECRET` as the password
4. Manage content at `http://localhost:3000/admin`

---

## Related Links

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/pratap26pps |
| LinkedIn | https://www.linkedin.com/in/pratap26pps |
| CorpTube | https://www.corptube.in/ |
| YouTube | https://www.youtube.com/@pratap26pps |
| Email | pankajpatna10321@gmail.com |

---

*This document reflects the codebase as of July 2026. Update it when adding new modules, changing deployment targets, or migrating from file-based storage to a database.*
