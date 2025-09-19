# LOVABLE-BUILD-GUIDE.md

## 🚁 Master Build Guide - SkyMarket Drone Marketplace

### What You're Building
Build a complete two-sided marketplace in 8-12 hours. No coding required.

### Time Needed
- Full build: 8-12 hours
- Setup: 30 minutes
- Each phase: 1-2 hours

### Why This Project
Two-sided marketplaces power the biggest platforms today. Think Airbnb, Uber, Etsy, Fiverr. They're perfect hackathon projects - low costs, scalable, proven business model.

---

## 📋 Introduction & Project Overview

### Understanding Two-Sided Marketplaces

Think of it like a farmers' market. Sellers set up stalls. Buyers browse and purchase. You own the space and take a small fee.

In SkyMarket:
- **Drone operators** = Sellers (offer services)
- **Consumers** = Buyers (book services)
- **You** = Platform owner (connect them)

### Key Terms
- **Marketplace:** Platform connecting buyers and sellers
- **Operator:** Person offering drone services
- **Consumer:** Person booking drone services
- **Listing:** Service offered by an operator

### Your 8 Phases

1. **Setup** (30 min) - Accounts and project creation
2. **Supabase** (20 min) - Database connection
3. **Foundation** (1.5 hours) - Landing page and auth
4. **Operator** (2 hours) - Dashboard and listings
5. **Marketplace** (2 hours) - Browse and search
6. **Consumer** (1.5 hours) - Booking and accounts
7. **Validation** (1 hour) - Testing everything
8. **Extensions** (Optional) - Extra features

### ✅ Check Before Moving On
- Understand marketplace concept?
- Know the 8 phases?
- Ready to build without coding?

---

## 🤖 Understanding Lovable Development

### The Magic Workflow

```
Prompt → Generate → Test → Refine
```

You describe what you want. Lovable builds it. You test it works. You refine if needed.

### Lovable Interface Tour

**Main Areas:**
- **Chat Panel** (left): Where you type prompts
- **Preview Pane** (center): Live app preview
- **File Tree** (right): Generated files
- **Console** (bottom): Messages and errors

### How AI Development Works

1. **Type in plain English:** "Create a login page"
2. **AI generates code:** React, Tailwind, TypeScript
3. **See results instantly:** Live preview updates
4. **Own everything:** Code syncs to GitHub

### 2025 Power Features

- **Supabase Native:** Database connects automatically
- **GitHub Sync:** Version control built-in
- **Visual Input:** Upload screenshots for reference
- **Team Workspace:** Collaborate in real-time


---

## 📐 Spec-Driven Development

### Working with Requirements

Think of specs like a recipe. PRD tells you what to cook. Tech stack tells you the ingredients. You follow both for success.

### Component Reusability Magic

**Always start prompts with:**
```
Create a reusable component that...
```

This builds blocks you use everywhere. Like LEGO pieces.

### Example Reusable Component

Copy This Prompt:
```
Create a reusable ServiceCard component for a drone marketplace with these exact specifications:

Structure & Layout:
- Container: bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-80 mx-auto sm:w-full
- Image section: h-48 bg-gray-200 rounded-t-xl relative overflow-hidden with placeholder text "Service Photo"
- Content padding: p-6 space-y-4

Content Elements:
- Service title: text-xl font-bold text-gray-900 line-clamp-2
- Operator name: text-sm text-gray-600 mb-2 format "by [operatorName]"
- Description: text-gray-700 text-sm line-clamp-3 mb-4
- Price: text-2xl font-bold text-red-600 (#BD1B04) text-right format "$XX/hour"
- CTA button: w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors

Props Interface:
- title: string
- operatorName: string
- description: string
- pricePerHour: number
- imageUrl?: string
- onBookClick: () => void

Responsive Design:
- Mobile: w-full max-w-sm
- Desktop: w-80 hover:scale-105 transition-transform

Accessibility:
- Image alt text from service title
- Button ARIA label "Book [service title]"
- Proper heading hierarchy with h3 for title
```

### What You Should See
After running this prompt, you should see:
- A clean white card with rounded corners and subtle shadow
- Placeholder image area at the top (gray background with "Service Photo" text)
- Service title in large, bold dark text
- Brief description text in smaller gray font (truncated if too long)
- Price displayed prominently in red on the right side (e.g., "$75/hour")
- Operator name in small text (e.g., "by John's Drone Services")
- Red "Book Now" button spanning the full width at the bottom
- Card should be 320px wide on desktop and look professional

