# CashPoint Agent App - Backend API

Production-ready backend API for CashPoint Agent App with Neon PostgreSQL database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
The database connection is already configured in `.env` with your Neon database URL.

### 3. Initialize Database Schema
```bash
npm run build
node dist/database/migrate.js
```

This will:
- Create all tables (agents, users, favorites, transactions, reviews)
- Create indexes for performance
- Seed initial agent data

### 4. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts                 # Main Express server
│   ├── database/
│   │   └── migrate.ts           # Database schema & migrations
│   └── routes/
│       ├── agents.ts            # Agent/deposit point routes
│       ├── users.ts             # User management routes
│       ├── favorites.ts         # Favorites management
│       └── transactions.ts      # Transaction management
├── .env                         # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Agents (Deposit Points)
```
GET    /api/agents                      # Get all agents with filters
GET    /api/agents/:id                  # Get agent by ID
GET    /api/agents/search/:query        # Search agents
GET    /api/agents/nearby/:lat/:lng     # Get nearby agents
PATCH  /api/agents/:id/status           # Update agent status
```

### Users
```
POST   /api/users/login                 # Create or login user
GET    /api/users/:id                   # Get user by ID
PUT    /api/users/:id                   # Update user
```

### Favorites
```
GET    /api/favorites/user/:userId              # Get user's favorites
POST   /api/favorites                           # Add to favorites
DELETE /api/favorites/:userId/:agentId          # Remove from favorites
GET    /api/favorites/check/:userId/:agentId    # Check if favorited
```

### Transactions
```
POST   /api/transactions                # Create transaction
GET    /api/transactions                # Get all transactions
GET    /api/transactions/:id            # Get transaction by ID
GET    /api/transactions/user/:userId   # Get user transactions
GET    /api/transactions/agent/:agentId # Get agent transactions
PATCH  /api/transactions/:id/status     # Update transaction status
```

### Health Checks
```
GET    /health                          # Server health
GET    /api/health/db                   # Database health
```

## 🗄️ Database Schema

### Tables
1. **agents** - Deposit points/agent information
2. **users** - User accounts
3. **favorites** - User's saved agents
4. **transactions** - Transaction records
5. **reviews** - User reviews for agents

## 📝 Example Usage

### Get All Agents
```bash
curl http://localhost:3000/api/agents
```

### Search Agents
```bash
curl http://localhost:3000/api/agents/search/kirana
```

### Get Nearby Agents
```bash
curl http://localhost:3000/api/agents/nearby/28.6139/77.2090?radius=10
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "fullName": "John Doe"}'
```

### Add to Favorites
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "agent_id": 1}'
```

### Create Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"agent_id": 1, "type": "Cash In", "amount": 500, "commission": 7.50}'
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run migrate    # Run database migrations
```

## 🌐 Environment Variables

```env
DATABASE_URL=postgresql://...    # Neon database connection string
PORT=3000                        # Server port
NODE_ENV=development             # Environment mode
```

## 🚢 Production Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
NODE_ENV=production npm start
```

### Database Migration
```bash
npm run migrate
```

## 📊 Database Connection

The app uses **Neon PostgreSQL** with connection pooling for optimal performance:

- **SSL Enabled**: Required for Neon database
- **Connection Pooling**: Manages multiple concurrent connections
- **Auto-Reconnect**: Handles connection drops gracefully

## 🔐 Security Features

- CORS enabled for frontend communication
- Parameterized queries (SQL injection protection)
- Input validation
- Error handling middleware
- Environment variable protection

## 🐛 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📈 Response Format

Success responses:
```json
{
  "success": true,
  "data": {},
  "count": 10,
  "message": "Optional message"
}
```

## 🧪 Testing

Test the API using:
- **Postman**: Import endpoints and test
- **curl**: Use examples above
- **Browser**: Visit `http://localhost:3000/health`

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **typescript** - Type safety
- **nodemon** - Development auto-reload

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Run migrations: `npm run build && node dist/database/migrate.js`
3. Start server: `npm run dev`
4. Test endpoints using Postman or curl
5. Integrate with React Native frontend

## 📞 Support

For issues or questions, check the error logs in the terminal.

---

**Backend is ready to use!** 🚀
