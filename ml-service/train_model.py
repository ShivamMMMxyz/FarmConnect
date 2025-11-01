"""
Crop Recommendation System - Training Script
FarmConnect ML Service
Date: November 1, 2025

This script trains a machine learning model to recommend the best crop to grow
based on soil and environmental conditions.
"""

import pandas as pd
import numpy as np
import warnings
import os
warnings.filterwarnings('ignore')

# Scikit-learn imports
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Model persistence
import pickle

# Optional: XGBoost
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("XGBoost not available. Will train without it.")

print("="*70)
print("FARMCONNECT CROP RECOMMENDATION SYSTEM - MODEL TRAINING")
print("="*70)

# Set up paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
DATA_FILE = os.path.join(DATA_DIR, 'Crop_recommendation.csv')

# Ensure models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# 1. Load the dataset
print("\n[STEP 1] Loading dataset...")
try:
    df = pd.read_csv(DATA_FILE)
    print(f"✅ Dataset loaded successfully! Shape: {df.shape}")
except FileNotFoundError:
    print(f"❌ Error: '{DATA_FILE}' not found.")
    print("Please ensure 'Crop_recommendation.csv' is in the 'data' folder.")
    exit(1)

# Display first few rows
print("\nFirst 5 rows of the dataset:")
print(df.head())

# 2. Data Cleaning
print("\n[STEP 2] Data Cleaning...")
print(f"Missing values per column:\n{df.isnull().sum()}")
print(f"\nTotal missing values: {df.isnull().sum().sum()}")

# Check for duplicates
duplicates = df.duplicated().sum()
print(f"Duplicate rows: {duplicates}")

if duplicates > 0:
    df = df.drop_duplicates()
    print(f"Removed {duplicates} duplicate rows.")

# Handle missing values if any
if df.isnull().sum().sum() > 0:
    print("Handling missing values by dropping rows with missing data...")
    df = df.dropna()
    print(f"Dataset shape after cleaning: {df.shape}")
else:
    print("✅ No missing values found. Dataset is clean!")

# 3. Exploratory Data Analysis
print("\n[STEP 3] Exploratory Data Analysis...")
print("\nDataset Information:")
print(df.info())

print("\nStatistical Summary:")
print(df.describe())

print("\nCrop distribution:")
crop_counts = df['label'].value_counts()
print(crop_counts)
print(f"\nTotal unique crops: {len(crop_counts)}")

# 4. Encode the target variable
print("\n[STEP 4] Encoding target variable...")
label_encoder = LabelEncoder()
df['label_encoded'] = label_encoder.fit_transform(df['label'])

print(f"Number of unique crops: {len(label_encoder.classes_)}")
print(f"Crop labels: {list(label_encoder.classes_)}")

# Save the label encoder
label_encoder_path = os.path.join(MODEL_DIR, 'label_encoder.pkl')
with open(label_encoder_path, 'wb') as f:
    pickle.dump(label_encoder, f)
print(f"✅ Label encoder saved to: {label_encoder_path}")

# 5. Split the dataset
print("\n[STEP 5] Splitting dataset...")
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label_encoded']

# Split into training and testing sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set size: {X_train.shape[0]} samples")
print(f"Testing set size: {X_test.shape[0]} samples")

# 6. Feature Scaling
print("\n[STEP 6] Feature Scaling...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save the scaler
scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
with open(scaler_path, 'wb') as f:
    pickle.dump(scaler, f)
print(f"✅ Scaler saved to: {scaler_path}")

# 7. Train multiple models
print("\n[STEP 7] Training Multiple Models...")
print("-"*70)

models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5)
}

# Add XGBoost if available
if XGBOOST_AVAILABLE:
    models['XGBoost'] = XGBClassifier(n_estimators=100, random_state=42, eval_metric='mlogloss')

# Dictionary to store model performance
model_accuracies = {}

for model_name, model in models.items():
    print(f"\n🔄 Training {model_name}...")
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    # Calculate accuracies
    train_accuracy = accuracy_score(y_train, y_pred_train)
    test_accuracy = accuracy_score(y_test, y_pred_test)
    
    model_accuracies[model_name] = {
        'model': model,
        'train_accuracy': train_accuracy,
        'test_accuracy': test_accuracy
    }
    
    print(f"   Training Accuracy: {train_accuracy*100:.2f}%")
    print(f"   Testing Accuracy: {test_accuracy*100:.2f}%")

# 8. Model Evaluation Summary
print("\n[STEP 8] Model Evaluation Summary...")
print("-"*70)
print(f"{'Model':<25} {'Train Accuracy':<18} {'Test Accuracy':<18}")
print("-"*70)

