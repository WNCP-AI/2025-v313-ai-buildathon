# 🚁 SkyMarket - Drone Service Marketplace

A modern drone service marketplace connecting consumers with verified drone operators and couriers in the Detroit Metro area.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Overview

SkyMarket is a comprehensive marketplace platform that enables:
- **Consumers** to discover and book drone services (food delivery, courier, aerial imaging, site mapping)
- **Providers** to offer services, manage bookings, and earn income
- **Businesses** to access professional drone services for marketing and operations

### 🎯 Key Features

- **Multi-Modal Services**: Bike couriers, car delivery, and drone operations on one platform
- **Real-Time Tracking**: Live GPS tracking and status updates
- **Secure Payments**: Stripe-powered escrow payments with instant provider payouts
- **Compliance Tools**: Built-in FAA Part 107 verification and airspace management
- **Trust & Safety**: Verified operators, ratings, reviews, and insurance requirements

## 🏗️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Server-side rendering, type safety |
| **Styling** | Tailwind CSS 3, shadcn/ui | Utility-first CSS, component library |
| **Backend** | Supabase | PostgreSQL database, auth, storage, realtime |
| **Payments** | Stripe | Payment processing, escrow, payouts |
| **Maps** | Mapbox GL JS | Interactive maps, geocoding, routing |
| **Deployment** | Vercel | Edge deployment, serverless functions |
| **Development** | ESLint, Prettier, Husky | Code quality, formatting, git hooks |

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher  
- Git 2.30.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skymarket-subpabase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys (see setup guide)
   ```

4. **Set up services**
   - Create a Supabase project and run the schema
   - Set up Stripe account for payments
   - Get Mapbox API key for maps

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
skymarket-subpabase/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── browse/            # Service discovery
│   ├── dashboard/         # User dashboards
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Layout components (header, footer)
│   ├── providers/        # Provider-specific components
│   ├── consumers/        # Consumer-specific components
│   └── shared/           # Shared components
├── lib/                   # Utility libraries
│   ├── supabase/         # Database client and helpers
│   ├── stripe/           # Payment integration
│   └── mapbox/           # Map utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── docs/                  # Project documentation
├── supabase/             # Database schema and migrations
└── skymarket-cursor-rules/ # Development guidelines
```

## 🌟 Services Offered

### 🍔 Food Delivery
- Restaurant meals and grocery delivery
- Temperature-controlled drone compartments
- 15-45 minute delivery windows
- Contactless delivery options

### 📦 Courier Services  
- Documents, packages, and urgent items
- Same-day delivery with express options
- Signature confirmation and tracking
- Fragile item handling protocols

### 📸 Aerial Imaging
- Real estate photography and videography
- Event coverage and marketing content
- 4K video and RAW photo delivery
- Professional editing services

### 🗺️ Site Mapping
- Construction site surveys and inspections
- 3D mapping and CAD integration
- Compliance reporting and documentation
- Multi-day project management

## 👥 User Types

### Consumers
- Browse and compare service providers
- Book services with flexible scheduling
- Track orders in real-time
- Rate and review providers

### Providers
- Create service listings with custom pricing
- Manage availability and service areas
- Accept and fulfill bookings
- Receive instant payments

### Admins
- Platform management and moderation
- User verification and compliance
- Analytics and reporting
- Customer support tools

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
npm run format       # Format code with Prettier
```

### Development Workflow

1. Create feature branch from `develop`
2. Make changes following our [coding standards](docs/development/WORKFLOW.md)
3. Run tests and quality checks
4. Submit pull request for review
5. Merge after approval and CI passes

See our [Development Workflow](docs/development/WORKFLOW.md) for detailed guidelines.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Getting Started
- [Installation Guide](docs/development/INSTALLATION.md) - Detailed setup instructions
- [Setup Guide](docs/development/SETUP.md) - Environment configuration
- [Development Workflow](docs/development/WORKFLOW.md) - Git workflow and standards

### Architecture
- [System Architecture](docs/architecture/ARCHITECTURE.md) - Technical architecture overview
- [Database Schema](docs/architecture/DATABASE.md) - Database design and relationships
- [API Documentation](docs/api/API.md) - REST API reference

### Business
- [Product Requirements](docs/PRD.md) - Complete product specification
- [Business Model](docs/BUSINESS_MODEL.md) - Revenue and growth strategy
- [Market Analysis](docs/MARKET_ANALYSIS.md) - Competitive landscape

## 🎯 Development Phases

### ✅ Phase 1: Foundation (Completed)
- [x] Next.js 14 setup with TypeScript
- [x] Supabase integration and database schema
- [x] Tailwind CSS and component system
- [x] Environment configuration

### 🔄 Phase 2: Authentication (In Progress)
- [ ] User registration and login
- [ ] Profile management
- [ ] Role-based access control
- [ ] Password reset and email verification

### 📅 Upcoming Phases
- **Phase 3**: UI Components and Design System
- **Phase 4**: Provider Management and Onboarding
- **Phase 5**: Marketplace and Service Discovery
- **Phase 6**: Booking System and Workflow
- **Phase 7**: Payment Processing and Escrow
- **Phase 8**: Real-time Features and Messaging

## 🌍 Target Market

**Primary Market**: Detroit Metropolitan Area
- Population: 4.3 million
- Coverage: Wayne, Oakland, Macomb counties
- Key Cities: Detroit, Royal Oak, Birmingham, Dearborn

**Expansion Plans**: Chicago, Cleveland, Pittsburgh (2025)

## 📊 Business Metrics

### Success Targets (6 Months)
- 10,000+ registered users
- 500+ active providers
- 1,000+ weekly completed orders
- $500K+ gross marketplace value
- 4.5+ average customer rating

### Key Performance Indicators
- Customer acquisition cost: <$25
- Provider retention rate: >80%
- Order completion rate: >95%
- Platform uptime: >99.9%
- Response time: <300ms

## 🤝 Contributing

We welcome contributions from the development community! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

### Development Setup
1. Fork the repository
2. Follow our [Installation Guide](docs/development/INSTALLATION.md)
3. Create a feature branch
4. Make your changes
5. Submit a pull request

### Code of Conduct
This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🔐 Security

Security is a top priority for SkyMarket. We implement:
- End-to-end encryption for sensitive data
- SOC 2 Type II compliance protocols
- Regular security audits and penetration testing
- Secure payment processing with PCI DSS compliance

To report security vulnerabilities, please email security@skymarket.com.

## 📄 License

This project is proprietary software developed for ID Ventures / WNCP AI. All rights reserved.

## 🆘 Support

### Documentation
- [Setup Guide](docs/development/SETUP.md)
- [Troubleshooting](docs/development/TROUBLESHOOTING.md)
- [FAQ](docs/FAQ.md)

### Contact
- **Technical Issues**: Create a GitHub issue
- **Business Inquiries**: contact@skymarket.com
- **Security Issues**: security@skymarket.com

---

**Built with ❤️ for the Detroit drone community**

*SkyMarket is revolutionizing how people access drone services in the Motor City, connecting innovative technology with local expertise to serve the Greater Detroit area.*