### Following Design Patterns

**Good Pattern:**
- One component, many uses
- Consistent styling
- Easy to update

**Bad Pattern:**
- Duplicate code everywhere
- Different styles each page
- Hard to maintain

### Referencing Your Docs

Copy This Prompt:
```
Create a comprehensive ServiceListingForm component with these exact specifications:

Form Container:
- bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto
- Form element with onSubmit handler and proper validation

Form Fields (in order):
1. Service Title:
   - Label: "Service Title" with required asterisk
   - Input: text type, placeholder "e.g., Professional Wedding Photography"
   - Validation: Required, min 5 characters, max 100 characters

2. Category Selection:
   - Label: "Service Category"
   - Select dropdown with options: "Photography", "Videography", "Inspection", "Mapping", "Real Estate", "Agricultural", "Search & Rescue", "Other"
   - Validation: Required selection

3. Description:
   - Label: "Service Description" with required asterisk
   - Textarea: rows={6}, placeholder "Describe your drone service in detail, including what clients can expect..."
   - Validation: Required, min 50 characters, max 1000 characters
   - Character counter: "X/1000 characters"

4. Pricing:
   - Label: "Hourly Rate"
   - Input group: "$" prefix, number input, "/hour" suffix
   - Validation: Required, min $25, max $500
   - Format display: "$XX.00/hour"

5. Service Area:
   - Label: "Coverage Area"
   - Input: text type, placeholder "e.g., Detroit Metro Area, within 25 miles of downtown"
   - Validation: Required, max 200 characters

6. Equipment Details:
   - Label: "Drone & Equipment Specifications"
   - Textarea: rows={4}, placeholder "List your drone model, camera specs, special equipment..."
   - Validation: Optional, max 500 characters

7. Availability:
   - Label: "General Availability"
   - Checkbox group: "Weekdays", "Evenings", "Weekends", "Holidays"
   - At least one must be selected

8. Image Upload:
   - Label: "Service Photos (up to 5)"
   - Drag-and-drop zone with preview thumbnails
   - Accept: .jpg, .png, .webp only
   - Max 5MB per image, 5 images total
   - Show upload progress and validation errors

Submit Button:
- Full width, bg-red-600 hover:bg-red-700, text-white font-semibold py-4
- Text: "Create Listing" with loading spinner when submitting
- Disabled state while form invalid or submitting

Validation & UX:
- Real-time validation with red borders and error messages
- Success states with green checkmarks
- Form submission with error handling
- Responsive: single column, proper spacing on mobile
- Form persistence: save draft to localStorage every 30 seconds
```

### ✅ Check Before Moving On
- Understand reusable components?
- Know how to reference PRD?
- See the pattern benefits?

---

## 💬 Effective Prompting Strategy

### The Perfect Prompt Formula

```
[COMPONENT] + [DETAILS] + [STYLE] + [BEHAVIOR]
```

### Good vs Bad Prompts

**❌ Bad:** "Make a form"

**✅ Good:**
```
Create a BookingForm component with these exact specifications:

Container & Layout:
- bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto
- Form with proper onSubmit handling and validation

Service Summary Section:
- Service card preview: title, operator, price per hour (read-only)
- bg-gray-50 rounded-lg p-4 mb-6
- Edit service button: text-blue-600 hover:text-blue-800

Date & Time Selection:
1. Date Picker:
   - Label: "Select Date"
   - Calendar component that disables past dates
   - Available dates highlighted in bg-red-100 border-red-300
   - Selected date: bg-red-600 text-white

2. Time Slots Grid:
   - Label: "Available Time Slots"
   - Grid: grid-cols-3 gap-2 on mobile, grid-cols-4 on desktop
   - Time buttons: "9:00 AM", "10:00 AM", etc.
   - Available: bg-white border-gray-300 hover:bg-red-50
   - Selected: bg-red-600 text-white
   - Unavailable: bg-gray-100 text-gray-400 cursor-not-allowed

Booking Details:
3. Duration Selector:
   - Label: "Estimated Duration"
   - Number input with step={0.5}, min={1}, max={8}
   - Unit display: "hours"
   - Validation: Required, 1-8 hours

4. Special Requirements:
   - Label: "Special Requests (Optional)"
   - Textarea: rows={3}, placeholder "Any special requests or equipment needs?"
   - Character limit: 500 characters

Contact Confirmation:
- Display current user email and phone
- "Update Contact Info" link opens modal

Price Calculation:
- Live calculation: duration × hourly rate
- Display: "Total: $XXX.XX" in text-2xl font-bold text-gray-900
- Breakdown: "X hours × $XX/hour"

Submit Section:
- "Confirm Booking" button: w-full bg-red-600 hover:bg-red-700 py-3
- Loading state: spinner + "Processing Booking..."
- Disabled when form invalid

Validation & States:
- Required field indicators with red asterisks
- Real-time validation with error messages
- Success modal on booking confirmation
- Mobile-optimized touch targets (min 44px)
- ARIA labels for all interactive elements
```

