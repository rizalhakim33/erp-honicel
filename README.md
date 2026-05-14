# Honeycomb ERP - Enterprise Manufacturing System

Honeycomb ERP is a modern, modular Manufacturing Resource Planning system designed for the honeycomb, core, and general manufacturing industries.

## Tech Stack
- **Frontend**: Next.js 15 (Patterns), React 19, TailwindCSS 4, shadcn/ui.
- **State Management**: Zustand (Auth, Global State).
- **Data Tables**: TanStack Table v8.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **Animations**: Motion (Framer Motion).

## Architecture
The project follows a **Modular Feature-based Architecture**:
- `src/modules/{feature}`: Each module contains its own components, pages, hooks, and logic.
- `src/components/ui`: Shared reusable UI primitives (shadcn).
- `src/lib`: Core utility functions (Supabase client, CN helper).

## Setup Guide

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Run the SQL provided in `database_schema.sql` in the Supabase SQL Editor.
3. Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment variables.

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

### 3. Installation
```bash
npm install
npm run dev
```

## Best Practices
- **Type Safety**: Use TypeScript interfaces for all data models.
- **Modularization**: Keep feature-specific logic inside its respective module.
- **Design**: Follow the "Modern Industrial" aesthetic with high data density and clean scannable grids.
- **Security**: Implement Row Level Security (RLS) policies in PostgreSQL to protect data.
