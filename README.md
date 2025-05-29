# Queyk

An earthquake monitoring and emergency response system designed for educational institutions. Queyk provides seismic activity monitoring, safety protocols, and evacuation planning to help schools prepare for and respond to earthquakes.

![queyk](https://queyk.vercel.app/og.png)

## Features

- 📊 **Earthquake Monitoring Dashboard** - Dashboard showing seismic activity data with hourly magnitude and frequency readings
- 🚨 **Emergency Response Protocols** - Comprehensive safety guidelines based on NDRRMC and PHIVOLCS standards
- 🗺️ **Evacuation Planning** - Interactive floor plans with marked emergency exits and assembly points
- 🔐 **Secure Authentication** - School email-based login system
- 📋 **User Manual** - Complete guide for system navigation and usage
- ⚡ **Offline Capabilities** - Downloadable evacuation plans for use during emergencies

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Auth.js (Google OAuth integration)
- **Database:** Supabase
- **Data Fetching:** TanStack Query
- **Data Standards:** NDRRMC, PHIVOLCS, RA 10121 compliance

## Dashboard Features

### Seismic Activity Monitoring

- **Activity Chart:** Hourly magnitude and frequency readings
- **Peak Magnitude:** Highest seismic reading of the day
- **Average Magnitude:** Daily average seismic activity level
- **Significant Hours:** Hours with notable activity (>1.0 magnitude)
- **Peak Activity:** Hour with most frequent seismic events

### Safety Information

- **Emergency Protocols:** Before, during, and after earthquake procedures
- **Evacuation Sites:** Nearest evacuation location finder
- **Safety Alerts:** Alerts for significant seismic activity

## Project Structure

```
├── app/
│   ├── (main)/
│   │   ├── protocols/          # Emergency response protocols
│   │   ├── user-manual/        # System usage guide
│   │   └── evacuation-plan/    # Building floor plans & exits
│   ├── signin/                 # Authentication pages
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── app-sidebar.tsx         # Main navigation
├── lib/
│   └── protocols.ts            # Emergency protocol data
├── auth.ts                     # Authentication config
└── middleware.ts               # Route protection
```

## Getting Started

### Prerequisites

- Node.js 18+
- School email account for authentication
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd queyk-web
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Configure authentication and API keys in `.env.local`

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Guide

### Authentication

- Access the system using your school email credentials
- Login through Google OAuth on the homepage
- Protected routes ensure secure access to monitoring data

### Dashboard Navigation

- **Dashboard:** View seismic activity data and key metrics
- **Protocols:** Access emergency response procedures
- **Evacuation Plan:** View building floor plans and emergency exits
- **User Manual:** Complete system usage guide

### Emergency Features

- **Activity Monitoring:** Track seismic events and patterns
- **Offline Access:** Download evacuation plans for emergency use
- **Mobile Support:** Full functionality on mobile devices during emergencies

## Safety Standards Compliance

This system follows guidelines from:

- **NDRRMC** (National Disaster Risk Reduction and Management Council)
- **PHIVOLCS** (Philippine Institute of Volcanology and Seismology)
- **RA 10121** (Philippine Disaster Risk Reduction and Management Act)

## Deployment

### Deploy on Vercel

The easiest way to deploy Queyk is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Build for Production

```bash
npm run build
npm start
```

## Contributing

We welcome contributions to improve earthquake monitoring and safety features:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/safety-improvement`)
3. Commit your changes (`git commit -m 'Add enhanced alert system'`)
4. Push to the branch (`git push origin feature/safety-improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Emergency Contact

For system support or emergency procedures:

- Open an issue on GitHub for technical problems
- Contact your school's emergency coordinator for safety protocols
- Follow official NDRRMC guidelines during actual emergencies

---

**⚠️ Important:** This system is designed to supplement, not replace, official emergency protocols. Always follow your institution's established emergency procedures during actual seismic events.

© 2025 Queyk Project - All Rights Reserved
