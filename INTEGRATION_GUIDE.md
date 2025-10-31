# FarmConnect Frontend2 Integration - Quick Guide

## ✅ Phase 1 COMPLETED
- Installed axios
- Created services, utils, context folders
- Added api.js, storage.js, AuthContext.js
- Wrapped App in AuthProvider
- Changed paths from /Grocery-react/ to /

## ⚠️ Current Status:
MyAccountSignIn.jsx has been updated but has duplicate code. 

## 🔧 Quick Fix Needed:

### Fix MyAccountSignIn.jsx:
Lines 163-169 have duplicate "Sign In" button code. Remove lines:
```
          Sign In
        </button>
      </div>
```
Keep only the version with `disabled={loading}` and conditional text.

## 📝 Next Steps - Phase 2 (Authentication):

### 1. Fix MyAccountSignUp.jsx
Add these imports at top:
```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../../services/api';
import { storeToken, storeUserData } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
```

Add state and logic before return:
```javascript
const navigate = useNavigate();
const { login } = useAuth();
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'customer',  // or get from URL params
  farmLocation: '',
  farmSize: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: ''
  }
});
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await authAPI.register(formData);
    if (response.data.success) {
      storeToken(response.data.token);
      storeUserData(response.data.user);
      login(response.data.user);
      Swal.fire({ icon: 'success', title: 'Account created!', timer: 1500 });
      navigate(response.data.user.role === 'farmer' ? '/farmer/dashboard' : '/Shop');
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.response?.data?.message });
  } finally {
    setLoading(false);
  }
};
```

Update form inputs with name, value, onChange props and combine First/Last name into one "name" field.

### 2. Update Header.jsx
Add at top:
```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
```

Use auth:
```javascript
const { user, logout, isFarmer, isCustomer } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate('/');
};
```

Show user name and logout button when logged in. Show farmer/customer specific menu items based on role.

## 📝 Phase 3 (Customer Interface - Connect to Backend):

### Update Shop.jsx (Products):
Replace static product arrays with:
```javascript
import { productAPI } from '../../services/api';

useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  const response = await productAPI.getAllProducts();
  setProducts(response.data.products);
};
```

### Create ShopTools.jsx (Tools):
Copy Shop.jsx, rename to ShopTools.jsx, change API to toolAPI.getAllTools(), show rental pricing instead of regular price.

### Update ShopCart.jsx:
Store cart with backend product/tool IDs, add quantity/rental days controls.

### Update ShopCheckOut.jsx:
Loop through cart items, create orders using orderAPI.createOrder() for each item.

### Update MyAccountOrder.jsx:
```javascript
import { orderAPI } from '../../services/api';

useEffect(() => {
  const fetchOrders = async () => {
    const response = await orderAPI.getMyOrders();
    setOrders(response.data.orders);
  };
  fetchOrders();
}, []);
```
Display orders from backend.

## 📝 Phase 4 (Farmer Interface):

Create new folder: `src/pages/Farmer/`

### Files to create:
1. **FarmerDashboard.jsx** - Stats, quick actions (use frontend2 styling)
2. **AddProduct.jsx** - Form to add products (use existing form styles)
3. **MyProducts.jsx** - List farmer's products (use Shop.jsx card style)
4. **AddTool.jsx** - Form to add tools
5. **MyTools.jsx** - List farmer's tools

Use same Bootstrap classes and styling as existing pages!

## 📝 Phase 5 (Routing):

Add to App.js Routes:
```javascript
{/* Farmer Routes - Protected */}
<Route path="/farmer/dashboard" element={<FarmerDashboard />} />
<Route path="/farmer/add-product" element={<AddProduct />} />
<Route path="/farmer/my-products" element={<MyProducts />} />
<Route path="/farmer/add-tool" element={<AddTool />} />
<Route path="/farmer/my-tools" element={<MyTools />} />
<Route path="/ShopTools" element={<ShopTools />} />
```

## 🚀 Run Commands:

Backend:
```powershell
cd FarmConnect\backend
npm start
```

Frontend2:
```powershell
cd FarmConnect\frontend2
npm start
```

## 📌 Key Points:
- Keep all frontend2 UI/styling
- Just replace mock data with API calls
- Add farmer pages using same Bootstrap components
- Use Swal for alerts (already installed)
- All backend logic is ready - just connect!

