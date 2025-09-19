---
Description: Login screen for returning users to access their SkyMarket account with anonymous login option
Title: UI-104 Login (Updated)
created: 2025-01-10
tags:
- ui
- screen
- auth
- login
- anonymous-login
- skymarket
---

# UI-104: Login (Updated Implementation)

## Screen Purpose
Allow returning users to securely access their SkyMarket account, with anonymous guest access and clear paths for password recovery and new user registration.

## Implementation Notes
**Enhanced Features**: The actual Login.tsx implementation includes anonymous/guest login functionality, allowing users to browse services without creating an account, and improved error handling with toast notifications.

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
|  [← Back]  SkyMarket                                            |
+------------------------------------------------------------------+
|                                                                  |
|                                                                  |
|                                                                  |
|                    Welcome Back to SkyMarket                    |
|                                                                  |
|                  Sign in to your account                        |
|                                                                  |
|                +---------------------------+                    |
|                |                           |                    |
|                | Email Address             |                    |
|                | [____________________]    |                    |
|                |                           |                    |
|                | Password                  |                    |
|                | [____________________] 👁️ |                    |
|                |                           |                    |
|                | ☐ Remember me             |                    |
|                |                           |                    |
|                |     [Sign In →]           |                    |
|                |                           |                    |
|                |  [Continue as guest]      |                    |
|                |                           |                    |
|                | Forgot your password?     |                    |
|                |                           |                    |
|                +---------------------------+                    |
|                                                                  |
|                                                                  |
|                 New to SkyMarket?                               |
|                 [Create an Account]                             |
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
|  Welcome Back           |
|                         |
| Sign in to your account |
|                         |
+-------------------------+
|                         |
| Email Address           |
| [_________________]     |
|                         |
| Password                |
| [_________________] 👁️  |
|                         |
| ☐ Remember me           |
|                         |
| [Sign In →]             |
|                         |
| [Continue as guest]     |
|                         |
| Forgot password?        |
|                         |
+-------------------------+
|                         |
| New to SkyMarket?       |
|                         |
| [Create Account]        |
|                         |
+-------------------------+
```

## Key Elements

### Header
- Back arrow to previous page
- SkyMarket branding

### Main Form Container
- Centered card/container
- Clear white background
- Subtle shadow for depth

### Form Fields
- **Email Address**
  - Type: email
  - Required field
  - Email validation
  - Autocomplete enabled

- **Password**
  - Type: password
  - Required field
  - Show/hide toggle (eye icon)
  - Autocomplete current-password

### Form Options
- Remember me checkbox
- Forgot password link

### Primary Action
- Sign In button (#BD1B04)
- Full width within form
- Loading state on submit

### Secondary Actions
- Create account link for new users
- Prominent but secondary styling

## Interactions

### Email Field
- Focus: Border highlight
- Blur: Validate email format
- Error: Red border and message

### Password Field
- Focus: Border highlight
- Show/hide toggle functionality
- Enter key submits form

### Remember Me
- Checkbox toggles
- Saves preference locally

### Sign In Button
- Hover: Darker shade
- Click: Loading spinner
- Success: Redirect based on role
- Error: Show error message with toast notification

### Continue as Guest
- Alternative login method for anonymous users
- No account creation required
- Click: Anonymous authentication via Supabase
- Success: Redirect to browse page with limited functionality
- Loading: "Please wait..." spinner state
- Error: Toast notification with retry option

### Forgot Password
- Click: Navigate to UI-105 (placeholder - not implemented)

### Create Account
- Click: Navigate to signup page (actual: /signup, consolidated form)

## States

### Loading
```
+---------------------------+
|                           |
|    [Signing in... ⟳]      |
|                           |
+---------------------------+
```

### Error
```
+---------------------------+
| ⚠️ Invalid email or password |
| Please try again.          |
|                           |
| Email Address             |
| [user@email.com______] !  |
|                           |
| Password                  |
| [____________________] !  |
|                           |
+---------------------------+
```

### Success
- Redirect to appropriate dashboard:
  - Consumers → UI-201 (Consumer Home)
  - Operators → UI-301 (Operator Dashboard)

## Validation

### Client-Side
- Email format validation
- Required field validation
- Minimum password length

### Server-Side
- Authenticate with Supabase
- Rate limiting
- Account lock after attempts

## Error Messages
- "Please enter your email address"
- "Please enter your password"
- "Invalid email or password"
- "Account locked. Please reset password"
- "Network error. Please try again"

## Mobile Adaptations
- Full-width form fields
- Larger touch targets (48px min)
- Native keyboard types
- Auto-zoom prevention
- Simplified layout

## Accessibility
- Label elements for all inputs
- Error messages announced
- Keyboard navigation support
- Focus management
- High contrast mode support

## Security Considerations
- No username enumeration
- Generic error messages
- HTTPS only
- Rate limiting
- Session management
- CSRF protection

## Implementation Notes
- Use Supabase Auth
- Store role in user metadata
- Redirect based on user role
- Handle deep links properly
- Clear sensitive data on logout

## Navigation Flow
- Success → Role-based redirect
- Forgot → UI-105 (Forgot Password)
- Sign Up → UI-101 (Role Selection)
- Back → Previous page or UI-001