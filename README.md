<div align="center">

![alt text](<Banner.png>)

### Multilingual Chating Apllication — Powered by AI

**Inlango** is a real-time multilingual messaging platform that breaks language barriers using AI-powered, context-aware translation. Chat naturally with anyone, in any language.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://inlango.vercel.app)
[![Made with React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Security](#security)
- [Contributing](#contributing)

---

## Overview

**Inlango** is a full-featured real-time messaging platform where language is never a barrier. Send messages, share photos, and have genuine conversations with anyone in the world — all without ever leaving the app.

No switching between your chat app and a translator. No copy-pasting messages back and forth. **Inlango** brings it all together in one place. Users can enable translation individually, and from that point on, every message they send is automatically delivered in the recipient's language — with meaning, tone, and intent fully intact. Not word-for-word conversion, but **context-aware translation** that makes every conversation feel native on both ends.

To keep this seamless, **Inlango** runs multiple **Gemini models** in parallel on every translation and uses whichever responds first — ensuring real-time delivery without any compromise on quality.

---

## Features

- 💬 **Real-Time Messaging** — Instant chat with live message delivery
- 🌍 **AI-Powered Translation** — Per-user toggle: enable translation for your messages only
- 🧠 **Context-Aware Translation** — Preserves meaning, tone, and intent across languages
- ⚡ **Parallel Model Inference** — Gemini models race in parallel; fastest response wins
- 📷 **Photo Sharing** — Send and receive images in conversations
- 🔒 **Secure Authentication** — JWT access + refresh tokens with session management
- 🛡️ **Rate Limiting & Bot Protection** — Powered by Arcjet
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Media Storage** | Cloudinary |
| **AI / Translation** | Google Gemini 2.5 Flash, Gemini 3 Flash Preview, Gemini 3.1 Flash Lite Preview |
| **Authentication** | JWT (Access Token + Refresh Token) |
| **Security** | Arcjet (rate limiting, bot protection) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## Architecture

Inlango uses a decoupled frontend/backend architecture with AI translation at the message layer.

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              React + TypeScript + Tailwind              │
│                   Hosted on Vercel                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────────┐
│                       SERVER                            │
│               Node.js + Express.js                      │
│          JWT Auth · Arcjet · Cloudinary                 │
│                   Hosted on Render                      │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼─────────────────────┐
│       MongoDB       │  │        Gemini Models             │
│  Users · Messages   │  │   2.5 Flash  ·  3 Flash Preview  │
│  Conversations      │  │   3.1 Flash Lite Preview         │
└─────────────────────┘  │   (parallel inference — fastest  │
                         │    response wins)                │
                         └──────────────────────────────────┘
```

<!-- 📸 Optionally replace the ASCII diagram above with a proper architecture image -->
<!-- ![Architecture Diagram](docs/images/architecture.png) -->
---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)
- A [Cloudinary](https://cloudinary.com/) account
- An [Arcjet](https://arcjet.com/) account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/inlango.git
cd inlango
```

2. **Install dependencies for both frontend and backend**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables

Create `.env` files in both the `frontend` and `backend` directories.

**`backend/.env`**

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=https://your-client-url.com

# Database
MONGODB_URL=your_mongodb_connection_string

# JWT Authentication
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret

# Email Configuration
SENDER_EMAIL=your_email@example.com
REDIRECT_URL=https://your-redirect-url.com

# Google OAuth & Gmail API
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_SECRET_KEY=your_google_oauth_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Arcjet Security
ARCJET_KEY=your_arcjet_key
```

**`frontend/.env`**

```env
VITE_CLIENT_ID=your_google_client_id
VITE_CLIENT_URL=https://your-client-url.com
VITE_BACKEND_URL=https://your-backend-url.com
```

> ⚠️ **Never commit your `.env` files.** They are already included in `.gitignore`.

### Running Locally

1. **Start the backend server**

```bash
cd backend
npm run dev
```

2. **Start the frontend dev server** (in a new terminal)

```bash
cd frontend
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Security

Inlango follows modern security best practices throughout:

- **JWT Authentication** — Stateless auth using short-lived Access Tokens and long-lived Refresh Tokens with a silent refresh mechanism
- **Rate Limiting** — Powered by [Arcjet](https://arcjet.com/) to protect API endpoints from abuse and automated bots
- **Protected Routes** — All sensitive API endpoints require valid authentication
- **Server-Side Validation** — All incoming requests are validated before processing
- **Secure Media Storage** — Images are uploaded and served through [Cloudinary](https://cloudinary.com/) with controlled access
- **Environment Secrets** — All sensitive credentials are stored in environment variables and never exposed to the client

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing code style and that all tests pass before submitting.

---

<div align="center">

Built with ❤️ by [Ayush](https://github.com/ayushawasthi246-dev)

</div>