<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=220&section=header&text=Dhani%20Travels%20✈️&fontSize=56&fontColor=ffffff&fontAlignY=38&desc=Full-Stack%20Travel%20Agency%20Platform&descAlignY=58&descSize=20" width="100%" />

</div>

<div align="center">

**A modern travel agency web app — public storefront + secure admin dashboard, all in one.**

[![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 🌟 Overview

**Dhani Travels** is a production-ready full-stack web application built for a travel agency. It combines a beautiful customer-facing website with a fully-featured admin dashboard — letting the agency showcase packages, manage bookings, and handle leads all in one place.

---

## ✨ Features

### 🌐 Public Website
- **Responsive UI** — sleek design built with React, Tailwind CSS & Framer Motion animations
- **Destinations** — browse popular travel destinations with rich detail pages
- **Tour Packages** — curated packages with itineraries, pricing & inclusions
- **Hotels** — explore and search partner hotels
- **Lead Generation** — built-in inquiry forms so customers can reach the agency instantly

### 🔐 Admin Dashboard (`/admin`)
- **Overview** — centralized metrics and quick stats
- **Destinations** — create, edit, and delete destination listings
- **Packages** — manage complex tour packages and itineraries
- **Hotels** — full CRUD for hotel listings
- **Leads** — track and respond to customer inquiries
- **Settings** — configure agency branding and details

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database & Auth** | Supabase (PostgreSQL + Storage + Auth) |
| **Middleware** | CORS, Morgan |
| **Deployment** | Render + Hostinger (custom domain) |

---

## 📁 Project Structure

```
dhani-travels/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # React Context (AgencyContext, etc.)
│       ├── pages/            # Public & Admin page components
│       └── lib/              # Utility functions
│
├── server/                   # Express backend
│   └── src/
│       ├── controllers/      # Route handler logic
│       ├── routes/           # Public & admin Express routes
│       ├── middleware/       # Custom middleware
│       ├── utils/            # Helpers & utilities
│       └── index.js          # Server entry point
│
├── DEPLOYMENT.md             # Render deployment guide
└── package.json              # Monorepo root config
```

---

## ⚙️ Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or newer
- A **[Supabase](https://supabase.com)** project (for database, storage & auth)

---

## 🚀 Local Development Setup

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/dhani-travels.git
cd dhani-travels
```

**2. Install dependencies**

This project uses a monorepo structure. Install from the root:

```bash
npm install
npm install --workspace server
npm install --workspace client
```

**3. Configure environment variables**

Create a `.env` file inside the `server/` directory:

```env
# server/.env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PANEL_KEY=your_secret_admin_key
SUPABASE_STORAGE_BUCKET=agency-images
```

Create a `.env` file inside the `client/` directory:

```env
# client/.env
VITE_API_URL=http://localhost:4000/api
VITE_ADMIN_API_URL=http://localhost:4000/api/admin
```

**4. Start the development servers**

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:5173 |
| Backend (Express) | http://localhost:4000 |

---

## 🌍 Deployment

Dhani Travels is designed for **Render** with a custom domain via Hostinger.

For full step-by-step deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🔒 Security

> ⚠️ Keep your secrets safe.

- Never commit `.env` files to version control — add them to `.gitignore`
- Rotate your `ADMIN_PANEL_KEY` and `SUPABASE_SERVICE_ROLE_KEY` immediately if exposed
- The admin dashboard is protected — never share your admin key publicly

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" width="100%" />

</div>