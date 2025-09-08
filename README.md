# Streetview Game

A modern web-based streetview guessing game built with Next.js and React, featuring an intuitive UI powered by shadcn/ui components.

## 🏗️ Project Architecture

### Tech Stack

**Frontend Framework**
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type safety and enhanced developer experience

**Styling & UI**
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Radix UI** - Low-level UI primitives for complex components
- **Geist Font** - Modern typography (Sans & Mono)
- **next-themes** - Dark/light theme support

**Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **pnpm** - Fast, disk space efficient package manager

### 📁 Project Structure

```
streetview-game/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with fonts and metadata
│   └── page.tsx           # Home page component
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components (auto-generated)
│   └── theme-provider.tsx # Theme context provider
├── lib/                  # Utility functions and configurations
│   └── utils.ts          # Common utilities (cn function for styling)
├── public/               # Static assets
│   ├── placeholder-*.png # Placeholder images
│   └── *.svg            # SVG assets
├── styles/              # Additional stylesheets
│   └── globals.css      # Legacy global styles
├── components.json      # shadcn/ui configuration
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── pnpm-lock.yaml       # Dependency lock file
```

### 🔧 Architecture Patterns

**Component Architecture**
- **Atomic Design**: Components organized by complexity and reusability
- **Composition Pattern**: Using shadcn/ui's composable component system
- **Server/Client Components**: Leveraging Next.js App Router's hybrid rendering

**Styling Architecture**
- **Design System**: Consistent theming with CSS variables
- **Utility-First**: Tailwind CSS for rapid UI development
- **Component Variants**: Using `class-variance-authority` for component variations

**Type Safety**
- **Strict TypeScript**: Full type coverage across the application
- **Path Aliases**: Clean imports using `@/*` mapping
- **Component Props**: Strongly typed component interfaces

### 🎯 Key Features (Planned)

- **Interactive Streetview Game**: Location guessing gameplay
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Light/dark mode toggle
- **Modern UI**: Clean, accessible interface with shadcn/ui
- **Performance Optimized**: Next.js optimizations and image handling

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/matmaz99/streetview-game.git
   cd streetview-game
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🛠️ Development

### Adding New Components

This project uses shadcn/ui for components. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

### Project Configuration

- **shadcn/ui**: Configured with New York style, CSS variables, and Lucide icons
- **Path Aliases**: `@/*` maps to project root for clean imports
- **TypeScript**: Strict mode enabled with Next.js plugin
- **Tailwind**: Custom configuration with shadcn/ui integration

### Theme System

The project supports light/dark themes using:
- `next-themes` for theme switching
- CSS variables for consistent theming
- Tailwind dark mode utilities

## 📦 Dependencies Overview

### Core Dependencies
- **React Ecosystem**: React 19, React DOM, React Hook Form
- **UI Components**: Full Radix UI suite for accessibility
- **Styling**: Tailwind CSS with animation support
- **Utilities**: clsx, tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **TypeScript**: Full type definitions for React and Node
- **Build Tools**: PostCSS, Tailwind CSS compiler
- **Animations**: Custom animation utilities

## 🔮 Future Enhancements

- Game logic implementation
- Google Street View API integration
- Score tracking and leaderboards
- Multiplayer functionality
- Progressive Web App (PWA) features
- Internationalization (i18n)

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using modern web technologies