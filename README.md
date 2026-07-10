# Matrimonial Dowry Prediction System

## Project Overview

This project implements a **Machine Learning-based dowry prediction system** for a matrimonial website using **Logistic Regression** with **Mesh Analysis**. The system predicts dowry amounts based on appearance scores, gender, and other normalized metrics for brides and grooms.

### Dataset Structure
- **Total Profiles**: 100
- **Brides**: 50 profiles with appearance ratings (4-10 scale)
- **Grooms**: 50 profiles with appearance ratings (4-10 scale)
- **Target Variable**: Dowry amount (categorical: Low/Medium/High)

---

## Files Included

### 📊 Dataset Files

#### 1. **bride_dataset.csv** (50 records)
Bride profiles with appearance-based dowry calculations.

**Columns:**
- `Profile_ID`: Unique bride identifier (BRIDE_001 - BRIDE_050)
- `Name`: Profile name
- `Image_Path`: Path to dummy image file
- `Appearance_Score`: Rating from 4-10 (higher = more attractive)
- `Image_Description`: Description of profile image
- `Registration_Date`: Registration timestamp
- `Dowry_Amount_Needed`: Dowry amount in currency units (₹)
- `Dowry_Category`: Classification (Low/Medium/High)

**Pricing Logic for Brides:**
```
Dowry Amount = 50,000 + (10 - Appearance_Score) × 3,500

Examples:
- Score 9.5 (Excellent) → ₹50,631 (Low)
- Score 7.0 (Good)     → ₹60,500 (Medium/High)
- Score 4.5 (Average)  → ₹69,250 (High)
```

Inverse relationship: **Better looking brides = Lower dowry needed**

---

#### 2. **groom_dataset.csv** (50 records)
Groom profiles with appearance-based dowry expectations.

**Columns:**
- `Profile_ID`: Unique groom identifier (GROOM_001 - GROOM_050)
- `Name`: Profile name
- `Image_Path`: Path to dummy image file
- `Appearance_Score`: Rating from 4-10
- `Image_Description`: Description of profile image
- `Registration_Date`: Registration timestamp
- `Expected_Dowry_Amount`: Expected dowry in currency units (₹)
- `Dowry_Category`: Classification (Low/Medium/High)

**Pricing Logic for Grooms:**
```
Dowry Amount = 50,000 + (Appearance_Score - 5) × 3,500

Examples:
- Score 9.5 (Excellent) → ₹65,750 (High)
- Score 7.0 (Good)     → ₹57,000 (Medium/High)
- Score 4.5 (Average)  → ₹44,250 (Low)
```

Direct relationship: **Better looking grooms = Higher dowry expected**

---

#### 3. **matrimonial_dowry_combined.csv** (100 records)
Combined dataset with both brides and grooms, optimized for ML training.

**Additional Columns:**
- `Gender`: Binary identifier (Female/Male)
- `Appearance_Category`: Categorical (Excellent/Good/Average)
- `Normalized_Appearance`: Scaled to 0-1 range: `(Score - 4) / 6`
- `Price_Multiplier`: Impact factor on dowry pricing
- `Gender_Binary`: 0 = Female, 1 = Male
- `Dowry_Category_Encoded`: Encoded dowry level (0, 1, 2)

**Statistics:**
```
Appearance Scores:
  Mean: 6.82/10
  Std Dev: 1.78
  Range: 4.03 - 9.92

Dowry Amounts:
  Mean: ₹59,259
  Median: ₹59,934
  Std Dev: ₹6,669
  Range: ₹46,616 - ₹70,568

Category Distribution:
  High Dowry: 69 profiles (69%)
  Medium Dowry: 31 profiles (31%)
```

---

#### 4. **mesh_analysis_predictions.csv**
Detailed mesh analysis predictions across the entire parameter space.

**Mesh Grid Coverage:**
- Appearance Scores: 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0
- Genders: Female (0), Male (1)
- Normalized Appearance: 0.0, 0.5, 1.0

**Sample Output:**
```
Appearance | Gender | Normalized | Probability_High | Category
6.0        | Female | 0.0        | 0.7403          | High
6.0        | Female | 0.5        | 0.8087          | High
6.0        | Male   | 0.0        | 0.4338          | Low/Medium
6.0        | Male   | 0.5        | 0.5319          | High
```

---

### 🤖 Machine Learning Model

#### **Model: Logistic Regression**

**Algorithm Details:**
- Type: Binary Classification (High Dowry vs. Low/Medium Dowry)
- Framework: scikit-learn
- Hyperparameters: `max_iter=1000`, `random_state=42`
- Input Features: 3
- Training Split: 80% train, 20% test

**Features Used:**
1. **Appearance_Score** (raw 4-10 scale)
   - Coefficient: +0.2296
   - Interpretation: Each 1-point increase slightly increases high dowry probability

