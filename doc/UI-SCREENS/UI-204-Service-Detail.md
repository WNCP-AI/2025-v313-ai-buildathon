---
Description: Service detail page showing full information about a specific drone or delivery service
Title: UI-204 Service Detail
created: 2025-01-10
tags:
- ui
- screen
- consumer
- service
- detail
- skymarket
---

# UI-204: Service Detail

## Screen Purpose
Detailed view of a specific service with all information needed for consumers to make a booking decision.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [SkyMarket Logo]  [Search____________] 🔍   👤 John D. [Menu ▼] |
+------------------------------------------------------------------+
| Home > Browse Services > Food Delivery                          |
+------------------------------------------------------------------+
|                                                                  |
| [← Back to Services]                                            |
|                                                                  |
| +------------------------+  +----------------------------------+ |
| |                        |  | Fast Drone Food Delivery         | |
| |     [Drone Image       |  | by Detroit Drones LLC            | |
| |      Placeholder]      |  |                                  | |
| |                        |  | ⭐ 4.8 (127 reviews)             | |
| |                        |  | 🍕 Food Delivery                 | |
| |                        |  | ✓ Verified Operator              | |
| |                        |  |                                  | |
| +------------------------+  | $29.99 per delivery              | |
| |                        |  |                                  | |
| | Operator Info:         |  | Service Description:             | |
| | Detroit Drones LLC     |  | Get your favorite restaurant    | |
| | Member since: Jan 2024 |  | food delivered by drone in      | |
| | Completed: 500+ jobs   |  | under 30 minutes. We partner    | |
| | Response time: < 1hr   |  | with local restaurants to       | |
| |                        |  | provide fast, contactless       | |
| | Certifications:        |  | delivery across downtown        | |
| | • FAA Part 107         |  | Detroit.                        | |
| | • Detroit Permit       |  |                                  | |
| | • $1M Insurance        |  | What's Included:                | |
| |                        |  | ✓ Restaurant pickup              | |
| +------------------------+  | ✓ Drone delivery to address     | |
|                            | ✓ Real-time tracking             | |
| Service Area:              | ✓ Insulated food containers      | |
| Downtown, Midtown,         |                                  | |
| Corktown, Riverfront      | What's Not Included:             | |
|                            | ✗ Food cost (paid separately)   | |
| Available:                 | ✗ Delivery outside service area | |
| Mon-Sun: 11am-10pm        | ✗ Alcohol delivery               | |
|                            |                                  | |
|                            | Requirements:                    | |
|                            | • Clear landing area             | |
|                            | • Phone for notifications        | |
|                            |                                  | |
|                            +----------------------------------+ |
|                                                                  |
|                            [Book This Service →]                 |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ← Browse Services       |
+-------------------------+
|                         |
| [Drone Image            |
|  Placeholder]           |
|                         |
+-------------------------+
| Fast Drone Food         |
| Delivery                |
| by Detroit Drones LLC   |
|                         |
| ⭐ 4.8 (127 reviews)    |
| 🍕 Food Delivery        |
| ✓ Verified              |
|                         |
| $29.99                  |
| per delivery            |
|                         |
+-------------------------+
|                         |
| About This Service      |
|                         |
| Get restaurant food     |
| delivered by drone in   |
| under 30 minutes.       |
| Fast, contactless       |
| delivery in downtown.   |
|                         |
| What's Included:        |
| ✓ Restaurant pickup     |
| ✓ Drone delivery        |
| ✓ Real-time tracking    |
| ✓ Insulated containers  |
|                         |
| Not Included:           |
| ✗ Food cost             |
| ✗ Outside service area  |
|                         |
+-------------------------+
|                         |
| Operator Info           |
|                         |
| Detroit Drones LLC      |
| Member since: Jan 2024  |
| 500+ completed          |
| < 1hr response          |
|                         |
| Certifications:         |
| • FAA Part 107          |
| • Detroit Permit        |
| • $1M Insurance         |
|                         |
+-------------------------+
|                         |
| Service Area            |
| Downtown, Midtown,      |
| Corktown, Riverfront    |
|                         |
| Hours: 11am-10pm Daily  |
|                         |
+-------------------------+
|                         |
| [Book This Service →]   |
|                         |
+-------------------------+
```

## Key Elements

### Navigation
- Breadcrumb trail
- Back to services link
- Standard header

### Service Header
- Service title (prominent)
- Operator name
- Rating and reviews
- Category badge
- Verification badge
- Price (very prominent)

### Main Content Area

#### Left Column (Desktop)
- Service image/placeholder
- Operator information box
- Certifications list
- Service area
- Availability hours

#### Right Column (Desktop)
- Service description
- What's included list
- What's not included list
- Requirements
- Book service button

### Mobile Layout
- Stacked single column
- Image at top
- Key info immediately visible
- Collapsible sections
- Sticky booking button

## Content Sections

### Service Description
- 2-3 paragraphs
- Clear value proposition
- Key differentiators
- Service process

### Operator Information
- Company/operator name
- Member since date
- Jobs completed count
- Average response time
- Verification status

### Certifications
- FAA Part 107 (if applicable)
- Business licenses
- Insurance coverage
- Local permits

### Service Details
- **Included**: Checkmarked list
- **Not Included**: X-marked list
- **Requirements**: Bullet list
- **Restrictions**: If any

### Service Coverage
- Areas served (text)
- Operating hours
- Availability status

## Interactions

### Book Service Button
- Primary action (#BD1B04)
- Click → UI-205 (Booking Step 1)
- Sticky on mobile scroll

### Back Link
- Returns to UI-202
- Maintains filter state

### Image Gallery (Future)
- Click to expand
- Swipe through images
- Lightbox view

### Share Service (Future)
- Copy link
- Social sharing

## States

### Loading
```
+-------------------------+
| Loading service...      |
| [Spinner]               |
+-------------------------+
```

### Unavailable
```
+-------------------------+
| This service is         |
| currently unavailable   |
|                         |
| [Browse Other Services] |
+-------------------------+
```

### Booking Disabled
```
[Book Service 🔒]
"Login to book"
```

## Trust Elements
- Verification badges
- Member since date
- Completed jobs count
- Response time
- Certifications
- Insurance coverage
- Reviews/rating

## Mobile Adaptations
- Full-width image
- Collapsible sections
- Sticky CTA button
- Simplified operator info
- Swipeable image gallery
- Bottom sheet for details

## Accessibility
- Image alt text
- Semantic headings
- List markup for features
- High contrast text
- Focus management
- Screen reader descriptions

## Implementation Notes
- Fetch single listing from Supabase
- Check user authentication for booking
- Track view analytics
- Cache service data
- Preload booking flow

## Navigation Flow
- Back → UI-202 (Browse Services)
- Book → UI-205 (Booking Step 1)
- Login → UI-104 (if not authenticated)
- Share → Native share menu

## SEO Considerations
- Unique page title
- Meta description
- Structured data markup
- Social media tags
- Canonical URL