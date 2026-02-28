# Adaptive Moderation System — Frontend

Real-time decision-support dashboard for content moderation under uncertainty. Built with **Next.js 14**, **TypeScript**, and **Zustand**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5.5 (Strict) |
| State | Zustand 4.5 |
| Data Fetching | React Query 5.51 |
| Real-time | Socket.IO Client 4.7 |
| Styling | SCSS Modules |
| Icons | Lucide React |

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main dashboard page + layout
│   ├── globals.scss      # Global theme (light/white/gray)
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── ContentStream/    # Live content feed with stage filters
│   ├── RiskTimeline/     # Risk score evolution bar chart
│   ├── DecisionCard/     # Auto-action / Escalation / Defer scores
│   ├── HumanAllocator/   # Reviewer capacity & priority queue
│   ├── ContextPanel/     # Multilingual context & translation risk
│   ├── FeedbackTracker/  # Loop health, bias signals, conflicts
│   ├── CostDashboard/    # Budget utilization & cost projections
│   ├── AdaptationMonitor/# Technique diversity & rotation alerts
│   ├── FailureOverlay/   # Dismissible failure banners
│   └── shared/           # ConfidenceMeter, ScoreBar, StageChip, etc.
├── stores/               # 7 Zustand stores
├── hooks/                # 10 React Query + Socket hooks
├── lib/                  # API client, Socket manager, Query client
├── providers/            # React Query provider wrapper
└── types/                # Full TypeScript type definitions
```

## Stores

| Store | Purpose |
|-------|---------|
| `contentStore` | Content items, stage filtering, decay tracking |
| `riskStore` | Risk snapshots, timelines, decay curves |
| `decisionStore` | Recommendations, trust predictions, content selection |
| `humanReviewStore` | Reviewer capacity, priority queue, overload detection |
| `costStore` | Budget tracking, burn ratio, projections |
| `adaptationStore` | Technique usage, diversity, rotation suggestions |
| `feedbackStore` | Label confidence, bias signals, poison detection |

## API Endpoints

The frontend expects a backend at `http://localhost:8000` with these routes:

- `GET /api/content/stream` — Live content items
- `GET /api/risk/current/:id` — Current risk for content
- `GET /api/risk/decay/:id` — Risk decay curve
- `GET /api/decision/recommend/:id` — Decision recommendation
- `GET /api/decision/trust/:id` — Trust prediction
- `GET /api/human/capacity` — Reviewer capacity
- `GET /api/context/analyze/:id` — Language & context analysis
- `GET /api/context/translation-risk/:id` — Translation risk
- `GET /api/feedback/confidence/:id` — Feedback confidence
- `GET /api/feedback/conflict/:id` — Feedback conflicts
- `GET /api/cost/current` — Current cost metrics
- `GET /api/cost/projection` — Budget projections
- `GET /api/adaptation/usage` — Technique usage stats
- `GET /api/adaptation/risk` — Adaptation risk metrics
- `GET /api/adaptation/rotate` — Rotation suggestions
- `GET /api/failure/:type` — Failure signals

## WebSocket Namespaces

| Namespace | Events |
|-----------|--------|
| `/ws/content` | `content:new`, `content:update`, `content:stage` |
| `/ws/risk` | `risk:snapshot`, `risk:decay` |
| `/ws/decision` | `decision:recommendation`, `decision:trust` |
| `/ws/human` | `human:capacity`, `human:priority` |
| `/ws/cost` | `cost:update`, `cost:projection` |

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit

# Lint
npx next lint
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Design

- **Light theme** — white cards on gray (#f7f8fa) background
- **DM Sans** font family with IBM Plex Mono for code
- Premium card shadows with hover elevation
- Pill-shaped filter buttons and status badges
- Lucide icons throughout (Radio, ShieldAlert, Scale, Users, Globe, MessageCircle, Wallet, Shuffle)
- Sleek transitions and subtle hover effects on all interactive elements