### Essential Details to Include

- **Colors:** Use #BD1B04 for primary
- **Layout:** Grid, flex, columns
- **Text:** Exact labels and placeholders
- **Behavior:** What happens on click

### Starting Prompts That Work

Copy These Patterns:
```
Create a reusable [component] that displays [content] and handles [action]
```

```
Add a [feature] that allows users to [action] with [details]
```

```
Update the existing [component] to include [new feature]
```

### Follow-Up Essentials

After each component, add:
```
Make it responsive for mobile, tablet, and desktop
```

```
Add error handling for empty inputs
```

```
Include accessibility features like alt text and ARIA labels
```

### Common Patterns

**For Lists:**
```
Create a ServiceGrid component for displaying drone service listings with these specifications:

Container & Layout:
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
- Each grid item renders the ServiceCard component

Props Interface:
- services: Array of service objects
- loading: boolean
- hasMore: boolean
- onLoadMore: () => void
- onServiceClick: (serviceId: string) => void

Loading States:
- Skeleton cards: bg-gray-200 animate-pulse rounded-xl h-80
- Show 8 skeleton cards in grid during loading
- Loading text: "Finding drone services..."

Empty State:
- Container: text-center py-16
- Icon: Large drone icon in gray
- Heading: "No services found"
- Message: "Try adjusting your filters or search terms"
- CTA button: "Browse all services" to clear filters

Pagination:
- "Load More" button: centered, bg-red-600 hover:bg-red-700 px-8 py-3
- Show services count: "Showing X of Y services"
- Hide button when no more results

Filter Controls (above grid):
- Category chips: inline-flex gap-2 mb-6
- Active state: bg-red-600 text-white
- Inactive state: bg-white border-gray-300 hover:border-red-300
- "All" chip to clear category filter

Interactive Features:
- Card hover: transform scale-105 transition-transform duration-200
- Focus management: proper tab order through cards
- Keyboard navigation: Enter/Space to select cards
- ARIA labels: "Grid of X drone services"

Performance:
- Lazy loading for images
- Virtual scrolling for large lists (>100 items)
- Debounced search if search prop provided
```

**For Forms:**
```
Create a FormField component with comprehensive validation system:

Base Structure:
- Container: space-y-1 mb-4
- Label: block text-sm font-medium text-gray-700 mb-1
- Required indicator: text-red-500 ml-1 for required fields

Input Styling:
- Base classes: w-full h-12 px-3 border rounded-lg transition-all duration-200
- Default state: border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200
- Error state: border-red-500 bg-red-50 focus:ring-red-200
- Success state: border-green-500 bg-green-50
- Disabled state: bg-gray-100 border-gray-200 cursor-not-allowed

Validation States:
- Real-time validation on blur and input change
- Debounced validation (300ms) while typing
- Visual feedback with icons:
  - Success: green checkmark icon (absolute right-3)
  - Error: red exclamation icon (absolute right-3)
  - Loading: spinner icon during async validation

Error Display:
- Error message: text-sm text-red-600 mt-1 min-h-[20px]
- Specific messages:
  - Email: "Please enter a valid email address"
  - Password: "Must be at least 8 characters with 1 number"
  - Phone: "Please enter a valid phone number"
  - Required: "[Field name] is required"

Props Interface:
- label: string
- type: 'text' | 'email' | 'password' | 'tel' | 'number'
- required?: boolean
- validation?: (value: string) => string | null
- placeholder?: string
- value: string
- onChange: (value: string) => void

Accessibility Features:
- ARIA describedby linking label to error message
- Role announcements for error state changes
- Keyboard navigation support
- High contrast focus indicators
- Screen reader friendly error announcements
```

