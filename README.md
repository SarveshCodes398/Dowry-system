# Dowry System - Matrimonial Dowry Prediction

A full-stack application that predicts dowry amounts based on appearance scores and gender using logistic regression. The system allows users to upload images (male or female) and calculates estimated dowry prices.

## Features

- **Image Upload**: Upload male or female images for dowry prediction
- **Logistic Regression Model**: Uses trained logistic regression model for accurate predictions
- **Dowry Calculation**: Calculate estimated dowry amounts based on appearance
- **Statistics Dashboard**: View prediction history and system statistics
- **Responsive UI**: Modern, responsive user interface with React

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- Chart.js for data visualization
- Modern CSS with animations

### Backend
- Node.js with Express
- Multer for file uploads
- Python integration for logistic regression model
- RESTful API endpoints

### Machine Learning
- Python 3
- Scikit-learn (Logistic Regression)
- Pandas for data processing
- NumPy for numerical operations

## Project Structure

```
dowry-system/
├── backend/
│   ├── server.js           # Express server
│   ├── package.json
│   ├── uploads/            # Uploaded images
│   ├── models/             # ML model files
│   │   ├── dowry_model.pkl
│   │   └── dowry_scaler.pkl
│   └── history.json        # Prediction history
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── predict_dowry.py        # Python prediction script
├── dowry_prediction_model.py # ML model training
└── README.md
```

## Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Python Dependencies

Install required Python packages:
```bash
pip install pandas numpy scikit-learn
```

## Usage

### Training the Model

To train the logistic regression model:
```bash
python dowry_prediction_model.py
```

This will:
- Load the dataset from `matrimonial_dowry_combined.csv`
- Train the logistic regression model
- Save the model and scaler to `backend/models/`

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| POST | `/api/upload` | Upload image for dowry prediction |
| POST | `/api/predict` | Get dowry prediction with appearance score |
| GET | `/api/history` | Get prediction history |
| GET | `/api/stats` | Get system statistics |

### Upload Request (POST /api/upload)

```javascript
const formData = new FormData();
formData.append('image', file); // Image file
formData.append('gender', 'Female'); // 'Male' or 'Female'
formData.append('name', 'John Doe'); // Optional

// Response
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/filename.jpg",
    "appearanceScore": 8.5,
    "gender": "Female",
    "predicted_category": "High Dowry",
    "probability_percentage": 85.5,
    "estimated_dowry_amount": 65000,
    "confidence": 0.855
  }
}
```

### Predict Request (POST /api/predict)

```javascript
{
  "appearanceScore": 8.5,
  "gender": "Female",
  "name": "Jane Doe" // Optional
}

// Response
{
  "success": true,
  "data": {
    "appearanceScore": 8.5,
    "gender": "Female",
    "predicted_category": "High Dowry",
    "probability_percentage": 85.5,
    "estimated_dowry_amount": 65000,
    "confidence": 0.855
  }
}
```

## Dataset

The system uses a dataset of 100 profiles (50 brides, 50 grooms) with the following features:
- Appearance Score (4-10)
- Gender (Male/Female)
- Normalized Appearance
- Dowry Category (High/Low/Medium)
- Dowry Amount

## Model Performance

- Training Accuracy: 87.5%
- Testing Accuracy: 90.0%
- ROC AUC Score: 0.60

## Screenshots

### Home Page
- Overview of the system
- Quick access to prediction and statistics

### Prediction Page
- Upload images or enter appearance scores
- Select gender (Male/Female)
- View prediction results with confidence scores

### History Page
- View all previous predictions
- Filter by gender, category, or time range
- Detailed prediction information

### Statistics Page
- Comprehensive analytics dashboard
- Charts and graphs for data visualization
- Gender distribution, dowry categories, and more

## Customization

### Changing the Model

1. Update the dataset in `matrimonial_dowry_combined.csv`
2. Retrain the model:
```bash
python dowry_prediction_model.py
```
3. The new model will be saved to `backend/models/`

### Configuration

- **Backend Port**: Change in `backend/server.js` (line 10)
- **Frontend API URL**: Change in `frontend/src/services/api.js`
- **Upload Limits**: Configure in `backend/server.js` (Multer config)

## Troubleshooting

### Backend not starting
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check Node.js version (16+ required)

### Frontend not connecting to backend
- Ensure backend is running
- Check CORS settings in backend
- Verify API URL in frontend

### Python model not loading
- Ensure Python dependencies are installed
- Check model file paths in `predict_dowry.py`
- Verify model files exist in `backend/models/`

## License

MIT License

## Disclaimer

This is a demonstration system for educational purposes only. The dowry prediction is based on a fictional dataset and should not be used for real-world applications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
