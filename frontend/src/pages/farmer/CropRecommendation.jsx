import { useState } from 'react';
import { mlService } from '../../services';
import './CropRecommendation.css';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await mlService.predictCrop(formData);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Prediction failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get crop recommendation');
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="crop-recommendation">
      <div className="container">
        <div className="recommendation-header">
          <h1>🧠 AI Crop Recommendation</h1>
          <p>Get personalized crop recommendations based on your soil and climate conditions</p>
        </div>

        <div className="recommendation-content">
          <div className="form-section">
            <h2>Enter Soil & Climate Data</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="recommendation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="N">Nitrogen (N) *</label>
                  <input
                    type="number"
                    id="N"
                    name="N"
                    value={formData.N}
                    onChange={handleChange}
                    required
                    min="0"
                    max="140"
                    step="0.1"
                    placeholder="0-140"
                  />
                  <small>Nitrogen content in soil (kg/ha)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="P">Phosphorus (P) *</label>
                  <input
                    type="number"
                    id="P"
                    name="P"
                    value={formData.P}
                    onChange={handleChange}
                    required
                    min="5"
                    max="145"
                    step="0.1"
                    placeholder="5-145"
                  />
                  <small>Phosphorus content in soil (kg/ha)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="K">Potassium (K) *</label>
                  <input
                    type="number"
                    id="K"
                    name="K"
                    value={formData.K}
                    onChange={handleChange}
                    required
                    min="5"
                    max="205"
                    step="0.1"
                    placeholder="5-205"
                  />
                  <small>Potassium content in soil (kg/ha)</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="temperature">Temperature *</label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                    min="8"
                    max="44"
                    step="0.1"
                    placeholder="8-44"
                  />
                  <small>Temperature in Celsius</small>
                </div>

                <div className="form-group">
                  <label htmlFor="humidity">Humidity *</label>
                  <input
                    type="number"
                    id="humidity"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    required
                    min="14"
                    max="100"
                    step="0.1"
                    placeholder="14-100"
                  />
                  <small>Relative humidity (%)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="ph">pH Level *</label>
                  <input
                    type="number"
                    id="ph"
                    name="ph"
                    value={formData.ph}
                    onChange={handleChange}
                    required
                    min="3.5"
                    max="9.9"
                    step="0.1"
                    placeholder="3.5-9.9"
                  />
                  <small>Soil pH value</small>
                </div>

                <div className="form-group">
                  <label htmlFor="rainfall">Rainfall *</label>
                  <input
                    type="number"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    required
                    min="20"
                    max="300"
                    step="0.1"
                    placeholder="20-300"
                  />
                  <small>Rainfall in mm</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Analyzing...' : '🔍 Get Recommendation'}
                </button>
                <button type="button" onClick={handleReset} className="btn btn-secondary">
                  Reset
                </button>
              </div>
            </form>
          </div>

          {result && (
            <div className="result-section">
              <div className="result-card">
                <h2>Recommended Crop</h2>
                <div className="crop-result">
                  <div className="crop-name">{result.crop}</div>
                  <div className="confidence">
                    Confidence: {result.confidence}%
                  </div>
                </div>

                <div className="result-details">
                  <h3>Your Input Values:</h3>
                  <div className="input-summary">
                    <div className="summary-item">
                      <span>Nitrogen:</span>
                      <strong>{result.input_values?.N}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Phosphorus:</span>
                      <strong>{result.input_values?.P}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Potassium:</span>
                      <strong>{result.input_values?.K}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Temperature:</span>
                      <strong>{result.input_values?.temperature}°C</strong>
                    </div>
                    <div className="summary-item">
                      <span>Humidity:</span>
                      <strong>{result.input_values?.humidity}%</strong>
                    </div>
                    <div className="summary-item">
                      <span>pH:</span>
                      <strong>{result.input_values?.ph}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Rainfall:</span>
                      <strong>{result.input_values?.rainfall} mm</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
