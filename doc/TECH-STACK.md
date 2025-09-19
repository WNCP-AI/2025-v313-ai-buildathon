# SkyMarket Technical Stack Documentation

## Overview

SkyMarket is built on a modern, production-ready tech stack optimized for rapid development while maintaining code quality and scalability. This document covers the architectural decisions, frameworks, and development patterns used in the Beginner Track implementation.

## Core Architecture

### Frontend Framework: React + TypeScript + Vite

**Why This Stack?**
- **React 18.3**: Industry-standard UI library with massive ecosystem
- **TypeScript 5.5**: Type safety catches bugs early, improves IDE support
- **Vite 5.4**: Lightning-fast development with HMR, optimized production builds

```typescript
// Example: Type-safe component with props
interface ServiceCardProps {
  title: string;
  price: number;
  duration: number;
  operatorId: string;
}

export function ServiceCard({ title, price, duration, operatorId }: ServiceCardProps) {
  // Component logic with full type safety
}
```

### UI Layer: Tailwind CSS + shadcn/ui

**Design System Architecture:**
- **Tailwind CSS 3.4**: Utility-first CSS for rapid styling
- **shadcn/ui**: Accessible, customizable component library
- **Radix UI Primitives**: Unstyled, accessible components

```tsx
// Example: Reusable Button component with variants
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg" className="w-full">
  Book Now
</Button>
```

**Component Structure:**
```
src/components/
├── admin/                 # Admin-specific UI components
│   ├── AdminDataTable.tsx
│   └── AdminModals.tsx
├── auth/                  # Route guards
│   ├── RoleBasedProtectedRoute.tsx
│   └── SimpleProtectedRoute.tsx
├── error-boundaries/      # Error boundaries
│   ├── FeatureErrorBoundary.tsx
│   ├── GlobalErrorBoundary.tsx
│   └── PageErrorBoundary.tsx
├── layout/                # Layout wrappers
│   └── AppLayout.tsx
├── shared/                # Shared, reusable building blocks
│   ├── ActionButton.tsx
│   ├── AdminGeneratorBox.tsx
│   ├── EmptyState.tsx
│   ├── FormSection.tsx
│   ├── ImageUpload.tsx
│   ├── LoadingSpinner.tsx
│   ├── LoadingState.tsx
│   ├── ModeSwitch.tsx
│   ├── ModeTransition.tsx
│   ├── StandardCard.tsx
│   └── index.ts
├── ui/                    # shadcn/ui primitives (Radix-based)
│   ├── button.tsx, card.tsx, dialog.tsx, form.tsx, avatar.tsx, ...
├── Categories.tsx
├── FeaturedOperators.tsx
├── Hero.tsx
├── HowItWorks.tsx
├── SharedHeader.tsx
└── StatsCard.tsx
```

## Development Principles

### 1. Component Reusability

**Pattern: Composition over Inheritance**
```tsx
// Base component
const Card = ({ children, className }) => (
  <div className={cn("rounded-lg border bg-card", className)}>
    {children}
  </div>
)

// Composed feature component
const ServiceCard = ({ service }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{service.title}</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Service details */}
    </CardContent>
  </Card>
)
```

### 2. Type Safety Throughout

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,              // Enable all strict checks
    "noImplicitAny": true,       // No implicit any types
    "strictNullChecks": true,    // Null safety
    "target": "ES2022",          // Modern JavaScript features
    "module": "ESNext",          // ES modules
    "jsx": "react-jsx",          // React 17+ JSX transform
    "paths": {
      "@/*": ["./src/*"]         // Path aliasing
    }
  }
}
```

### 3. State Management

**Local State + Context API:**
```tsx
// Global auth context
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook for consuming auth state
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

## Build Tools & Development Workflow

### Development Environment

