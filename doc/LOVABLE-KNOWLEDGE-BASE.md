# SkyMarket Lovable Knowledge Base

## Project Overview
SkyMarket is a **drone service marketplace** connecting consumers with certified operators in the Detroit area. This is a two-sided marketplace where operators offer services (aerial photography, delivery, mapping) and consumers book them.

**Why perfect for Lovable:** Clean UI patterns, straightforward database structure, proven marketplace model that can be adapted to any service industry.


## Lovable Development Workflow

### 1. Basic Prompting Pattern
```
Create a [component/page] for SkyMarket that [specific functionality].

Requirements:
- Use Tailwind CSS for styling
- Make it responsive for mobile and desktop
- Include proper error handling
- Follow the brand colors: primary blue (#0EA5E9), accent orange (#F97316)
```

### 2. Component Reusability
Always start components with: **"Create a reusable component that..."**

Example: "Create a reusable ServiceCard component that displays service title, price, operator name, and category badge."

### 3. Database Integration
```
Add Supabase integration to [component] that:
- Fetches data from [table] table
- Includes loading and error states
- Uses TypeScript for type safety
- Implements proper error boundaries
```

## Key Features to Build

### Phase 1: Foundation
- **Landing Page**: Hero section, featured services, how it works
- **Authentication**: Login/signup with role selection (consumer/operator)
- **User Profiles**: Basic profile management with avatar upload

### Phase 2: Operator Features
- **Service Management**: CRUD operations for listings
- **Dashboard**: Overview of bookings and service performance
- **Image Upload**: Supabase storage for service photos

### Phase 3: Marketplace
- **Browse Services**: Grid layout with filtering by category
- **Search**: Real-time search across title/description
- **Service Details**: Individual listing pages with booking CTA

### Phase 4: Booking System
- **Booking Flow**: Date/time selection, requirements form
- **Booking Management**: Status tracking, history view
- **Email Notifications**: Operator notifications via Resend

## API Integrations

### OpenAI (Optional)
- **Purpose**: AI-generated service descriptions
- **Implementation**: Supabase Edge Function
- **Model**: gpt-4o-mini
- **Prompt**: "Generate professional drone service description for [category]"

### Resend Email (Optional)
- **Purpose**: Booking confirmations and operator notifications
- **Setup**: API key in Lovable environment variables
- **Templates**: Booking confirmation, new booking alert

## UI/UX Guidelines

### Brand Colors
- **Primary**: Blue (#0EA5E9) - trust, sky, technology
- **Accent**: Orange (#F97316) - energy, action, sunset
- **Background**: White/light gray
- **Text**: Dark gray (#374151)

### Component Patterns
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary blue for main actions, orange for secondary
- **Forms**: Clean labels, proper spacing, validation states
- **Navigation**: Simple header with role-based menu items

### Responsive Design
- **Mobile First**: Stack components vertically on small screens
- **Grid Layouts**: 1 column mobile, 2-3 columns tablet, 3-4 desktop
- **Touch Targets**: Minimum 44px for mobile interactions

## Common Lovable Prompts

### Authentication Setup
```
Add user authentication to SkyMarket with:
- Email/password login and signup
- Role selection during signup (consumer or operator)
- Protected routes based on user role
- Automatic redirect to appropriate dashboard
- Clean, branded login forms
```

### Service Listing Creation
```
Create a service listing form for operators with:
- Title and description fields
- Category dropdown (food delivery, courier, aerial imaging, site mapping)
- Price input with currency formatting
- Service area text field
- Image upload with preview
- Save to Supabase listings table
```

### Marketplace Browse
```
Build a marketplace browse page with:
- Grid layout of service cards
- Each card shows: image, title, price, operator name, category
- Filter buttons for each category
- Search bar for real-time filtering
- Responsive design (1 column mobile, 3 columns desktop)
- Link to service detail pages
```

### Booking Flow
```
Create a booking flow with:
- Service selection confirmation
- Date and time picker
- Special requirements textarea
- Contact information review
- Submit to booking_requests table
- Success confirmation with booking ID
- Email notification to operator
```

## Troubleshooting Common Issues

### Supabase Connection
If database queries fail:
1. Check Supabase integration is connected in Lovable
2. Verify table names match schema exactly
3. Ensure Row Level Security policies allow access

### Authentication Problems
If auth doesn't work:
1. Verify auth is enabled in Supabase integration
2. Check role-based redirects are properly implemented
3. Ensure user roles are saved to profiles table

### Image Upload Issues
If images don't upload:
1. Verify Supabase storage bucket is public
2. Check file size limits (usually 5MB max)
3. Ensure proper file type validation (jpg, png, webp)

## Progressive Enhancement

### Start Simple
1. Static pages with hardcoded content
2. Add authentication and user roles
3. Implement CRUD operations
4. Add image uploads and advanced features

### Avoid Over-Engineering
- Use Lovable's built-in components first
- Add custom styling gradually
- Focus on core functionality before polish
- Let Lovable handle complex state management

## Success Metrics

### Technical Completion
- [ ] Users can register and login with roles
- [ ] Operators can create and manage service listings
- [ ] Consumers can browse and search services
- [ ] Booking system creates records and sends emails
- [ ] Responsive design works on all devices

### User Experience
- [ ] Clear value proposition on landing page
- [ ] Intuitive navigation between features
- [ ] Fast loading with proper loading states
- [ ] Error messages are helpful and actionable
- [ ] Professional appearance with consistent branding

## Deployment Checklist

### Pre-Deploy
- [ ] Test all user flows end-to-end
- [ ] Verify responsive design on mobile
- [ ] Check all forms handle errors gracefully
- [ ] Ensure proper loading states everywhere
- [ ] Test email notifications work

### Deploy with Lovable
- [ ] Use Lovable's one-click deployment
- [ ] Choose memorable subdomain
- [ ] Verify all integrations work in production
- [ ] Test with real data and multiple users

---

*This knowledge base provides everything needed to build SkyMarket in Lovable. Focus on one feature at a time, always test as you build, and use detailed prompts for best results.*