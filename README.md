# Salah Timings - Production App

## Stack
- Next.js App Router
- Tailwind CSS (same prototype design)
- PostgreSQL + Prisma
- JWT auth (HttpOnly cookie)

## Setup
1. Install deps:
```bash
npm install
```
2. Copy env file:
```bash
cp .env.example .env
```
3. Run migration and seed:
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```
4. Start dev server:
```bash
npm run dev
```

## Required API routes
- `GET /api/mosques`
- `GET /api/mosques/:id`
- `POST /api/mosques`
- `PUT /api/mosques/:id`
- `DELETE /api/mosques/:id`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `PUT /api/users/:id/role`
- `DELETE /api/users/:id`

## Deploy to Vercel
1. Push repo to Git provider.
2. Import project in Vercel.
3. Add env vars from `.env.example`.
4. Set build command: `npm run build`.
5. Set install command: `npm install`.
6. Run migrations in your CI/CD or before first deploy:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## Notes
- Public page keeps same night glass UI and prayer logic.
- `quarterBucketJamaat()`, `fajrJamaatFromSunrise()`, `getTimingsForMosque()`, and `upcomingSalahLabel()` logic is unchanged.
- Daily prayer start times are cached for 24h using Next cache/revalidate.
