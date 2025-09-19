# 🚁 SkyMarket - Multi-Modal Service Marketplace

> **The Uber of Drones** - A comprehensive marketplace connecting consumers with drone operators and delivery services in Detroit, Michigan.

![SkyMarket Banner](https://via.placeholder.com/800x200?text=SkyMarket+-+Drone+%26+Delivery+Services)

## 🎯 Project Overview

SkyMarket is a web-first marketplace that connects consumers with service providers (drone operators, couriers, delivery drivers) for on-demand services. Built as a hackathon project in 2.5 hours using Lovable.dev's AI-powered no-code platform, it demonstrates rapid MVP development with modern web technologies.

### Core Concept
Think "Uber meets DoorDash meets drone delivery" - a unified platform for all delivery and aerial services, featuring:
- **Multi-modal services**: Food delivery, courier services, aerial imaging, and site mapping
- **Real-time booking**: Submit requests and receive instant notifications
- **Trust-forward design**: Verification badges, ratings, and professional profiles
- **Mobile-first experience**: Responsive design optimized for on-the-go usage

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive styling
- **React Router** for client-side routing
- **Lucide React** for icons
- **React Hook Form** with Zod validation

### Backend
- **Supabase** for authentication and database
- **PostgreSQL** with Row Level Security (RLS)
- **Supabase Edge Functions** for serverless logic
- **Resend** for email notifications

### Deployment
- **Vercel** for hosting and CI/CD
- **Custom domain** support
- **Environment variables** for configuration

### Development Platform
- **Lovable.dev** - AI-powered no-code development
- **Natural language** to React code generation
- **Built-in integrations** with Supabase and Vercel

## 👥 User Roles & Features

### 🛍️ Consumers
- Browse and search available services
- Filter by category, price, and rating
- View detailed operator profiles
- Submit booking requests with requirements
- Track booking status and history
- Rate and review completed services

### 🎯 Operators (Service Providers)
- Create comprehensive professional profiles
- List multiple services with pricing
- Manage service availability and areas
- Receive real-time booking notifications
- Update listings and credentials
- View earnings and analytics

### 🔧 Admin Panel
- Manage users and listings
- Generate AI-powered content and images
- Bulk operations and moderation tools
- Security scanning and compliance checks
- Analytics and reporting

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #BD1B04        /* Vibrant Red - CTA buttons, ratings */
--background: #FFFFFF     /* Pure White - cards, modals */
--text-primary: rgba(0,0,0,0.87)    /* High contrast text */
--text-secondary: #4A4A4A /* Meta information */

/* Status Colors */
--success: #1ABF8B        /* Completed deliveries */
--warning: #E4A300        /* Pending status */
--error: #D3402B          /* Cancellations */
```

### Typography
- **Font Family**: Inter
- **Responsive scaling**: 16px base, mobile-optimized
- **Semantic hierarchy**: H1-H6 with consistent spacing

### Layout Principles
- **8pt grid system** for consistent spacing
- **Mobile-first responsive design**
- **Touch-friendly targets** (44px minimum)
- **Clean card-based layouts** with subtle shadows

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── shared/                # Reusable components
│   ├── auth/                  # Authentication components
│   └── layout/                # Layout components
├── contexts/
│   ├── ModeContext.tsx        # App mode switching
│   └── SimpleAuthContext.tsx  # Authentication state
├── pages/
│   ├── Browse.tsx             # Service marketplace
│   ├── OperatorDashboard.tsx  # Provider dashboard
│   ├── AdminPanel.tsx         # Admin interface
│   └── ...                    # Other pages
├── integrations/
│   └── supabase/              # Supabase client & types
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities and helpers
└── assets/                    # Images and static files
```

## 🏗️ Database Schema

### Core Tables

#### `listings`
```sql
- id (UUID, primary key)
- user_id (references auth.users)
- title, description, category
- price (decimal)
- service_area_text
- is_active (boolean)
- created_at (timestamp)
```

#### `bookings`
```sql
- id (UUID, primary key)
- user_id (references auth.users)
- listing_id (references listings)
- requirements (text)
- preferred_date, preferred_time
- status (default 'pending')
- created_at (timestamp)
```

#### `profiles`
```sql
- id (UUID, references auth.users)
- full_name, avatar_url, bio
- user_type ('consumer' | 'operator')
- created_at, updated_at
```

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Policy-based access control** for data protection
- **Authentication required** for sensitive operations

## 📱 Service Categories

1. **🍔 Food Delivery**
   - Restaurant and grocery delivery
   - Express and scheduled delivery
   - Temperature-controlled transport

2. **📦 Courier/Parcel**
   - Document and package delivery
   - Same-day and next-day service
   - Secure handling for sensitive items

3. **📸 Aerial Imaging**
   - Real estate photography
   - Event coverage and videography
   - Construction site monitoring

4. **🗺️ Site Mapping**
   - Surveying and mapping services
   - Construction progress tracking
   - Agricultural monitoring

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Resend account (for emails)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skymarket.git
   cd skymarket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   RESEND_API_KEY=your-resend-api-key
   ```

4. **Set up Supabase database**
   - Run migrations in `supabase/migrations/`
   - Configure RLS policies
   - Set up authentication providers

5. **Start development server**
   ```bash
   npm run dev
   ```

### Development with Lovable.dev

This project was built using Lovable.dev's AI-powered platform. To continue development:

1. Import project to Lovable.dev
2. Connect your Supabase and Vercel accounts
3. Use natural language prompts for rapid development
4. Deploy automatically to Vercel

**Project URL**: https://lovable.dev/projects/03d4cf3c-3fe5-42b4-be3c-d9689a647d56

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Set up custom domain** (optional)
   - Add domain in Vercel project settings
   - Configure DNS records

### Via Lovable.dev

Simply open [Lovable](https://lovable.dev/projects/03d4cf3c-3fe5-42b4-be3c-d9689a647d56) and click on Share → Publish.

## 🔐 Authentication & Security

### User Authentication
- **Email/password** authentication via Supabase Auth
- **Role-based access control** (Consumer/Operator/Admin)
- **JWT tokens** for secure API access
- **Password reset** and email verification

### Data Security
- **Row Level Security (RLS)** policies
- **HTTPS only** in production
- **Environment variable** protection
- **Regular security scans** via admin panel

## 📧 Email Integration

### Notification Types
- **Booking confirmations** for consumers
- **New booking alerts** for operators
- **Status updates** and reminders
- **System notifications** and alerts

### Email Templates
- **Professional design** with brand consistency
- **Mobile-responsive** layouts
- **Clear call-to-action** buttons
- **Unsubscribe options** for compliance

## 🎯 Key Features

### Enhanced Search & Filtering
- **Debounced search** with 300ms delay
- **Multi-category filtering** 
- **Price range selection**
- **Rating and distance sorting**
- **Real-time results** updates

### Admin Panel Capabilities
- **User and listing management**
- **AI-powered content generation**
- **Bulk operations** with multi-select
- **Security scanning** and compliance
- **Analytics dashboard**

### Mobile Experience
- **Touch-optimized** interface
- **Swipe gestures** for navigation
- **Offline support** for core features
- **Push notifications** (planned)

## 🔄 API Integration

### Supabase Edge Functions
```typescript
// Send booking notification
POST /functions/v1/send-booking-notification
{
  "bookingId": "uuid",
  "operatorEmail": "operator@example.com"
}

// Generate listing images
POST /functions/v1/generate-listing-images
{
  "listingId": "uuid",
  "prompt": "Professional food delivery drone"
}
```

### Real-time Features
- **Live booking status** updates
- **Operator availability** tracking
- **Chat messaging** (planned)
- **Location tracking** (planned)

## 📊 Analytics & Monitoring

### Performance Metrics
- **Page load times** and Core Web Vitals
- **User engagement** and conversion rates
- **Booking completion** rates
- **Operator response** times

### Business Intelligence
- **Revenue tracking** per category
- **Popular services** and trends
- **Geographic service** distribution
- **Customer satisfaction** scores

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for git messages
- **Component documentation** with JSDoc

## 📋 Roadmap

### Phase 1: MVP ✅
- [x] User authentication and profiles
- [x] Service listings and browsing
- [x] Basic booking system
- [x] Email notifications
- [x] Mobile-responsive design

### Phase 2: Enhanced Features 🚧
- [ ] Real-time chat messaging
- [ ] Interactive maps integration
- [ ] Advanced search with AI
- [ ] Payment processing
- [ ] Rating and review system

### Phase 3: Scale & Growth 📅
- [ ] Multi-city expansion
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with drone APIs
- [ ] Marketplace optimization

## 🎪 Hackathon Context

**Event**: Venture313 AI Buildathon 2025  
**Track**: Beginner (2.5 hours)  
**Location**: Detroit, Michigan  
**Achievement**: Fully functional MVP deployed to production

This project demonstrates the power of modern no-code platforms and AI-assisted development for rapid prototyping and MVP creation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Project Lead**: [Your Name]
- **Email**: contact@skymarket.dev
- **GitHub**: [@skymarket](https://github.com/skymarket)
- **Discord**: [Join our community](https://discord.gg/skymarket)

### Getting Help
- 📖 Check the [documentation](docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/skymarket/issues)
- 💬 Join our [Discord community](https://discord.gg/skymarket)
- 📧 Email us at support@skymarket.dev

---

<div align="center">
  
**Built with ❤️ in Detroit using [Lovable.dev](https://lovable.dev)**

*Empowering the future of on-demand services with drone technology*

[🚀 Live Demo](https://skymarket.vercel.app) | [📚 Documentation](docs/) | [🛠️ API Reference](docs/api.md)

</div>