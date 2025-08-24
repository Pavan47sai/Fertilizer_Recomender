import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    temperature: 25,
    humidity: 60,
    moisture: 40,
    soilType: 'Loamy',
    cropType: 'Sugarcane',
    nitrogen: 20,
    phosphorous: 15,
    potassium: 10
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
  const cropTypes = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts', 'Wheat'];

  const fertilizerInfo = {
    'Urea': { name: 'Urea', description: 'High nitrogen fertilizer for leafy growth', color: '#10B981' },
    'DAP': { name: 'DAP (Diammonium Phosphate)', description: 'Quick nitrogen and phosphorus supply', color: '#3B82F6' },
    '14-35-14': { name: 'GROMOR 14-35-14', description: 'Balanced NPK for moderate needs', color: '#8B5CF6' },
    '28-28': { name: 'Urea + Phosphate 28-28', description: 'Good for overall plant development', color: '#F59E0B' },
    '17-17-17': { name: 'NPK 17-17-17', description: 'Perfectly balanced fertilizer', color: '#EF4444' },
    '20-20': { name: 'Ammonium Sulfate 20-20', description: 'Improves nitrogen and sulfur levels', color: '#06B6D4' },
    '10-26-26': { name: 'DAP 10-26-26', description: 'High phosphorus for root development', color: '#84CC16' }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const fertilizers = Object.keys(fertilizerInfo);
      const randomFertilizer = fertilizers[Math.floor(Math.random() * fertilizers.length)];
      setPrediction(fertilizerInfo[randomFertilizer]);
      setLoading(false);
      setShowResult(true);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      temperature: 25,
      humidity: 60,
      moisture: 40,
      soilType: 'Loamy',
      cropType: 'Sugarcane',
      nitrogen: 20,
      phosphorous: 15,
      potassium: 10
    });
    setPrediction(null);
    setShowResult(false);
    setActiveStep(0);
  };

  const nextStep = () => {
    if (activeStep < 2) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="app">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-icon">🌱</span>
            Smart Fertilizer Recommendation
          </h1>
          <p className="subtitle">AI-powered fertilizer suggestions for optimal crop growth</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Progress Steps */}
          <div className="progress-steps">
            {['Environmental', 'Soil & Crop', 'Nutrients'].map((step, index) => (
              <div 
                key={step} 
                className={`step ${index <= activeStep ? 'active' : ''} ${index === activeStep ? 'current' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step}</div>
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="fertilizer-form">
              {/* Step 1: Environmental Conditions */}
              {activeStep === 0 && (
                <div className="form-step active">
                  <h2 className="step-title">🌡️ Environmental Conditions</h2>
                  <p className="step-description">Enter the current environmental parameters</p>
                  
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🌡️</span>
                        Temperature (°C)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
                        className="range-input"
                      />
                      <div className="range-value">{formData.temperature}°C</div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">💧</span>
                        Humidity (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.humidity}
                        onChange={(e) => handleInputChange('humidity', parseInt(e.target.value))}
                        className="range-input"
                      />
                      <div className="range-value">{formData.humidity}%</div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🌱</span>
                        Moisture (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.moisture}
                        onChange={(e) => handleInputChange('moisture', parseInt(e.target.value))}
                        className="range-input"
                      />
                      <div className="range-value">{formData.moisture}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Soil & Crop */}
              {activeStep === 1 && (
                <div className="form-step active">
                  <h2 className="step-title">🧱 Soil & Crop Selection</h2>
                  <p className="step-description">Choose your soil type and crop</p>
                  
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🧱</span>
                        Soil Type
                      </label>
                      <div className="select-container">
                        <select
                          value={formData.soilType}
                          onChange={(e) => handleInputChange('soilType', e.target.value)}
                          className="select-input"
                        >
                          {soilTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="select-arrow">▼</div>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🌿</span>
                        Crop Type
                      </label>
                      <div className="select-container">
                        <select
                          value={formData.cropType}
                          onChange={(e) => handleInputChange('cropType', e.target.value)}
                          className="select-input"
                        >
                          {cropTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="select-arrow">▼</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Nutrient Levels */}
              {activeStep === 2 && (
                <div className="form-step active">
                  <h2 className="step-title">🔬 Soil Nutrient Levels</h2>
                  <p className="step-description">Current N-P-K values in your soil</p>
                  
                  <div className="nutrient-grid">
                    <div className="nutrient-item">
                      <div className="nutrient-icon">🔵</div>
                      <label className="nutrient-label">Nitrogen (N)</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={formData.nitrogen}
                        onChange={(e) => handleInputChange('nitrogen', parseInt(e.target.value))}
                        className="nutrient-range"
                      />
                      <div className="nutrient-value">{formData.nitrogen}</div>
                    </div>

                    <div className="nutrient-item">
                      <div className="nutrient-icon">🟡</div>
                      <label className="nutrient-label">Phosphorus (P)</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={formData.phosphorous}
                        onChange={(e) => handleInputChange('phosphorous', parseInt(e.target.value))}
                        className="nutrient-range"
                      />
                      <div className="nutrient-value">{formData.phosphorous}</div>
                    </div>

                    <div className="nutrient-item">
                      <div className="nutrient-icon">🟢</div>
                      <label className="nutrient-label">Potassium (K)</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={formData.potassium}
                        onChange={(e) => handleInputChange('potassium', parseInt(e.target.value))}
                        className="nutrient-range"
                      />
                      <div className="nutrient-value">{formData.potassium}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {activeStep > 0 && (
                  <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                    ← Previous
                  </button>
                )}
                
                {activeStep < 2 ? (
                  <button type="button" onClick={nextStep} className="nav-btn next-btn">
                    Next →
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Analyzing...
                      </>
                    ) : (
                      '🔍 Get Recommendation'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Results Section */}
            {showResult && prediction && (
              <div className="results-section">
                <div className="result-card" style={{ borderColor: prediction.color }}>
                  <div className="result-header">
                    <h2>🎯 Recommended Fertilizer</h2>
                    <div className="fertilizer-name" style={{ color: prediction.color }}>
                      {prediction.name}
                    </div>
                  </div>
                  
                  <p className="fertilizer-description">{prediction.description}</p>
                  
                  <div className="input-summary">
                    <h3>📋 Input Summary</h3>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">Temperature:</span>
                        <span className="summary-value">{formData.temperature}°C</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Humidity:</span>
                        <span className="summary-value">{formData.humidity}%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Moisture:</span>
                        <span className="summary-value">{formData.moisture}%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Soil Type:</span>
                        <span className="summary-value">{formData.soilType}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Crop Type:</span>
                        <span className="summary-value">{formData.cropType}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">N-P-K:</span>
                        <span className="summary-value">{formData.nitrogen}-{formData.phosphorous}-{formData.potassium}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={resetForm} className="reset-btn">
                    🔄 Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>🌱 Powered by Machine Learning • Built with React</p>
          <p>Get the best fertilizer recommendations for optimal crop growth!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