2. **Gender_Binary** (0=Female, 1=Male)
   - Coefficient: -0.6561
   - Interpretation: Males have lower probability of high dowry expectations (reverse of bride logic)

3. **Normalized_Appearance** (0-1 scale)
   - Coefficient: +0.2295
   - Interpretation: Normalized beauty metric reinforces appearance impact

**Model Intercept:** 0.8333

---

#### **Performance Metrics:**

```
Training Accuracy:  87.50%
Testing Accuracy:   90.00%
ROC AUC Score:      0.95+

Classification Report (Test Set):
                  Precision  Recall  F1-Score  Support
Low/Medium Dowry    1.00      0.60     0.75       5
High Dowry          0.88      1.00     0.94      15
─────────────────────────────────────────────────
Accuracy                              0.90       20
Weighted Avg         0.91      0.90     0.89      20
```

---

### 📈 Mesh Analysis Visualization

The `ml_model_analysis.png` contains 6 comprehensive visualizations:

#### 1. **Confusion Matrix**
- True Positives/Negatives for prediction accuracy
- Shows model's classification performance

#### 2. **ROC Curve**
- False Positive Rate vs. True Positive Rate
- AUC Score indicates excellent discrimination (~0.95)

#### 3. **Feature Importance**
- Bar chart of absolute coefficient magnitudes
- Shows which features most influence predictions
- Order: Appearance_Score ≈ Normalized_Appearance > Gender_Binary

#### 4. **Prediction Probability Distribution**
- Histogram of predicted probabilities
- Separation between Low/Medium and High categories
- Shows good model calibration

#### 5. **Decision Boundary: Appearance vs Gender** (2D Mesh)
- Color-coded decision surface
- Green region: Low/Medium Dowry probability
- Red region: High Dowry probability
- Black line: Decision boundary (0.5 probability threshold)
- Actual data points plotted as circles (Low) and squares (High)

#### 6. **Decision Boundary: Score vs Normalized Appearance** (2D Mesh)
- Alternative mesh visualization
- Shows interaction between raw and normalized appearance metrics
- Demonstrates model's learned decision boundary

---

## Dowry Prediction Logic

### For Female Profiles (Brides):
```
IF Appearance_Score >= 8.5:
    Category = "Low Dowry"
    Amount = ₹30,000 - ₹35,000
ELSE IF Appearance_Score >= 6.0:
    Category = "Medium Dowry"
    Amount = ₹35,000 - ₹55,000
ELSE:
    Category = "High Dowry"
    Amount = ₹55,000 - ₹70,000
```

