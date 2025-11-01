# FarmConnect ML Service - Crop Recommendation

## About
This is the Machine Learning service for FarmConnect that provides crop recommendations based on soil and environmental parameters.

## Model Details
- **Model Type**: Random Forest Classifier
- **Accuracy**: 99.55%
- **Features**: N, P, K, Temperature, Humidity, pH, Rainfall

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd ml-service
pip install -r requirements.txt
```

### 2. Place Model Files
Place your trained model files in the `models/` directory:
- `best_crop_model.pkl`
- `scaler.pkl`
- `label_encoder.pkl`

### 3. Run the Service
```bash
python app.py
```

The service will start on `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Get Model Info
```
GET /model-info
```

### Predict Crop
```
POST /predict
Content-Type: application/json

{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
```

Response:
```json
{
  "crop": "rice",
  "confidence": 99.75,
  "input_values": {...},
  "model_info": {...}
}
```

## Testing
Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)
