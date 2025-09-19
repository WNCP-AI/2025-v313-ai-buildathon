---
Description: Create listing step 1 - Basic service information for operators adding new services
Title: UI-303 Create Listing Step 1
created: 2025-01-10
tags:
- ui
- screen
- operator
- listing
- create
- skymarket
---

# UI-303: Create Listing Step 1 - Basic Information

## Screen Purpose
First step in the listing creation flow where operators define their service's basic information.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [SkyMarket Logo]                    👤 Detroit Drones [Menu ▼]  |
+------------------------------------------------------------------+
| Dashboard > My Listings > Create New Listing                    |
+------------------------------------------------------------------+
|                                                                  |
| Create New Service Listing                                      |
|                                                                  |
| Step 1 of 4: Basic Information                                  |
| [●--------]  25% Complete                                        |
|                                                                  |
| +--------------------------------------------------------------+ |
| |                                                              | |
| | Service Title *                                              | |
| | [________________________________________________]           | |
| | Give your service a clear, descriptive name                 | |
| | Example: "Fast Downtown Food Delivery by Drone"             | |
| |                                                              | |
| | Service Category *                                           | |
| | [Select a category...                               ▼]      | |
| | • Food Delivery                                              | |
| | • Courier/Parcel                                             | |
| | • Aerial Imaging                                             | |
| | • Site Mapping                                               | |
| |                                                              | |
| | Service Description *                                        | |
| | [                                                      ]     | |
| | [                                                      ]     | |
| | [                                                      ]     | |
| | [                                                      ]     | |
| | [____________________________________________________]     | |
| | Describe what you offer, how it works, and why customers    | |
| | should choose your service (500 characters max)             | |
| | 0/500 characters                                             | |
| |                                                              | |
| | Keywords/Tags (Optional)                                     | |
| | [________________________________________________]           | |
| | Add keywords to help customers find your service             | |
| | Example: "fast delivery, downtown, restaurant, drone"       | |
| |                                                              | |
| +--------------------------------------------------------------+ |
|                                                                  |
| [Cancel]                    [Save Draft]    [Next: Pricing →]   |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ← Cancel    Step 1 of 4 |
+-------------------------+
| Create New Service      |
|                         |
| [●--------] 25%         |
+-------------------------+
|                         |
| Service Title *         |
| [_________________]     |
| Clear, descriptive name |
|                         |
| Category *              |
| [Select...        ▼]    |
|                         |
| Description *           |
| [                   ]   |
| [                   ]   |
| [                   ]   |
| [_________________]     |
| What you offer & why    |
| 0/500                   |
|                         |
| Keywords (Optional)     |
| [_________________]     |
| Help users find you     |
|                         |
+-------------------------+
|                         |
| [Save Draft]            |
|                         |
| [Next: Pricing →]       |
|                         |
+-------------------------+
```

## Key Elements

### Progress Indicator
- Step counter (1 of 4)
- Progress bar
- Percentage complete

### Form Fields

#### Service Title (Required)
- Text input
- Max 100 characters
- Helper text with example
- Clear, searchable title

#### Service Category (Required)
- Dropdown select
- 4 predefined options:
  - Food Delivery
  - Courier/Parcel
  - Aerial Imaging
  - Site Mapping
- Single selection only

#### Service Description (Required)
- Textarea
- 500 character limit
- Character counter
- Helper text
- Rich text (basic)

#### Keywords/Tags (Optional)
- Text input
- Comma-separated
- Auto-suggest common tags
- Help with SEO

### Action Buttons
- Cancel (return to dashboard)
- Save Draft (save progress)
- Next (proceed to step 2)

## Form Validation

### Title Validation
- Required field
- Min 10 characters
- Max 100 characters
- No special characters

### Category Validation
- Required selection
- Must be from list

### Description Validation
- Required field
- Min 50 characters
- Max 500 characters
- Basic profanity filter

### Keywords Validation
- Optional
- Max 10 keywords
- Alphanumeric only

## Interactions

### Field Focus
- Border highlight
- Helper text appears
- Previous value retained

### Category Dropdown
- Click: Show options
- Select: Close dropdown
- Visual feedback

### Character Counter
- Live update as typing
- Color change near limit:
  - Green: 0-400
  - Yellow: 401-450
  - Red: 451-500

### Save Draft
- Save to local state
- Show success toast
- Enable auto-save

### Next Button
- Validate all required fields
- Show errors if invalid
- Proceed to UI-304 if valid

### Cancel
- Confirmation dialog if unsaved changes
- Return to UI-301 or UI-302

## Error States

### Field Errors
```
Service Title *
[_________________] ❌
⚠️ Title must be at least 10 characters
```

### Missing Required
```
[Next: Pricing →] (disabled)
"Please complete all required fields"
```

## Success States

### Draft Saved
```
✓ Draft saved successfully
Auto-saving enabled
```

### Validation Passed
- Green checkmarks on valid fields
- Next button enabled

## Mobile Adaptations
- Single column layout
- Larger touch targets
- Native select for category
- Sticky action buttons
- Simplified progress bar

## Auto-Save Logic
- Save after 5 seconds of inactivity
- Save on blur of any field
- Indicate save status
- Restore on return

## Accessibility
- Required fields marked with *
- ARIA labels for all inputs
- Error messages associated with fields
- Keyboard navigation
- Screen reader announcements

## Implementation Notes
- Store draft in localStorage
- Validate on blur and submit
- Sanitize HTML in description
- Track abandonment rate
- Support back button

## Navigation Flow
- Cancel → UI-301/302 (with confirmation)
- Save Draft → Stay on page
- Next → UI-304 (Step 2: Pricing)
- Back browser → Restore draft

## Tips Display
Consider showing tips:
- "Good titles include location"
- "Be specific about your service"
- "Keywords help customers find you"