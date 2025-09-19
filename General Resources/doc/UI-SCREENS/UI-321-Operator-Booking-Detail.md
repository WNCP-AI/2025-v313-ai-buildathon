---
Description: Detailed booking management interface for operators with customer communication, status updates, and service coordination
Title: UI-321 Operator Booking Detail
created: 2025-09-14
tags:
- ui
- screen
- operator
- booking-detail
- customer-communication
- service-management
- skymarket
---

# UI-321: Operator Booking Detail

## Screen Purpose
Comprehensive booking detail interface for operators to manage individual booking requests, communicate with customers, update service status, and coordinate service delivery.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [← Back to Bookings]  Booking Details #SM-2025-0847            |
+------------------------------------------------------------------+
|                                                                  |
| Status: 🟡 Pending Confirmation          [Confirm] [Counter-Offer]|
| Received: 2 hours ago • Response Due: 22 hours remaining        |
|                                                                  |
| +------------------------+ +------------------------------------+ |
| | Customer Information   | | Service Details                    | |
| |------------------------| |------------------------------------| |
| |                        | |                                    | |
| | [JD] John Doe          | | Service: Fast Food Delivery       | |
| | ⭐ 4.9 Customer Rating | | Category: Food Delivery 🍕         | |
| | 📞 (555) 987-6543      | | Base Price: $29.99                 | |
| | 📧 john@email.com      | |                                    | |
| | 📍 Downtown Detroit    | | Requested Date: Jan 15, 2025       | |
| |                        | | Requested Time: 2:00 PM            | |
| | Customer Since: Jan 10 | | Duration: ~30-45 minutes           | |
| | Completed Bookings: 7  | | Service Area: Downtown             | |
| | Average Rating: 4.9★   | |                                    | |
| | Payment Method: ✓ Card | | Delivery Address:                  | |
| |                        | | 123 Main St, Apt 4B               | |
| | [Call Customer]        | | Detroit, MI 48226                  | |
| | [Send Message]         | | (Validated ✓)                      | |
| |                        | |                                    | |
| +------------------------+ | Special Instructions:              | |
|                            | "Please call when arriving.        | |
| Booking Timeline           | Gate code is 1234. Deliver to     | |
| +------------------------+ | 4th floor apartment. No alcohol   | |
| | ⏰ 2 hours ago         | | orders please."                   | |
| | 📝 Booking received    | |                                    | |
| |                        | | Estimated Earnings: $29.99        | |
| | 🔄 Now                 | | Platform Fee: $2.99               | |
| | ⏳ Awaiting response   | | Your Net: $27.00                  | |
| |                        | |                                    | |
| | ⏱️ 22 hours remaining  | +------------------------------------+ |
| | 📋 Response due        | |                                    | |
| |                        | | Quick Actions                      | |
| +------------------------+ | [✓ Accept Booking]                 | |
|                            | [📝 Counter-Offer]                 | |
| Communication History      | [❌ Decline]                       | |
| +------------------------+ | [📞 Call Customer]                 | |
| | No messages yet        | | [💬 Send Message]                  | |
| | Start the conversation | | [📧 Email Update]                  | |
| | with your customer     | |                                    | |
| |                        | +------------------------------------+ |
| | [Send First Message]   | |                                    | |
| +------------------------+ |                                    | |
|                            |                                    | |
+------------------------------------------------------------------+
|                                                                  |
| Response Options                                                 |
| +--------------------------------------------------------------+ |
| | [●] Accept as Requested                                      | |
| | [○] Accept with Modifications:                               | |
| |     Suggested Date: [Jan 15 ▼] Time: [3:00 PM ▼]          | |
| |     Price Adjustment: $[29.99] Reason: [Standard Rate___]   | |
| |                                                              | |
| | [○] Decline Booking:                                         | |
| |     Reason: [Not Available ▼] [Schedule Conflict] [Other]   | |
| |     Message: [I'm not available at that time, but I can   ] | |
| |              [offer service on Jan 16 at 2 PM instead.    ] | |
| |                                                              | |
| | Response Message (Optional):                                 | |
| | [Hi John! Thanks for choosing our service. I can confirm  ] | |
| | [your food delivery for Jan 15 at 2 PM. I'll call you    ] | |
| | [15 minutes before arrival. Looking forward to serving    ] | |
| | [you! - Detroit Drones Team                               ] | |
| |                                                              | |
| | [Cancel]                                    [Send Response] | |
| +--------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ← Booking #0847         |
+-------------------------+
| 🟡 Pending • 2h ago     |
| Response Due: 22h left  |
| [Confirm] [Counter]     |
+-------------------------+
|                         |
| Customer Info           |
+-------------------------+
| [JD] John Doe           |
| ⭐ 4.9 • 7 bookings     |
| 📞 (555) 987-6543       |
| 📧 john@email.com       |
| 📍 Downtown Detroit     |
| Since: Jan 10           |
|                         |
| [Call] [Message]        |
+-------------------------+
|                         |
| Service Details         |
+-------------------------+
| Fast Food Delivery 🍕   |
| $29.99 base price       |
|                         |
| Date: Jan 15, 2025      |
| Time: 2:00 PM           |
| Duration: ~30-45 min    |
|                         |
| Address:                |
| 123 Main St, Apt 4B     |
| Detroit, MI 48226       |
|                         |
| Instructions:           |
| "Please call when       |
| arriving. Gate code     |
| 1234. 4th floor apt."   |
+-------------------------+
|                         |
| Earnings                |
| Service: $29.99         |
| Fee: -$2.99             |
| Net: $27.00             |
+-------------------------+
|                         |
| Timeline                |
| ⏰ 2h ago - Received    |
| 🔄 Now - Awaiting       |
| ⏱️ 22h left - Due       |
+-------------------------+
|                         |
| Quick Actions           |
+-------------------------+
| [✓ Accept as Requested] |
| [📝 Counter-Offer]      |
| [❌ Decline Booking]    |
| [📞 Call Customer]      |
| [💬 Send Message]       |
+-------------------------+
|                         |
| Response Message        |
| [Hi John! Thanks for    |
|  choosing our service...] |
|                         |
| [Cancel] [Send Response]|
+-------------------------+
```

## Key Elements

### Header Section
- **Navigation**: Back to bookings list
- **Booking ID**: Unique booking reference number
- **Status Indicator**: Visual status with color coding
- **Response Timer**: Time remaining to respond
- **Quick Actions**: Primary action buttons for immediate response

### Customer Information Card
- **Customer Profile**: Avatar, name, and rating
- **Contact Details**: Phone and email with click-to-contact
- **Customer History**: Booking count, average rating, member since
- **Location**: Customer's general area
- **Payment Verification**: Confirmed payment method
- **Communication Tools**: Call and message buttons

### Service Details Card
- **Service Information**: Name, category, and base price
- **Schedule Details**: Requested date, time, and duration
- **Location Information**: Full delivery/service address
- **Special Instructions**: Customer requirements and notes
- **Address Validation**: Confirmed deliverable location
- **Earnings Breakdown**: Service fee, platform fee, net earnings

### Booking Timeline
- **Event History**: Chronological booking events
- **Current Status**: Present state and next steps
- **Time Remaining**: Countdown to response deadline
- **Milestone Tracking**: Key booking milestones

### Communication History
- **Message Thread**: All customer-operator communication
- **Message Timestamps**: When messages were sent/received
- **Read Status**: Message read confirmation
- **Quick Reply**: Common response templates
- **Attachment Support**: Photo and document sharing

### Response Options Panel
- **Accept as Requested**: Confirm booking with current details
- **Accept with Modifications**: Counter-offer with changes
- **Decline Booking**: Reject with reason and alternative
- **Custom Message**: Personalized response to customer
- **Schedule Alternatives**: Suggest different times/dates

## Interactions

### Booking Response Flow
1. **Review Details**: Examine all booking information
2. **Check Availability**: Verify schedule compatibility
3. **Select Response**: Choose accept, modify, or decline
4. **Add Message**: Include personal communication
5. **Send Response**: Confirm and notify customer
6. **Track Follow-up**: Monitor customer response

### Customer Communication
1. **Message Composition**: Write message to customer
2. **Template Selection**: Use pre-written response templates
3. **Attachment Options**: Add photos or documents
4. **Delivery Confirmation**: Verify message sent successfully
5. **Response Tracking**: Monitor customer replies

### Status Management
1. **Status Updates**: Change booking status as needed
2. **Timeline Updates**: Add milestones to booking timeline
3. **Customer Notification**: Automatic notifications for status changes
4. **Internal Notes**: Private notes for operator reference

## States

### Pending Confirmation State
```
+-------------------------+
| 🟡 Pending Confirmation |
| Received 2 hours ago    |
| Response due: 22h left  |
|                         |
| [Accept] [Counter] [Decline]|
+-------------------------+
```

### Confirmed State
```
+-------------------------+
| ✅ Confirmed Booking    |
| Scheduled: Jan 15, 2PM  |
| Customer notified       |
|                         |
| [Message] [Reschedule]  |
+-------------------------+
```

### In Progress State
```
+-------------------------+
| 🚀 Service In Progress  |
| Started: 2:15 PM        |
| ETA: 2:45 PM           |
|                         |
| [Update Status] [Call]  |
+-------------------------+
```

### Completed State
```
+-------------------------+
| ✅ Service Completed    |
| Finished: 2:40 PM       |
| Awaiting customer review|
|                         |
| [View Review] [Book Again]|
+-------------------------+
```

## Response Options

### Accept as Requested
- **Confirmation**: Accept all booking details as provided
- **Auto-Response**: Send confirmation message to customer
- **Calendar Integration**: Add to operator's calendar
- **Preparation**: Begin service preparation workflow
- **Customer Notification**: Immediate booking confirmation

### Accept with Modifications
- **Time Adjustment**: Suggest different time or date
- **Price Adjustment**: Modify pricing based on requirements
- **Service Modification**: Adjust service scope or terms
- **Reason Explanation**: Explain modification rationale
- **Customer Approval**: Wait for customer to accept changes

### Decline Booking
- **Reason Selection**: Choose from predefined decline reasons
- **Alternative Suggestions**: Offer different times or services
- **Professional Message**: Maintain positive relationship
- **Future Availability**: Suggest when services might be available
- **Referral Option**: Recommend other operators if appropriate

## Communication Features

### Message Templates
- **Confirmation Messages**: Standard acceptance responses
- **Modification Requests**: Professional counter-offer language
- **Status Updates**: Service progress communications
- **Completion Messages**: Service completion confirmations
- **Follow-up Messages**: Post-service customer care

### Real-time Communication
- **Instant Messaging**: Real-time chat with customers
- **Read Receipts**: Know when customer reads messages
- **Typing Indicators**: Show when customer is responding
- **Push Notifications**: Alert for new messages
- **Message History**: Complete communication record

### Professional Communication Tools
- **Auto-Responses**: Automatic replies for common situations
- **Scheduled Messages**: Send messages at specific times
- **Message Templates**: Library of professional responses
- **Tone Suggestions**: AI-powered communication tone advice
- **Grammar Check**: Ensure professional communication quality

## Customer Information Display

### Customer Profile
- **Verified Information**: Confirmed customer details
- **Booking History**: Previous services with operator
- **Payment Status**: Verified payment methods
- **Communication Preferences**: Preferred contact methods
- **Special Notes**: Important customer considerations

### Customer Reliability Indicators
- **Response Rate**: How quickly customer responds
- **Cancellation Rate**: Historical cancellation frequency
- **Payment History**: On-time payment record
- **Review Pattern**: Typical review scores given
- **Communication Style**: Professional interaction history

### Risk Assessment
- **New Customer**: Flag for first-time customers
- **High-Risk Indicators**: Unusual requests or payment issues
- **Preferred Customer**: Mark loyal, reliable customers
- **Special Handling**: Customers requiring extra attention
- **VIP Status**: High-value or frequent customers

## Service Coordination

### Pre-Service Preparation
- **Service Checklist**: Required preparation tasks
- **Equipment Check**: Verify necessary equipment availability
- **Route Planning**: Optimal path to service location
- **Weather Considerations**: Service-affecting weather conditions
- **Backup Plans**: Alternative arrangements if needed

### Service Execution
- **Status Updates**: Regular progress updates to customer
- **Issue Reporting**: Handle service complications
- **Time Management**: Track service duration and efficiency
- **Quality Assurance**: Ensure service meets standards
- **Documentation**: Photo/video evidence of service completion

### Post-Service Follow-up
- **Completion Confirmation**: Mark service as completed
- **Customer Satisfaction**: Check customer satisfaction
- **Issue Resolution**: Address any service concerns
- **Review Management**: Encourage positive reviews
- **Future Booking**: Suggest additional services

## Mobile Optimizations

### Touch Interface
- **Large Action Buttons**: Easy thumb access for primary actions
- **Swipe Gestures**: Swipe between booking details sections
- **Pull to Refresh**: Update booking information
- **Long Press**: Quick access to communication options
- **Haptic Feedback**: Tactile confirmation for important actions

### Communication Optimizations
- **Voice Messages**: Quick voice message recording
- **Photo Sharing**: Easy camera integration for updates
- **Quick Replies**: One-tap common responses
- **Call Integration**: Direct phone call from booking details
- **SMS Fallback**: SMS option when app messaging unavailable

## Accessibility Features

### Screen Reader Support
- **Booking Details**: Full screen reader compatibility
- **Status Updates**: Announced status changes
- **Customer Information**: Accessible customer data presentation
- **Action Buttons**: Clear button descriptions and purposes
- **Timeline**: Accessible timeline navigation

### Visual Accessibility
- **High Contrast**: Clear visual distinction between elements
- **Large Text**: Support for user font size preferences
- **Status Colors**: Color-blind friendly status indicators
- **Focus States**: Clear keyboard navigation focus
- **Icon Labels**: Text alternatives for all icons

## Performance Considerations

### Real-time Updates
- **Live Status**: Real-time booking status updates
- **Message Sync**: Instant message synchronization
- **Notification System**: Immediate push notifications
- **Offline Support**: Basic functionality when offline
- **Background Sync**: Update data when app regains connectivity

### Data Efficiency
- **Selective Loading**: Load only necessary booking details
- **Image Optimization**: Compressed customer and service images
- **Cache Strategy**: Cache frequently accessed booking data
- **Network Efficiency**: Minimize data usage on mobile
- **Battery Optimization**: Efficient background processes

## Security and Privacy

### Customer Data Protection
- **Data Encryption**: Secure customer information storage
- **Access Control**: Limit access to booking information
- **Privacy Compliance**: GDPR and privacy law compliance
- **Data Retention**: Appropriate data retention policies
- **Audit Trail**: Log access to sensitive customer information

### Communication Security
- **Message Encryption**: Secure operator-customer communications
- **Phone Number Protection**: Mask phone numbers when appropriate
- **Email Privacy**: Secure email communication channels
- **File Sharing Security**: Safe attachment and photo sharing
- **Identity Verification**: Confirm customer identity for high-value services

## Integration Points

### Platform Services
- **Booking Database**: Real-time booking data synchronization
- **Customer Database**: Complete customer profile information
- **Communication System**: Integrated messaging and notification
- **Payment Processing**: Secure payment verification and processing
- **Analytics**: Track booking response patterns and success rates

### External Services
- **Calendar Integration**: Sync with operator's personal calendar
- **Navigation**: Maps and routing for service location
- **Weather Services**: Weather data for service planning
- **Communication**: Phone and SMS integration
- **Document Management**: Service completion documentation

## Implementation Notes

### Technical Stack
- **Component**: Dedicated BookingDetail component with comprehensive state management
- **Real-time**: Supabase subscriptions for live booking updates
- **Communication**: Integration with messaging and notification systems
- **Data Management**: Efficient caching and synchronization strategies

### State Management
- **Booking State**: Complete booking lifecycle management
- **Communication State**: Message thread and notification handling
- **UI State**: Form interactions, modal states, loading indicators
- **Sync State**: Online/offline status and data synchronization

### Performance Optimization
- **Component Memoization**: Prevent unnecessary re-renders
- **Data Fetching**: Optimized queries for booking and customer data
- **Image Loading**: Progressive loading for customer and service images
- **Background Processing**: Efficient handling of real-time updates