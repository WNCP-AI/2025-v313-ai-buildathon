---
Description: Landing page mockup and specifications for SkyMarket's public homepage
Title: UI-001 Landing Page
created: 2025-01-10
tags:
- ui
- screen
- landing
- public
- skymarket
---

# UI-001: Landing Page

## Screen Purpose
First impression for all visitors - communicates value, builds trust, and guides users to sign up or login.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
|  [SkyMarket Logo]                    [How It Works] [Sign In]   |
|                                       [Get Started →]            |
+------------------------------------------------------------------+
|                                                                  |
|                                                                  |
|              Detroit's Drone & Delivery Marketplace              |
|                                                                  |
|         Connect with certified drone operators and delivery      |
|              services for fast, reliable solutions               |
|                                                                  |
|     [================== Search Services ==================]     |
|                        [🔍 Search]                               |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|   +---------------+  +---------------+  +---------------+       |
|   | Food Delivery |  | Courier/      |  | Aerial       |       |
|   | 🍕            |  | Parcel 📦     |  | Imaging 📷   |       |
|   |               |  |               |  |               |       |
|   | Fast drone    |  | Same-day      |  | Professional |       |
|   | delivery for  |  | document &    |  | photography  |       |
|   | restaurants   |  | package       |  | & video      |       |
|   |               |  | delivery      |  | services     |       |
|   | [Browse →]    |  | [Browse →]    |  | [Browse →]    |       |
|   +---------------+  +---------------+  +---------------+       |
|                                                                  |
|   +---------------+                                             |
|   | Site Mapping  |                                             |
|   | 🗺️            |                                             |
|   |               |                                             |
|   | Construction  |                                             |
|   | & real estate |                                             |
|   | surveying     |                                             |
|   |               |                                             |
|   | [Browse →]    |                                             |
|   +---------------+                                             |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|                    How SkyMarket Works                          |
|                                                                  |
|     1️⃣                2️⃣                3️⃣                      |
|   Search          Connect         Get Service                   |
|   Find the        Book with       Receive fast,                 |
|   perfect         verified        reliable                      |
|   service         operators       delivery                      |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|                    Why Choose SkyMarket?                        |
|                                                                  |
|   ✓ 500+ Verified Operators    ✓ Same-Day Service             |
|   ✓ Licensed & Insured         ✓ Real-Time Updates            |
|   ✓ Serving Greater Detroit    ✓ Secure Payments              |
|                                                                  |
|              [Get Started as Consumer]                          |
|              [Join as Operator]                                 |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
| About | How It Works | Safety | Contact | Terms | Privacy      |
|                                                                  |
| © 2025 SkyMarket - Detroit's Innovation in Motion              |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ☰  SkyMarket    [Sign In]|
+-------------------------+
|                         |
|  Detroit's Drone &      |
|  Delivery Marketplace   |
|                         |
|  Connect with certified |
|  operators for fast     |
|  delivery               |
|                         |
| [====Search====] [🔍]   |
|                         |
| [Get Started →]         |
|                         |
+-------------------------+
|                         |
| +---------------------+ |
| | Food Delivery 🍕    | |
| | Fast drone delivery | |
| | [Browse →]          | |
| +---------------------+ |
|                         |
| +---------------------+ |
| | Courier/Parcel 📦   | |
| | Same-day delivery   | |
| | [Browse →]          | |
| +---------------------+ |
|                         |
| +---------------------+ |
| | Aerial Imaging 📷   | |
| | Professional photos | |
| | [Browse →]          | |
| +---------------------+ |
|                         |
| +---------------------+ |
| | Site Mapping 🗺️     | |
| | Surveying services  | |
| | [Browse →]          | |
| +---------------------+ |
|                         |
+-------------------------+
|                         |
|   How It Works          |
|                         |
| 1. Search Services      |
| 2. Connect w/ Operators |
| 3. Get Fast Delivery    |
|                         |
+-------------------------+
|                         |
| ✓ 500+ Operators        |
| ✓ Licensed & Insured    |
| ✓ Greater Detroit       |
|                         |
| [Start as Consumer]     |
| [Join as Operator]      |
|                         |
+-------------------------+
| About | Contact | Terms |
| © 2025 SkyMarket       |
+-------------------------+
```

## Key Elements

### Header
- Logo/brand name (left)
- Navigation links (right on desktop, hamburger on mobile)
- Sign In button (secondary)
- Get Started button (primary, #BD1B04)

### Hero Section
- Clear value proposition headline
- Supporting description text
- Search bar (prominent)
- Search button with icon

### Service Categories
- 4 category cards with icons
- Brief description for each
- Browse links to filtered marketplace
- Visual hierarchy with cards

### How It Works
- 3 simple steps with icons
- Brief explanation for each
- Visual flow indication

### Trust Indicators
- Number of operators
- Service guarantees
- Coverage area
- Security badges

### Call-to-Action Section
- Two role-based CTAs
- Consumer path (primary)
- Operator path (secondary)

### Footer
- Important links
- Legal pages
- Copyright notice

## Interactions

### Search Bar
- Placeholder: "What service do you need?"
- Auto-suggestions on type
- Enter key submits search
- Redirects to UI-203 (Search Results)

### Category Cards
- Hover: slight lift effect
- Click: Navigate to UI-202 with category filter

### Get Started Button
- Click: Navigate to UI-101 (Role Selection)

### Sign In Button
- Click: Navigate to UI-104 (Login)

### Role CTAs
- Consumer button → UI-101 → UI-102
- Operator button → UI-101 → UI-103

## Mobile Adaptations
- Hamburger menu for navigation
- Full-width search bar
- Stacked category cards
- Sticky CTA button at bottom
- Simplified footer

## Accessibility
- High contrast text
- Clear focus indicators
- Alt text for icons
- Semantic HTML structure
- Skip to main content link

## Performance
- Lazy load below-fold content
- Optimize hero image
- Minimize initial bundle
- Progressive enhancement

## Notes for Implementation
- Search should work without login
- Categories are hard-coded for Track 1
- Trust numbers can be static initially
- Mobile-first responsive design
- Use system fonts for fast loading