

# UI-601: Admin Dashboard

## Screen Purpose
Central command center for SkyMarket administrators to monitor platform health, generate AI content, and perform bulk data operations.

## Access Control
- **Access Level**: WNCP.ai email domain only (@wncp.ai)
- **Fallback**: Access Denied screen for unauthorized users
- **Authentication**: Verified through SimpleAuthContext

## ASCII Mockup

### Desktop View
```
+------------------------------------------------------------------+
| [SkyMarket Logo]                       👤 Admin [Menu ▼]        |
+------------------------------------------------------------------+
| Admin Panel                                [Database Health ✓]  |
| Manage platform data and generate AI content  [Test Email 📧]  |
+------------------------------------------------------------------+
|                                                                  |
| AI Content Generation                                           |
| +------------------+ +------------------+ +------------------+  |
| | Generate Images  | | Generate Listings| | Generate Users   |  |
| | 📷              | | 📝               | | 👥               |  |
| | Create AI images | | AI-powered       | | Create realistic |  |
| | for listings or  | | service listings | | user profiles    |  |
| | profiles missing | | with descriptions| | with bios        |  |
| | visuals          | |                  |                  |  |
| |                  | | Count: [5___]    | | Count: [10__]    |  |
| | Count: [3___]    | | Model: [GPT-4o▼] | | Model: [GPT-4o▼] |  |
| | Type: [Listing▼] | | Guidance:        | | Role: [Consumer] |  |
| | Guidance:        | | [Create varied   | | Guidance:        |  |
| | [Professional    | |  drone services  | | [Realistic users |  |
| |  drone photos]   | |  for Detroit]    | |  from Detroit]   |  |
| |                  | |                  | |                  |  |
| | [Generate →]     | | [Generate →]     | | [Generate →]     |  |
| +------------------+ +------------------+ +------------------+  |
|                                                                  |
| Platform Data Management                                        |
| +--------------------------------------------------------------+ |
| | Users Management                               [Bulk Delete]  | |
| |--------------------------------------------------------------| |
| | ☐ Select All    | Name               | Role     | Created    | |
| |                 |                    |          |            | |
| | ☐ John Doe      | john@email.com     | Consumer | 2025-01-10 | |
| | ☐ Detroit Drones| operator@dd.com    | Operator | 2025-01-08 | |
| | ☐ Sarah Smith   | sarah@email.com    | Consumer | 2025-01-07 | |
| |                 |                    |          |            | |
| | [Load More...]                                [Edit] [Delete] | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------------------------------------------------+ |
| | Listings Management                            [Bulk Delete]  | |
| |--------------------------------------------------------------| |
| | ☐ Select All    | Title             | Operator  | Status    | |
| |                 |                   |           |           | |
| | ☐ Food Delivery | Fast Drone Delivery| Det. Drones| Active   | |
| | ☐ Site Mapping  | Construction Survey| Metro Maps | Active   | |
| | ☐ Photography   | Aerial Photos     | Sky Photo  | Inactive | |
| |                 |                   |           |           | |
| | [Load More...]                               [Edit] [Delete] | |
| +--------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile View
```
+-------------------------+
| ☰ Admin Panel     👤    |
+-------------------------+
| Platform Management     |
+-------------------------+
| AI Generation Tools     |
+-------------------------+
| [📷 Images]             |
| Count: [3] [Generate]   |
+-------------------------+
| [📝 Listings]           |
| Count: [5] [Generate]   |
+-------------------------+
| [👥 Users]              |
| Count: [10] [Generate]  |
+-------------------------+
| Data Management         |
+-------------------------+
| Users: 156 total        |
| [Manage Users →]        |
+-------------------------+
| Listings: 47 active     |
| [Manage Listings →]     |
+-------------------------+
| [Database Health ✓]     |
| [Test Email 📧]         |
+-------------------------+
```

## Key Elements

### Header Section
- **Admin Panel Title**: Clear identification of admin area
- **Action Buttons**: Database health check, test email functionality
- **Access Control**: Visual confirmation of admin status

### AI Generation Tools
- **Generate Images**:
  - Count selector (1-10)
  - Image type dropdown (Listing, Profile, Generic)
  - Style guidance text input
  - Model selection (GPT-4o, Claude-3)
  - Generate action button

- **Generate Listings**:
  - Count selector (1-20)
  - Service category guidance
  - AI model selection
  - Location and style parameters
  - Bulk generation capability

- **Generate Users**:
  - Count selector (1-50)
  - Role selection (Consumer/Operator)
  - Demographic guidance
  - Realistic profile generation

### Data Management Tables
- **Users Table**:
  - Bulk selection checkboxes
  - User details (name, email, role, created date)
  - Individual edit/delete actions
  - Bulk delete functionality

- **Listings Table**:
  - Service information display
  - Operator association
  - Status management (Active/Inactive)
  - Bulk operations support

## Interactions

### AI Generation Workflow
1. **Select Tool**: Choose Images, Listings, or Users
2. **Configure Parameters**: Set count, type, guidance
3. **Model Selection**: Choose AI model for generation
4. **Generate**: Execute with loading state
5. **Review Results**: Preview generated content
6. **Apply/Reject**: Bulk approve or individual review

### Bulk Operations
1. **Selection**: Individual checkboxes or "Select All"
2. **Action Choice**: Delete, Edit, or Status change
3. **Confirmation**: Safety dialog for destructive actions
4. **Execution**: Progress indication and results

### Database Health Check
- **Trigger**: Click "Database Health Check" button
- **Process**: Run integrity validation
- **Results**: Modal with detailed findings
- **Actions**: Suggested fixes and repair options

## States

### Loading States
```
+-------------------------+
| [Generating content...] |
| ████████░░░░ 75%       |
+-------------------------+
```

### Error States
```
+-------------------------+
| ⚠️ Generation Failed     |
| AI service unavailable |
| [Retry] [Cancel]       |
+-------------------------+
```

### Success States
```
+-------------------------+
| ✅ Generated 5 listings  |
| Ready for review       |
| [Preview] [Apply]      |
+-------------------------+
```
