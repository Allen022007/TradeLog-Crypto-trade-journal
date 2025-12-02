# TradeLog - Crypto Trading Journal

A full-stack MERN application for tracking crypto trades with JWT Authentication.

## 🚀 Scalability & Production Strategy
**Architecture:** MERN Stack (Monolithic MVP)

### 1. Moving from Monolith to Microservices
While the current monolithic architecture is perfect for an MVP, a high-frequency trading application requires decoupling.
* **Auth Service:** Isolate user authentication (JWT handling) to a separate service to reduce load on core trade logic.
* **Trade Engine:** A dedicated service for CRUD operations on trade logs.
* **Market Data Service:** A separate worker to fetch real-time crypto prices (e.g., CoinGecko/Binance API) via WebSockets.

### 2. Database Optimization
* **Sharding:** Implement MongoDB Sharding based on `userId` to distribute data across multiple servers.
* **Indexing:** Strict compound indexing on `{ user: 1, symbol: 1 }` for sub-millisecond dashboard queries.

### 3. Caching Strategy (Redis)
* **API Response Caching:** Cache the "Dashboard Summary" for 60 seconds to reduce DB hits.
* **Session Management:** Store active tokens in Redis for instant logout capabilities.

## 🛠 Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Security:** BCrypt, JWT, Helmet
