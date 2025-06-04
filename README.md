# Sandbox Demo

A Next.js 15 application with TypeScript, Tailwind CSS, and Shadcn UI components that demonstrates a simple message board using a FastAPI backend.

## Features

- Form with textarea for submitting messages
- Validation: required, ≤ 280 characters
- Paginated table showing all messages
- Auto-refresh every 10 seconds
- API health check indicator

## Backend API

The application connects to a FastAPI backend at:
`https://cloud-flare-694581007726.us-central1.run.app`

### Expected API Endpoints

- `GET /` - Health check endpoint
- `GET /messages` - Fetch all messages
- `POST /messages` - Create a new message

### Message Schema

\`\`\`json
{
  "id": 1,
  "message": "Hello World",
  "created_at": "2025-06-02T20:11:45.123Z"
}
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Development

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Deploy to Cloudflare Workers

### Prerequisites

- Cloudflare account
- Wrangler CLI installed globally (`npm install -g wrangler`)
- Authenticated with Cloudflare (`wrangler login`)

### Deployment Steps

1. Build the application:

\`\`\`bash
npm run build
\`\`\`

2. Deploy to Cloudflare Pages:

\`\`\`bash
npm run deploy
\`\`\`

3. Deploy to Cloudflare Workers:

\`\`\`bash
npm run deploy:cf
\`\`\`

This will deploy the application to the Sandbox environment at `sandbox.o6ai.com`.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- SWR for data fetching
- FastAPI backend
- Cloudflare Workers for deployment

## API Integration

The frontend includes graceful fallbacks:
- If the `/messages` endpoints are not available, it shows mock data
- Health check indicator shows API connection status
- Error handling for network issues
