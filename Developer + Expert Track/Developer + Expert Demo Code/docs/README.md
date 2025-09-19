# SkyMarket Documentation Hub

Comprehensive documentation for the SkyMarket drone service marketplace platform. This documentation provides everything needed to understand, develop, deploy, and maintain the SkyMarket application.

## 📋 Quick Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| [PRD.md](./PRD.md) | Product requirements and current implementation status | Product managers, stakeholders |
| [Architecture](./specs/architecture/ARCHITECTURE.md) | System design and technical decisions | Developers, architects |
| [Database Schema](./specs/architecture/DATABASE.md) | Complete database structure | Developers, DBAs |
| [API Documentation](./specs/api/API.md) | REST API endpoints and contracts | Frontend/backend developers |
| [Webhooks](./specs/webhooks/WEBHOOKS.md) | Stripe webhook handling and integration | Backend developers |
| [Payment Processing](./specs/payment/PAYMENT.md) | Stripe Connect and marketplace payments | Backend developers, finance |
| [AI Integration](./specs/ai/AI.md) | OpenAI integration and chat features | AI/ML developers |
| [Security](./specs/security/SECURITY.md) | Authentication, authorization, and compliance | Security engineers |
| [Business Logic](./specs/business-logic/BUSINESS-LOGIC.md) | Detroit-specific rules and workflows | Developers, product managers |
| [Deployment](./specs/deployment/DEPLOYMENT.md) | Infrastructure and deployment procedures | DevOps engineers |

## 🚀 Getting Started

### For New Developers
1. **Start here**: Read the [PRD.md](./PRD.md) for product overview and current implementation status
2. **Architecture**: Review [ARCHITECTURE.md](./specs/architecture/ARCHITECTURE.md) for system design
3. **Database**: Study [DATABASE.md](./specs/architecture/DATABASE.md) for data models and RLS policies
4. **APIs**: Reference [API.md](./specs/api/API.md) for the 8 implemented endpoints
5. **Payment Integration**: Study [PAYMENT.md](./specs/payment/PAYMENT.md) for Stripe Connect implementation
6. **AI Features**: Review [AI.md](./specs/ai/AI.md) for OpenAI chat integration

### For Backend Developers
1. **Payment Processing**: [PAYMENT.md](./specs/payment/PAYMENT.md) - Stripe Connect marketplace model
2. **Webhook Handling**: [WEBHOOKS.md](./specs/webhooks/WEBHOOKS.md) - Comprehensive Stripe webhook processing
3. **Business Rules**: [BUSINESS-LOGIC.md](./specs/business-logic/BUSINESS-LOGIC.md) - Detroit-specific constraints
4. **Security**: [SECURITY.md](./specs/security/SECURITY.md) - Authentication and compliance

