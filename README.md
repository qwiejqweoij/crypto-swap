# crypto-swap

A full-stack cryptocurrency exchange app built with React (TypeScript) + Express.js.

## Features

- Swap between BTC, ETH, XMR, LTC, TRX, and popular ERC-20/TRC-20 tokens
- Live prices via CoinGecko
- Exchange quotes and order creation via SimpleSwap
- Demo mode for testing without API keys

## Project Structure

```
crypto-swap/
├── backend/   # Express.js API (prices, quotes, swap execution)
└── frontend/  # React + TypeScript + Tailwind CSS UI
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [SimpleSwap](https://simpleswap.io) API key (optional — demo mode works without one)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add your SIMPLESWAP_API_KEY
npm run dev
```

The API runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SIMPLESWAP_API_KEY` | No | SimpleSwap API key. Omit to run in demo mode. |
| `PORT` | No | Backend port (default: `3001`) |
