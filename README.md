# Kaarigar AI — कारीगर AI
> AI-Powered Digital Commerce Assistant for Indian Micro-Entrepreneurs, Artisans, and Handloom Weavers.

---

## Project Structure

```
kaarigar-ai/
├── mobile/          React Native / Expo app (TypeScript)
├── backend/         Node.js / Express REST API (TypeScript + Prisma)
├── .gitignore
└── README.md
```

---

## Team & Branch Ownership

| Member | Responsibility | Branch | Backend Module | Mobile Feature |
|:---|:---|:---|:---|:---|
| **Nikhil** | Auth, Artisan Profile & Dashboard | `feature/auth-dashboard` | `auth/` `artisans/` `dashboard/` | `features/auth/` `features/artisan/` |
| **Suhani** | AI Studio, Image Enhancement, Voice-to-Text | `feature/ai-studio` | `ai/` | `features/ai-studio/` |
| **Vishwajit** | Smart Pricing, Inventory, Buyer Catalog | `feature/inventory-catalog` | `inventory/` `pricing/` `catalog/` | `features/inventory/` `features/pricing/` `features/catalog/` |

---

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env        # Fill in your PostgreSQL URL and JWT secrets
npx prisma generate
npx prisma migrate dev
npm run dev
```

- Health check: `http://localhost:5000/health`
- API base: `http://localhost:5000/api/v1`

### Mobile App

```bash
cd mobile
npm install
cp .env.example .env        # Set EXPO_PUBLIC_API_URL
npm run start               # Press i (iOS), a (Android), or scan QR
```


---

## Rules for All Developers

1. Work only inside your assigned `modules/` and `features/` folders.
2. There is **one backend server** — add your routes in `app.ts` via your own PR.
3. Coordinate on `prisma/schema.prisma` before running any migration.
4. Never commit `.env` files — use `.env.example` templates.
5. All API responses use the shared `ApiResponse` envelope.