**For Navigation:**
```
Create a NavigationHeader component with these exact specifications:

Header Structure:
- Container: sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm
- Inner container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Layout: flex justify-between items-center h-16

Left Section - Logo:
- SkyMarket logo: font-bold text-xl text-gray-900
- Hover state: text-red-600 transition-colors
- Link to "/" with proper focus ring

Center Section - Desktop Menu:
- Container: hidden md:flex space-x-8
- Navigation links: "Browse Services", "How It Works", "For Operators", "About"
- Link styling: text-gray-700 hover:text-red-600 font-medium transition-colors
- Active page: text-red-600 border-b-2 border-red-600

Right Section - Auth Buttons:
- Container: hidden md:flex items-center space-x-3
- "Sign In" button: text-red-600 hover:text-red-700 font-medium px-3 py-2
- "Get Started" button: bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium

Mobile Menu System:
- Mobile toggle: md:hidden button with hamburger icon (3 horizontal lines)
- Toggle styling: p-2 text-gray-700 hover:text-red-600
- Mobile overlay: fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm
- Mobile panel: bg-white h-full w-80 shadow-xl slide-in from right
- Mobile header: p-6 border-b with logo and close button (X)
- Mobile nav: px-6 py-4 space-y-4
- Mobile links: block py-3 text-lg text-gray-700 hover:text-red-600
- Mobile auth buttons: px-6 py-4 space-y-3

Interactive States:
- Focus rings: focus:ring-2 focus:ring-red-500 focus:ring-offset-2
- Keyboard navigation: proper tab order
- Hover animations: smooth transitions on all interactive elements
- Active states: visual feedback for current page

Props Interface:
- currentPath: string (for active state)
- user?: User object (shows different buttons if logged in)
- onSignIn: () => void
- onSignUp: () => void
- onSignOut?: () => void (if user exists)

Responsive Behavior:
- Desktop: full horizontal layout with all elements visible
- Tablet: hide center menu, keep auth buttons
- Mobile: hamburger menu with slide-out panel
```

### ✅ Check Before Moving On
- Know the prompt formula?
- Understand good vs bad?
- Have patterns ready?

---

## 🔧 Recovery & Troubleshooting

### Quick Diagnosis

- **Blank screen?** → See Fix A
- **Button not working?** → See Fix B
- **Styling wrong?** → See Fix C

### Fix A: Blank Screen

**Quick fix:**
```
Debug why the page is blank and fix any errors preventing display
```

**If that doesn't work:**
```
Regenerate the last component ensuring all imports and exports are correct
```

### Fix B: Broken Buttons

**Quick fix:**
```
Fix the button click handler and ensure it's properly connected to the function
```

**If that doesn't work:**
```
Add console.log statements to debug why the button click isn't working
```

### Fix C: Styling Issues

**Quick fix:**
```
Update the styling to match the design using Tailwind classes
```

**If that doesn't work:**
```
Reset all styles and rebuild using the original specifications
```

### Universal Recovery Prompts

**When totally stuck:**
```
Review the current code, identify what's broken, and fix all errors
```

**Starting fresh:**
```
Create a new version of this component from scratch following best practices
```

**Rollback:**
```
Revert to the last working version before the error occurred
```

### When to Regenerate vs Fix

**Regenerate when:**
- Multiple errors exist
- Logic is fundamentally wrong
- Starting fresh is faster

**Fix when:**
- Single small error
- Just styling issues
- Logic is correct

### Getting Human Help

💡 **Still stuck after 15 minutes?**
- Ask in Discord channel
- Share your error message
- Describe what you tried

### ✅ Check Before Moving On
- Know the quick fixes?
- Have recovery prompts saved?
- Know when to ask for help?

---

## 🚀 Quick Reference

### Essential Prompts to Save

