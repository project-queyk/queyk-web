# Queyk Web: Earthquake Monitoring and Emergency Response Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-black.svg?logo=auth0)](https://www.better-auth.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F.svg?logo=drizzle)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Queyk Web is a progressive web application (PWA) built with Next.js 15, React 19, TypeScript, Better Auth, and Drizzle ORM. It serves as the centralized dashboard and emergency response portal for institutional earthquake safety, aggregating real-time seismic sensor feeds, managing multi-floor evacuation plans, dispatching Web Push/SMS notifications, and displaying safety protocols.

---

## 1. Overview & Key Capabilities

Queyk Web bridges IoT seismic hardware with institutional safety coordinators, staff, and students. It ingests seismic metrics, visualizes activity trends, handles emergency notification dispatching, and ensures offline readiness through PWA support and downloadable evacuation schematics.

### Key Capabilities

- **Real-Time Seismic Dashboard**: Live charts powered by Recharts and Socket.io, displaying hourly magnitude, peak ground acceleration metrics, and daily rolling averages with custom date range filtering.
- **Evacuation Plan Navigator**: Interactive multi-floor architectural viewer highlighting primary/secondary evacuation routes, fire exits, and outdoor assembly zones for desktop and mobile viewports.
- **Incident & Protocol Documentation**: Comprehensive before/during/after safety procedures aligned with national disaster management standards.
- **Notification Subsystems**:
  - **Web Push Notifications**: Browser-level push alert subscriptions using the Web Push standard and service workers.
  - **SMS Alert Dispatching**: Direct phone number management and SMS dispatch integrations.
- **PDF Report Generation**: Built-in client-side report generator (`jspdf` and `jspdf-autotable`) for exporting tabular seismic logs and safety summaries.
- **Domain-Restricted Authentication (Better Auth)**:
  - Integrated with **Better Auth** using Drizzle ORM and PostgreSQL.
  - Shares database sessions and user entities with the central backend server.
  - Next.js API routes automatically forward the user's active Better Auth session token (`session.session.token`) to the backend API.
  - Google OAuth sign-in restricted to authorized institutional email domains (`AUTH_EMAIL_DOMAIN`).
  - Automatic account linking for verified Google credentials.
  - Branded access restriction page (`/error?error=AccessDenied`) for unauthorized domains.
- **Role-Based User Management**: Administrative portal for viewing active users, modifying access roles (`admin` / `user`), and configuring notification permissions.
- **Progressive Web App (PWA)**: Full offline service worker caching, installable on mobile devices and desktops with Android Trusted Web Activity (TWA) asset link verification.

---

## 2. Architecture / How it Works

The web platform acts as both an administrative dashboard and an API proxy layer between authenticated client sessions, third-party services (Google OAuth, Web Push), and the core backend microservices.

```mermaid
flowchart TD
    subgraph Client ["Client Browser / Mobile PWA"]
        A[User Access] --> B{Authenticated?}
        B -- No --> C[Sign-in Page: Google OAuth]
        C --> D[Better Auth Callback & Domain Hook]
        D -- Unauthorized --> E["Access Denied Screen (/error)"]
        D -- Authorized --> B
        B -- Yes --> F[Role-Based View: Admin / User]
        F --> G[Live Dashboard & Recharts]
        F --> H[Evacuation Floor Plans]
        F --> I[Safety Protocols & User Manual]
        F --> J[User Profile & Notification Settings]
    end

    subgraph AppRouter ["Next.js App Router & Better Auth Layer"]
        D --> BA["Better Auth Handler\\n/api/auth/[...all]"]
        BA --> DB[(PostgreSQL Database)]
        G --> K["GET /api/readings"]
        G --> L["GET /api/earthquakes"]
        J --> M["POST /api/phone-number"]
        F --> N["GET/PATCH /api/users"]
    end

    subgraph ExternalBackend ["Queyk Backend Services"]
        K --> O["Backend Service: /v1/api/readings"]
        L --> P["Backend Service: /v1/api/earthquakes"]
        N --> Q["Backend Service: /v1/api/users"]
    end
```

### Data Flow Overview

