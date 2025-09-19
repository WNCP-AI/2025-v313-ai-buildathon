---
Description: Operator listing editing interface with form validation, image upload, and service management capabilities
Title: UI-320 Edit Listing
created: 2025-09-14
tags:
- ui
- screen
- operator
- listing-editing
- form-management
- service-editing
- skymarket
---

# UI-320: Edit Listing

## Screen Purpose
Comprehensive listing editing interface for operators to modify existing service listings, update pricing, manage images, and maintain service information with full validation.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [← Back to My Listings]  Edit Service Listing                   |
+------------------------------------------------------------------+
|                                                                  |
| Editing: "Fast Food Delivery" • Created Jan 8, 2025  [Save Changes]|
| Status: ✅ Active • Views: 1,247 • Bookings: 23                  |
|                                                                  |
| +--------------------------------------------------------------+ |
| | Service Information                                          | |
| |--------------------------------------------------------------| |
| |                                                              | |
| | Service Title *                                              | |
| | [Fast Drone Food Delivery________________________]          | |
| | ✓ Clear, descriptive title (89 characters remaining)        | |
| |                                                              | |
| | Service Category *                                           | |
| | [Food Delivery ▼] [Courier & Parcel] [Aerial] [Mapping]    | |
| |                                                              | |
| | Service Description *                                        | |
| | [Get your favorite restaurant food delivered by drone in   ] | |
| | [under 30 minutes. We partner with local restaurants to   ] | |
| | [provide fast, contactless delivery across downtown       ] | |
| | [Detroit. Professional pilots ensure safe delivery.       ] | |
| | [___________________________________________________]       | |
| | Character count: 245/500 ✓                                  | |
| |                                                              | |
| | Service Area *                                               | |
| | [Downtown, Midtown, Corktown, Riverfront_____________]      | |
| | 165 characters remaining                                     | |
| |                                                              | |
| | Base Price *                                                 | |
| | $ [29.99] per [Delivery ▼] [Per Hour] [Per Project]        | |
| | ✓ Competitive pricing in your area                          | |
| |                                                              | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | Service Image                                    [Upload]    | |
| |--------------------------------------------------------------| |
| |                                                              | |
| | Current Image:                                               | |
| | +------------------------+                                   | |
| | | [Drone Delivery Photo] |  Image Details:                  | |
| | |                        |  • Size: 1.2MB                   | |
| | |   Click to preview     |  • Format: JPEG                  | |
| | |   or change image      |  • Resolution: 1920x1080        | |
| | |                        |  • Uploaded: Jan 8, 2025        | |
| | +------------------------+                                   | |
| |                                                              | |
| | Image URL (Alternative):                                     | |
| | [https://images.skymarket.com/drone-food-delivery.jpg____] | |
| |                                                              | |
| | [Browse Files] [Take Photo] [Remove Image] [Use Default]    | |
| | Recommended: 1920x1080 or higher, under 5MB, JPG/PNG       | |
| |                                                              | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | Service Status & Visibility                                  | |
| |--------------------------------------------------------------| |
| |                                                              | |
| | Listing Status:                                              | |
| | [●] Active - Visible to customers                           | |
| | [○] Inactive - Hidden from search                           | |
| | [○] Draft - Save changes without publishing                 | |
| |                                                              | |
| | Availability:                                                | |
| | [☑] Available now      [☑] Bookable in advance             | |
| | [☐] Seasonal service   [☐] By appointment only             | |
| |                                                              | |
| | Listing Performance:                                         | |
| | Views this month: 1,247    Bookings: 23    Conversion: 1.8%| |
| | Average rating: 4.8/5      Total reviews: 127              | |
| | Last booking: 2 hours ago  Response rate: 98%              | |
| |                                                              | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | Advanced Options                                    [Expand] | |
| |--------------------------------------------------------------| |
| |                                                              | |
| | SEO & Discovery:                                             | |
| | Keywords: [drone, food, delivery, fast, detroit___________] | |
| | Search tags help customers find your service                 | |
| |                                                              | |
| | Booking Settings:                                            | |
| | Advance booking: [1] to [30] days                           | |
| | Minimum notice: [2] hours before service                   | |
| | Auto-accept bookings: [☑] Under $50  [☐] All bookings     | |
| |                                                              | |
| | Special Instructions:                                        | |
| | [Please provide clear landing area and phone number for   ] | |
| | [delivery confirmation. Food pickup requires restaurant    ] | |
| | [coordination 15 minutes before delivery time.            ] | |
| |                                                              | |
| +--------------------------------------------------------------+ |
|                                                                  |
| [Cancel Changes]  [Save as Draft]  [Preview]  [Save & Publish] |
|                                                                  |
| ⚠️ Unsaved changes will be lost. Auto-save: Last saved 2 min ago |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ← Edit Listing          |
+-------------------------+
| Fast Food Delivery      |
| Created Jan 8 • Active  |
| Views: 1,247 • 23 books |
| [Save]                  |
+-------------------------+
|                         |
| Service Info            |
+-------------------------+
| Title *                 |
| [Fast Drone Food        |
|  Delivery_____________] |
| 89 chars remaining      |
|                         |
| Category * [Food ▼]     |
|                         |
| Description *           |
| [Get your favorite      |
|  restaurant food        |
|  delivered by drone...] |
| 245/500 chars           |
|                         |
| Service Area *          |
| [Downtown, Midtown...   |
|  ____________________] |
| 165 chars remaining     |
|                         |
| Price * $[29.99] per    |
| [Delivery ▼]            |
| ✓ Competitive pricing   |
+-------------------------+
|                         |
| Service Image           |
+-------------------------+
| Current Image:          |
| [📷 Drone Photo]        |
| 1.2MB • JPEG • 1920x1080|
| Jan 8, 2025             |
|                         |
| [Change] [Remove]       |
| [Take Photo] [Gallery]  |
+-------------------------+
|                         |
| Status & Visibility     |
+-------------------------+
| [●] Active              |
| [○] Inactive            |
| [○] Draft               |
|                         |
| Availability:           |
| ☑ Available now         |
| ☑ Bookable in advance   |
| ☐ Seasonal service      |
|                         |
| Performance:            |
| 1,247 views • 23 books  |
| 4.8★ (127 reviews)      |
| 98% response rate       |
+-------------------------+
|                         |
| Advanced [Expand ▼]     |
+-------------------------+
| Keywords:               |
| [drone, food, delivery  |
|  fast, detroit________] |
|                         |
| Booking Settings:       |
| Advance: 1-30 days      |
| Notice: 2 hours min     |
| Auto-accept: ☑ <$50     |
+-------------------------+
| [Cancel] [Draft] [Save] |
|                         |
| ⚠️ Unsaved changes      |
| Auto-save: 2 min ago    |
+-------------------------+
```

## Key Elements

### Header Section
- **Navigation**: Back to listings management
- **Listing Title**: Current service name being edited
- **Creation Info**: When listing was created and current status
- **Performance Metrics**: Views, bookings, conversion rate
- **Save Action**: Primary save changes button

### Service Information Card
- **Title Field**: Service name with character count
- **Category Selection**: Dropdown for service categorization
- **Description Area**: Large textarea with character counter
- **Service Area**: Geographic coverage text input
- **Pricing**: Price input with unit selector (per delivery/hour/project)

### Image Management Card
- **Current Image**: Preview of existing service image
- **Image Details**: File size, format, resolution, upload date
- **Upload Options**: File browser, camera, URL input
- **Image Actions**: Change, remove, or use default options
- **Recommendations**: Size and format guidelines

### Status and Visibility Controls
- **Listing Status**: Active, inactive, or draft modes
- **Availability Options**: Now, advance booking, seasonal, appointment
- **Performance Display**: Views, bookings, ratings, response metrics
- **Analytics Integration**: Conversion rates and engagement data

### Advanced Options (Expandable)
- **SEO Keywords**: Search optimization tags
- **Booking Settings**: Advance booking window, minimum notice
- **Auto-Accept**: Automatic booking approval settings
- **Special Instructions**: Custom instructions for customers

## Interactions

### Form Validation
- **Real-time Validation**: Live feedback as user types
- **Character Counting**: Visual indicators for field limits
- **Required Field Indicators**: Clear marking of mandatory fields
- **Error Highlighting**: Red borders and messages for invalid inputs
- **Success Indicators**: Green checkmarks for valid inputs

### Auto-Save System
- **Periodic Saving**: Automatic draft saves every 2 minutes
- **Change Detection**: Track modifications to prevent data loss
- **Save Status**: Visual indicator of last save time
- **Unsaved Warning**: Alert user before leaving with unsaved changes
- **Draft Recovery**: Restore from auto-saved draft if needed

### Image Upload Process
1. **Selection Method**: Choose from file browser, camera, or URL
2. **Upload Progress**: Visual progress bar during upload
3. **Image Preview**: Immediate preview of selected image
4. **Validation Check**: Size, format, and quality validation
5. **Storage Confirmation**: Successful upload confirmation

### Save and Publish Flow
1. **Validation Check**: Ensure all required fields are complete
2. **Status Selection**: Choose active, inactive, or draft status
3. **Preview Option**: Preview how listing will appear to customers
4. **Confirmation Dialog**: Summary of changes before saving
5. **Success Feedback**: Confirmation and redirect options

## States

### Loading States
```
+-------------------------+
| Loading listing data... |
| ████████░░░░ 75%       |
|                         |
| [Skeleton form...]      |
+-------------------------+
```

### Validation States
```
+-------------------------+
| Title *                 |
| [Fast Drone Food Deli...] |
| ✓ Good title length     |
|                         |
| Price *                 |
| $[abc___]               |
| ❌ Must be valid number |
+-------------------------+
```

### Image Upload States
```
+-------------------------+
| Uploading image...      |
| ████████░░ 80%         |
|                         |
| Processing: 1.2MB       |
| [Cancel Upload]         |
+-------------------------+
```

### Save States
```
+-------------------------+
| Saving changes...       |
| [████████░░] 80%       |
|                         |
| Updating service info   |
| Publishing listing      |
+-------------------------+
```

## Form Validation

### Field-Level Validation
- **Title**: 1-100 characters, descriptive content required
- **Description**: 10-500 characters, informative content
- **Category**: Must select from valid service categories
- **Price**: Positive number, reasonable market range
- **Service Area**: 1-200 characters, specific location info

### Business Logic Validation
- **Pricing Reasonableness**: Compare against similar services
- **Content Quality**: Basic grammar and spelling checks
- **Image Requirements**: Appropriate resolution and file size
- **Availability Logic**: Consistent availability options
- **Category Matching**: Ensure description matches category

### Real-time Feedback
- **Character Counters**: Show remaining characters for text fields
- **Validation Icons**: Green checkmarks or red X marks
- **Inline Messages**: Contextual help and error messages
- **Progress Indicators**: Show completion status of form
- **Smart Suggestions**: Recommend improvements or corrections

## Image Management

### Upload Methods
- **File Browser**: Traditional file selection dialog
- **Camera Capture**: Direct camera integration for mobile
- **URL Input**: Paste image URL from external source
- **Drag & Drop**: Desktop drag-and-drop functionality (future)

### Image Processing
- **Automatic Resizing**: Optimize images for web display
- **Format Conversion**: Convert to web-optimized formats
- **Compression**: Reduce file size while maintaining quality
- **Thumbnail Generation**: Create multiple sizes for different uses

### Image Validation
- **File Size Limits**: Maximum 5MB per image
- **Format Support**: JPEG, PNG, WebP formats accepted
- **Resolution Requirements**: Minimum 800x600, recommended 1920x1080
- **Content Filtering**: Basic inappropriate content detection

## Performance Analytics Integration

### Metrics Display
- **View Analytics**: Track listing views over time
- **Booking Conversion**: Views to bookings conversion rate
- **Search Performance**: Position in search results
- **User Engagement**: Time spent viewing listing details

### Performance Insights
- **Optimization Suggestions**: Recommend improvements based on data
- **Competitor Comparison**: Compare against similar services
- **Seasonal Trends**: Identify peak and off-peak periods
- **Customer Feedback**: Integrate review data for insights

## Advanced Features

### SEO Optimization
- **Keyword Suggestions**: Recommend relevant search terms
- **Title Optimization**: Suggest title improvements for search
- **Description Enhancement**: Improve search visibility
- **Tag Management**: Organize and manage service tags

### Booking Management
- **Availability Windows**: Set booking lead times
- **Auto-Accept Rules**: Automate booking approvals
- **Pricing Rules**: Dynamic pricing based on demand
- **Special Conditions**: Custom booking requirements

### Content Enhancement
- **AI Suggestions**: AI-powered content improvements (future)
- **Template Library**: Pre-built service descriptions
- **Best Practices**: Inline tips for better listings
- **Quality Scoring**: Rate listing completeness and quality

## Mobile Optimizations

### Touch Interface
- **Large Touch Targets**: 44px minimum button size
- **Touch Gestures**: Swipe, pinch, and tap optimizations
- **Keyboard Handling**: Smart keyboard for different input types
- **Haptic Feedback**: Tactile confirmation for actions

### Layout Adaptations
- **Collapsible Sections**: Accordion-style form organization
- **Bottom Sheet**: Modal interfaces for complex selections
- **Floating Actions**: Sticky save button during editing
- **Progressive Disclosure**: Show details progressively

## Accessibility Features

### Form Accessibility
- **Label Association**: Proper form label relationships
- **Error Announcements**: Screen reader friendly error messages
- **Focus Management**: Logical tab order through form
- **Keyboard Navigation**: Complete keyboard accessibility

### Visual Accessibility
- **High Contrast**: Clear visual distinctions between elements
- **Font Scaling**: Support for user font size preferences
- **Color Independence**: Don't rely solely on color for information
- **Focus Indicators**: Clear visual focus states

## Security Features

### Data Validation
- **Input Sanitization**: Clean all user input before processing
- **XSS Prevention**: Prevent cross-site scripting attacks
- **SQL Injection Protection**: Parameterized queries only
- **File Upload Security**: Validate uploaded files thoroughly

### Access Control
- **Owner Verification**: Ensure user owns the listing being edited
- **Session Validation**: Verify active and valid user session
- **Permission Checks**: Confirm editing permissions
- **Audit Logging**: Log all editing activities

## Error Handling

### Form Errors
- **Field Validation**: Individual field error messages
- **Form Summary**: Overall form validation status
- **Network Errors**: Handle connectivity issues gracefully
- **Server Errors**: User-friendly server error messages

### Recovery Options
- **Auto-save Recovery**: Restore from auto-saved drafts
- **Manual Save**: Allow manual save at any time
- **Error Retry**: Retry failed operations with exponential backoff
- **Offline Support**: Limited offline editing capability (future)

## Integration Points

### Platform Services
- **Image Storage**: Supabase Storage for image management
- **Database**: Real-time updates to listings table
- **Search Index**: Update search data when listing changes
- **Analytics**: Track editing patterns and success rates

### External Services
- **Image Processing**: Optimization and thumbnail generation
- **Content Analysis**: Quality assessment and suggestions
- **Geolocation**: Service area validation and suggestions
- **Market Data**: Pricing comparison and recommendations

## Implementation Notes

### Technical Stack
- **Component**: EditListing.tsx with comprehensive form management
- **Form Library**: React Hook Form with Zod schema validation
- **File Upload**: ImageUpload component with progress tracking
- **State Management**: Local state with auto-save capability

### Performance Considerations
- **Form Optimization**: Debounced validation to prevent excessive API calls
- **Image Handling**: Progressive image loading and caching
- **Auto-save Efficiency**: Intelligent change detection for minimal saves
- **Mobile Performance**: Optimized rendering for mobile devices

### Data Management
- **Change Tracking**: Monitor form modifications for auto-save
- **Conflict Resolution**: Handle concurrent editing scenarios
- **Version Control**: Basic versioning for major changes
- **Backup Strategy**: Automatic backup before significant modifications