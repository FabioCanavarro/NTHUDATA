# ✨ NTHU HUB — Unified Campus OS

> ⚡ **100% VIBE-CODED with AI** • Built for NTHU Students • Live WipePay MQTT & TDX YouBike 2.0

NTHU Hub is a modern, high-performance, unified campus dashboard and open API for **National Tsing Hua University (國立清華大學)**.

---

### 🤙 100% Vibe-Coded Notice
> **This entire repository was 100% Vibe-Coded!** 🚀  
> Built with zero friction, pure vibes, real-time WebSocket engineering, reverse-engineered WipePay MQTT brokers, live TDX transportation scraping, and instant UI polish powered by Next.js 14, Framer Motion, and Tailwind CSS.

---

## 🌟 Key Features

### 🧺 Live Laundry Monitor & WipePay Direct Pay (`/laundry`)
- **Real-Time WipePay Broker**: Connects directly to `wss://wipepay.com.tw:443/mqtt/` streaming live machine status across 16 NTHU dormitories (113 real machines).
- **Exact Seconds Countdown Ticker**: Live 1-second interval ticking countdowns (`MM分SS秒`).
- **2-Column Split Dashboard**: Clean reference layout with `洗衣機` (Washers) and `烘衣機` (Dryers).
- **WipePay Direct Link (`操作 ↗`)**: Instant one-click redirect to WipePay payment control pages (`https://wipepay.com.tw/v2/machine/[MAC]/`).
- **Pinyin Support**: Dorm headers formatted cleanly with Pinyin labels.

### 🚲 YouBike 2.0 & Electric 2.0E Real-Time Map (`/youbike`)
- **Electric vs Standard Breakdown**: Tracks standard YouBike 2.0 and YouBike 2.0E (Electric) availability separately.
- **Interactive Map Pins**: Built with Leaflet & OpenStreetMap showing real-time dock occupancy.
- **Location Finder**: Automatically sorts campus stations by distance from your location.

### 🔍 Lost & Found Registry (`/lost-and-found`)
- **Campus Lost Items Registry**: Search and filter lost items retrieved across campus halls.
- **Dual Language**: Item titles formatted with English translations & Pinyin.

### 🏋️ Gym & Sports Facilities Tracker (`/gym`)
- **Real-Time Capacity Meters**: Headcount percentages and vacancy indicators for campus gyms, swimming pools, and sports courts.

### 📚 Library & Space Reservation Helper (`/library`)
- **Seat Availability by Level**: Real-time vacancy breakdown per library floor.
- **Reservation Guide**: Step-by-step guide for booking group study rooms and computer seats.

### 🍱 Food & Dining Venues (`/food`)
- **Dynamic Status Badges**: Real-time status indicators (`Open Now` 🟢, `Opening Soon` 🟡, `Closed` 🔴) with opening/closing hours.

---

## ⚡ Developer API (`/api/v1/...`)

All endpoints are built as Next.js Serverless API routes, optimized for deployment on Vercel:

- `GET /api/v1/washers` — Live laundry machines & WipePay MAC mappings
- `GET /api/v1/youbike` — Live YouBike 2.0 & 2.0E e-bike counts
- `GET /api/v1/gym` — Gym headcount & court availability
- `GET /api/v1/lost-and-found` — Campus lost & found registry
- `GET /api/v1/library` — Seat vacancy by floor
- `GET /api/v1/food` — Dining hall opening hours & status
- `GET /api/v1/overview` — Aggregated campus summary

---

## 🚀 Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/NTHUDATA.git
cd NTHUDATA

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

Deploy instantly using Vercel CLI or GitHub Integration:

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy directly
vercel
```

Or connect your GitHub repository directly in the [Vercel Dashboard](https://vercel.com/new).

---

## 📄 License

MIT License — Built for NTHU Students with ❤️
