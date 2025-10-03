# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Nano Banana**, an AI-powered image editor with natural language understanding. It's a Next.js 14 application using the App Router with TypeScript and Tailwind CSS, designed as a landing page showcasing AI image editing capabilities.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics

### Project Structure

```
app/
  layout.tsx          # Root layout with fonts, metadata, and Analytics
  page.tsx            # Homepage - composes all section components
  globals.css         # Global styles and CSS variables

components/
  *-section.tsx       # Landing page sections (hero, editor, features, etc.)
  header.tsx          # Site header/navigation
  footer.tsx          # Site footer
  theme-provider.tsx  # Theme management
  ui/                 # shadcn/ui components (50+ components)

lib/
  utils.ts            # cn() utility for className merging (clsx + tailwind-merge)

hooks/
  use-mobile.ts       # Mobile detection hook
  use-toast.ts        # Toast notification hook
```

### Import Aliases
All imports use `@/` prefix for absolute paths:
- `@/components` → components directory
- `@/lib/utils` → lib/utils.ts
- `@/components/ui` → UI components
- `@/hooks` → Custom hooks

### Key Patterns

**Component Architecture**: The homepage is composed of modular section components (HeroSection, EditorSection, FeaturesSection, ShowcaseSection, TestimonialsSection, FAQSection) that can be independently developed and tested.

**Client Components**: Interactive components like `editor-section.tsx` use `"use client"` directive for state management and event handlers.

**Styling**: Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes with conditional logic. CSS variables in `globals.css` enable consistent theming.

**shadcn/ui**: Components are configured via `components.json` and follow the New York style variant. To add new components, use the shadcn CLI or manually create in `components/ui/`.

### Build Configuration

The Next.js config (`next.config.mjs`) has special settings:
- ESLint and TypeScript errors are ignored during builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`)
- Images are unoptimized (`unoptimized: true`)

These settings suggest this is a landing page optimized for rapid deployment rather than production-grade error handling.
