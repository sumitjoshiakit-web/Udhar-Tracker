# ApnaKhata — Udhar Tracker

A shopkeeper's customer-wise, date-wise credit ledger built with Next.js, TypeScript and Supabase.

## Features

- Supabase email/password authentication (each shopkeeper sees only their own records)
- Create customer khatas and search by customer name
- Record udhar (credit) and jama (payment) against a customer
- Date-wise ledger with a running balance
- Dashboard totals are calculated from actual database records
- Responsive dashboard and empty states; no seeded/demo customer or transaction records

## Local setup

1. Install Node.js 20+ and pnpm (or npm).
2. Install dependencies: `pnpm install`
3. Create a Supabase project.
4. In Supabase → SQL Editor, run all of `supabase/schema.sql`.
5. Copy `.env.example` to `.env.local` and fill in the project's Project URL and publishable/anon key from Supabase → Project Settings → API.
6. In Supabase → Authentication → URL Configuration, set the Site URL to your local URL (`http://localhost:3000`) and add it to Redirect URLs.
7. Run `pnpm dev` and open `http://localhost:3000`.

## Deploy to Vercel

1. Import this GitHub repository in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Project → Settings → Environment Variables (Production, Preview and Development as needed).
3. Deploy.
4. In Supabase → Authentication → URL Configuration, set Site URL to the deployed Vercel URL and add both the production URL and preview URL patterns you use to Redirect URLs.
5. Create a test shopkeeper account and verify that one account cannot read another account's customer or transaction records.

## Data model

- `customers`: one row per customer khata, owned by one authenticated shopkeeper.
- `transactions`: immutable-in-normal-use ledger entries (`credit` or `payment`) linked to a customer. Running balances are calculated chronologically from entries, rather than manually overwritten.
- Row Level Security (RLS) restricts reads and writes to the authenticated owner. A database trigger also verifies customer ownership on transaction writes.

## Ledger example

- Credit ₹500 → balance ₹500
- Credit ₹200 → balance ₹700
- Payment ₹100 → balance ₹600

No sample records are inserted by the SQL migration.
