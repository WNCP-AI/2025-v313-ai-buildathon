---
Description: Operator dashboard home screen showing overview of business metrics and quick actions
Title: UI-301 Operator Dashboard
created: 2025-01-10
tags:
- ui
- screen
- operator
- dashboard
- skymarket
---

# UI-301: Operator Dashboard

## Screen Purpose
Central hub for operators to manage their drone/delivery business, view metrics, and access key functions.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [SkyMarket Logo]                    👤 Detroit Drones [Menu ▼]  |
|                                      Operator Account            |
+------------------------------------------------------------------+
| Dashboard | My Listings | Bookings | Profile | Settings         |
+------------------------------------------------------------------+
|                                                                  |
| Welcome back, Detroit Drones LLC!                               |
|                                                                  |
| +----------------+ +----------------+ +----------------+        |
| | Active Listings| | Pending Books  | | This Week      |        |
| |      5         | |      3         | |     12         |        |
| | services       | | awaiting reply | | bookings       |        |
| +----------------+ +----------------+ +----------------+        |
|                                                                  |
| Quick Actions                                                   |
| +------------------------------+ +-----------------------------+|
| |  + Create New Listing         | | 📊 View Analytics          ||
| |    Add a new service          | |    See your performance    ||
| +------------------------------+ +-----------------------------+|
|                                                                  |
| Recent Activity                                    [View All]   |
| +--------------------------------------------------------------+|
| | 🔔 New booking request from John D. - Food Delivery         ||
| |    2 minutes ago                            [Respond →]      ||
| +--------------------------------------------------------------+|
| | 🔔 New booking request from Sarah M. - Aerial Photography   ||
| |    1 hour ago                               [Respond →]      ||
| +--------------------------------------------------------------+|
| | ✓ Completed delivery for Mike R. - Courier Service          ||
| |    3 hours ago                              [View Details]   ||
| +--------------------------------------------------------------+|
|                                                                  |
| Your Top Services                                               |
| +--------------------------------------------------------------+|
| | Service              | Views | Bookings | Revenue            ||
| |---------------------|-------|----------|--------------------||
| | Food Delivery       |  245  |    8     | $239.92            ||
| | Document Courier    |  189  |    4     | $79.96             ||
| | Aerial Photography  |  156  |    2     | $398.00            ||
| +--------------------------------------------------------------+|
|                                                                  |
| Availability Status: [● Online] [Switch to Offline]             |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ☰ SkyMarket  👤 Operator|
+-------------------------+
| Welcome back!           |
| Detroit Drones LLC      |
+-------------------------+
|                         |
| +-----+ +-----+ +-----+ |
| |  5  | |  3  | | 12  | |
| |List.| |Pend.| |Week | |
| +-----+ +-----+ +-----+ |
|                         |
| [+ New Listing]         |
| [📊 Analytics]          |
|                         |
+-------------------------+
| Recent Activity         |
+-------------------------+
| 🔔 New: John D.         |
| Food Delivery - 2m ago  |
| [Respond →]             |
+-------------------------+
| 🔔 New: Sarah M.        |
| Aerial Photo - 1hr ago  |
| [Respond →]             |
+-------------------------+
| ✓ Completed: Mike R.    |
| Courier - 3hrs ago      |
+-------------------------+
| [View All Activity]     |
+-------------------------+
| Top Services            |
| Food Delivery (8)       |
| Courier (4)             |
| Aerial (2)              |
+-------------------------+
| Status: [● Online]      |
+-------------------------+
| Dashboard | Listings    |
| Bookings  | Profile     |
+-------------------------+
```

## Key Elements

### Header
- Logo and branding
- User identification (Operator Account)
- Account menu dropdown
- Sign out option

### Navigation Tabs
- Dashboard (current)
- My Listings → UI-302
- Bookings → UI-308
- Profile → UI-310
- Settings → UI-311

### Key Metrics Cards
- **Active Listings**: Total published services
- **Pending Bookings**: Requires action
- **This Week**: Completed bookings

### Quick Actions
- Create New Listing (primary)
- View Analytics
- Manage availability
- Export data (future)

### Recent Activity Feed
- Chronological list
- Action items highlighted
- Quick response buttons
- Time stamps
- Activity types:
  - New booking requests
  - Completed services
  - Customer messages
  - System notifications

### Performance Summary
- Top performing services
- View counts
- Booking counts
- Revenue (if applicable)

### Availability Toggle
- Online/Offline status
- Quick toggle switch
- Visual indicator

## Interactions

### Metric Cards
- Click: Drill down to detailed view
- Hover: Show trend indicator

### Create New Listing
- Click → UI-303 (Create Listing Step 1)

### View Analytics
- Click → UI-312 (Analytics page)

### Activity Items
- Respond → UI-309 (Booking Detail)
- View Details → Relevant page

### View All Activity
- Click: Expand to full activity log

### Status Toggle
- Click: Switch online/offline
- Confirmation if going offline with pending bookings

## States

### Online Status
```
[● Online] - Accepting bookings
```

### Offline Status
```
[○ Offline] - Not accepting bookings
```

### New Activity Badge
```
🔔 (3) - Number of new items
```

## Mobile Adaptations
- Condensed metrics display
- Swipeable activity cards
- Bottom navigation bar
- Simplified table view
- Full-width action buttons
- Collapsible sections

## Data Display

### Activity Priorities
1. Urgent: New bookings requiring response
2. Important: Today's scheduled services
3. Informational: Completed services
4. System: Platform updates

### Time Formats
- Just now
- X minutes ago
- X hours ago
- Yesterday
- Date for older

## Performance Metrics

### Displayed Metrics
- Service view counts
- Booking conversion
- Revenue totals
- Response time
- Completion rate

### Trend Indicators
- ↑ Increase from last period
- ↓ Decrease from last period
- → No change

## Accessibility
- Screen reader announcements for new activity
- Keyboard navigation support
- High contrast mode
- Focus indicators
- ARIA labels for icons

## Implementation Notes
- Real-time updates for new bookings
- Cache dashboard data
- Lazy load activity feed
- Progressive disclosure for details
- Mobile-first responsive design

## Navigation Flow
- My Listings → UI-302
- Create Listing → UI-303
- Bookings → UI-308
- Booking Detail → UI-309
- Profile → UI-310
- Analytics → UI-312

## Business Logic
- Pending bookings show warning if > 1 hour old
- Offline status prevents new bookings
- Activity feed limited to 7 days
- Metrics update every 5 minutes