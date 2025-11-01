# 🚀 FarmConnect - Quick Start Guide

## ✅ Frontend Setup Complete!

Your new React frontend is ready with a clean, organized structure.

---

## 📋 What's Been Created

### **Folder Structure:**
```
frontend/
├── src/
│   ├── components/          ✅ Header, Footer, ProtectedRoute
│   ├── pages/              ✅ Home, Login, Register, Shop
│   │   └── farmer/         ✅ FarmerDashboard, CropRecommendation
│   ├── context/            ✅ AuthContext, CartContext
│   ├── services/           ✅ API, Auth, Product, Order, ML services
│   ├── hooks/              ✅ useAuth custom hook
│   ├── utils/              ✅ storage, constants
│   ├── styles/             ✅ Component & page styles
│   └── layouts/            ✅ MainLayout
├── .env                    ✅ Environment configuration
└── package.json            ✅ Dependencies installed
```

### **Features Implemented:**
- ✅ User Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Shopping Cart with Context
- ✅ Product Browsing & Search
- ✅ Farmer Dashboard
- ✅ AI Crop Recommendation (ML Integration)
- ✅ Order Management
- ✅ Responsive Design with Clean CSS

---

## 🎯 How to Run

### **1. Start Backend** (Terminal 1)
```powershell
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### **2. Start ML Service** (Terminal 2)
```powershell
cd ml-service
python app.py
```
ML Service runs on: http://localhost:8001

### **3. Start Frontend** (Terminal 3)
```powershell
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🔑 Test Accounts

You can register new users or use existing accounts from your database.

**Farmer Account:**
- Register with role: "farmer"
- Access: Farmer Dashboard, Crop Recommendation, Product Management

**Customer Account:**
- Register with role: "customer"
- Access: Shop, Cart, Orders

---

## 📁 Key Files to Know

### **Configuration:**
- `frontend/.env` - API endpoints
- `frontend/src/utils/constants.js` - App constants

### **Authentication:**
- `frontend/src/context/AuthContext.jsx` - Auth state management
- `frontend/src/services/auth.service.js` - Auth API calls
- `frontend/src/components/ProtectedRoute.jsx` - Route protection

### **Shopping:**
- `frontend/src/context/CartContext.jsx` - Cart state
- `frontend/src/pages/Shop.jsx` - Product listing
- `frontend/src/services/product.service.js` - Product API

### **Farmer Features:**
- `frontend/src/pages/farmer/FarmerDashboard.jsx` - Dashboard
- `frontend/src/pages/farmer/CropRecommendation.jsx` - ML predictions
- `frontend/src/services/ml.service.js` - ML API calls

---

## 🎨 Customization

### **Change Colors:**
Edit `frontend/src/index.css`:
```css
:root {
  --primary-color: #10b981;  /* Change this */
  --secondary-color: #059669;
  /* ... more colors */
}
```

### **Add New Pages:**
1. Create page in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="your-route" element={<YourPage />} />
```

### **Add New API Service:**
1. Create service in `src/services/your.service.js`
2. Import and use in components

---

## 🐛 Troubleshooting

### **Frontend won't start:**
```powershell
cd frontend
npm install
npm run dev
```

### **API connection issues:**
- Check backend is running on port 5000
- Verify `.env` has correct API_URL
- Check browser console for errors

### **Authentication not working:**
- Clear browser localStorage: `localStorage.clear()`
- Check backend JWT_SECRET is set
- Verify tokens in browser DevTools → Application → Local Storage

### **ML predictions failing:**
- Ensure ML service is running on port 8001
- Check ML service loaded models successfully
- Verify backend `.env` has ML_SERVICE_URL=http://localhost:8001

---

## 📝 Next Steps

1. ✅ **Test the application** - Try registering, logging in, browsing products
2. ✅ **Test Farmer features** - Create farmer account, add products, try crop recommendation
3. ✅ **Customize styling** - Update colors, fonts, layouts as needed
4. ✅ **Add more features** - Orders page, profile page, etc.

---

## 🆘 Need Help?

Common issues:
- **Port already in use**: Change port in `vite.config.js`
- **CORS errors**: Check backend CORS settings
- **Module not found**: Run `npm install` again

---

## ✨ You're All Set!

Start all three services and visit:
👉 **http://localhost:5173**

Happy coding! 🌾
