# Full-Stack Vue Project

A modern full-stack application built with Vue.js, Fastify, and Cloudflare Workers, organized as a monorepo.

---

## Tech Stack

- **Frontend**: Vue 3 (Composition API) with TypeScript, Vite, and Vue Router.
- **State Management**: Pinia
- **Backend (API)**: Fastify with tRPC for end-to-end type-safe APIs.
- **Backend (Workflows)**: Hono on Cloudflare Workers for durable, asynchronous tasks.
- **Database**: Firestore
- **Package Manager**: pnpm Workspaces

---

## Project Structure

This project is a monorepo managed by `pnpm`. The primary packages are located in the `/packages` directory:

- **`/packages/client`**: The Vue.js frontend application.
- **`/packages/server`**: The Fastify/tRPC backend server responsible for the main CRUD API and connecting to Firestore.
- **`/packages/workflow`**: The Hono/Cloudflare Worker service for handling background jobs like sending emails and SMS.

---

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm (`npm install -g pnpm`)
- Firebase project with Firestore enabled.
- Cloudflare account.

### Installation

1. Clone the repository.
2. Install all dependencies from the root directory:
   ```bash
   pnpm install
   ```

### Running in Development

1. Create a `.env` file in `/packages/server` for your database credentials.
2. Create a `.dev.vars` file in `/packages/workflow` for your Cloudflare secrets (API keys for Resend, Twilio, etc.).
3. Run all services concurrently from the root directory:
   ```bash
   pnpm run dev
   ```