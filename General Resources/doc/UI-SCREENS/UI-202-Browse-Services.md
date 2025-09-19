---
Description: Enhanced Browse services marketplace with fuzzy search, debounced input, category filtering, and real-time URL updates
Title: UI-202 Browse Services (Enhanced)
created: 2025-01-10
tags:
- ui
- screen
- consumer
- marketplace
- enhanced-search
- fuzzy-matching
- debounced-input
- skymarket
---

# UI-202: Browse Services (Enhanced Implementation)

## Screen Purpose
Main marketplace page where consumers browse, search, and filter available drone and delivery services with advanced search capabilities including fuzzy matching and real-time filtering.

## Implementation Notes
**Enhanced Features**: The actual Browse.tsx implementation includes sophisticated fuzzy search with text normalization, debounced search input (300ms delay), category filtering, real-time URL parameter updates, and comprehensive field matching across titles, descriptions, operator names, and service areas.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [SkyMarket Logo]  [Search____________] 🔍   👤 John D. [Menu ▼] |
+------------------------------------------------------------------+
| Home > Browse Services                                          |
+------------------------------------------------------------------+
|                                                                  |
| Browse Services                          Found: 47 services     |
|                                                                  |
| [================== Search ==================] [🔍 Search]      |
|                                                                  |
| [Food 🍕] [Courier 📦] [Aerial 📷] [Mapping 🗺️] [All Services]   |
|                                                                  |
| Filter by:  Price [$0 ----●---- $500]   Sort: [Most Popular ▼] |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
| +------------------+ +------------------+ +------------------+  |
| | Detroit Drones   | | Sky Delivery Co  | | Metro Couriers   |  |
| | ⭐ 4.8           | | ⭐ 4.9           | | ⭐ 4.5           |  |
| | 🍕 Food Delivery | | 📦 Courier       | | 📦 Courier       |  |
| |                  | |                  | |                  |  |
| | Fast restaurant  | | Same-day docs   | | 24/7 package    |  |
| | delivery by      | | and packages    | | delivery across  |  |
| | drone            | | delivery        | | Detroit          |  |
| |                  | |                  | |                  |  |
| | $29.99/delivery  | | $19.99/delivery | | $24.99/delivery  |  |
| | Downtown Detroit | | All Metro Areas | | Greater Detroit  |  |
| |                  | |                  | |                  |  |
| | [View Details]   | | [View Details]   | | [View Details]   |  |
| +------------------+ +------------------+ +------------------+  |
|                                                                  |
| +------------------+ +------------------+ +------------------+  |
| | AeroPhoto Pro    | | Quick Parcels    | | SkyMap Services  |  |
| | ⭐ 5.0           | | ⭐ 4.7           | | ⭐ 4.9           |  |
| | 📷 Aerial        | | 📦 Courier       | | 🗺️ Site Mapping |  |
| |                  | |                  | |                  |  |
| | Professional     | | Express courier  | | Construction &   |  |
| | aerial photos    | | for urgent      | | real estate      |  |
| | and video        | | deliveries      | | surveying        |  |
| |                  | |                  | |                  |  |
| | $199/hour        | | $34.99/delivery | | $299/project     |  |
| | All Detroit      | | Downtown Only   | | Metro Detroit    |  |
| |                  | |                  | |                  |  |
| | [View Details]   | | [View Details]   | | [View Details]   |  |
| +------------------+ +------------------+ +------------------+  |
|                                                                  |
|                    [Load More Services]                         |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ☰ SkyMarket  🔍  👤     |
+-------------------------+
| [Search_______] [🔍]    |
+-------------------------+
| [Food] [Courier] [All]  |
| [Aerial] [Mapping]      |
+-------------------------+
| Filter ▼  Sort: Popular |
+-------------------------+
| 47 services found       |
+-------------------------+
|                         |
| +---------------------+ |
| | Detroit Drones      | |
| | ⭐ 4.8  Food 🍕     | |
| |                     | |
| | Fast restaurant     | |
| | drone delivery      | |
| |                     | |
| | $29.99/delivery     | |
| | Downtown Detroit    | |
| |                     | |
| | [View Details →]    | |
| +---------------------+ |
|                         |
| +---------------------+ |
| | Sky Delivery Co     | |
| | ⭐ 4.9  Courier 📦  | |
| |                     | |
| | Same-day document   | |
| | delivery            | |
| |                     | |
| | $19.99/delivery     | |
| | All Metro Areas     | |
| |                     | |
| | [View Details →]    | |
| +---------------------+ |
|                         |
| [Load More]             |
|                         |
+-------------------------+
```

## Key Elements

### Header Navigation
- Logo with home link
- Global search bar
- User menu with name/avatar
- Sign out option

### Page Title
- Breadcrumb navigation
- Service count indicator

### Search & Filter Bar
- Large search input
- Category filter pills
- Price range slider
- Sort dropdown

### Service Grid
- Responsive grid layout
- 3 columns desktop
- 2 columns tablet
- 1 column mobile

### Service Cards
- Operator name and rating
- Service category with icon
- Brief description
- Price clearly displayed
- Service area
- View Details button

### Load More
- Pagination or infinite scroll
- Shows loading state

## Service Card Details
- **Header**: Operator name
- **Rating**: Star rating (future feature)
- **Category**: Icon and label
- **Description**: 2-3 lines max
- **Price**: Prominent display
- **Coverage**: Service area text
- **Action**: View Details button

## Interactions

### Search
- Real-time filtering as user types
- Searches title and description
- Clear button appears when text entered

### Category Pills
- Toggle selection on/off
- Multiple selections allowed
- Updates results immediately

### Price Slider
- Drag to set min/max range
- Shows price values
- Filters on release

### Sort Dropdown
- Options: Popular, Price Low-High, Price High-Low, Newest
- Updates order immediately

### Service Cards
- Hover: Lift effect with shadow
- Click card or button: Navigate to UI-204

### Load More
- Click: Load next batch
- Auto-load on scroll (optional)

## States

### Loading
```
+------------------+
| ░░░░░░░░░░░░░░░░ |
| ░░░░░░░░░░░░░░░░ |
| ░░░░░░░░░░░░░░░░ |
| ░░░░░░░░░░░░░░░░ |
+------------------+
```

### Empty State
```
+-------------------------+
|                         |
|    No services found    |
|                         |
| Try adjusting your      |
| filters or search       |
|                         |
| [Clear Filters]         |
|                         |
+-------------------------+
```

### Error State
```
+-------------------------+
| ⚠️ Unable to load       |
|    services             |
|                         |
| [Try Again]             |
+-------------------------+
```

## Filter Logic
- Categories: OR logic (show Food OR Courier)
- Price: AND logic (within range)
- Search: AND logic (matches term)
- Combined: AND between different filter types

## Mobile Adaptations
- Collapsible filter panel
- Horizontal scrolling category pills
- Full-width service cards
- Sticky filter bar
- Simplified card content

## Performance
- Lazy load images
- Virtual scrolling for long lists
- Debounced search (300ms)
- Cache filter results
- Progressive loading

## Accessibility
- Announce result count changes
- Keyboard navigation for filters
- Clear focus indicators
- Screen reader friendly cards
- Skip to results link

## Advanced Search Implementation

### Fuzzy Search Features
- **Text Normalization**: Removes special characters, converts to lowercase, normalizes whitespace
- **Multi-term Matching**: Splits search query into individual terms for partial matching
- **Field Coverage**: Searches across title, description, operator name, service area, and category labels
- **Partial Matching**: Finds results even with incomplete terms (e.g., "food del" matches "Food Delivery")
- **Typo Tolerance**: Text normalization helps handle minor typing errors

### Search Fields Indexed
```typescript
const searchFields = [
  listing.title,                    // "Fast Drone Food Delivery"
  listing.description,              // Service description text
  listing.profiles?.full_name,      // "Detroit Drones LLC"
  listing.service_area_text,        // "Downtown Detroit"
  categoryLabels[listing.category], // "Food Delivery"
];
```

### Enhanced User Experience
- **Debounced Input**: 300ms delay prevents excessive API calls
- **Real-time Results**: Search results update as user types
- **URL Persistence**: Search terms and filters preserved in URL parameters
- **Category Integration**: Combines text search with category filtering
- **Loading States**: Professional loading grid while fetching results

### Performance Optimizations
- **Client-side Filtering**: Fast filtering after initial data fetch
- **Optimized Queries**: Supabase query with joins for operator profiles
- **Debounce Prevention**: Reduces server load with intelligent input delay
- **State Management**: Efficient React state handling for search and filter state

## Implementation Notes
- Uses Supabase for data fetching with joins for operator profiles
- Implements sophisticated client-side fuzzy search algorithm
- Real-time URL parameter updates for bookmarkable searches
- Debounced search input with 300ms delay for performance
- Category filtering integrated with search functionality
- Enhanced empty states and loading states for better UX

## Navigation Flow
- Card click → UI-204 (Service Detail)
- Category filter → Updated results (no page navigation)
- Search → Real-time filtering (no separate search results page)
- Logo → UI-201 (Consumer Home)

## Technical Implementation Details
- **Component**: Browse.tsx with enhanced search hook
- **Search Hook**: Custom useCallback with fuzzy matching algorithm
- **URL Management**: useSearchParams for persistent search state
- **Debounce**: useEffect with setTimeout for input optimization
- **State**: Separate state for immediate input vs debounced search term