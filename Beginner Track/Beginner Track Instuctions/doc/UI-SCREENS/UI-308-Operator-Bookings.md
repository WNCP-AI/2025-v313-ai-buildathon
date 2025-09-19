---
Description: Comprehensive operator booking management with status filtering, detailed consumer information, and batch status updates - matches OperatorBookings.tsx
Title: UI-308 Operator Bookings (Advanced)
created: 2025-09-14
tags:
- ui
- screen
- operator
- bookings
- status-management
- filtering
- customer-communication
- skymarket
---

# UI-308: Operator Bookings (Advanced Implementation)

## Screen Purpose
Advanced booking request management interface for drone operators to view, filter, and manage incoming booking requests with detailed consumer information and comprehensive status management.

## Implementation Notes
**Advanced Features**: The actual OperatorBookings.tsx implementation provides sophisticated booking management with status filtering, detailed consumer profiles, comprehensive booking information, and batch status update capabilities with real-time notifications.

## ASCII Mockup

### Desktop View - Advanced Booking Management
```
+------------------------------------------------------------------+
| [SkyMarket Logo]  [Search____________] 🔍   👤 Operator [Menu ▼] |
+------------------------------------------------------------------+
| Home > Operator Dashboard > Booking Requests                   |
+------------------------------------------------------------------+
|                                                                  |
| Booking Requests                     Filter: [All Status ▼]     |
|                                                                  |
| Manage incoming booking requests and communicate with clients    |
|                                                                  |
| [All (12)] [Pending (3)] [Confirmed (6)] [Completed (2)] [❌ (1)]|
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
| +--------------------------------------------------------------+ |
| | 🟡 PENDING • Req #BR-2025-0847                              | |
| | Fast Drone Food Delivery • $29.99                           | |
| | ┌─────────────────────────────────────────────────────────┐ | |
| | │ 👤 Customer: John Smith                                 │ | |
| | │    john.smith@email.com                                 │ | |
| | │                                                         │ | |
| | │ 📅 Requested Service:                                   │ | |
| | │    January 15, 2025 at 2:00 PM                         │ | |
| | │    Duration: ~30 minutes                               │ | |
| | │                                                         │ | |
| | │ 📍 Service Location:                                    │ | |
| | │    123 Main St, Apt 4B, Detroit, MI 48226             │ | |
| | │                                                         │ | |
| | │ 📝 Special Requirements:                                │ | |
| | │    "Please call when arriving. Gate code is 1234."     │ | |
| | │                                                         │ | |
| | │ 💰 Service Fee: $29.99 • Platform Fee: $2.99          │ | |
| | │    Your Revenue: $26.99 (90%)                          │ | |
| | │                                                         │ | |
| | │ ⏰ Requested: 2 hours ago                               │ | |
| | └─────────────────────────────────────────────────────────┘ | |
| |                                                              | |
| | Status: [Pending ▼] [Confirm] [Decline] [Contact Customer]  | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | ✅ CONFIRMED • Req #BR-2025-0843                            | |
| | Document Courier Service • $19.99                           | |
| | ┌─────────────────────────────────────────────────────────┐ | |
| | │ 👤 Customer: Sarah Johnson                              │ | |
| | │    sarah.j@example.com                                  │ | |
| | │                                                         │ | |
| | │ 📅 Confirmed Service:                                   │ | |
| | │    January 14, 2025 at 10:00 AM                        │ | |
| | │    Status: Ready for service                           │ | |
| | │                                                         │ | |
| | │ 📍 Pickup & Delivery:                                   │ | |
| | │    From: 123 Law Office, Downtown Detroit              │ | |
| | │    To: 456 Oak Ave, Midtown Detroit                    │ | |
| | │                                                         │ | |
| | │ 📝 Package Details:                                     │ | |
| | │    "Legal documents - handle with care"                │ | |
| | │                                                         │ | |
| | │ 💰 Your Revenue: $17.99 (90% of $19.99)               │ | |
| | │                                                         │ | |
| | │ ⏰ Confirmed: Yesterday                                 │ | |
| | └─────────────────────────────────────────────────────────┘ | |
| |                                                              | |
| | Status: [Confirmed ▼] [Start Service] [Complete] [Contact] | |
| +--------------------------------------------------------------+ |
|                                                                  |
| [Load More Bookings...]                    [Export to CSV]     |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View - Card-Based Interface
```
+-------------------------+
| ← Booking Requests      |
+-------------------------+
| Filter: [All ▼]         |
| 12 total bookings       |
+-------------------------+
| [All] [Pending] [Conf.] |
| [Done] [Cancelled]      |
+-------------------------+
|                         |
| 🟡 PENDING              |
| Req #BR-2025-0847       |
|                         |
| Fast Food Delivery      |
| $29.99 • Your: $26.99   |
|                         |
| 👤 John Smith           |
| john.smith@email.com    |
|                         |
| 📅 Jan 15, 2:00 PM      |
| 📍 123 Main St, Apt 4B  |
|                         |
| 📝 "Call when arriving. |
| Gate code: 1234"        |
|                         |
| ⏰ 2 hours ago          |
|                         |
| [Confirm] [Decline]     |
| [Contact Customer]      |
+-------------------------+
|                         |
| ✅ CONFIRMED            |
| Req #BR-2025-0843       |
|                         |
| Document Courier        |
| $19.99 • Your: $17.99   |
|                         |
| 👤 Sarah Johnson        |
| sarah.j@example.com     |
|                         |
| 📅 Jan 14, 10:00 AM     |
| 📍 Downtown → Midtown   |
|                         |
| ✓ Ready for service     |
|                         |
| [Start] [Complete]      |
| [Contact]               |
+-------------------------+
| [Load More...]          |
+-------------------------+
```

## Key Elements

### Advanced Status Filtering
- **Status Tabs**: All, Pending, Confirmed, Completed, Cancelled with counts
- **Dropdown Filter**: Alternative compact filter selector
- **Real-time Counts**: Dynamic badge counts for each status
- **Filter Persistence**: Remember selected filter across sessions

### Comprehensive Booking Cards
- **Status Header**: Color-coded status with booking reference number
- **Service Information**: Service title, category, and pricing breakdown
- **Customer Details**: Full name, email, and communication history
- **Service Details**: Date, time, location, and special requirements
- **Revenue Information**: Service fee, platform fee, and operator revenue
- **Timeline**: Request time, confirmation time, and service completion

### Status Management System
- **Status Dropdown**: Current status with change options
- **Action Buttons**: Context-sensitive actions based on status
- **Batch Operations**: Select multiple bookings for bulk status updates
- **Status History**: Track all status changes with timestamps

### Customer Information Display
- **Profile Integration**: Customer name linked to profile (if available)
- **Contact Information**: Email address with direct contact option
- **Communication History**: Previous interactions and messages
- **Customer Rating**: Display customer rating and review history

## Advanced Features

### Smart Status Workflow
- **Pending**: Confirm, Decline, or Request More Info
- **Confirmed**: Start Service, Reschedule, or Cancel
- **In Progress**: Update Status, Complete Service, or Report Issues
- **Completed**: Request Review, Report Issues, or Archive
- **Cancelled**: View Reason, Rebook, or Archive

### Revenue Analytics Integration
- **Fee Breakdown**: Service fee, platform fee (10%), operator revenue (90%)
- **Revenue Tracking**: Track earnings per booking and service category
- **Performance Metrics**: Acceptance rate, completion rate, customer satisfaction
- **Financial Reporting**: Export revenue data for accounting

### Customer Communication
- **Direct Email**: Integrated email communication through platform
- **Message Templates**: Pre-written responses for common scenarios
- **Status Notifications**: Automatic customer notifications on status changes
- **Communication Log**: Full history of all customer interactions

## Status Management Workflow

### Pending Bookings
- **Review Request**: Examine all booking details and requirements
- **Check Availability**: Verify schedule availability for requested time
- **Confirm**: Accept booking and notify customer
- **Decline**: Reject booking with optional reason
- **Request Info**: Ask customer for clarification or additional details

### Confirmed Bookings
- **Pre-Service**: Prepare for service, check equipment, plan route
- **Start Service**: Mark service as in progress
- **Service Updates**: Provide real-time updates to customer
- **Complete Service**: Mark service as completed
- **Post-Service**: Request customer review and handle any issues

### Advanced Status Options
```typescript
const statusOptions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled', 'completed'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};
```

## Interactions

### Status Management
- **Status Dropdown**: Change booking status with confirmation
- **Quick Actions**: One-click actions for common status changes
- **Bulk Selection**: Checkbox selection for bulk status updates
- **Status Confirmation**: Confirmation dialog for irreversible changes

### Customer Communication
- **Contact Button**: Direct email or message customer
- **Phone Integration**: Click-to-call customer phone number (if available)
- **Message Templates**: Quick-select common messages
- **Communication History**: View all previous interactions

### Booking Actions
- **View Details**: Expand card to see all booking information
- **Edit Service**: Modify service details (time, location, requirements)
- **Generate Invoice**: Create formal invoice for completed services
- **Report Issues**: Report problems or disputes

## States

### Loading States
```
+-------------------------+
| Loading bookings...     |
| ████████░░░░ 75%       |
|                         |
| [Skeleton cards...]     |
+-------------------------+
```

### Empty States by Filter
```
+-------------------------+
| 📅 No pending bookings  |
|                         |
| All caught up! Check    |
| confirmed bookings for  |
| upcoming services.      |
|                         |
| [View All Bookings]     |
+-------------------------+
```

### Status Update States
```
+-------------------------+
| Updating booking...     |
| ⟳ Processing request    |
|                         |
| [Confirming status...] |
+-------------------------+
```

## Data Management

### Booking Request Structure
```typescript
interface BookingRequest {
  id: string;
  consumer_id: string;
  listing_id: string;
  preferred_date: string | null;
  preferred_time: string | null;
  requirements: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  listings: {
    title: string;
    category: string;
    price: number;
  };
  profiles: {
    full_name: string;
  } | null;
}
```

### Status Change Implementation
```typescript
const updateBookingStatus = async (bookingId: string, newStatus: string) => {
  setUpdatingBookings(prev => new Set(prev).add(bookingId));

  try {
    const { error } = await supabase
      .from('booking_requests')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) throw error;

    // Send notification email
    await supabase.functions.invoke('send-status-notification', {
      body: { bookingId, newStatus }
    });

    // Update local state and show success message
    await fetchBookings();
    toast({ title: "Booking updated successfully" });
  } catch (error) {
    // Handle error and revert state
  } finally {
    setUpdatingBookings(prev => {
      const updated = new Set(prev);
      updated.delete(bookingId);
      return updated;
    });
  }
};
```

## Mobile Optimizations

### Touch-Friendly Interface
- **Large Touch Targets**: Easy-to-tap buttons and status selectors
- **Swipe Actions**: Swipe booking cards for quick actions
- **Bottom Sheet**: Action menus slide up from bottom
- **Pull to Refresh**: Refresh booking data with pull gesture

### Performance Features
- **Virtual Scrolling**: Efficient rendering of large booking lists
- **Progressive Loading**: Load additional bookings as needed
- **Optimistic Updates**: Immediate UI feedback for status changes
- **Offline Caching**: Cache booking data for offline viewing

## Accessibility Features

### Screen Reader Support
- **Status Announcements**: Booking status changes announced
- **Booking Information**: Complete booking details readable
- **Action Context**: Clear descriptions for all action buttons
- **Navigation Aids**: Logical heading structure and landmarks

### Keyboard Navigation
- **Tab Order**: Logical tab progression through bookings and actions
- **Status Changes**: Keyboard-accessible status dropdown
- **Quick Actions**: Keyboard shortcuts for common actions
- **Focus Management**: Clear focus indicators and focus retention

## Technical Implementation

### Component Architecture
- **OperatorBookings.tsx**: Main component with comprehensive state management
- **Booking Card**: Reusable card component for booking display
- **Status Manager**: Dedicated component for status change logic
- **Customer Profile**: Integrated customer information display

### Real-time Features
- **Supabase Subscriptions**: Real-time booking updates
- **Status Notifications**: Live status changes from other sources
- **Customer Messages**: Real-time customer communication
- **Booking Conflicts**: Live conflict detection and resolution

### Integration Points
- **Email Service**: Resend API for customer communications
- **Revenue Tracking**: Integration with analytics dashboard
- **Customer Profiles**: Link to customer management system
- **Calendar Integration**: Sync with operator's calendar system

## Error Handling

### Status Update Errors
- **Network Issues**: Retry failed status updates automatically
- **Conflict Resolution**: Handle concurrent status changes gracefully
- **Rollback Support**: Revert UI changes if server update fails
- **User Feedback**: Clear error messages with suggested actions

### Communication Errors
- **Email Failures**: Handle email delivery failures gracefully
- **Notification Issues**: Backup notification methods
- **Customer Unreachable**: Track communication attempts
- **Template Errors**: Fallback to basic notifications

This implementation provides a comprehensive booking management system that matches the sophisticated OperatorBookings.tsx component with advanced features like real-time status updates, integrated customer communication, and professional revenue tracking.