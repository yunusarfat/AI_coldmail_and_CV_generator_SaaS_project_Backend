# AI Cold Email & CV Generator — Backend

REST API powering an AI-driven job application assistant: analyzes job postings, matches candidate profiles against them, and generates ATS-optimized cold emails and tailored CVs as downloadable PDFs.

**Frontend repo:** [aiemail_front](https://github.com/yunusarfat/AI_coldmail_and_CV_generator_SaaS_project_Frontend)
**Live API:** `https://ai-coldmail-and-cv-generator-saas.onrender.com/api`

---

## Features

- **Authentication** — Email/password signup & login with JWT (httpOnly cookie), Google Sign-In via Firebase Admin, account deletion.
- **Desired Jobs** — AI-powered job description analysis extracting role, seniority, required skills, and keywords.
- **Profile Upload** — PDF resume parsing (`pdf-parse`) or raw text, structured into a candidate profile via AI.
- **Job Matching** — Weighted scoring algorithm (skills 55%, keywords 20%, role 15%, experience 10%) producing a 0–100% fit score.
- **Cold Email Generation** — AI-generated, personalized outreach emails tailored to the matched job/profile pair.
- **CV Generation** — AI-tailored one-page resume rendered to PDF via Puppeteer and stored on Cloudinary.
- **Payments** — Stripe Checkout with webhook-driven subscription upgrades and a credit-based usage system.
- **Email Delivery** — Transactional email via Resend.

---

## Tech Stack

| Layer            | Technology                              |
|-------------------|-------------------------------------------|
| Runtime            | Node.js, Express, TypeScript             |
| Database            | MongoDB (Mongoose)                       |
| Cache / Ephemeral   | Redis (ioredis)                          |
| Auth                | JWT, bcrypt, Firebase Admin (Google Sign-In) |
| AI                  | Groq (OpenAI-compatible), Google Gemini  |
| PDF Generation       | Puppeteer, @sparticuz/chromium (serverless) |
| File Storage         | Cloudinary                               |
| Payments             | Stripe                                   |
| Email                | Resend                                   |
| Deployment           | Render                                   |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis instance (local or Redis Cloud)
- API keys: Groq, Gemini, Resend, Cloudinary, Stripe, Firebase service account

### Installation

```bash
git clone https://github.com/your-username/aimail-backend.git
cd aimail-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=
REDIS_URL=
JWT_SECRET=

RESEND_API_KEY=
RESEND_FROM=

GEMINI_API_KEY=
GROQ_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Run Locally

```bash
npm run dev
```

API available at `http://localhost:5000/api`.

### Build for Production

```bash
npm run build
npm start
```

> Set `NODE_ENV=production` in your deployment environment so Puppeteer uses `@sparticuz/chromium` instead of a local Chrome install.

---

## API Overview

| Module    | Base Route      | Description                                  |
|-----------|------------------|-----------------------------------------------|
| Auth      | `/api/auth`      | Signup, login, logout, Google login, account deletion |
| Jobs      | `/api/djob`       | Create/list/view desired jobs with AI analysis |
| Upload    | `/api/upload`     | PDF resume upload → profile creation          |
| Profile   | `/api/profile`    | Text-based profile creation, job matching     |
| Email     | `/api/email`      | AI cold email generation and retrieval        |
| CV        | `/api/cv`         | AI-tailored CV generation, retrieval, deletion |
| Payment   | `/api/payment`    | Stripe checkout session and webhook handling  |

---

## Project Structure

```
src/
  config/            # DB, Redis, mail, Cloudinary, Firebase config
  middleware/         # Auth middleware
  models/             # Shared Mongoose models (User)
  modules/
    auth/              # Authentication logic
    djob/               # Desired job creation + AI analysis
    upload/             # Resume PDF/text ingestion
    profile/             # Candidate profile + matching logic
    email/               # Cold email generation
    cv/                   # CV generation, templating, PDF rendering
    payment/              # Stripe checkout + webhooks
    services/             # Shared AI/matching services
  utils/               # JWT, OTP, credit utilities
```

---

## Deployment

Deployed on [Render](https://render.com). Push to the connected branch to trigger an automatic build and deploy. Ensure all environment variables above are set in Render's dashboard, and that `NODE_ENV=production` is set for correct Puppeteer/Chromium behavior.

---

## License

This project is for personal/portfolio use.