**Project Start:**
```
Initialize a SkyMarket drone marketplace project with these exact specifications:

Technology Stack:
- React 18 with TypeScript and strict mode enabled
- Vite for fast development and building
- Tailwind CSS with custom SkyMarket theme configuration
- React Router DOM for client-side routing
- Supabase for backend (auth, database, storage)

Custom Tailwind Configuration:
- Primary brand color: 'red': { 600: '#BD1B04', 700: '#A01603' }
- Extended colors for drone/aviation theme
- Custom font stack with Inter as primary
- Responsive breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px

Project Structure:
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Basic UI elements
│   └── layout/       # Layout components
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configs
│   ├── supabase.ts   # Supabase client
│   └── utils.ts      # Helper functions
├── types/            # TypeScript type definitions
└── App.tsx           # Main app component
```

Essential Configuration:
- TypeScript strict mode with proper type checking
- ESLint with React and TypeScript rules
- Prettier for code formatting
- Environment variables for Supabase keys
- Absolute imports with @ path mapping

Core Components to Create First:
1. Layout with NavigationHeader and Footer
2. HomePage with hero section and service preview
3. ServicesPage with ServiceGrid
4. ServiceDetailPage with booking flow
5. AuthPage with sign-in/sign-up forms

Supabase Integration:
- Initialize Supabase client with environment variables
- Set up authentication context and hooks
- Configure database tables for users, services, bookings
- Enable Row Level Security (RLS) for data protection
```

**Authentication:**
```
Create a comprehensive AuthProvider and authentication system with these specifications:

AuthProvider Setup:
- Create AuthContext with user state and auth methods
- Supabase auth integration with automatic session management
- TypeScript interfaces for User and AuthState
- Loading states during auth operations

Sign Up Component:
- Form fields: email, password, confirmPassword, role (dropdown: "customer" | "operator")
- Validation: email format, password strength (8+ chars, 1 number), passwords match
- Role selection: radio buttons with descriptions
- Submit: createUser with Supabase auth.signUp()
- Success: redirect to email verification page
- Error handling: display specific error messages

Sign In Component:
- Form fields: email, password, "Remember me" checkbox
- Validation: required fields, email format
- Submit: signInWithPassword through Supabase
- "Forgot password" link to reset flow
- Success: redirect to dashboard based on user role
- Error states: invalid credentials, unverified email

Password Reset Flow:
- Reset request: email input with validation
- Supabase resetPasswordForEmail() integration
- Success message: "Check your email for reset instructions"
- Reset form: new password, confirm password validation
- Update password with Supabase auth.updateUser()

Protected Route Component:
- Higher-order component for route protection
- Check authentication status before rendering
- Redirect to sign-in if not authenticated
- Loading spinner while checking auth status
- Optional role-based access control

User Profile Management:
- Profile completion form after first sign-up
- Update profile information through Supabase
- Avatar upload to Supabase storage
- Role-specific profile fields (operator: business info, customer: preferences)

Session Management:
- Automatic token refresh handling
- Persistent session across browser sessions
- Sign out functionality clearing all auth state
- Auth state changes broadcast to all components
```

**Dashboard:**
```
Create a comprehensive Dashboard layout with role-based content:

Dashboard Layout Structure:
- Container: min-h-screen bg-gray-50 flex
- Sidebar: w-64 bg-white shadow-lg (hidden on mobile, slides in on toggle)
- Main content: flex-1 flex flex-col overflow-hidden

Sidebar Component:
- Header section: p-6 border-b with user avatar, name, role badge
- Navigation: space-y-1 px-4 py-6
- Link styling: flex items-center px-4 py-2 rounded-lg hover:bg-gray-100
- Active link: bg-red-50 text-red-600 border-r-2 border-red-600
- Footer: sign out button at bottom

Operator Navigation Items:
- Dashboard Overview (chart icon): earnings, bookings overview
- My Services (drone icon): manage service listings
- Bookings (calendar icon): upcoming and past bookings
- Messages (message icon): customer communications
- Analytics (bar-chart icon): performance metrics
- Profile (user icon): account settings

Customer Navigation Items:
- Browse Services (search icon): find drone services
- My Bookings (calendar icon): current and past bookings
- Favorites (heart icon): saved service providers
- Messages (message icon): operator communications
- Profile (user icon): account settings

Main Content Area:
- Header bar: flex justify-between items-center p-6 bg-white shadow-sm
- Page title: text-2xl font-bold text-gray-900
- Action buttons: primary CTA button (varies by role and page)
- Content: p-6 flex-1 overflow-auto

