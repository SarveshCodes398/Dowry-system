const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Dowry System API',
    version: '1.0.0',
    endpoints: {
      'POST /api/upload': 'Upload user image for dowry prediction',
      'POST /api/predict': 'Get dowry prediction based on appearance score and gender',
      'GET /api/history': 'Get prediction history',
      'GET /api/stats': 'Get system statistics'
    }
  });
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const { gender, name } = req.body;
    
    if (!gender || !['male', 'female', 'Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender is required and must be either Male or Female'
      });
    }

    // For demo purposes, we'll estimate appearance score based on image analysis
    // In a real application, you would use a proper image analysis model
    const appearanceScore = estimateAppearanceScore(req.file.path);

    // Get prediction using the logistic regression model
    const prediction = await predictDowry(appearanceScore, gender);

    // Save prediction history
    const historyEntry = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
      appearanceScore,
      imagePath: `/uploads/${req.file.filename}`,
      prediction,
      timestamp: new Date().toISOString()
    };

    saveToHistory(historyEntry);

    res.json({
      success: true,
      message: 'Image uploaded and dowry predicted successfully',
      data: {
        imageUrl: `/uploads/${req.file.filename}`,
        appearanceScore,
        ...prediction
      },
      historyId: historyEntry.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image and predicting dowry',
      error: error.message
    });
  }
});

// Direct prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { appearanceScore, gender, name } = req.body;

    if (appearanceScore === undefined || appearanceScore === null) {
      return res.status(400).json({
        success: false,
        message: 'Appearance score is required'
      });
    }

    if (!gender || !['male', 'female', 'Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender is required and must be either Male or Female'
      });
    }

    const score = parseFloat(appearanceScore);
    if (isNaN(score) || score < 4 || score > 10) {
      return res.status(400).json({
        success: false,
        message: 'Appearance score must be a number between 4 and 10'
      });
    }

    const prediction = await predictDowry(score, gender);

    // Save to history
    const historyEntry = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
      appearanceScore: score,
      imagePath: null,
      prediction,
      timestamp: new Date().toISOString()
    };

    saveToHistory(historyEntry);

    res.json({
      success: true,
      data: {
        appearanceScore: score,
        ...prediction
      },
      historyId: historyEntry.id
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting dowry',
      error: error.message
    });
  }
});

// Get prediction history
app.get('/api/history', (req, res) => {
  try {
    const history = getHistory();
    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving history',
      error: error.message
    });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const history = getHistory();
    const stats = calculateStats(history);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating statistics',
      error: error.message
    });
  }
});

// Helper function to estimate appearance score from image
function estimateAppearanceScore(imagePath) {
  // This is a placeholder function
  // In a real application, you would use a proper image analysis model
  // For now, we'll return a random score between 4 and 10
  // You can replace this with actual image processing
  
  // Simple hash-based estimation for demo consistency
  const hash = require('crypto').createHash('md5').update(imagePath).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const score = 4 + (hashNum % 600) / 100; // 4.0 to 10.0
  
  return Math.min(10, Math.max(4, parseFloat(score.toFixed(2))));
}

// Helper function to predict dowry using JavaScript implementation
// Uses the same logic as the Python logistic regression model
async function predictDowry(appearanceScore, gender) {
  return new Promise((resolve) => {
    // Use JavaScript fallback directly (no Python dependency needed)
    const fallbackResult = calculateDowryFallback(appearanceScore, gender);
    resolve(fallbackResult);
  });
}

// Fallback JavaScript implementation
function calculateDowryFallback(appearanceScore, gender) {
  const baseDowry = 30000;
  const maxAdjustment = 40000;
  
  // Normalize appearance score
  const normalizedAppearance = (appearanceScore - 4) / 6;
  
  // Gender binary (Female: 0, Male: 1)
  const genderBinary = gender.toLowerCase() === 'female' ? 0 : 1;
  
  // Simple logistic function approximation
  // Using coefficients from the Python model
  const coefficients = [0.5, -0.3, 0.8]; // Appearance_Score, Gender_Binary, Normalized_Appearance
  const intercept = -2.0;
  
  const z = intercept + 
    coefficients[0] * appearanceScore + 
    coefficients[1] * genderBinary + 
    coefficients[2] * normalizedAppearance;
  
  const probability = 1 / (1 + Math.exp(-z));
  const predictedCategory = probability > 0.5 ? 'High Dowry' : 'Low/Medium Dowry';
  const estimatedDowry = baseDowry + (probability * maxAdjustment);
  
  return {
    appearance_score: parseFloat(appearanceScore.toFixed(2)),
    gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
    normalized_appearance: parseFloat(normalizedAppearance.toFixed(3)),
    predicted_category: predictedCategory,
    probability_high_dowry: parseFloat(probability.toFixed(4)),
    probability_percentage: parseFloat((probability * 100).toFixed(2)),
    estimated_dowry_amount: parseFloat(estimatedDowry.toFixed(2)),
    confidence: parseFloat(Math.max(probability, 1 - probability).toFixed(4))
  };
}

// History management
const HISTORY_FILE = path.join(__dirname, 'history.json');

function saveToHistory(entry) {
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      history = JSON.parse(data);
    }
    history.unshift(entry);
    // Keep only last 100 entries
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

function getHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

function calculateStats(history) {
  const total = history.length;
  const maleCount = history.filter(h => h.gender === 'Male').length;
  const femaleCount = history.filter(h => h.gender === 'Female').length;
  
  const avgAppearance = history.reduce((sum, h) => sum + h.appearanceScore, 0) / total;
  const avgDowry = history.reduce((sum, h) => sum + h.prediction.estimated_dowry_amount, 0) / total;
  
  const highDowryCount = history.filter(h => h.prediction.predicted_category === 'High Dowry').length;
  const lowDowryCount = total - highDowryCount;

  return {
    totalPredictions: total,
    malePredictions: maleCount,
    femalePredictions: femaleCount,
    averageAppearanceScore: parseFloat(avgAppearance.toFixed(2)),
    averageDowryAmount: parseFloat(avgDowry.toFixed(2)),
    highDowryPredictions: highDowryCount,
    lowDowryPredictions: lowDowryCount,
    highDowryPercentage: parseFloat(((highDowryCount / total) * 100).toFixed(2)),
    lowDowryPercentage: parseFloat(((lowDowryCount / total) * 100).toFixed(2))
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`API endpoints available at http://localhost:${PORT}`);
});

module.exports = app;
