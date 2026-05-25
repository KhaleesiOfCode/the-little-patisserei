# The Little Patisserie

Artisan bakery e-commerce website for a Chennai-based cake shop. Built with Next.js 16, React 19, Supabase, and Tailwind CSS v4.

## Features

- **Menu** — Browse categories, search, filter by food type and delivery mode
- **Cart & Checkout** — Pickup, local delivery (Chennai zones), or courier (South India)
- **Custom Cake Studio** — Personalise cakes with flavour, message, and design
- **Order Tracking** — Real-time order status with 15s polling
- **Gallery** — Image gallery with lightbox
- **Admin Panel** — Manage orders, menu items, gallery, and store status
- **Responsive** — Mobile-first design with Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Cookie-based admin session |
| Payment | Razorpay (to be integrated) |
| Notifications | WhatsApp Business API (to be integrated) |
| Monitoring | Sentry |
| Testing | Vitest |
| Deployment | Render.com |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |

## Environment Variables

See `.env.example` for all required variables: Supabase URL/keys, Razorpay key ID, admin password, Sentry DSN.

## Deployment

Deployed on Render.com. See `render.yaml` for configuration.
