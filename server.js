const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const { RandomForestRegression } = require('ml-random-forest');
const { Matrix } = require('ml-matrix');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Global variables for the model
let trainedModel = null;
let labelEncoder = {};
let isModelTrained = false;

// Function to encode categorical variables
function encodeCategorical(data) {
  const encoded = [];
  
  data.forEach(row => {
    const encodedRow = [];
    
    // Encode Soil Type
    const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
    const soilIndex = soilTypes.indexOf(row['Soil Type']);
    encodedRow.push(soilIndex);
    
    // Encode Crop Type
    const cropTypes = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts', 'Wheat'];
    const cropIndex = cropTypes.indexOf(row['Crop Type']);
    encodedRow.push(cropIndex);
    
    // Add numerical features
    encodedRow.push(parseFloat(row['Temparature']));
    encodedRow.push(parseFloat(row['Humidity ']));
    encodedRow.push(parseFloat(row['Moisture']));
    encodedRow.push(parseFloat(row['Nitrogen']));
    encodedRow.push(parseFloat(row['Potassium']));
    encodedRow.push(parseFloat(row['Phosphorous']));
    
    encoded.push(encodedRow);
  });
  
  return encoded;
}

// Function to encode fertilizer names
function encodeFertilizers(fertilizers) {
  const uniqueFertilizers = [...new Set(fertilizers)];
  const encoded = fertilizers.map(fertilizer => uniqueFertilizers.indexOf(fertilizer));
  
  // Store mapping for decoding
  labelEncoder.fertilizers = uniqueFertilizers;
  
  return encoded;
}

// Function to train the model
async function trainModel() {
  try {
    const data = [];
    
    // Read CSV file
    return new Promise((resolve, reject) => {
      fs.createReadStream('dataset/Fertilizer Prediction.csv')
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => {
          try {
            // Prepare features and labels
            const features = encodeCategorical(data);
            const labels = encodeFertilizers(data.map(row => row['Fertilizer Name']));
            
            // Convert to Matrix format
            const X = new Matrix(features);
            const y = labels;
            
            // Train Random Forest model
            const options = {
              nEstimators: 100,
              maxDepth: 10,
              minSamplesSplit: 2,
              minSamplesLeaf: 1
            };
            
            trainedModel = new RandomForestRegression(options);
            trainedModel.train(X, y);
            
            isModelTrained = true;
            console.log('Model trained successfully!');
            resolve();
          } catch (error) {
            console.error('Error training model:', error);
            reject(error);
          }
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('Error in trainModel:', error);
    throw error;
  }
}

// Function to predict fertilizer
function predictFertilizer(input) {
  if (!isModelTrained) {
    throw new Error('Model not trained yet');
  }
  
  // Encode input
  const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
  const cropTypes = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts', 'Wheat'];
  
  const encodedInput = [
    soilTypes.indexOf(input.soilType),
    cropTypes.indexOf(input.cropType),
    parseFloat(input.temperature),
    parseFloat(input.humidity),
    parseFloat(input.moisture),
    parseFloat(input.nitrogen),
    parseFloat(input.potassium),
    parseFloat(input.phosphorous)
  ];
  
  // Make prediction
  const prediction = trainedModel.predict([encodedInput]);
  const fertilizerIndex = Math.round(prediction[0]);
  
  // Decode prediction
  return labelEncoder.fertilizers[fertilizerIndex] || 'Unknown';
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fertilizer Recommendation API is running' });
});

app.get('/api/model-status', (req, res) => {
  res.json({ 
    isTrained: isModelTrained, 
    message: isModelTrained ? 'Model is ready' : 'Model is training...' 
  });
});

app.post('/api/predict', (req, res) => {
  try {
    if (!isModelTrained) {
      return res.status(400).json({ error: 'Model not trained yet. Please wait...' });
    }
    
    const {
      temperature,
      humidity,
      moisture,
      soilType,
      cropType,
      nitrogen,
      potassium,
      phosphorous
    } = req.body;
    
    // Validation
    if (!temperature || !humidity || !moisture || !soilType || !cropType || 
        nitrogen === undefined || potassium === undefined || phosphorous === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const prediction = predictFertilizer({
      temperature,
      humidity,
      moisture,
      soilType,
      cropType,
      nitrogen,
      potassium,
      phosphorous
    });
    
    res.json({ 
      prediction,
      confidence: 0.85, // Placeholder confidence score
      input: req.body
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed', details: error.message });
  }
});

// Get available options for dropdowns
app.get('/api/options', (req, res) => {
  res.json({
    soilTypes: ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'],
    cropTypes: ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts', 'Wheat']
  });
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Initialize and start server
async function startServer() {
  try {
    console.log('Training model...');
    await trainModel();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Model training completed!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