1. **Authentication Flow**: Users log in via Google OAuth through Better Auth (`authClient.signIn.social`). Better Auth validates the user's institutional email domain against `AUTH_EMAIL_DOMAIN`. Authorized users create a session in the shared PostgreSQL database; unauthorized domains are routed to `/error?error=AccessDenied`.
2. **Telemetry Ingestion & Visualizations**: The dashboard polls `/api/readings` with date parameters or receives live socket updates. TanStack Query manages query caching, background refetching, and state deduplication.
3. **Emergency Alerts**: When the backend flags a seismic event, web push payloads are routed to subscribed service workers, immediately popping push notifications across registered client devices.

---

## 3. Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Webpack/Turbopack, React Server Components)
- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Authentication**:
  - [Better Auth](https://www.better-auth.com/) with `@better-auth/drizzle-adapter` & `@better-auth/next-js`
  - Client SDK: `authClient` (`better-auth/react`)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM 0.45](https://orm.drizzle.team/) & `postgres`
- **Styling & UI**:
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) Primitives
  - [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
  - [Motion](https://motion.dev/) (Framer Motion)
- **State Management & Data Fetching**:
  - [TanStack React Query v5](https://tanstack.com/query/latest)
  - [TanStack React Table v8](https://tanstack.com/table/latest)
- **Reporting & Visualization**:
  - [Recharts](https://recharts.org/)
  - [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **PWA Integration**:
  - [`@ducanh2912/next-pwa`](https://github.com/DuCanhDe/next-pwa)

---

## 4. Project Structure

```
queyk-web/
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── (main)/             # Protected application routes with shared sidebar
│   │   │   ├── dashboard/      # Real-time seismic analytics dashboard
│   │   │   ├── evacuation-plan/# Interactive desktop & mobile floor plans
│   │   │   ├── profile/        # User profile, push subscriptions, SMS settings
│   │   │   ├── protocols/      # Safety protocols standards
│   │   │   ├── user-management/# Admin user management and role delegation
│   │   │   └── user-manual/    # System documentation and usage guide
│   │   ├── api/                # API Route Handlers
│   │   │   ├── auth/[...all]/  # Better Auth Next.js catch-all route handler
│   │   │   ├── earthquakes/    # Historical earthquake event endpoints
│   │   │   ├── notifications/  # Notification dispatch endpoints
│   │   │   ├── phone-number/   # SMS contact endpoints
│   │   │   ├── readings/       # Sensor reading telemetry query proxy
│   │   │   └── users/          # User management proxy endpoints
│   │   ├── signin/             # Custom login page with Google OAuth
│   │   ├── error/              # Authentication & access denied error handler page
│   │   ├── layout.tsx          # Root HTML layout with PWA meta tags
│   │   └── page.tsx            # Public landing page
│   ├── components/             # React UI components
│   │   ├── ui/                 # Reusable shadcn/ui components (Dialog, Table, etc.)
│   │   ├── Sidebar.tsx         # Responsive collapsible sidebar navigation
│   │   ├── Dashboard.tsx       # Dashboard view with charts, filters, and PDF export
│   │   ├── DesktopFloorPlans.tsx # Large-screen floor plan canvas
│   │   ├── MobileFloorPlans.tsx  # Touch-optimized mobile floor plan viewer
│   │   ├── SignIn.tsx          # Google social login button and handlers
│   │   ├── AuthError.tsx       # Branded error and Access Denied component
│   │   └── UserManagementPage.tsx # Admin tabular user management interface
│   ├── db/                     # Drizzle ORM database connection & schema
│   │   ├── schema.ts           # User, session, account, verification schemas
│   │   └── index.ts            # PostgreSQL client initialization
│   ├── lib/                    # Business logic, configuration, and helpers
│   │   ├── auth-client.ts      # Better Auth client instance (useSession, signIn, signOut)
│   │   ├── pdf-generator.ts    # Client-side PDF export logic for seismic data
│   │   └── utils.ts            # Class merging (cn) and formatting utilities
│   ├── auth.ts                 # Better Auth server configuration & domain hooks
│   ├── proxy.ts                # Next.js middleware for route handling & redirects
│   └── types/                  # TypeScript definitions (auth, API, models)
├── public/                     # Static assets, floor plan SVG/images, icons, manifest
├── next.config.ts              # Next.js & PWA compiler settings
└── package.json                # Project dependencies and npm scripts
```

---

## 5. Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- Package manager: `npm`, `pnpm`, `yarn`, or `bun`
- A Google Cloud Console project with OAuth 2.0 credentials configured
- PostgreSQL database instance (Supabase, Neon, or local PostgreSQL)

### Installation

1. Clone the repository and navigate to `queyk-web`:
   ```bash
   cd queyk-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```

### Environment Variables

Configure the following variables in `.env.local`:

| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Secret key used for Better Auth encryption (`openssl rand -hex 32`) | `your-32-char-random-secret` |
| `BETTER_AUTH_URL` | Canonical URL of the Next.js application | `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxxxxx` |
| `AUTH_EMAIL_DOMAIN` | Restricts login to a specific email domain | `@school.edu.ph` |
| `NEXT_PUBLIC_APP_URL` | Base public URL of the web app | `http://localhost:3000` |
| `NEXT_PUBLIC_BACKEND_URL` | Public-facing URL of the Queyk backend API | `http://localhost:8000` |
| `BACKEND_URL` | Server-to-server URL of the Queyk backend API | `http://localhost:8000` |
| `ADMIN_TOKEN` | Token used by Next.js API routes for privileged backend calls | `secret-admin-token` |
| `USER_TOKEN` | Token used for standard user proxy endpoints | `secret-user-token` |
| `IOT_TOKEN` | IoT communication verification token | `secret-iot-token` |

### Running Locally

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 6. Usage & Navigation

### 1. Dashboard (`/dashboard`)
- **Seismic Charts**: View real-time graphs of Spectral Intensity (SI) and Peak Ground Acceleration (PGA).
- **Date Range Picker**: Filter metrics by custom start and end dates.
- **Export Data**: Click **Export PDF** to generate an instant printable incident report containing metric tables and statistics.

### 2. Evacuation Plans (`/evacuation-plan`)
- **Interactive Floor Plan**: Switch between Building levels/floors.
- **Route Markers**: Inspect marked primary exit pathways, emergency stairwells, fire extinguisher locations, and open-air assembly zones.
- **Offline Mode**: Floor plans remain accessible offline through PWA service worker caching.

### 3. Emergency Protocols (`/protocols`)
- **Actionable Guidelines**: View clear protocols for the three disaster management phases:
  - **Before**: Structural checks, emergency kit preparation, drill planning.
  - **During**: Duck, Cover, and Hold instructions for classrooms and open areas.
  - **After**: Evacuation guidelines, injury reporting, aftershock safety.

### 4. User Profile & Notifications (`/profile`)
- **Web Push**: Toggle browser push notifications for real-time seismic alerts.
- **SMS Alerts**: Link and verify your phone number to receive critical emergency alerts via SMS.

### 5. User Management (`/user-management` — Admins Only)
- **Role Control**: View registered users and promote accounts between `user` and `admin` roles.
- **Search & Pagination**: Filter users by name or email.

---

## 7. Troubleshooting & Common Issues

| Issue / Error | Potential Cause | Solution |
| :--- | :--- | :--- |
| `AccessDenied` on Login | Email domain does not match `AUTH_EMAIL_DOMAIN` | Ensure you are signing in with an authorized institutional email matching the configured domain filter. |
| `account_not_linked` | Account existed prior to Better Auth without provider link | `accountLinking` is enabled in `auth.ts` and legacy accounts have been backfilled with their OAuth IDs. |
| `500 Failed to retrieve readings` | Backend server unreachable or token rejected | Check that `BACKEND_URL` is running and verify `ADMIN_TOKEN` matches your backend configuration. |
| Web Push fails to register | Service worker blocked or insecure origin | Web Push requires HTTPS (or `localhost` for development) and notification permissions granted in the browser. |

---

## License

This project is licensed under the [MIT License](LICENSE).