for model_name, results in model_accuracies.items():
    print(f"{model_name:<25} {results['train_accuracy']*100:>16.2f}% {results['test_accuracy']*100:>16.2f}%")

# Find the best model based on test accuracy
best_model_name = max(model_accuracies, key=lambda x: model_accuracies[x]['test_accuracy'])
best_model = model_accuracies[best_model_name]['model']
best_accuracy = model_accuracies[best_model_name]['test_accuracy']

print("-"*70)
print(f"\n🏆 Best Model: {best_model_name}")
print(f"🎯 Best Test Accuracy: {best_accuracy*100:.2f}%")

# Display confusion matrix and classification report for best model
y_pred_best = best_model.predict(X_test_scaled)
print("\nConfusion Matrix (Best Model):")
cm = confusion_matrix(y_test, y_pred_best)
print(cm)

print("\nClassification Report (Best Model):")
print(classification_report(y_test, y_pred_best, target_names=label_encoder.classes_, zero_division=0))

# 9. Save the best model
print("\n[STEP 9] Saving the best model...")
model_path = os.path.join(MODEL_DIR, 'best_crop_model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(best_model, f)
print(f"✅ Best model ({best_model_name}) saved to: {model_path}")

print("\n" + "="*70)
print("✅ MODEL TRAINING COMPLETED SUCCESSFULLY!")
print("="*70)

print("\nGenerated Files in 'models' directory:")
print("  1. best_crop_model.pkl - Trained model")
print("  2. scaler.pkl - Feature scaler")
print("  3. label_encoder.pkl - Label encoder")

print("\n" + "="*70)
print("TESTING PREDICTIONS")
print("="*70)

# Test prediction function
def test_prediction(N, P, K, temperature, humidity, ph, rainfall):
    """Test prediction with given parameters"""
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    input_scaled = scaler.transform(input_data)
    prediction = best_model.predict(input_scaled)
    
    # Get probability scores
    prediction_proba = best_model.predict_proba(input_scaled)
    confidence = np.max(prediction_proba) * 100
    
    crop_name = label_encoder.inverse_transform(prediction)[0]
    return crop_name, confidence

# Test Case 1
print("\nTest Case 1:")
print("-"*70)
test_params_1 = {
    'N': 90, 'P': 42, 'K': 43,
    'temperature': 20.87, 'humidity': 82.00,
    'ph': 6.50, 'rainfall': 202.93
}
print(f"Input: N={test_params_1['N']}, P={test_params_1['P']}, K={test_params_1['K']}, "
      f"Temp={test_params_1['temperature']}°C, Humidity={test_params_1['humidity']}%, "
      f"pH={test_params_1['ph']}, Rainfall={test_params_1['rainfall']}mm")

crop1, conf1 = test_prediction(**test_params_1)
print(f"Recommended Crop: {crop1} (Confidence: {conf1:.2f}%)")

# Test Case 2
print("\nTest Case 2:")
print("-"*70)
test_params_2 = {
    'N': 40, 'P': 80, 'K': 40,
    'temperature': 25.5, 'humidity': 70.0,
    'ph': 7.0, 'rainfall': 150.0
}
print(f"Input: N={test_params_2['N']}, P={test_params_2['P']}, K={test_params_2['K']}, "
      f"Temp={test_params_2['temperature']}°C, Humidity={test_params_2['humidity']}%, "
      f"pH={test_params_2['ph']}, Rainfall={test_params_2['rainfall']}mm")

crop2, conf2 = test_prediction(**test_params_2)
print(f"Recommended Crop: {crop2} (Confidence: {conf2:.2f}%)")

# Test Case 3
print("\nTest Case 3:")
print("-"*70)
test_params_3 = {
    'N': 20, 'P': 60, 'K': 20,
    'temperature': 28.0, 'humidity': 85.0,
    'ph': 6.0, 'rainfall': 250.0
}
print(f"Input: N={test_params_3['N']}, P={test_params_3['P']}, K={test_params_3['K']}, "
      f"Temp={test_params_3['temperature']}°C, Humidity={test_params_3['humidity']}%, "
      f"pH={test_params_3['ph']}, Rainfall={test_params_3['rainfall']}mm")

crop3, conf3 = test_prediction(**test_params_3)
print(f"Recommended Crop: {crop3} (Confidence: {conf3:.2f}%)")

print("\n" + "="*70)
print("✅ TRAINING SCRIPT COMPLETED!")
print("="*70)
print("\n📌 Next Steps:")
print("   1. Start the ML service: python app.py")
print("   2. Test the API at: http://localhost:8000/health")
print("   3. Make predictions via: http://localhost:8000/predict")
print("="*70)
