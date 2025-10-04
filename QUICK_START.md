# 🚀 Quick Start Guide - Expense Management System

## ⚡ Super Fast Setup (5 Minutes)

### Step 1: Install MongoDB
```bash
# Windows: Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# OR use MongoDB Atlas (cloud)
# https://www.mongodb.com/cloud/atlas
```

### Step 2: Start Backend
```bash
# Open terminal in project root
cd server

# Install dependencies
npm install

# Seed database with test data
npm run seed

# Start server
npm run dev
```

**Output should show:**
```
✅ MongoDB Connected: localhost
🚀 Expense Management API Server
📡 Port: 5000
```

### Step 3: Start Frontend
```bash
# Open NEW terminal in project root
cd client

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Open browser:** http://localhost:5173

### Step 4: Login & Test

**Test Credentials:**
- **Admin**: admin@expense.com / admin123
- **Manager**: john@expense.com / manager123
- **Employee**: alice@expense.com / employee123

---

## 🎯 What to Test

### As Employee (alice@expense.com)
1. ✅ **Create Expense** - Click "New Expense"
2. ✅ **OCR Scan** - Upload receipt image → Auto-extract data
3. ✅ **Submit for Approval** - Click submit button
4. ✅ **View History** - See approval timeline

### As Manager (john@expense.com)
1. ✅ **View Pending** - See waiting approval expenses
2. ✅ **Currency Conversion** - Auto-converts to USD
3. ✅ **Add Comment** - Required when approving/rejecting
4. ✅ **Approve/Reject** - Action buttons

### As Admin (admin@expense.com)
1. ✅ **User Management** - Create, edit, delete users
2. ✅ **Approval Rules** - Configure multi-level workflow
3. ✅ **IS MANAGER APPROVER** - Enable/disable checkbox
4. ✅ **Conditional Rules** - Set percentage, specific approver, hybrid

---

## 📁 File Structure

```
📦 expense-management/
├── 📂 server/              → Backend API
│   ├── src/
│   │   ├── models/         → MongoDB schemas
│   │   ├── controllers/    → Business logic
│   │   ├── routes/         → API endpoints
│   │   └── middleware/     → Auth, upload
│   └── .env               → MongoDB URI, JWT secret
│
├── 📂 client/              → React Frontend
│   ├── src/
│   │   ├── api/           → API service layer ⭐
│   │   ├── components/    → UI components
│   │   └── pages/         → Page views
│   └── .env               → API URL
│
└── README.md              → Full documentation
```

---

## 🔧 Configuration Files

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_management
JWT_SECRET=expense_management_secret_key_2025_hackathon
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Common Issues

### ❌ "Cannot connect to MongoDB"
**Solution:**
```bash
# Make sure MongoDB is running
# Windows: Start MongoDB service
# OR use MongoDB Atlas connection string
```

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in server/.env to 5001
PORT=5001

# Update client/.env
VITE_API_URL=http://localhost:5001/api
```

### ❌ "Cannot GET /api/..."
**Solution:**
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify VITE_API_URL in client/.env

### ❌ "OCR not scanning"
**Solution:**
- Use clear receipt images (PNG/JPG)
- Make sure text is readable
- Wait for progress bar to complete

---

## 📊 API Testing (Postman/Thunder Client)

### 1. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@expense.com",
  "password": "admin123"
}
```

### 2. Get Expenses (with token)
```http
GET http://localhost:5000/api/expenses
Authorization: Bearer <your_token>
```

### 3. Create Expense
```http
POST http://localhost:5000/api/expenses
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

description: "Test expense"
amount: 100
currency: "USD"
category: "Food"
expenseDate: "2025-10-04"
```

---

## 🎓 Learning Path

1. **Day 1**: Setup & Login
   - Install MongoDB
   - Run seed script
   - Login with test accounts

2. **Day 2**: Explore Features
   - Create expenses as employee
   - Approve as manager
   - Configure rules as admin

3. **Day 3**: Understand Code
   - Read `server/src/models/` - Database schemas
   - Read `client/src/api/` - API integration
   - Read `server/src/controllers/` - Business logic

4. **Day 4**: Customize
   - Add new expense categories
   - Modify approval rules
   - Add new features

---

## 🚀 Deployment Checklist

### Backend (Render/Railway)
- [ ] Push code to GitHub
- [ ] Create new web service
- [ ] Set environment variables
- [ ] Connect MongoDB Atlas
- [ ] Deploy

### Frontend (Vercel/Netlify)
- [ ] Push code to GitHub
- [ ] Create new site
- [ ] Set build command: `npm run build`
- [ ] Set VITE_API_URL to production backend URL
- [ ] Deploy

---

## 📞 Need Help?

### Check These First:
1. ✅ MongoDB is running
2. ✅ Both terminals are running (server & client)
3. ✅ Port 5000 and 5173 are available
4. ✅ .env files are configured correctly

### Documentation:
- **Full README**: /README.md
- **Server README**: /server/README.md
- **API Examples**: /server/README.md#-api-endpoints

---

## ⭐ Key Features to Demonstrate

### 1. OCR Receipt Scanning
- Upload receipt image
- Watch real-time progress
- See auto-extracted data
- Edit if needed

### 2. Multi-Level Approval
- Submit as employee
- Approve as manager (Level 1)
- See status update
- View approval history

### 3. Conditional Rules (Admin)
- Set percentage rule (60%)
- Enable specific approver bypass
- Configure hybrid rule
- Test approval workflow

### 4. Currency Conversion
- Create expense in EUR/GBP/INR
- Manager sees USD conversion
- Shows exchange rate
- Original + converted amount

### 5. Role-Based Access
- Login as different roles
- See different dashboards
- Test permissions
- Try unauthorized actions

---

## 🎉 Success Indicators

When everything is working:

✅ Backend console shows "MongoDB Connected"  
✅ Frontend loads on http://localhost:5173  
✅ Login with test credentials works  
✅ Can create and submit expenses  
✅ OCR extracts data from receipts  
✅ Manager can approve/reject  
✅ Admin can configure rules  
✅ All dashboards load correctly  

---

**Estimated Setup Time:** 5-10 minutes  
**Prerequisites:** Node.js v16+, MongoDB  
**Difficulty:** Beginner to Intermediate  

---

Built with ❤️ for Odoo Hackathon 2025 by TechieTribes 🚀