### For Product Managers
1. **Current Status**: [PRD.md](./PRD.md) - Implementation progress and completed features
2. **Business Rules**: [BUSINESS-LOGIC.md](./specs/business-logic/BUSINESS-LOGIC.md) - 4 service categories and policies
3. **User Flows**: [PRD.md](./PRD.md#user-experience-design) - Complete booking and payment flows

### For DevOps Engineers
1. **Infrastructure**: [DEPLOYMENT.md](./specs/deployment/DEPLOYMENT.md) - Vercel hosting and CI/CD
2. **Security**: [SECURITY.md](./specs/security/SECURITY.md) - Security architecture and monitoring
3. **Database**: [DATABASE.md](./specs/architecture/DATABASE.md) - Migration and backup strategies

## 📚 Documentation Structure

### Product Documentation
- **[PRD.md](./PRD.md)**: Complete product requirements document with features, roadmap, and business goals
- **[Planning Guide](./specs/PLANNING-GUIDE.md)**: Documentation methodology and best practices

### Technical Specifications

#### Core Architecture
- **[System Architecture](./specs/architecture/ARCHITECTURE.md)**: High-level system design, component relationships, and technical decisions
- **[Database Schema](./specs/architecture/DATABASE.md)**: Complete data model with tables, relationships, indexes, and RLS policies

#### API & Integration
- **[API Documentation](./specs/api/API.md)**: 8 REST endpoints with request/response schemas and authentication
- **[Webhooks](./specs/webhooks/WEBHOOKS.md)**: Stripe webhook handling with 8 event types and comprehensive error handling
- **[Payment Processing](./specs/payment/PAYMENT.md)**: Stripe Connect marketplace implementation with escrow and 15% platform fee
- **[AI Integration](./specs/ai/AI.md)**: OpenAI GPT-4o-mini chat integration with fallback modes and future enhancement plans

#### Business & Compliance
- **[Business Logic](./specs/business-logic/BUSINESS-LOGIC.md)**: Detroit-specific rules, 4 service categories, booking lifecycle, and pricing models
- **[Security](./specs/security/SECURITY.md)**: Authentication, RLS policies, PCI compliance, and FAA Part 107 integration

#### Operations
- **[Deployment](./specs/deployment/DEPLOYMENT.md)**: Vercel hosting, environment management, CI/CD pipelines, and monitoring setup

## 🏗️ Architecture Overview

SkyMarket is built on a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
├─────────────────────────────────────────────────────────────┤
│ • React 19 Server Components                               │
│ • Tailwind CSS 4 + shadcn/ui                              │
│ • Real-time subscriptions                                  │
│ • AI-powered chat integration                              │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│ • Supabase (Database, Auth, Storage, Realtime)            │
│ • Stripe Connect (Payments, Escrow, Payouts)              │
│ • OpenAI (AI Chat, Embeddings)                            │
│ • Mapbox (Maps, Geocoding, Navigation)                    │
│ • Resend (Email notifications)                            │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure                           │
├─────────────────────────────────────────────────────────────┤
│ • Vercel (Hosting, Edge Functions, CDN)                   │
│ • PostgreSQL (Primary database)                           │
│ • Edge computing for geographic optimization              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Current Implementation Status (January 2025)

### ✅ COMPLETED MVP Features
- **Complete Database Schema**: 7 tables with comprehensive RLS policies and triggers
- **Authentication & Authorization**: Supabase Auth with role-based access and JWT middleware
- **Service Management**: Full CRUD for listings across 4 service categories
- **End-to-End Booking Flow**: Complete booking system with validation and status lifecycle
- **Payment Processing**: Stripe Connect marketplace with escrow and webhook handling
- **AI Customer Support**: OpenAI GPT-4o-mini chat integration with fallback modes
- **Geographic Constraints**: Detroit Metro area validation (25-mile radius)
- **Business Logic**: Comprehensive rules for all 4 service categories
- **Real-time Infrastructure**: Supabase Realtime subscriptions setup

### 🔧 8 Implemented API Endpoints
- `POST /api/chat` - AI customer support assistant
- `GET/POST /api/listings` - Service listing management
- `GET /api/listings/[id]` - Individual listing details
- `GET/POST /api/orders` - Booking creation and management
- `PATCH /api/orders/[id]` - Booking status updates
- `POST /api/orders/[id]/checkout` - Stripe Checkout Session creation
- `POST /api/orders/[id]/reset-intent` - Payment intent reset
- `POST /api/webhooks/stripe` - Comprehensive Stripe webhook handler

### 🔄 IN PROGRESS Features
- Two-sided rating and review system
- Provider verification dashboard
- Interactive maps with Mapbox integration
- Advanced search and filtering
- Automated email notifications

## 🎯 Core Features

### For Consumers ✅ IMPLEMENTED
- **Service Discovery**: Browse drone services across 4 categories (food_delivery, courier, aerial_imaging, site_mapping)
- **Transparent Pricing**: Dynamic pricing with platform fee calculation
- **Booking System**: Complete booking flow with 24-hour advance scheduling
- **Secure Payments**: Stripe Connect escrow with automatic webhook processing
- **AI Support**: GPT-4o-mini powered chat assistant

### For Providers ✅ CORE IMPLEMENTED
- **Service Listings**: Create and manage services with pricing and availability
- **Order Management**: Accept bookings and update status through lifecycle
- **Payment Processing**: Automatic payouts via Stripe Connect (15% platform fee)
- **Compliance Ready**: FAA Part 107 certification tracking structure
- **Geographic Validation**: Detroit Metro area service boundaries

### For Platform ✅ FOUNDATION COMPLETE
- **User Management**: Role-based access (Consumer, Provider, Admin)
- **Payment Orchestration**: Marketplace model with escrow and fee handling
- **Real-time Updates**: Status notifications via Supabase Realtime
- **Security**: Comprehensive RLS policies and authentication middleware

## 🌍 Service Categories

SkyMarket supports exactly four service categories:

1. **Food Delivery** (`food_delivery`)
   - Restaurant and grocery delivery
   - Temperature-controlled transport
   - 15-45 minute delivery windows

2. **Courier Services** (`courier`)
   - Document and package delivery
   - Same-day and express options
   - Signature confirmation available

3. **Aerial Imaging** (`aerial_imaging`)
   - Real estate photography
   - Event coverage
   - 4K video and high-resolution photos

4. **Site Mapping** (`site_mapping`)
   - Construction site surveys
   - 3D mapping and modeling
   - Professional surveyor oversight

## 🔒 Security & Compliance

SkyMarket implements enterprise-grade security:

- **Authentication**: Multi-factor authentication with JWT tokens
- **Authorization**: Role-based access control with RLS policies
- **Encryption**: End-to-end encryption for sensitive data
- **Compliance**: FAA Part 107, PCI DSS, SOC 2 Type II aligned
- **Privacy**: Privacy by design with minimal data collection

## 📱 Technology Stack

### Frontend
- **Next.js 15.5.2**: App Router with React 19 Server Components
- **TypeScript**: Strict mode for comprehensive type safety
- **Tailwind CSS 4**: Modern styling with CSS custom properties
- **shadcn/ui**: Accessible component library with Radix UI
- **Framer Motion**: Smooth animations and transitions

### Backend & Services
- **Supabase**: PostgreSQL database with real-time subscriptions and comprehensive RLS policies
- **Stripe Connect**: Marketplace payments with escrow and webhook processing
- **OpenAI**: GPT-4o-mini powered AI chat assistance
- **Mapbox**: Maps and location services (Detroit-focused)
- **Resend**: Transactional email service
- **Vercel**: Edge hosting and serverless functions

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Zod**: Runtime type validation
- **React Hook Form**: Form management with validation

## 🚀 Development Workflow

### Local Development
```bash
# Clone and setup
git clone <repository>
cd skymarket-subpabase
npm ci

# Environment setup
cp .env.example .env.local
# Configure environment variables

# Database setup
npx supabase start
npx supabase db reset

# Start development
npm run dev
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 📊 Performance Standards

- **Page Load**: < 3 seconds on 3G networks
- **API Response**: < 300ms average response time
- **Availability**: 99.9% uptime SLA
- **Mobile Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA compliance

## 📞 Support & Contributing

### Documentation Standards
- All code changes require documentation updates
- Use clear, descriptive language
- Include code examples where relevant
- Follow the established documentation structure

### Getting Help
- **Technical Issues**: Review relevant specification documents
- **Business Questions**: Consult business-logic.md and PRD.md
- **Security Concerns**: Reference security-compliance.md
- **Deployment Issues**: Check deployment.md

## 🗺️ Geographic Focus

SkyMarket is specifically designed for the **Detroit Metropolitan Area**:

- **Service Boundary**: 25-mile radius from downtown Detroit
- **Coordinates**: 42.3314°N, 83.0458°W (center point)
- **Restricted Areas**: FAA-compliant no-fly zones around airports
- **Service Zones**: Optimized for Detroit neighborhoods and suburbs

## 📈 Business Model

- **Revenue**: 15% transaction fee on completed services
- **Payment Flow**: Escrow system with 24-hour hold after completion
- **Provider Payouts**: Instant via Stripe Connect Express accounts
- **Target Market**: Detroit Metro residents and businesses

## 🔄 Continuous Updates

This documentation is actively maintained and updated with:
- Feature implementations and changes
- API endpoint modifications
- Business rule updates
- Security enhancements
- Performance optimizations

Last updated: January 15, 2025

---

**Ready to dive deeper?** Start with the [Product Requirements Document](./PRD.md) for a comprehensive overview, then explore the specific documentation that matches your role and needs.