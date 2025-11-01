# FastAPI ML Service for Crop Recommendation
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import numpy as np
from typing import Dict
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FarmConnect ML Service",
    description="Crop Recommendation using Machine Learning",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

try:
    with open(os.path.join(MODEL_DIR, 'best_crop_model.pkl'), 'rb') as f:
        model = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'label_encoder.pkl'), 'rb') as f:
        label_encoder = pickle.load(f)
    print("✅ ML models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    model = None
    scaler = None
    label_encoder = None

# Request model
class CropPredictionInput(BaseModel):
    N: float = Field(..., description="Nitrogen content (0-140)", ge=0, le=140)
    P: float = Field(..., description="Phosphorus content (5-145)", ge=5, le=145)
    K: float = Field(..., description="Potassium content (5-205)", ge=5, le=205)
    temperature: float = Field(..., description="Temperature in Celsius (8-44)", ge=8, le=44)
    humidity: float = Field(..., description="Humidity percentage (14-100)", ge=14, le=100)
    ph: float = Field(..., description="pH value (3.5-9.9)", ge=3.5, le=9.9)
    rainfall: float = Field(..., description="Rainfall in mm (20-300)", ge=20, le=300)

# Response model
class CropPredictionOutput(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    crop: str
    confidence: float
    input_values: Dict[str, float]
    model_info: Dict[str, str]

@app.get("/")
def read_root():
    return {
        "message": "FarmConnect ML Service API",
        "status": "running",
        "model_loaded": model is not None,
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "model_info": "/model-info"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "label_encoder_loaded": label_encoder is not None
    }

@app.get("/model-info")
def model_info():
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": "RandomForestClassifier",
        "accuracy": "99.55%",
        "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
        "possible_crops": list(label_encoder.classes_) if label_encoder else [],
        "feature_ranges": {
            "N": "0-140",
            "P": "5-145",
            "K": "5-205",
            "temperature": "8-44°C",
            "humidity": "14-100%",
            "ph": "3.5-9.9",
            "rainfall": "20-300mm"
        }
    }

@app.post("/predict", response_model=CropPredictionOutput)
def predict_crop(input_data: CropPredictionInput):
    if model is None or scaler is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="ML models not loaded properly")
    
    try:
        # Prepare input features
        features = np.array([[
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        prediction_proba = model.predict_proba(features_scaled)
        
        # Get crop name
        crop_name = label_encoder.inverse_transform(prediction)[0]
        
        # Get confidence (max probability)
        confidence = float(np.max(prediction_proba) * 100)
        
        return CropPredictionOutput(
            crop=crop_name,
            confidence=round(confidence, 2),
            input_values={
                "N": input_data.N,
                "P": input_data.P,
                "K": input_data.K,
                "temperature": input_data.temperature,
                "humidity": input_data.humidity,
                "ph": input_data.ph,
                "rainfall": input_data.rainfall
            },
            model_info={
                "model_type": "RandomForestClassifier",
                "accuracy": "99.55%"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("ML_SERVICE_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