**Vite Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,  // Expose to network
  },
})
```

### Code Quality Tools

**ESLint Configuration:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Prettier Configuration:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## Project Structure

### Directory Organization
```
project-root/
├── src/
│   ├── assets/               # Images and other static assets used in UI
│   ├── components/           # UI components (admin, auth, shared, ui, etc.)
│   ├── contexts/             # React context providers (e.g., auth, mode)
│   ├── hooks/                # Custom React hooks
│   ├── integrations/
│   │   └── supabase/         # Supabase client and generated types
│   ├── lib/                  # Utilities (e.g., theme, classnames)
│   ├── pages/                # Route components (e.g., Browse, Login, Orders)
│   ├── services/             # App services (e.g., ErrorLogger)
│   ├── index.css             # Global styles (Tailwind entry)
│   ├── main.tsx              # App bootstrap
│   └── App.tsx               # Root component
├── public/                   # Static files served as-is
├── supabase/                 # SQL migrations and scripts for DB
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind configuration
└── index.html                # Vite HTML entry
```

### Environment Configuration

**Environment Variables:**
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
```

**Type-safe Environment Access:**
```typescript
// src/lib/env.ts
const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  // Edge function environment variables (server-side only)
  openai: {
    apiKey: Deno.env.get('OPENAI_API_KEY'), // Server-side only
  },
  resend: {
    apiKey: Deno.env.get('RESEND_API_KEY'), // Server-side only
  },
} as const

export default env
```

## Performance Optimization

### Code Splitting
```tsx
// Lazy load heavy pages/components
const ListingDetail = lazy(() => import('./pages/ListingDetail'))

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ListingDetail />
  {/* or any other page like AdminPanel, Orders, etc. */}
  
</Suspense>
```

### Image Optimization
```tsx
// Use Supabase Storage CDN with transformations
const getOptimizedImageUrl = (path: string, width: number) => {
  return `${SUPABASE_URL}/storage/v1/render/image/public/${path}?width=${width}&quality=75`
}
```

## Testing Strategy

### Unit Testing with Vitest
```typescript
// Example test file
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceCard } from './ServiceCard'

describe('ServiceCard', () => {
  it('displays service information', () => {
    const service = {
      title: 'Aerial Photography',
      price: 299,
      duration: 60,
    }

    render(<ServiceCard {...service} />)

    expect(screen.getByText('Aerial Photography')).toBeInTheDocument()
    expect(screen.getByText('$299')).toBeInTheDocument()
  })
})
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Output structure
dist/
├── assets/          # JS/CSS bundles
├── index.html       # Entry point
└── favicon.ico      # App icon
```

### Deployment Targets
- **Vercel**: Zero-config deployment for React apps
- **Netlify**: Alternative with similar ease
- **Supabase Hosting**: Co-locate with backend

## Best Practices Implemented

### 1. Error Boundaries
```tsx
class ErrorBoundary extends Component {
  componentDidCatch(error: Error) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### 2. Loading States
```tsx
const ServiceList = () => {
  const { data, loading, error } = useServices()

  if (loading) return <ServiceSkeleton />
  if (error) return <ErrorMessage error={error} />

  return <ServiceGrid services={data} />
}
```

### 3. Form Validation
```tsx
// Using react-hook-form with zod
const listingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(500),
  price: z.number().min(1).max(1000),
  category: z.enum(['food_delivery', 'courier_parcel', 'aerial_imaging', 'site_mapping']),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(listingSchema),
})
```

## Developer Experience Features

### Hot Module Replacement
- Instant updates without losing state
- CSS changes apply immediately
- Component updates preserve local state

### TypeScript IDE Support
- IntelliSense for all APIs
- Auto-imports and refactoring
- Type checking in real-time

### Developer Tools
- React DevTools integration
- Redux DevTools (if using Redux)
- Network request inspection

## Conclusion

This tech stack provides:
- **Rapid Development**: Vite + HMR + Tailwind
- **Type Safety**: TypeScript throughout
- **Component Reusability**: shadcn/ui + composition
- **Production Ready**: Error handling, testing, optimization
- **Developer Experience**: Great tooling and IDE support

Perfect for hackathon development where speed and quality both matter.