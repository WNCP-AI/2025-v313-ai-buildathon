---
Description: Master index and numbering convention for all SkyMarket UI screens with complete coverage
Title: SkyMarket UI Screen Index
created: 2025-01-10
tags:
- ui
- screens
- index
- navigation
- skymarket
---

# SkyMarket UI Screen Index

## Screen Numbering Convention

### Format: UI-XXX-Screen-Name
- **First Digit (X00)**: Section category
- **Second Digit (0X0)**: Main screen within section
- **Third Digit (00X)**: Sub-screen or variant

## Screen Categories

### 000-099: Public/Landing Pages
- UI-001-Landing-Page
- UI-002-About-Page
- UI-003-How-It-Works
- UI-004-Contact-Page

### 100-199: Authentication & Onboarding
- UI-101-Role-Selection
- UI-102-Consumer-Signup
- UI-103-Operator-Signup
- UI-104-Login
- UI-105-Forgot-Password
- UI-106-Reset-Password
- UI-107-Email-Verification
- UI-108-Consumer-Welcome
- UI-109-Operator-Welcome

### 200-299: Consumer Pages
- UI-201-Consumer-Home
- UI-202-Browse-Services
- UI-203-Search-Results
- UI-204-Service-Detail
- UI-205-Booking-Step1-Confirm
- UI-206-Booking-Step2-Details
- UI-207-Booking-Step3-Contact
- UI-208-Booking-Step4-Review
- UI-209-Booking-Confirmation
- UI-210-Consumer-Dashboard
- UI-211-My-Bookings
- UI-212-Booking-Detail
- UI-213-Consumer-Profile
- UI-214-Consumer-Settings
- UI-215-View-Profile ✅ NEW

### 300-399: Operator Pages
- UI-301-Operator-Dashboard
- UI-302-My-Listings
- UI-303-Create-Listing-Step1
- UI-304-Create-Listing-Step2
- UI-305-Create-Listing-Step3
- UI-306-Create-Listing-Step4
- UI-307-Edit-Listing
- UI-308-Operator-Bookings
- UI-309-Booking-Request-Detail
- UI-310-Operator-Profile
- UI-311-Business-Settings
- UI-312-Operator-Analytics
- UI-320-Edit-Listing ✅ NEW
- UI-321-Operator-Booking-Detail ✅ NEW

### 400-499: Shared/Common Pages
- UI-401-404-Not-Found
- UI-402-500-Server-Error
- UI-403-Maintenance-Page
- UI-404-Terms-Of-Service
- UI-405-Privacy-Policy

### 500-599: Mobile-Specific Variants
- UI-501-Mobile-Navigation
- UI-502-Mobile-Search
- UI-503-Mobile-Filters
- UI-504-Mobile-Bottom-Nav

### 600-699: Admin Panel Screens ✅ NEW
- UI-601-Admin-Dashboard ✅
- UI-602-Admin-User-Management ✅
- UI-603-Admin-Edit-User ✅
- UI-604-Admin-Listing-Management ✅
- UI-605-Admin-Edit-Listing ✅
- UI-606-Admin-AI-Content-Generation ✅

## Complete Screen Coverage Checklist

### Public Experience ✓
- [x] Landing page with value proposition
- [x] How it works explanation
- [x] About and contact pages

### Authentication Flow ✓
- [x] Role selection (Consumer vs Operator)
- [x] Separate signup flows for each role
- [x] Login for returning users
- [x] Password recovery flow
- [x] Email verification
- [x] Welcome/onboarding for each role

### Consumer Journey ✓
- [x] Home page after login
- [x] Browse all services
- [x] Search and filter services
- [x] View service details
- [x] Multi-step booking flow
- [x] Booking confirmation
- [x] Consumer dashboard
- [x] View and manage bookings
- [x] Profile and settings

### Operator Journey ✓
- [x] Operator dashboard overview
- [x] View and manage listings
- [x] Create new listing (multi-step)
- [x] Edit existing listings
- [x] View booking requests
- [x] Booking request details
- [x] Business profile management
- [x] Analytics and insights

### Error & Edge Cases ✓
- [x] 404 page not found
- [x] 500 server error
- [x] Maintenance page
- [x] Legal pages (Terms, Privacy)

