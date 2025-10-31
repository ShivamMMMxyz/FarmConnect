# FarmConnect - Farmer Marketplace Website

A full-stack web application connecting farmers with customers. Farmers can sell their produce and rent out farm equipment, while customers can buy fresh products and rent tools.

## 🌟 Features

### For Farmers 🚜
- Separate farmer registration and login
- Dashboard to manage business
- Add and manage products (fruits, vegetables, grains, dairy)
- List tools for rent (tractors, ploughs, spray machines, threshers, etc.)
- Set rental prices (hourly, daily, weekly)
- View and manage inventory
- Track orders

### For Customers 🛒
- Separate customer registration and login
- Browse fresh produce from local farmers
- Search and filter products
- Rent farm tools
- Shopping cart functionality
- Place orders
- Order history and tracking

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **React Router** for routing
- **Axios** for API calls
- **CSS3** for styling
- **LocalStorage** for auth token management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
FarmConnect/
├── backend/                # Node.js/Express backend
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Tool.js
│   │   └── Order.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── tool.routes.js
│   │   └── order.routes.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   ├── server.js         # Server entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend/             # React/Vite frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── utils/       # Utility functions
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── public/          # Static assets
    └── package.json

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
The `.env` file is already created with your MongoDB URI. Verify it:
```
MONGO_URI=mongodb+srv://hwu:890890@clustermern.w96iu2k.mongodb.net/farmconnect?retryWrites=true&w=majority
JWT_SECRET=farmconnect_secret_key_2024_change_in_production
PORT=5000
NODE_ENV=development
```

4. **Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder (in a new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (farmer/customer)
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/farmer` - Get farmer's products (Auth required)
- `POST /api/products` - Add new product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)

### Tools
- `GET /api/tools` - Get all tools
- `GET /api/tools/farmer` - Get farmer's tools (Auth required)
- `POST /api/tools` - Add new tool (Farmer only)
- `PUT /api/tools/:id` - Update tool (Farmer only)
- `DELETE /api/tools/:id` - Delete tool (Farmer only)

### Orders
- `POST /api/orders` - Create new order (Customer only)
- `GET /api/orders/customer` - Get customer's orders (Auth required)
- `GET /api/orders/:id` - Get order details (Auth required)

## 🗄️ Database Models

### User
- name, email, password (hashed), phone, role (farmer/customer)
- **Farmer fields**: farmLocation, farmSize
- **Customer fields**: address (street, city, state, pincode)

### Product
- name, category, description, price, unit, quantity
- images, farmer (ref), farmerName, farmLocation
- isAvailable, createdAt

### Tool
- name, type, description, rentalPrice (hourly/daily/weekly)
- condition, images, farmer (ref), farmerName, location
- isAvailable, specifications, createdAt

### Order
- customer (ref), orderType (product/tool_rental)
- items, totalAmount, status, deliveryAddress
- paymentStatus, createdAt

## 👥 User Roles

### Farmer
- Green-themed interface
- Can add/edit/delete products and tools
- Can view orders for their products/tools
- Access to farmer dashboard

### Customer
- Blue-themed interface
- Can browse products and tools
- Can add items to cart
- Can place and track orders
- Access to customer dashboard

## 🔐 Authentication

- JWT-based authentication
- Tokens stored in localStorage
- Protected routes for authenticated users
- Role-based access control (Farmer/Customer)

## 🎨 Features to Implement Next

- [ ] Image upload functionality
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Chat between farmers and customers
- [ ] Ratings and reviews
- [ ] Admin panel
- [ ] Order status updates
- [ ] Email notifications
- [ ] Mobile responsive design enhancements

## 🧪 Testing

Test the application:
1. Register as a farmer
2. Add some products and tools
3. Log out and register as a customer
4. Browse products and tools
5. Add items to cart
6. Place an order

## 📝 License

MIT License

## 🤝 Contributing

This is a hackathon project. Contributions and suggestions are welcome!

## 📧 Contact

For questions or support, please contact the development team.

---

**Built for the Hackathon Finals 2025** 🚀