Mobile Responsiveness:
- Mobile: sidebar hidden, hamburger toggle in header
- Overlay: fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm
- Slide animation: sidebar slides from left with smooth transition
- Close on overlay click or escape key

Dashboard Overview Content:
- Stats cards grid: 2x2 on desktop, stacked on mobile
- Recent activity list: last 5 bookings/services
- Quick actions: prominent buttons for common tasks
- Charts: earnings over time (operators), booking history (customers)

Loading & Empty States:
- Skeleton loading for dashboard stats and lists
- Empty states with illustrations and actionable CTAs
- Error boundaries for failed data loads
- Retry functionality for failed operations
```

**Listings:**
```
Create a comprehensive service management system for drone operators:

MyServices Page Layout:
- Page header: "My Services" title with "Create New Service" button
- Services grid: responsive grid showing service cards with quick actions
- Filter/sort controls: status filter (active/inactive), sort by date/price
- Empty state: welcome message with large "Create Your First Service" CTA

Service Creation Flow:
1. ServiceForm component (reuse from earlier ServiceListingForm prompt)
2. Image upload with Supabase Storage:
   - Multiple file selection with drag-and-drop
   - Image preview thumbnails with remove buttons
   - Progress indicators during upload
   - Automatic resizing and optimization
   - Error handling for file size/type validation

3. Availability Calendar:
   - Monthly calendar view with selectable dates
   - Time slot configuration: morning, afternoon, evening blocks
   - Recurring availability: weekdays, weekends, specific days
   - Blackout dates: mark unavailable periods
   - Save availability to Supabase database

Service Management Table:
- Columns: Service image, title, category, price, status, bookings, actions
- Status toggle: active/inactive with visual indicators
- Quick actions: edit (pencil icon), delete (trash icon), view bookings
- Bulk actions: activate/deactivate multiple services
- Responsive: stack columns on mobile, show essential info only

Service Editing:
- Pre-populated form with existing service data
- Live preview of changes in sidebar
- Save draft functionality with auto-save every 30 seconds
- Change tracking: highlight modified fields
- Cancel/save buttons with unsaved changes warning

Delete Confirmation Modal:
- Warning message about permanent deletion
- Impact notice: "X active bookings will be cancelled"
- Confirmation input: type service name to confirm
- Two-button layout: "Cancel" and "Delete Service" (red, destructive)

Service Analytics Dashboard:
- Service performance metrics: views, bookings, revenue
- Booking calendar: visual representation of upcoming bookings
- Customer feedback: ratings and reviews for each service
- Photo performance: which images get the most engagement

Supabase Integration:
- Database schema: services table with proper relationships
- Row Level Security: operators only see their own services
- Real-time subscriptions: live updates for booking notifications
- Image storage: organized by user ID and service ID
```

**Search:**
```
Create an advanced search and discovery system for drone services:

Search Interface Layout:
- Header: large search bar with location input side-by-side
- Search bar: "What drone service do you need?" with search icon
- Location input: "Detroit, MI" with GPS location button
- Filter toggle: "Filters" button (mobile) or sidebar (desktop)

Advanced Search Bar:
- Autocomplete dropdown with recent searches and suggestions
- Search categories: "Photography", "Videography", "Inspections", etc.
- Voice search button with microphone icon
- Search history: save last 10 searches in localStorage
- Clear search button (X) when text is entered

Filter Sidebar/Panel:
- Category checkboxes: all service types with service counts
- Price range: dual-thumb slider $25-$500+ with input fields
- Distance radius: slider 5-50+ miles with current location
- Availability: "Available today", "This weekend", custom date picker
- Rating filter: 4+ stars, 4.5+ stars checkboxes
- Service features: "Same day booking", "Equipment included", etc.

Sort Controls:
- Dropdown with options: "Best match", "Price: Low to High", "Price: High to Low", "Rating", "Distance", "Newest"
- View toggle: grid view (default) vs list view
- Results per page: 12, 24, 48 options

Search Results Grid:
- Use improved ServiceGrid component from earlier prompt
- Each card shows: image, title, operator, rating, price, distance
- Quick book button on hover
- Favorite heart icon (save to user favorites)
- "View Details" link to service detail page

Advanced Features:
- Map view toggle: show services on interactive map
- Saved searches: email alerts for new matching services
- Recently viewed services: show last 5 viewed services
- Smart filters: "Popular this week", "Highly rated", "New operators"

