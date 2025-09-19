---
Description: DEPRECATED - Role selection now integrated into single signup form (SignUp.tsx) with radio button selection
Title: UI-101 Role Selection (DEPRECATED)
created: 2025-01-10
tags:
- ui
- screen
- auth
- onboarding
- skymarket
- deprecated
---

# UI-101: Role Selection (DEPRECATED)

## ⚠️ IMPLEMENTATION NOTE
**This screen is DEPRECATED in the actual implementation.** The actual SignUp.tsx component combines role selection with account creation on a single page using radio buttons, providing a more streamlined user experience.

**Actual Implementation**: Users select their role (Consumer/Operator) directly on the signup form via radio buttons, then complete registration in one step.

## Original Screen Purpose
Critical decision point where new users choose their account type, determining their entire experience on the platform.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
|  [← Back]  SkyMarket                                            |
+------------------------------------------------------------------+
|                                                                  |
|                                                                  |
|                                                                  |
|                   Welcome to SkyMarket!                         |
|                                                                  |
|              How do you want to use our platform?               |
|                                                                  |
|                                                                  |
|     +------------------------+  +------------------------+      |
|     |                        |  |                        |      |
|     |         👤             |  |         🚁             |      |
|     |                        |  |                        |      |
|     |     I'm a Consumer     |  |    I'm an Operator     |      |
|     |                        |  |                        |      |
|     | • Book drone services  |  | • Offer my services    |      |
|     | • Track deliveries     |  | • Manage bookings      |      |
|     | • Browse operators     |  | • Grow my business     |      |
|     |                        |  |                        |      |
|     |   [Continue →]         |  |   [Continue →]         |      |
|     |                        |  |                        |      |
|     +------------------------+  +------------------------+      |
|                                                                  |
|                                                                  |
|            You can always add another role later                |
|                                                                  |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ← SkyMarket             |
+-------------------------+
|                         |
|                         |
|  Welcome to SkyMarket!  |
|                         |
| How do you want to use  |
|    our platform?        |
|                         |
+-------------------------+
|                         |
| +---------------------+ |
| |        👤           | |
| |                     | |
| |   I'm a Consumer    | |
| |                     | |
| | • Book services     | |
| | • Track deliveries  | |
| | • Browse operators  | |
| |                     | |
| |  [Continue →]       | |
| +---------------------+ |
|                         |
| +---------------------+ |
| |        🚁           | |
| |                     | |
| |  I'm an Operator    | |
| |                     | |
| | • Offer services    | |
| | • Manage bookings   | |
| | • Grow business     | |
| +---------------------+ |
|                         |
| You can add another     |
| role later              |
|                         |
+-------------------------+
```

## Key Elements

### Header
- Back arrow to return to landing
- SkyMarket branding

### Main Content
- Welcome headline
- Clear question about role
- Two equal-weight cards

### Role Cards
- **Consumer Card**:
  - Person icon
  - "I'm a Consumer" title
  - 3 key benefits listed
  - Continue button

- **Operator Card**:
  - Drone/helicopter icon  
  - "I'm an Operator" title
  - 3 key benefits listed
  - Continue button

### Footer Note
- Reassurance about changing roles
- Reduces decision anxiety

## Interactions

### Card Selection
- Hover: Card lifts with shadow
- Click anywhere on card: Selects role
- Visual feedback on selection

### Continue Buttons
- Consumer → Navigate to UI-102 (Consumer Signup)
- Operator → Navigate to UI-103 (Operator Signup)
- Store role choice in session/state

### Back Button
- Returns to UI-001 (Landing Page)
- No data loss

## States

### Default
- Both cards equal visual weight
- No pre-selection

### Hover
- Card shadow increases
- Slight scale transform
- Cursor changes to pointer

### Selected
- Border color changes to #BD1B04
- Background subtle tint
- Continue button becomes primary

## Mobile Adaptations
- Cards stack vertically
- Full-width cards
- Larger touch targets
- Simplified benefit points
- Bottom padding for thumb reach

## Accessibility
- Cards are keyboard navigable
- Clear focus indicators
- Screen reader announces role options
- Semantic heading structure
- Color not sole indicator

## Error Handling
- If navigation fails, show inline error
- Maintain selected state
- Allow retry

## Implementation Notes
- Store role in auth metadata
- This choice affects entire UX
- Consider A/B testing card order
- Track selection metrics
- No authentication required yet

## User Psychology
- Equal visual weight prevents bias
- Benefits help users identify
- "Add role later" reduces commitment fear
- Icons provide quick recognition
- Clear, simple language

## Next Steps
- Consumer selection → UI-102
- Operator selection → UI-103
- Back → UI-001