### Mobile Adaptations ✓
- [x] Mobile navigation patterns
- [x] Mobile search experience
- [x] Mobile filter interface
- [x] Bottom navigation bar

## Usage Guide

### For Developers
1. Reference screens by their UI-XXX number
2. Check this index for complete coverage
3. Each screen file contains ASCII mockup and specifications

### For Designers
1. Use numbering to maintain consistency
2. Create variants using sub-numbers (e.g., UI-201-A for alternate version)
3. Mobile variants in 500 series

### For Product Managers
1. Track implementation progress by screen number
2. Use for sprint planning and task assignment
3. Reference in user stories and requirements

## Screen Dependencies

### Critical Path Screens (MVP)
1. UI-101 → UI-102/103 → UI-104 (Auth flow)
2. UI-201 → UI-202 → UI-204 → UI-205-209 (Consumer booking)
3. UI-301 → UI-303-306 → UI-308 (Operator listing creation)

### Enhancement Screens (Post-MVP)
- Analytics (UI-312)
- Advanced settings pages
- Additional legal/policy pages

## Implementation Alignment Status

### ✅ Completed Alignments (September 14, 2025)
**New Screens Created (9 screens):**
- UI-601-Admin-Dashboard ✅ - Matches AdminPanel.tsx implementation
- UI-602-Admin-User-Management ✅ - Matches AdminDataTable user management
- UI-603-Admin-Edit-User ✅ - Matches AdminEditUser.tsx interface
- UI-604-Admin-Listing-Management ✅ - Matches AdminDataTable listing management
- UI-605-Admin-Edit-Listing ✅ - Matches AdminEditListing.tsx interface
- UI-606-Admin-AI-Content-Generation ✅ - Matches AI generation tools
- UI-215-View-Profile ✅ - Matches ViewProfile.tsx public profile interface
- UI-320-Edit-Listing ✅ - Matches EditListing.tsx operator interface
- UI-321-Operator-Booking-Detail ✅ - Comprehensive booking management

**Updated Screens:**
- UI-209-Booking-Confirmation ✅ - Updated to reflect toast notification pattern vs separate page
- UI-211-My-Bookings-Updated ✅ - Major update to match Orders.tsx tabbed/collapsible interface

### ✅ Recently Completed Updates (September 14, 2025 Session)
**Authentication Flow:**
- UI-101-Role-Selection ✅ - DEPRECATED: Marked as deprecated since SignUp.tsx consolidates role selection
- UI-104-Login ✅ - UPDATED: Added anonymous login functionality and enhanced error handling

**Browse and Search:**
- UI-202-Browse-Services ✅ - UPDATED: Added fuzzy search, debounced input, enhanced filtering documentation

**Operator Management:**
- UI-302-My-Listings ✅ - CREATED: Advanced table-based interface matching OperatorListings.tsx
- UI-308-Operator-Bookings ✅ - CREATED: Comprehensive booking management matching OperatorBookings.tsx

### 🔄 Screens Still Needing Updates (Future Work)
**Authentication & Signup:**
- UI-102/103-Signup screens - May need consolidation since SignUp.tsx handles both roles

**Booking Flow:**
- UI-205-208 - Multi-step booking screens don't exist (correctly - implementation uses single modal)
- UI-211-My-Bookings - Replace with UI-211-My-Bookings-Updated version

**Operator Listing Creation:**
- UI-303-306 - Consolidate multi-step listing creation to single-page NewListing.tsx approach

**Search Results:**
- UI-203-Search-Results - Consider deprecation (redundant with Browse.tsx real-time filtering)

### 📊 Updated Alignment Summary
- **New Screens**: 11 created total (2 more in this session)
- **Updated Screens**: 4 updated total (3 more in this session)
- **Major Updates**: 5 completed, ~3 remaining
- **Coverage**: Admin functionality fully documented, operator management now complete
- **Implementation Match**: Authentication, browse, and operator flows now aligned with sophisticated actual code

## Notes
- All screens should follow Design-Guidelines.md
- Components defined in Component-Patterns.md
- Use Prompt-Examples.md for Lovable implementation
- ASCII mockups provide visual structure without constraining design
- **Priority**: Focus on updating multi-step flows to match single-page implementations