Search State Management:
- URL synchronization: all filters and search terms in URL
- Shareable links: users can share filtered search results
- Search persistence: maintain search state across page navigation
- Back button support: proper browser history handling

No Results Handling:
- Helpful message: "No services found for [search terms]"
- Suggestions: "Try removing filters", "Search nearby cities"
- Alternative results: "Similar services" or "Popular in your area"
- Contact form: "Request a custom service" CTA

Performance Optimization:
- Debounced search: 300ms delay before API calls
- Infinite scroll: load more results as user scrolls
- Search result caching: cache results for 5 minutes
- Optimistic UI updates: instant filter application with loading states
```

**Booking:**
```
Create a comprehensive end-to-end booking system with these components:

Service Detail Page:
- Hero section: service image gallery with thumbnails, zoom functionality
- Service info: title, description, operator profile, rating/reviews
- Pricing display: hourly rate, minimum booking, additional fees
- "Book Now" CTA button: fixed position on mobile, prominent on desktop
- Operator profile card: photo, name, experience, verification status
- Service includes: equipment provided, travel radius, insurance details

Booking Flow (Multi-Step):
Step 1 - Date & Time Selection:
- Calendar component: shows operator's available dates in green
- Unavailable dates: grayed out with hover tooltips explaining why
- Time slot grid: morning (9-12), afternoon (12-5), evening (5-8) blocks
- Duration selector: 1-8 hours with price calculation per selection
- "Continue to Details" button

Step 2 - Booking Details:
- Contact verification: pre-filled from user profile, edit option
- Location details: service address, GPS coordinates, access instructions
- Special requirements: textarea for custom requests
- Add-ons: optional services with pricing (rush delivery, additional crew, etc.)
- Terms checkbox: "I agree to service terms and cancellation policy"

Step 3 - Payment & Confirmation:
- Booking summary: service, date/time, duration, location, total cost
- Payment options: credit card, PayPal integration
- Payment form: secure input with validation and formatting
- Split payment: deposit now, balance on completion option
- Submit booking: "Confirm and Pay" button with loading state

Booking Confirmation:
- Success page: confirmation number, booking details summary
- Next steps: what to expect, operator contact info
- Calendar integration: "Add to Calendar" button (Google, Outlook, Apple)
- Confirmation email: automatic send to customer and operator
- Redirect options: "View My Bookings" or "Book Another Service"

My Bookings Page:
- Booking cards: upcoming, past, cancelled bookings in separate tabs
- Each card shows: service image, date/time, operator, status, actions
- Status indicators: pending (yellow), confirmed (green), completed (blue), cancelled (red)
- Actions: message operator, reschedule, cancel, leave review
- Booking details modal: full information, payment history, messages

Booking Management Features:
- Reschedule request: customer can propose new dates, operator approves
- Cancellation: policy enforcement, refund calculation, confirmation dialog
- Real-time updates: booking status changes via Supabase subscriptions
- Message thread: in-app communication between customer and operator
- Review system: post-service rating and feedback collection

Operator Booking Management:
- Booking requests: approve/decline new bookings with reasons
- Schedule view: calendar showing all bookings and availability
- Customer communication: respond to messages, send updates
- Service completion: mark jobs complete, request payment for balance
- Availability updates: easily block out dates or change available times

Payment Integration:
- Stripe integration: secure payment processing with webhooks
- Payment states: processing, succeeded, failed with appropriate UI
- Refund handling: automated partial/full refunds per cancellation policy
- Payment history: transaction records for both parties
- Invoice generation: PDF receipts for completed services
```

### Lovable Shortcuts

- **Cmd/Ctrl + Enter:** Run prompt
- **Cmd/Ctrl + K:** Clear chat
- **Cmd/Ctrl + Z:** Undo last change

### Remember

1. Build reusable components always
2. Test after each prompt
3. Save working versions
4. Reference PRD often
5. Ask for help when stuck

---

## ✅ Final Checklist

Before you start building:
- [ ] Lovable account created
- [ ] Supabase account ready
- [ ] PRD document available
- [ ] 8-12 hours scheduled
- [ ] Discord joined for help

You're ready! Start with Phase 1: Setup.

**Next Document:** `1.1-project-overview.md`