# 💼 Expense Management System - MERN Stack

A complete full-stack expense management system built with **MongoDB, Express.js, React, and Node.js (MERN Stack)** for the **Odoo Hackathon 2025**.

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin, Manager, Employee)
- Password hashing with bcrypt
- Protected routes and API endpoints

### 💰 Expense Management
- Create, read, update, delete expenses
- Multi-currency support (163 currencies)
- Real-time currency conversion
- Receipt upload (image/PDF)
- **OCR Receipt Scanning** - Auto-extract merchant, amount, date, category
- Draft and submit workflow

### ✅ Multi-Level Approval System
- **3-Level Approval Workflow** (Manager → Finance → Director)
- **Conditional Approval Rules**:
  - Percentage Rule (60% approval threshold)
  - Specific Approver Rule (CFO/Director bypass)
  - Hybrid Rule (OR logic combining both)
- **IS MANAGER APPROVER** configuration
- Approval comments (required)
- Complete approval history timeline
- Real-time status updates

### 👥 User Management (Admin)
- Create, edit, delete users
- Assign roles and managers
- Department management
- Active/inactive user status

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Expense statistics and charts
- Pending approvals view
- Search and filter capabilities

## 🏗️ Project Structure

```
expense-management/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   ├── constants/     # Constants and config
│   │   └── routes/        # Route configuration
│   ├── public/            # Static assets
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, upload, etc.
│   │   └── utils/         # Helper functions
│   ├── uploads/           # Receipt storage
│   ├── .env               # Environment variables
│   └── package.json
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd expense-management
```

### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed database with initial data
npm run seed

# Start server (development mode)
npm run dev
```

Server will run on **http://localhost:5000**

### 3. Setup Frontend

```bash
# Navigate to client directory (from root)
cd ../client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5173**

## 🔑 Test Credentials (After Seeding)

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@expense.com | admin123 | Full system access |
| **Manager** | john@expense.com | manager123 | Approve expenses, view team |
| **Manager** | jane@expense.com | manager123 | Approve expenses, view team |
| **Employee** | alice@expense.com | employee123 | Create/submit expenses |
| **Employee** | bob@expense.com | employee123 | Create/submit expenses |
| **Employee** | carol@expense.com | employee123 | Create/submit expenses |

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### Expense Endpoints
- `GET /expenses` - Get all expenses
- `POST /expenses` - Create expense
- `GET /expenses/:id` - Get expense details
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `POST /expenses/:id/submit` - Submit for approval
- `GET /expenses/pending-approval` - Pending approvals

### Approval Endpoints
- `POST /approvals/:id/approve` - Approve expense
- `POST /approvals/:id/reject` - Reject expense
- `GET /approvals/:id/history` - Approval history
- `GET /approvals/config` - Get approval config
- `PUT /approvals/config` - Update approval config

### User Management Endpoints
- `GET /users` - Get all users (Admin)
- `POST /users` - Create user (Admin)
- `GET /users/:id` - Get user (Admin)
- `PUT /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `GET /users/managers` - Get managers list

## 🎯 Key Features Implementation

### OCR Receipt Scanning
- **Library**: Tesseract.js (browser-based OCR)
- **Auto-extracts**: Merchant name, amount, currency, date, category
- **Real-time progress**: Shows scanning percentage
- **Editable results**: User can review and modify extracted data

### Multi-Level Approval Workflow
1. **Employee submits** expense
2. **Level 1** (Manager) reviews and approves/rejects
3. **Level 2** (Finance) - conditional approval
4. **Level 3** (Director) - final approval
5. **Conditional rules** can auto-approve based on percentage or specific approver

### Currency Conversion
- **163 currencies** supported
- **Real-time exchange rates** from open API
- **Automatic conversion** to base currency (USD)
- **Display**: Shows original + converted amount

### Approval Comments
- **Required** when approving or rejecting
- **Stored** in approval history
- **Timeline view** with timestamps and approver details

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client
- **Tesseract.js** - OCR
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **CORS** - Cross-origin support

## 📦 Scripts

### Server Scripts
```bash
npm start          # Production mode
npm run dev        # Development mode (nodemon)
npm run seed       # Seed database
```

### Client Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## 🔧 Configuration

### Server Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense_management
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### Client Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy automatically

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

### MongoDB Atlas
1. Create cluster on MongoDB Atlas
2. Update `MONGODB_URI` in server `.env`
3. Whitelist IP addresses

## 🐛 Troubleshooting

### Backend Issues
**MongoDB Connection Error**
- Ensure MongoDB is running locally
- Check `MONGODB_URI` in `.env`
- For Atlas, verify network access settings

**JWT Token Error**
- Verify `JWT_SECRET` is set
- Check Authorization header format

**File Upload Error**
- Ensure `uploads/` directory exists
- Check `MAX_FILE_SIZE` limit

### Frontend Issues
**API Connection Error**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS is enabled on backend

**OCR Not Working**
- Check image file format (PNG, JPG, JPEG)
- Ensure image text is clear and readable
- Check browser console for errors

## 📝 Development Workflow

1. **Backend Development**
   - Modify models in `server/src/models/`
   - Add routes in `server/src/routes/`
   - Add controllers in `server/src/controllers/`
   - Test with Postman/Thunder Client

2. **Frontend Development**
   - Create components in `client/src/components/`
   - Add pages in `client/src/pages/`
   - Add API calls in `client/src/api/`
   - Test in browser

3. **Testing**
   - Seed database: `npm run seed` (in server/)
   - Login with test credentials
   - Test all features end-to-end

## 🎓 Learning Resources

- **MERN Stack**: https://www.mongodb.com/mern-stack
- **React**: https://react.dev
- **Express.js**: https://expressjs.com
- **MongoDB**: https://www.mongodb.com/docs
- **Mongoose**: https://mongoosejs.com

## 👥 Team

**TechieTribes** - Odoo Hackathon 2025

## 📄 License

ISC License

---

## 🎉 Hackathon Requirements Met

✅ **Currency Conversion** - Multi-currency support with real-time conversion  
✅ **OCR Receipt Scanning** - Tesseract.js integration with auto-extraction  
✅ **Multi-Level Approval** - 3-level configurable workflow  
✅ **Conditional Rules** - Percentage, Specific Approver, Hybrid rules  
✅ **IS MANAGER APPROVER** - Admin configuration option  
✅ **Approval Comments** - Required comments with history  
✅ **Approval History** - Complete audit trail  
✅ **Role-Based Access** - Admin, Manager, Employee roles  
✅ **MERN Stack** - Full-stack implementation  
✅ **MongoDB Integration** - Real database with Mongoose ODM  
✅ **JWT Authentication** - Secure token-based auth  
✅ **File Upload** - Receipt storage with Multer  

---

Built with ❤️ for Odoo Hackathon 2025 🚀
