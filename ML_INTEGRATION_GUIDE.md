# 🌾 FarmConnect ML Integration - Complete Setup Guide

## 📁 Project Structure

```
FarmConnect/
├── backend/                          # Node.js Express backend (Port 5000)
│   ├── controllers/
│   │   └── ml.controller.js         ✅ Created - ML API controller
│   ├── routes/
│   │   └── ml.routes.js             ✅ Created - ML routes
│   └── server.js                    ✅ Updated - Added ML routes
│
├── ml-service/                       ✅ NEW - Python ML Service (Port 8000)
│   ├── models/                       📦 PUT YOUR MODEL FILES HERE
│   │   ├── best_crop_model.pkl     ⚠️ COPY FROM YOUR TRAINED MODEL
│   │   ├── scaler.pkl              ⚠️ COPY FROM YOUR TRAINED MODEL
│   │   └── label_encoder.pkl       ⚠️ COPY FROM YOUR TRAINED MODEL
│   ├── app.py                       ✅ Created - FastAPI server
│   ├── requirements.txt             ✅ Created - Python dependencies
│   ├── .env                         ✅ Created - Configuration
│   └── README.md                    ✅ Created - Documentation
│
└── frontend2/                        # React frontend (Port 3000)
    └── src/
        ├── pages/Farmer/
        │   ├── CropRecommendation.jsx  ✅ Created - Crop recommendation UI
        │   └── FarmerDashboard.jsx     ✅ Updated - Added link
        ├── services/
        │   └── api.js                   ✅ Updated - Added mlAPI
        └── App.js                       ✅ Updated - Added route
```

---

## 🚀 Installation Steps

### Step 1: Place Your ML Model Files

**IMPORTANT:** Copy your trained model files to the `ml-service/models/` directory:

```bash
# Navigate to ml-service/models folder
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\ml-service\models

# Copy your model files here:
# - best_crop_model.pkl
# - scaler.pkl
# - label_encoder.pkl
```

### Step 2: Install Python Dependencies

```bash
# Navigate to ml-service directory
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\ml-service

# Install Python packages
pip install -r requirements.txt
```

**Required Python packages:**
- fastapi==0.104.1
- uvicorn==0.24.0
- pydantic==2.5.0
- scikit-learn==1.3.2
- numpy==1.24.3
- python-dotenv==1.0.0

### Step 3: Install Node.js Dependencies (if needed)

```bash
# Navigate to backend
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\backend

# Install axios if not already installed
npm install axios
```

---

## ▶️ Running the Services

You need to run **3 services** simultaneously:

### Terminal 1: ML Service (Python - Port 8000)

```bash
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\ml-service
python app.py
```

**Expected output:**
```
✅ ML models loaded successfully!
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test it:** Open browser → http://localhost:8000/docs (Swagger UI)

### Terminal 2: Backend (Node.js - Port 5000)

```bash
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### Terminal 3: Frontend (React - Port 3000)

```bash
cd C:\Users\kushw\OneDrive\Desktop\kaam\hwu\FarmConnect\frontend2
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view farmconnect in the browser.
Local: http://localhost:3000
```

---

## 🧪 Testing the Integration

### Test 1: ML Service Health Check

```bash
# Test ML service directly
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true,
  "label_encoder_loaded": true
}
```

### Test 2: Backend ML API

```bash
# Test through Node.js backend
curl http://localhost:5000/api/ml/health
```

### Test 3: Get Model Info

Open browser: http://localhost:8000/model-info

### Test 4: Test Prediction (Direct to ML Service)

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93
  }'
```

**Expected response:**
```json
{
  "crop": "rice",
  "confidence": 99.75,
  "input_values": {...},
  "model_info": {...}
}
```

---

## 🎨 Using the Crop Recommendation Feature

### As a Farmer:

1. **Login** as a farmer account
2. Go to **Farmer Dashboard** → Click **"Crop Recommendation"** card (purple gradient)
3. Enter your soil and weather data:
   - **Nitrogen (N):** 0-140
   - **Phosphorus (P):** 5-145
   - **Potassium (K):** 5-205
   - **Temperature:** 8-44°C
   - **Humidity:** 14-100%
   - **pH:** 3.5-9.9
   - **Rainfall:** 20-300mm
4. Click **"Get Recommendation"**
5. View the recommended crop with confidence score

---

## 🔍 API Endpoints

### ML Service (Python) - Port 8000

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |
| `/model-info` | GET | Model details |
| `/predict` | POST | Get crop recommendation |
| `/docs` | GET | Interactive API docs (Swagger) |

### Backend (Node.js) - Port 5000

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/ml/health` | GET | No | ML service health |
| `/api/ml/model-info` | GET | Yes | Model information |
| `/api/ml/predict` | POST | Yes | Crop recommendation |

---

## 🐛 Troubleshooting

### Problem: "ML models not loaded properly"

**Solution:**
- Verify model files are in `ml-service/models/` directory
- Check file names match exactly:
  - `best_crop_model.pkl`
  - `scaler.pkl`
  - `label_encoder.pkl`
- Ensure files are valid pickle files

### Problem: "ML service is not available"

**Solution:**
- Make sure ML service is running on port 8000
- Check `ML_SERVICE_URL` in backend (default: http://localhost:8000)
- Verify no firewall is blocking port 8000

### Problem: "Module not found" errors in Python

**Solution:**
```bash
pip install -r requirements.txt --upgrade
```

### Problem: Frontend can't connect to backend

**Solution:**
- Ensure backend is running on port 5000
- Check `API_URL` in `frontend2/src/services/api.js`
- Verify you're logged in (crop recommendation requires authentication)

---

## 📊 Model Information

- **Model Type:** Random Forest Classifier
- **Accuracy:** 99.55%
- **Training Accuracy:** 100%
- **Input Features:** 7 (N, P, K, temperature, humidity, ph, rainfall)
- **Output:** Crop name (string)
- **Possible Crops:** Check `/model-info` endpoint for full list

---

## 🔐 Security Notes

- Crop recommendation endpoint requires authentication (farmer role)
- Only farmers can access the crop recommendation page
- Protected by JWT token authentication

---

## 📝 Environment Variables

### Backend (.env)
```env
ML_SERVICE_URL=http://localhost:8000
```

### ML Service (.env)
```env
ML_SERVICE_PORT=8000
```

---

## ✅ Verification Checklist

- [ ] Python 3.8+ installed
- [ ] All Python packages installed
- [ ] Model files copied to `ml-service/models/`
- [ ] ML service starts without errors
- [ ] Backend includes ML routes
- [ ] Frontend includes CropRecommendation page
- [ ] All 3 services running simultaneously
- [ ] Can access Swagger UI at http://localhost:8000/docs
- [ ] Can see crop recommendation link on farmer dashboard
- [ ] Test prediction returns valid crop name

---

## 🎉 Success!

Once all services are running and tests pass, farmers can:
1. Navigate to Crop Recommendation page
2. Input their soil/weather data
3. Get AI-powered crop suggestions with confidence scores

**The ML model is now fully integrated into FarmConnect!** 🚜🌾
