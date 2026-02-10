# HiScore — Base Chain Trader Leaderboard

Real-time leaderboard tracking the best traders on Base chain.

## Quick Deploy

### Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**
5. Done! Live in ~60 seconds

### Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

### Local Development
```bash
npm install
npm run dev
```

## Backend API

All data comes from Supabase Edge Functions:

| Endpoint | Description |
|----------|------------|
| `/leaderboard` | Ranked wallets + live trade feed |
| `/sync-trades` | Fetch latest trades from Base chain |
| `/compute-stats` | Calculate PnL and rankings |
| `/add-wallet` | POST to track a new wallet |

Base URL: `https://ppqbosrweabdqayawhbw.supabase.co/functions/v1`

## Stack
- **Frontend**: React + Vite
- **Backend**: Supabase Edge Functions (Deno)
- **Data**: Alchemy (Base chain txs) + Birdeye (ETH pricing)
- **Database**: Supabase Postgres