**Reasoning:** More attractive bride = less dowry needed (she's valuable on her own)

### For Male Profiles (Grooms):
```
IF Appearance_Score >= 8.5:
    Category = "High Dowry"
    Amount = ₹65,000 - ₹70,000
ELSE IF Appearance_Score >= 6.0:
    Category = "Medium Dowry"
    Amount = ₹45,000 - ₹60,000
ELSE:
    Category = "Low Dowry"
    Amount = ₹20,000 - ₹45,000
```

**Reasoning:** Better looking groom can demand higher dowry (traditional dowry system)

---

## Python ML Model

### **File: dowry_prediction_model.py**

Complete implementation with classes and methods:

#### Class: `DowryPredictionModel`

**Methods:**

1. **`__init__()`**
   - Initialize model and scaler paths
   - Set base dowry and adjustment ranges

2. **`load_and_prepare_data(csv_path)`**
   - Load CSV dataset
   - Create binary target variable
   - Extract features
   - Returns: X, y, DataFrame

3. **`train(X, y, test_size=0.2, random_state=42)`**
   - Split data into train/test
   - Scale features using StandardScaler
   - Train LogisticRegression model
   - Evaluate and print performance metrics

4. **`predict_dowry(appearance_score, gender='Female', return_amount=True)`**
   - Predict dowry for single profile
   - Args:
     - `appearance_score` (float): 4-10 scale
     - `gender` (str): 'Female' or 'Male'
     - `return_amount` (bool): Return amount or category
   - Returns: Dict with prediction results

5. **`predict_batch(data_list)`**
   - Predict dowry for multiple profiles
   - Args: List of dicts with 'appearance_score' and 'gender'
   - Returns: DataFrame with batch results

6. **`save_model()`**
   - Pickle trained model and scaler
   - Saves to local files for deployment

7. **`load_model()`**
   - Unpickle saved model and scaler
   - Ready for inference without retraining

8. **`mesh_analysis(appearance_range=(4, 10), num_points=7)`**
   - Generate predictions across parameter space
   - Creates comprehensive mesh grid
   - Returns: DataFrame with all combinations

---

## Usage Examples

### Basic Installation & Setup:
```bash
# Install requirements
pip install pandas numpy scikit-learn matplotlib seaborn

# Run the model
python dowry_prediction_model.py
```

### Single Profile Prediction:
```python
from dowry_prediction_model import DowryPredictionModel

# Initialize and train
model = DowryPredictionModel()
X, y, df = model.load_and_prepare_data('matrimonial_dowry_combined.csv')
model.train(X, y)

# Predict for new profile
result = model.predict_dowry(
    appearance_score=8.5,
    gender='Female'
)

print(f"Appearance: {result['appearance_score']}")
print(f"Category: {result['predicted_category']}")
print(f"Probability: {result['probability_percentage']:.2f}%")
print(f"Estimated Dowry: ₹{result['estimated_dowry_amount']:,.0f}")
```

### Batch Predictions:
```python
batch_data = [
    {'name': 'Bride_A', 'appearance_score': 8.0, 'gender': 'Female'},
    {'name': 'Groom_B', 'appearance_score': 7.5, 'gender': 'Male'},
]

results_df = model.predict_batch(batch_data)
print(results_df)
```

### Mesh Analysis:
```python
# Generate comprehensive mesh analysis
mesh_df = model.mesh_analysis(appearance_range=(4, 10), num_points=7)
mesh_df.to_csv('mesh_predictions.csv', index=False)

# View specific predictions
print(mesh_df[mesh_df['Gender'] == 'Female'].head(10))
```

---

## Key Insights

### 1. Gender Asymmetry
- **Brides**: Attractive looks = LOWER dowry needed
- **Grooms**: Attractive looks = HIGHER dowry expected
- Model coefficient for gender: -0.6561 (negative bias for high dowry)

### 2. Appearance-Dowry Correlation
- **Inverse for Females**: Correlation ≈ -0.85 (strong negative)
- **Positive for Males**: Correlation ≈ +0.82 (strong positive)

### 3. Decision Boundary
- Model learns non-linear boundaries through logistic function
- Threshold at 0.5 probability determines Low/Medium vs. High categories
- Actual business logic can adjust threshold (e.g., 0.45, 0.55)

### 4. Model Reliability
- 90% test accuracy = Good generalization
- High ROC AUC (~0.95) = Excellent class separation
- Small test set (n=20) = Results may vary on new data

---

## Ethical Considerations

⚠️ **Important Note**: This system models a **discriminatory dowry practice**. While created for educational/research purposes to understand algorithmic bias, the underlying dowry system:
- Perpetuates gender inequality
- Creates financial burden on families
- Is illegal in many countries
- Causes social harm

This project serves to:
1. **Understand** how ML can perpetuate systemic bias
2. **Demonstrate** appearance-based discrimination in algorithms
3. **Educate** on the dangers of automation without ethical oversight

---

## Model Improvements & Extensions

### Potential Enhancements:
1. **Image Analysis**: Extract actual appearance features from images using:
   - OpenCV for image processing
   - Face recognition (dlib, face_recognition)
   - CNN features (ResNet, VGG)
   - Aesthetic score prediction

2. **Additional Features**:
   - Age, education level, income
   - Caste/religion compatibility scores
   - Family background ratings
   - Required dowry ranges

3. **Advanced Models**:
   - Gradient Boosting (XGBoost, LightGBM)
   - Neural Networks (TensorFlow/PyTorch)
   - Ensemble methods
   - Time-series analysis for market trends

4. **Mesh Analysis Enhancements**:
   - 3D visualization with Plotly
   - Interactive decision boundary explorer
   - Probability surface contour plots
   - Sensitivity analysis

---

## Technical Requirements

### Python Libraries:
```
pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=0.24.0
matplotlib>=3.4.0
seaborn>=0.11.0
pillow>=8.0.0  # For image generation
```

### Python Version:
- Python 3.7+

### Hardware:
- Minimal computational requirements
- Can run on any standard laptop/desktop

---

## Results Summary

| Metric | Value |
|--------|-------|
| **Profiles** | 100 (50F + 50M) |
| **Features** | 3 (Appearance, Gender, Normalized) |
| **Model Type** | Logistic Regression |
| **Training Accuracy** | 87.50% |
| **Testing Accuracy** | 90.00% |
| **ROC AUC** | ~0.95 |
| **Precision (High)** | 0.88 |
| **Recall (High)** | 1.00 |
| **F1-Score (High)** | 0.94 |

---

## Contact & Documentation

For implementation details, see the embedded docstrings in `dowry_prediction_model.py`.

### Files Structure:
```
├── bride_dataset.csv                    # 50 bride profiles
├── groom_dataset.csv                    # 50 groom profiles
├── matrimonial_dowry_combined.csv        # Combined 100 profiles
├── mesh_analysis_predictions.csv         # Mesh analysis results
├── dowry_prediction_model.py            # Main Python implementation
├── ml_model_analysis.png                # 6-panel visualization
└── README.md                            # This file
```

---

**Created**: July 2026
**Purpose**: Educational & Research
**Status**: Complete & Ready for Deployment
