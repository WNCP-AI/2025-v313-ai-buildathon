---
Description: Advanced operator listings management with table view, inline actions, and status toggles - matches OperatorListings.tsx
Title: UI-302 My Listings (Advanced)
created: 2025-09-14
tags:
- ui
- screen
- operator
- listings
- table-management
- inline-actions
- skymarket
---

# UI-302: My Listings (Advanced Implementation)

## Screen Purpose
Comprehensive listing management interface for drone operators to create, view, edit, and manage their service offerings with advanced table-based controls and inline actions.

## Implementation Notes
**Advanced Features**: The actual OperatorListings.tsx implementation provides a sophisticated table-based interface with dropdown menus, inline status toggles, direct edit/delete actions, and comprehensive loading states with toast notifications.

## ASCII Mockup

### Desktop View - Advanced Table Interface
```
+------------------------------------------------------------------+
| [SkyMarket Logo]  [Search____________] 🔍   👤 Operator [Menu ▼] |
+------------------------------------------------------------------+
| Home > Operator Dashboard > My Listings                        |
+------------------------------------------------------------------+
|                                                                  |
| My Listings                                    [+ New Listing]   |
|                                                                  |
| Manage your service offerings and track their performance       |
|                                                                  |
+------------------------------------------------------------------+
| ┌──────────────────────────────────────────────────────────────┐ |
| │ Service Title      │Category    │Price    │Area      │Status│⚙│ |
| ├────────────────────┼────────────┼─────────┼──────────┼──────┼─┤ |
| │ Fast Drone Food    │Food        │$29.99   │Downtown  │●    │●│ |
| │ Delivery           │Delivery    │         │Detroit   │Active│⋮│ |
| ├────────────────────┼────────────┼─────────┼──────────┼──────┼─┤ |
| │ Aerial Photography │Aerial      │$199.00  │Metro     │○    │●│ |
| │ Services           │Imaging     │/hour    │Detroit   │Inactive│⋮│ |
| ├────────────────────┼────────────┼─────────┼──────────┼──────┼─┤ |
| │ Construction Site  │Site        │$299.00  │Greater   │●    │●│ |
| │ Mapping           │Mapping      │/project │Detroit   │Active│⋮│ |
| ├────────────────────┼────────────┼─────────┼──────────┼──────┼─┤ |
| │ Express Document   │Courier &   │$34.99   │Downtown  │●    │●│ |
| │ Courier           │Parcel      │         │Only      │Active│⋮│ |
| └────────────────────┴────────────┴─────────┴──────────┴──────┴─┘ |
|                                                                  |
| 4 listings total • 3 active • 1 inactive                       |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View - Responsive Card Layout
```
+-------------------------+
| ← My Listings      [+]  |
+-------------------------+
| [+ New Listing]         |
+-------------------------+
| Active Listings: 3      |
| Inactive: 1             |
+-------------------------+
|                         |
| [Fast Drone Food Del.]  |
| Food Delivery           |
| $29.99 • Downtown       |
| ● Active    [⋮ Menu]    |
+-------------------------+
|                         |
| [Aerial Photography]    |
| Aerial Imaging          |
| $199/hr • Metro Area    |
| ○ Inactive  [⋮ Menu]    |
+-------------------------+
|                         |
| [Construction Mapping]  |
| Site Mapping           |
| $299/project • Greater  |
| ● Active    [⋮ Menu]    |
+-------------------------+
| [Load More...]          |
+-------------------------+
```

## Key Elements

### Advanced Table Interface
- **Responsive Table**: Professional data table with proper column headers
- **Service Information**: Title, category, pricing, and service area
- **Status Indicators**: Visual active/inactive status with color coding
- **Inline Actions**: Dropdown menu for each listing with contextual actions
- **Bulk Operations**: Checkbox selection for bulk actions (future enhancement)

### Table Columns
- **Service Title**: Listing name with truncation for long titles
- **Category**: Service category with friendly labels (Food Delivery, Aerial Imaging, etc.)
- **Price**: Formatted pricing with /hour or /project indicators
- **Service Area**: Geographic coverage area
- **Status**: Active/Inactive toggle with visual indicators
- **Actions**: Dropdown menu with Edit, Delete, View, Toggle Status

### Status Management
- **Active Status**: Green indicator (●) for active listings
- **Inactive Status**: Gray indicator (○) for disabled listings
- **Toggle Functionality**: One-click status change with immediate UI update
- **Visual Feedback**: Color-coded status indicators throughout interface

### Dropdown Action Menu
- **Edit Listing**: Navigate to edit form with pre-populated data
- **Delete Listing**: Confirmation dialog for permanent deletion
- **View Public**: See listing as consumers would see it
- **Toggle Status**: Quick activate/deactivate without confirmation
- **Duplicate**: Create copy for similar services (future)

## Advanced Features

### Real-time Data Management
- **Optimistic Updates**: UI updates immediately before server confirmation
- **Error Handling**: Rollback UI changes if server update fails
- **Toast Notifications**: Success and error feedback for all actions
- **Auto-refresh**: Periodic data refresh for multi-device sync

### Professional Table Features
- **Sortable Columns**: Click column headers to sort by different criteria
- **Responsive Design**: Collapses to card view on mobile devices
- **Loading States**: Skeleton loading for table rows during fetch
- **Empty States**: Professional empty state when no listings exist
- **Pagination**: Handle large numbers of listings efficiently

### Status Toggle Implementation
```typescript
const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
  // Optimistic UI update
  setListings(prev => prev.map(listing =>
    listing.id === id
      ? { ...listing, is_active: !currentStatus }
      : listing
  ));

  // Server update with error handling
  const { error } = await supabase
    .from('listings')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  // Toast notification and error rollback
};
```

## Interactions

### Table Row Actions
- **Row Click**: View listing details (optional)
- **Status Toggle**: Click status indicator to toggle active/inactive
- **Menu Button**: Open dropdown with all available actions
- **Edit Action**: Navigate to edit form with listing data pre-filled
- **Delete Action**: Show confirmation dialog with warning

### Status Indicators
- **Active (●)**: Green circle indicating listing is visible to consumers
- **Inactive (○)**: Gray circle indicating listing is hidden from consumers
- **Click to Toggle**: Single click changes status with immediate visual feedback
- **Loading State**: Spinner during status update API call

### Action Dropdown Menu
- **Edit**: Navigate to `/edit-listing/${id}` with form pre-populated
- **Delete**: Show confirmation dialog with permanent deletion warning
- **View Public**: Open listing detail page in new tab
- **Toggle Status**: Immediate status change without navigation
- **Menu Positioning**: Smart positioning to stay within viewport

## States

### Loading States
```
+-------------------------+
| Loading your listings...│
│ ████████░░░░ 75%       │
│                        │
│ [Skeleton table rows]  │
+-------------------------+
```

### Empty State
```
+-------------------------+
│ 📝 No listings yet      │
│                         │
│ Create your first       │
│ service listing to      │
│ start receiving         │
│ bookings               │
│                         │
│ [Create First Listing] │
+-------------------------+
```

### Error States
```
+-------------------------+
│ ⚠️ Failed to load       │
│    listings             │
│                         │
│ Check your connection   │
│ and try again          │
│                         │
│ [Retry] [Support]      │
+-------------------------+
```

## Data Management

### Listing Data Structure
```typescript
interface Listing {
  id: string;
  title: string;
  description: string;
  category: 'food_delivery' | 'courier_parcel' | 'aerial_imaging' | 'site_mapping';
  price: number;
  service_area_text: string;
  is_active: boolean;
  created_at: string;
  operator_id: string;
}
```

### Category Label Mapping
- `food_delivery` → "Food Delivery"
- `courier_parcel` → "Courier & Parcel"
- `aerial_imaging` → "Aerial Imaging"
- `site_mapping` → "Site Mapping"

### Database Operations
- **Fetch**: Query listings filtered by current operator ID
- **Update Status**: Toggle is_active field with optimistic updates
- **Delete**: Soft delete or permanent removal with confirmation
- **Create**: Navigate to new listing form

## Mobile Optimizations

### Card-Based Layout
- **Responsive Breakpoint**: Switches from table to cards on mobile
- **Touch-Friendly**: Large touch targets for actions and status toggles
- **Gesture Support**: Swipe actions for quick status toggle
- **Bottom Sheet**: Action menu slides up from bottom on mobile

### Performance Optimizations
- **Virtual Scrolling**: Efficient rendering for large listing sets
- **Image Lazy Loading**: Load listing images only when visible
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Data Caching**: Cache listing data for faster subsequent loads

## Accessibility Features

### Screen Reader Support
- **Table Headers**: Properly associated with data cells
- **Status Announcements**: Status changes announced to screen readers
- **Action Labels**: Clear descriptions for all dropdown menu actions
- **Loading States**: Loading progress announced

### Keyboard Navigation
- **Tab Navigation**: Logical tab order through table and actions
- **Enter/Space**: Activate buttons and toggle status
- **Arrow Keys**: Navigate through table cells
- **Escape**: Close dropdown menus

## Technical Implementation

### Component Architecture
- **OperatorListings.tsx**: Main component with state management
- **Table Components**: shadcn/ui Table, TableHeader, TableRow, TableCell
- **Dropdown Menu**: shadcn/ui DropdownMenu with action items
- **Toast Integration**: useToast hook for notifications

### State Management
- **Listings State**: Array of operator's listings
- **Loading State**: Boolean for initial data fetch
- **Updating State**: Track which listings are being updated
- **Error State**: Handle and display error messages

### Database Integration
- **Supabase Query**: Fetch listings filtered by operator_id
- **Real-time Updates**: Optional real-time subscriptions
- **Row Level Security**: Ensure operators only see their own listings
- **Optimistic Updates**: Update UI before server confirmation

## Error Handling

### Network Errors
- **Connection Issues**: Show retry option with clear error message
- **Timeout Handling**: Handle slow network connections gracefully
- **Offline Support**: Basic offline viewing of cached data
- **Data Sync**: Reconcile changes when connection restored

### User Feedback
- **Success Messages**: "Listing updated successfully"
- **Error Messages**: "Failed to update listing. Please try again."
- **Loading Indicators**: Show progress during operations
- **Rollback Support**: Undo UI changes if server update fails

## Navigation Flow
- **New Listing**: Navigate to create listing form
- **Edit Listing**: Navigate to edit form with pre-populated data
- **View Public**: Open listing detail page (consumer view)
- **Operator Dashboard**: Return to main operator dashboard
- **Delete Confirmation**: Modal dialog for permanent deletion

This implementation provides a professional, table-based interface that matches the sophisticated OperatorListings.tsx component with advanced features like optimistic updates, comprehensive error handling, and responsive design.