---
Description: Enhanced My Bookings page with tabbed interface, collapsible details, and comprehensive booking management - matches Orders.tsx implementation
Title: UI-211 My Bookings (Updated)
created: 2025-09-14
tags:
- ui
- screen
- consumer
- bookings
- orders
- tabbed-interface
- skymarket
---

# UI-211: My Bookings (Updated Implementation)

## Screen Purpose
Comprehensive booking management interface for consumers with tabbed organization, collapsible booking details, and advanced filtering that matches the sophisticated Orders.tsx implementation.

## Implementation Notes
**This screen reflects the actual Orders.tsx implementation** which provides a much more advanced interface than originally mocked up, including tabbed navigation, collapsible booking cards, and detailed booking information.

## ASCII Mockup

### Desktop View - Tabbed Interface
```
+------------------------------------------------------------------+
| [SkyMarket Logo]  [Search____________] 🔍   👤 John D. [Menu ▼] |
+------------------------------------------------------------------+
| Home > My Account > My Bookings                                 |
+------------------------------------------------------------------+
|                                                                  |
| My Orders & Bookings                                            |
|                                                                  |
| [All Orders] [Active] [Completed] [Cancelled]                   |
|                                                                  |
| Showing: All Orders (8 total) • Last updated: 2 minutes ago    |
|                                                                  |
| +--------------------------------------------------------------+ |
| | 🟡 Pending • Fast Drone Food Delivery               [▼]     | |
| |    Detroit Drones LLC • $29.99 • Jan 15, 2:00 PM           | |
| |    Requested 2 hours ago                                     | |
| |                                                              | |
| | [EXPANDED VIEW]                                              | |
| | +----------------------------------------------------------+ | |
| | | Booking Details                                          | | |
| | | Service: Fast Drone Food Delivery                        | | |
| | | Operator: Detroit Drones LLC                             | | |
| | | Phone: (555) 123-4567                                    | | |
| | |                                                          | | |
| | | Scheduled Service:                                       | | |
| | | Date: January 15, 2025                                  | | |
| | | Time: 2:00 PM                                           | | |
| | | Duration: ~30 minutes                                   | | |
| | |                                                          | | |
| | | Service Location:                                        | | |
| | | 123 Main St, Apt 4B, Detroit, MI 48226                 | | |
| | |                                                          | | |
| | | Special Requirements:                                    | | |
| | | "Please call when arriving. Gate code is 1234."        | | |
| | |                                                          | | |
| | | Pricing:                                                 | | |
| | | Service Fee: $29.99                                     | | |
| | | Platform Fee: $2.99                                     | | |
| | | Total: $32.98                                           | | |
| | |                                                          | | |
| | | [Contact Operator] [View Service] [Cancel Request]      | | |
| | +----------------------------------------------------------+ | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | ✅ Completed • Aerial Photography Service           [▲]     | |
| |    SkyShot Studios • $199.00 • Jan 10, 3:00 PM             | |
| |    Completed 5 days ago                                      | |
| |                                                              | |
| | [COLLAPSED VIEW - Click to expand details]                  | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | 🟢 Confirmed • Document Courier Service             [▼]     | |
| |    QuickSend Pro • $19.99 • Jan 14, 10:00 AM               | |
| |    Confirmed yesterday                                       | |
| |                                                              | |
| | [EXPANDED VIEW]                                              | |
| | +----------------------------------------------------------+ | |
| | | Delivery Details                                         | | |
| | | Package: Legal documents                                 | | |
| | | From: 123 Law Office, Downtown                          | | |
| | | To: 456 Oak Ave, Midtown Detroit                        | | |
| | | Special: Handle with care, signature required           | | |
| | |                                                          | | |
| | | Operator Contact:                                        | | |
| | | QuickSend Pro • 4.6★ (89 reviews)                      | | |
| | | Phone: (555) 987-6543                                   | | |
| | | Response: Usually within 1 hour                         | | |
| | |                                                          | | |
| | | [Message Operator] [View Details] [Modify Booking]      | | |
| | +----------------------------------------------------------+ | |
| +--------------------------------------------------------------+ |
|                                                                  |
| [Load More Orders...]                              [Export List] |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View - Tabbed with Collapsible Cards
```
+-------------------------+
| ← My Orders             |
+-------------------------+
| [All] [Active] [Done]   |
| 8 orders total          |
+-------------------------+
|                         |
| 🟡 Pending       [▼]    |
| Fast Food Delivery      |
| Detroit Drones • $29.99 |
| Jan 15, 2:00 PM         |
| Requested 2h ago        |
|                         |
| [EXPANDED]              |
| ┌─────────────────────┐ |
| │ Booking Details     │ |
| │                     │ |
| │ Service: Fast Food  │ |
| │ Delivery            │ |
| │                     │ |
| │ Date: Jan 15, 2025  │ |
| │ Time: 2:00 PM       │ |
| │                     │ |
| │ Location:           │ |
| │ 123 Main St, Apt 4B │ |
| │ Detroit, MI 48226   │ |
| │                     │ |
| │ Requirements:       │ |
| │ "Call when arriving.│ |
| │ Gate code: 1234"    │ |
| │                     │ |
| │ Total: $32.98       │ |
| │ (incl. platform fee)│ |
| │                     │ |
| │ [Contact] [Cancel]  │ |
| └─────────────────────┘ |
+-------------------------+
|                         |
| ✅ Completed     [▲]    |
| Aerial Photography      |
| SkyShot • $199.00       |
| Jan 10, 3:00 PM         |
| 5 days ago              |
| [COLLAPSED - Tap ▼]     |
+-------------------------+
|                         |
| 🟢 Confirmed     [▼]    |
| Document Courier        |
| QuickSend • $19.99      |
| Jan 14, 10:00 AM        |
| Confirmed yesterday     |
| [COLLAPSED - Tap ▼]     |
+-------------------------+
|                         |
| [Load More...]          |
|                         |
+-------------------------+
```

## Key Elements

### Enhanced Header
- **Tab Navigation**: All Orders, Active, Completed, Cancelled
- **Order Count**: Total number with real-time updates
- **Last Updated**: Timestamp of most recent data refresh
- **Export Option**: Download order history (future feature)

### Tabbed Organization
- **All Orders**: Complete order history
- **Active**: Pending and confirmed bookings
- **Completed**: Successfully finished services
- **Cancelled**: Cancelled or declined bookings
- **Dynamic Counts**: Tab badges showing count per category

### Collapsible Booking Cards
- **Collapsed State**: Summary with key information
- **Expanded State**: Full booking details and actions
- **Toggle Control**: Click/tap chevron to expand/collapse
- **Smart Default**: Recent/active bookings expanded by default
- **Individual Control**: Each booking can be expanded independently

### Booking Card Information
#### Collapsed View
- **Status Icon**: Color-coded status indicator
- **Service Title**: Primary service name
- **Operator Name**: Service provider with rating
- **Price**: Service cost with formatting
- **Date/Time**: Scheduled service time
- **Relative Time**: "2 hours ago", "yesterday", etc.

#### Expanded View
- **Complete Booking Details**: All booking information
- **Service Information**: Full service description and category
- **Location Details**: Complete address and special instructions
- **Operator Contact**: Phone, email, rating, response time
- **Pricing Breakdown**: Service fee, platform fee, total
- **Action Buttons**: Contact, view service, modify, cancel

### Action Controls
- **Contact Operator**: Direct communication with service provider
- **View Service**: Navigate to original service listing
- **Modify Booking**: Change date/time if allowed
- **Cancel Request**: Cancel pending bookings
- **Leave Review**: Rate completed services (future)

## Advanced Features

### Real-time Updates
- **Live Status Changes**: Automatic updates when operator responds
- **Push Notifications**: Alert for booking status changes
- **Background Sync**: Update data when app regains focus
- **Optimistic Updates**: Show changes immediately before server confirmation

### Enhanced Filtering
- **Date Range**: Filter bookings by date period
- **Service Type**: Filter by category (food, courier, aerial, mapping)
- **Operator**: Filter by specific operators
- **Status Combination**: Multiple status filters simultaneously
- **Price Range**: Filter by booking value
- **Location**: Filter by service area

### Search Functionality
- **Full-Text Search**: Search across service names, operators, locations
- **Fuzzy Matching**: Handle typos and partial matches
- **Quick Filters**: One-click common filter combinations
- **Search History**: Remember recent searches
- **Search Suggestions**: Auto-complete based on booking history

## Interactions

### Tab Navigation
- **Click/Tap Tabs**: Switch between order categories
- **Keyboard Navigation**: Arrow keys to switch tabs
- **URL Persistence**: Tab state preserved in URL
- **Deep Linking**: Direct links to specific tab views
- **Badge Updates**: Real-time count updates on tabs

### Booking Card Interactions
- **Expand/Collapse**: Click chevron or card header
- **Quick Actions**: One-click common actions in collapsed view
- **Detailed Actions**: Full action menu in expanded view
- **Swipe Actions**: Mobile swipe gestures for quick actions
- **Long Press**: Mobile context menu activation

### Status Management
- **Status Tracking**: Visual progress through booking lifecycle
- **Timeline View**: Chronological status changes
- **Next Steps**: Clear indication of what happens next
- **Communication Integration**: Direct operator contact options

## States

### Loading States
```
+-------------------------+
| Loading orders...       |
| ████████░░░░ 75%       |
|                         |
| [Skeleton cards...]     |
+-------------------------+
```

### Empty States
```
+-------------------------+
| 📦 No bookings yet      |
|                         |
| You haven't made any    |
| bookings yet. Start     |
| browsing services!      |
|                         |
| [Browse Services]       |
+-------------------------+
```

### Filter States
```
+-------------------------+
| Filtered: Pending (2)   |
| [Clear Filter] [▼]      |
|                         |
| 🟡 Food Delivery        |
| 🟡 Aerial Photography   |
|                         |
| [Show All 8 Orders]     |
+-------------------------+
```

## Data Display Patterns

### Status Visual Coding
- **Pending**: 🟡 Yellow circle with clock icon
- **Confirmed**: 🟢 Green circle with checkmark
- **Completed**: ✅ Green checkmark badge
- **Cancelled**: ❌ Red X badge
- **In Progress**: 🔵 Blue circle with progress icon

### Information Hierarchy
1. **Primary**: Service title and status
2. **Secondary**: Operator name and rating
3. **Tertiary**: Price, date/time, location
4. **Detailed**: Requirements, contact info, full breakdown

### Time Display
- **Relative Time**: "2 hours ago", "yesterday", "last week"
- **Absolute Time**: Full date and time for scheduled services
- **Duration**: Expected service duration
- **Time Until**: Countdown to scheduled services

## Mobile Optimizations

### Touch Interface
- **Large Touch Targets**: Easy tap areas for expansion
- **Swipe Gestures**: Swipe to reveal quick actions
- **Pull to Refresh**: Refresh booking data
- **Bottom Sheet**: Detailed actions slide up from bottom

### Performance
- **Virtual Scrolling**: Handle large order histories efficiently
- **Progressive Loading**: Load additional orders as needed
- **Image Optimization**: Efficient operator avatar loading
- **Battery Optimization**: Minimize background processing

### Layout Adaptations
- **Stacked Cards**: Vertical card layout for mobile
- **Condensed Information**: Essential info prioritized
- **Action Sheets**: Modal action menus for complex operations
- **Sticky Tabs**: Tab bar remains visible during scrolling

## Accessibility Features

### Screen Reader Support
- **Tab Labels**: Clear tab descriptions and counts
- **Status Announcements**: Booking status changes announced
- **Expansion State**: Announce when cards expand/collapse
- **Action Context**: Clear action button descriptions

### Keyboard Navigation
- **Tab Navigation**: Switch between order tabs
- **Arrow Keys**: Navigate through booking cards
- **Enter/Space**: Expand/collapse cards and activate buttons
- **Escape**: Close expanded details or action menus

### Visual Accessibility
- **High Contrast**: Clear visual distinction between statuses
- **Focus Indicators**: Clear focus states for navigation
- **Text Scaling**: Support for enlarged text preferences
- **Color Independence**: Status information not color-dependent

## Advanced Features (Actual Implementation)

### Collapsible Interface
- **Smart Defaults**: Recent and active bookings start expanded
- **Individual Control**: Each booking can be collapsed independently
- **State Persistence**: Remember expansion preferences
- **Performance**: Only render expanded content when needed

### Enhanced Data Display
- **Complete Operator Info**: Name, phone, rating, response time
- **Detailed Pricing**: Service fee breakdown with platform fees
- **Location Information**: Full address with special instructions
- **Booking Timeline**: Created, updated, and status change timestamps

### Communication Integration
- **Direct Contact**: One-click operator communication
- **Message History**: View previous conversations (future)
- **Booking Updates**: Real-time status change notifications
- **Email Integration**: Access email confirmations and updates

## Performance Optimizations

### Data Management
- **Efficient Queries**: Optimized database queries with joins
- **Real-time Subscriptions**: Live updates via Supabase subscriptions
- **Pagination**: Load orders in chunks for large histories
- **Caching**: Cache booking data for improved performance

### UI Performance
- **Component Memoization**: Prevent unnecessary re-renders
- **Virtual Scrolling**: Handle large order lists efficiently
- **Lazy Loading**: Load booking details on expansion
- **Image Optimization**: Efficient operator avatar loading

## Integration Points

### Database Integration
- **Complex Queries**: Join booking_requests with listings and profiles
- **Real-time Updates**: Supabase subscriptions for live status changes
- **Efficient Pagination**: Cursor-based pagination for large datasets
- **Data Transformation**: Transform nested data for UI consumption

### Communication Services
- **Email Integration**: Access to email confirmations and updates
- **Notification System**: Push notifications for status changes
- **Operator Contact**: Direct phone and email integration
- **Message Threading**: Conversation history with operators

## Technical Implementation

### Component Architecture
- **Orders.tsx**: Main component with comprehensive state management
- **Tabbed Interface**: Uses shadcn/ui Tabs component
- **Collapsible Cards**: Uses shadcn/ui Collapsible component
- **Data Fetching**: Custom hooks for order management

### State Management
- **Tab State**: Active tab selection and persistence
- **Expansion State**: Track which cards are expanded
- **Filter State**: Applied filters and search terms
- **Loading State**: Track data loading and refresh states

### Data Structure
```typescript
interface OrderWithDetails {
  id: string;
  consumer_id: string;
  listing_id: string;
  preferred_date: string | null;
  preferred_time: string | null;
  requirements: string | null;
  status: string;
  created_at: string;
  listing: {
    title: string;
    price: number;
    category: string;
    operator_id: string;
  };
  operator_profile: {
    full_name: string;
    phone: string;
  };
}
```

## Error Handling

### Network Errors
- **Connection Loss**: Show offline indicator and cache data
- **API Failures**: Retry failed requests with exponential backoff
- **Timeout Handling**: Clear timeout error messages
- **Data Sync**: Reconcile data when connection restored

### User Feedback
- **Loading Indicators**: Show data loading progress
- **Error Messages**: User-friendly error descriptions
- **Retry Options**: Allow users to retry failed operations
- **Offline Support**: Basic functionality when offline

## User Experience Improvements

### Contextual Information
- **Smart Grouping**: Group related bookings (same operator, service)
- **Timeline View**: Chronological order of all bookings
- **Status Progression**: Clear visual booking lifecycle
- **Action Availability**: Context-aware action buttons

### Quick Actions
- **One-Click Contact**: Direct operator communication
- **Fast Rebooking**: Quick rebook same service
- **Status Checking**: Real-time status information
- **Service Navigation**: Quick access to original service listings

This updated implementation reflects the sophisticated Orders.tsx component which provides a much more advanced and user-friendly interface than the original simple list mockup.