# Sugarbabes Backend API

Detta är backend-servern för Sugarbabes, en flirt/dating-plattform med premium-funktioner och AI-integration.

## 🚀 Teknisk stack

- **Node.js** & **Express.js** - Serverramverk
- **PostgreSQL** - Databas
- **Sequelize** - ORM för databashantering
- **JWT** - Autentisering
- **Stripe** - Betalningshantering
- **Claude AI** - AI-funktionalitet

## 📁 Mappstruktur

```
/server
│
├── /controllers     → Logik för endpoints
├── /routes          → Definitioner av API-endpoints
├── /models          → Databasscheman och modeller
├── /middleware      → Autentisering, roller mm.
├── /services        → AI, betalningar, externa tjänster
├── /utils           → Hjälpfunktioner
└── server.js        → Huvudapplikation
```

## 🚀 Kom igång

### Förutsättningar

- Node.js (v14+)
- PostgreSQL (v13+)
- Stripe-konto för betalningsintegration
- Claude AI API-nycklar

### Installation

1. Klona projektet
2. Installera beroenden:
   ```bash
   cd server
   npm install
   ```

3. Skapa en `.env`-fil baserad på `.env.example` med dina egna värden:
   ```
   PORT=5000
   NODE_ENV=development
   
   JWT_SECRET=ditt_hemliga_jwt_lösenord_här
   
   DB_HOST=localhost
   DB_NAME=sugarbabes_db
   DB_USER=postgres
   DB_PASSWORD=ditt_lösenord
   DB_PORT=5432
   
   CLAUDE_API_KEY=ditt_claude_api_key
   
   STRIPE_SECRET_KEY=ditt_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=ditt_stripe_webhook_secret
   ```

4. Skapa databasen i PostgreSQL:
   ```sql
   CREATE DATABASE sugarbabes_db;
   ```

5. Starta servern:
   ```bash
   npm run dev
   ```

## 🔒 API-Endpoints

### Autentisering
- **POST /api/auth/register** - Registrera ny användare
- **POST /api/auth/login** - Logga in
- **POST /api/auth/logout** - Logga ut
- **GET /api/auth/me** - Hämta inloggad användare

### Användare
- **GET /api/users/profile** - Hämta egen profil
- **PUT /api/users/profile** - Uppdatera profil
- **PUT /api/users/password** - Ändra lösenord
- **GET /api/users/search** - Sök användare
- **GET /api/users/:id** - Hämta annan användare

### Inlägg
- **GET /api/posts/feed** - Hämta inläggsflöde
- **POST /api/posts** - Skapa inlägg
- **GET /api/posts/:id** - Hämta inlägg
- **DELETE /api/posts/:id** - Ta bort inlägg
- **POST /api/posts/:id/like** - Gilla inlägg

### Meddelanden
- **GET /api/messages/conversations** - Hämta konversationer
- **GET /api/messages/:userId** - Hämta chatt med användare
- **POST /api/messages/:userId** - Skicka meddelande
- **DELETE /api/messages/:messageId** - Ta bort meddelande

### Betalningar
- **POST /api/payments/checkout** - Skapa checkout-session
- **POST /api/payments/cancel-subscription** - Avbryt prenumeration
- **GET /api/payments/history** - Betalningshistorik
- **GET /api/payments/subscription** - Hämta prenumerationsstatus
- **POST /api/payments/webhook** - Stripe webhook

### AI-integration
- **POST /api/ai/generate-reply** - Generera AI-chattsvar
- **POST /api/ai/generate-post** - Generera AI-inlägg
- **POST /api/ai/enhance-profile** - Förbättra profiltext
- **POST /api/ai/icebreakers** - Generera chattöppnare

### Admin
- **GET /api/admin/users** - Lista användare
- **GET /api/admin/users/:id** - Hämta användare med aktivitet
- **PUT /api/admin/users/:id** - Uppdatera användare
- **GET /api/admin/stats** - Hämta statistik
- **GET /api/admin/reports** - Lista rapporterade inlägg
- **POST /api/admin/notifications** - Skicka push-notiser

## 💰 Premiumfunktioner

För att få tillgång till följande funktioner behöver användaren vara premium:
- Se premium-profiler i sin helhet
- Se premium-inlägg
- AI-genererade inlägg och svar
- Förbättrad profil med AI-hjälp
- Få chattförslag från AI 