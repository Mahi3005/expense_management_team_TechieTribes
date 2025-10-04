# Expense Management System - Backend API

Complete REST API for the Expense Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ **JWT Authentication** - Secure user authentication with JSON Web Tokens
- ✅ **Role-Based Access Control** - Admin, Manager, and Employee roles
- ✅ **Multi-Level Approval Workflow** - Configurable 3-level approval system
- ✅ **Conditional Approval Rules** - Percentage, Specific Approver, and Hybrid rules
- ✅ **File Upload** - Receipt image/PDF upload with Multer
- ✅ **MongoDB Integration** - Mongoose ODM with schema validation
- ✅ **API Security** - CORS, input validation, password hashing
- ✅ **Approval History** - Complete audit trail of all approvals/rejections

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── expenseController.js # Expense CRUD operations
│   │   ├── approvalController.js # Approval workflow
│   │   └── userController.js   # User management
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & authorization
│   │   └── upload.js           # File upload configuration
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Expense.js          # Expense schema
│   │   └── ApprovalConfig.js   # Approval rules schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── expenseRoutes.js    # Expense endpoints
│   │   ├── approvalRoutes.js   # Approval endpoints
│   │   └── userRoutes.js       # User management endpoints
│   ├── utils/
│   │   └── seed.js             # Database seeding script
│   └── server.js               # Main application entry
├── uploads/                    # Receipt file storage
├── .env                        # Environment variables
├── .env.example                # Environment template
└── package.json

```

## ⚙️ Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on **http://localhost:5000**

## 🔑 Test Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@expense.com | admin123 |
| Manager | john@expense.com | manager123 |
| Manager | jane@expense.com | manager123 |
| Employee | alice@expense.com | employee123 |
| Employee | bob@expense.com | employee123 |
| Employee | carol@expense.com | employee123 |

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
PUT    /api/auth/profile      - Update profile
```

### Expenses
```
GET    /api/expenses                    - Get all expenses (filtered by role)
POST   /api/expenses                    - Create new expense
GET    /api/expenses/:id                - Get single expense
PUT    /api/expenses/:id                - Update expense
DELETE /api/expenses/:id                - Delete expense
POST   /api/expenses/:id/submit         - Submit for approval
GET    /api/expenses/pending-approval   - Get pending approvals (Manager/Admin)
```

### Approvals
```
POST   /api/approvals/:expenseId/approve   - Approve expense (Manager/Admin)
POST   /api/approvals/:expenseId/reject    - Reject expense (Manager/Admin)
GET    /api/approvals/:expenseId/history   - Get approval history
GET    /api/approvals/config               - Get approval configuration (Admin)
PUT    /api/approvals/config               - Update approval config (Admin)
```

### Users
```
GET    /api/users           - Get all users (Admin)
POST   /api/users           - Create user (Admin)
GET    /api/users/:id       - Get single user (Admin)
PUT    /api/users/:id       - Update user (Admin)
DELETE /api/users/:id       - Delete user (Admin)
GET    /api/users/managers  - Get managers list (All authenticated)
```

### Health Check
```
GET    /api/health          - Server health status
```

## 🔒 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## 🎯 Multi-Level Approval Logic

1. **Level 1**: Manager approval (required)
2. **Level 2**: Finance team approval (conditional)
3. **Level 3**: Director approval (conditional)

### Conditional Rules

- **Percentage Rule**: Auto-approve if 60%+ approvers approve
- **Specific Approver Rule**: Auto-approve if CFO/Director approves (bypass)
- **Hybrid Rule**: Auto-approve if EITHER percentage OR specific approver approves

## 📝 Database Models

### User Schema
- name, email, password (hashed)
- role: employee | manager | admin
- department, managerId
- isActive, avatar
- timestamps

### Expense Schema
- employee (ref: User)
- description, amount, currency, category
- expenseDate, paidBy, remarks
- receipt (file info)
- status: Draft | Waiting Approval | Approved | Rejected | Partially Approved
- currentApprovalLevel
- approvalHistory[]
- ocrData (for OCR extraction results)
- timestamps

### ApprovalConfig Schema
- isManagerApprover, approvalSequence
- minApprovalPercentage
- conditionalRules: {percentageRule, specificApproverRule, hybridRule}
- approvalRules[] (level, approver, required, description)
- isActive
- timestamps

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```

### Reseed Database
```bash
npm run seed
```

### Test API with Postman/Thunder Client
Import the collection and test all endpoints with the seeded credentials.

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**JWT Token Error:**
- Verify JWT_SECRET is set
- Check token format in Authorization header

**File Upload Error:**
- Check MAX_FILE_SIZE limit
- Ensure uploads/ directory exists

## 📚 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **morgan** - HTTP request logger
- **express-validator** - Input validation
- **dotenv** - Environment variable management

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_secret>
CLIENT_URL=<your_frontend_url>
```

### Deployment Platforms
- **Render** - Easy deployment with free tier
- **Railway** - Simple Git-based deployment
- **Heroku** - Classic platform-as-a-service
- **DigitalOcean** - Full control with droplets

---

Built with ❤️ by **TechieTribes** for Odoo Hackathon 2025
