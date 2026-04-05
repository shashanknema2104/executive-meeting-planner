# TCS Executive Meeting Planner

A professional full-stack web application that helps executives and teams schedule, manage, and coordinate meetings efficiently.

---

## Features

- **Meeting Management** — Create, edit, and delete meetings with title, description, date, time, and participant list
- **Public / Private Visibility** — Control whether colleagues can see your meetings on your public profile
- **Dashboard** — View today's schedule, weekly load, and upcoming meetings at a glance
- **Monthly Calendar** — Interactive calendar that highlights days with meetings and filters the agenda by date
- **Colleague Search** — Search for team members by email and view their public schedules
- **Secure Authentication** — Powered by Replit Auth (OpenID Connect)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Shadcn UI (Radix UI) |
| State / Data | TanStack Query v5 |
| Routing | Wouter |
| Backend | Node.js, Express |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Replit Auth (OpenID Connect, Passport.js) |
| Validation | Zod, drizzle-zod |

---

## Project Structure

```
├── client/                  # React frontend
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Reusable UI components
│       │   └── ui/          # Shadcn UI primitives
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility libraries (queryClient, utils)
│       └── pages/           # Route-level page components
│           ├── dashboard.tsx
│           ├── meetings.tsx
│           ├── calendar.tsx
│           ├── search.tsx
│           ├── profile.tsx
│           └── landing.tsx
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database access layer
│   ├── replitAuth.ts        # Authentication setup
│   ├── db.ts                # Drizzle DB connection
│   └── vite.ts              # Vite dev server integration
├── shared/
│   └── schema.ts            # Drizzle schema + Zod types (shared by client & server)
├── drizzle.config.ts        # Drizzle Kit configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite bundler configuration
└── tsconfig.json            # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- A [Replit](https://replit.com) account (required for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/tcs-meeting-planner.git
   cd tcs-meeting-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example file and fill in your values:

   ```bash
   cp .env.example .env
   ```

4. **Push the database schema**

   ```bash
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `REPL_ID` | Replit application ID (for auth) |
| `ISSUER_URL` | Replit OpenID Connect issuer URL |

See `.env.example` for a full template.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema changes to the database |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/user` | Get the currently authenticated user |
| GET | `/api/meetings` | List all meetings for the current user |
| POST | `/api/meetings` | Create a new meeting |
| PUT | `/api/meetings/:id` | Update a meeting |
| DELETE | `/api/meetings/:id` | Delete a meeting |
| GET | `/api/meetings/today` | Get today's meetings |
| GET | `/api/meetings/upcoming` | Get upcoming meetings |
| GET | `/api/meetings/week` | Get this week's meetings |
| GET | `/api/meetings/date/:date` | Get meetings for a specific date |
| GET | `/api/meetings/user/:userId` | Get a user's public meetings |
| GET | `/api/users/search?email=` | Search for a user by email |
| GET | `/api/stats` | Get meeting statistics for the dashboard |

---

## License

This project is licensed under the MIT License.
