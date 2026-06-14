# Alagetränke GmbH — B2B E-Commerce

Premium B2B Getränke-Großhandel für Gastronomie und Gewerbe.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React
- Supabase (Auth + Database)

## Starten

```bash
npm install
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

## Supabase

SQL-Schema: `database/schema.sql`

Umgebungsvariablen in Vercel oder `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Demo-Zugang (ohne Supabase)

| E-Mail | Rolle |
|--------|-------|
| admin@alagetraenke.de | Admin + freigegeben |
| pending@alagetraenke.de | Onay bekleyen müşteri |
| beliebige@email.de | Freigegebener Kunde |

## Features

- 3 Sprachen (DE/TR/EN) — Menü-Selektor
- B2B Preissperre (is_approved)
- Pfand-Aufschlüsselung im Warenkorb
- Kasten-Bestellung (1 Klick = 1 Kasten)
- Abholung & Lieferservice
- PayPal UI (Integration vorbereitet)
- Admin Panel (Produkte, Bestellungen, Kunden)
