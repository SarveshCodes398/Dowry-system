#!/usr/bin/env python3
"""
Dowry Prediction Script
=======================

This script provides dowry predictions based on the trained logistic regression model.
It can be called from the Node.js backend to get predictions.

Usage:
    python predict_dowry.py <appearance_score> <gender>

Example:
    python predict_dowry.py 8.5 Female
"""

import sys
import json
import pickle
import os
import numpy as np
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))


class DowryPredictor:
    """Lightweight predictor using pre-trained model"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_path = os.path.join(os.path.dirname(__file__), 'backend', 'models', 'dowry_model.pkl')
        self.scaler_path = os.path.join(os.path.dirname(__file__), 'backend', 'models', 'dowry_scaler.pkl')
        self.feature_names = ['Appearance_Score', 'Gender_Binary', 'Normalized_Appearance']
        self.base_dowry = 30000
        self.max_adjustment = 40000
        
        # Try to load pre-trained model
        self._load_model()
        
        # If model doesn't exist, use fallback coefficients
        if self.model is None:
            print("Using fallback model coefficients")
            self.fallback_coefficients = {
                'Appearance_Score': 0.5,
                'Gender_Binary': -0.3,
                'Normalized_Appearance': 0.8,
                'intercept': -2.0
            }
    
    def _load_model(self):
        """Load pre-trained model and scaler"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                print("Model and scaler loaded successfully")
            else:
                print("Model files not found, will use fallback")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
            self.scaler = None
    
    def predict(self, appearance_score, gender):
        """
        Predict dowry based on appearance score and gender
        
        Args:
            appearance_score (float): Score from 4-10
            gender (str): 'Male' or 'Female'
            
        Returns:
            dict: Prediction results
        """
        try:
            appearance_score = float(appearance_score)
            gender = str(gender).strip()
            
            # Validate inputs
            if appearance_score < 4 or appearance_score > 10:
                return {
                    'error': 'Appearance score must be between 4 and 10',
                    'appearance_score': appearance_score,
                    'gender': gender
                }
            
            if gender.lower() not in ['male', 'female']:
                return {
                    'error': 'Gender must be Male or Female',
                    'appearance_score': appearance_score,
                    'gender': gender
                }
            
            # Convert gender to binary
            gender_binary = 0 if gender.lower() == 'female' else 1
            
            # Normalize appearance score
            normalized_appearance = (appearance_score - 4) / 6
            normalized_appearance = np.clip(normalized_appearance, 0, 1)
            
            # Prepare input
            input_data = np.array([[appearance_score, gender_binary, normalized_appearance]])
            
            if self.model is not None and self.scaler is not None:
                # Use trained model
                input_scaled = self.scaler.transform(input_data)
                prediction = self.model.predict(input_scaled)[0]
                probability = self.model.predict_proba(input_scaled)[0][1]
            else:
                # Use fallback logistic function
                z = (self.fallback_coefficients['intercept'] + 
                     self.fallback_coefficients['Appearance_Score'] * appearance_score +
                     self.fallback_coefficients['Gender_Binary'] * gender_binary +
                     self.fallback_coefficients['Normalized_Appearance'] * normalized_appearance)
                probability = 1 / (1 + np.exp(-z))
                prediction = 1 if probability > 0.5 else 0
            
            # Calculate estimated dowry
            estimated_dowry = self.base_dowry + (probability * self.max_adjustment)
            
            result = {
                'appearance_score': round(appearance_score, 2),
                'gender': gender,
                'normalized_appearance': round(float(normalized_appearance), 3),
                'predicted_category': 'High Dowry' if prediction == 1 else 'Low/Medium Dowry',
                'probability_high_dowry': round(float(probability), 4),
                'probability_percentage': round(float(probability * 100), 2),
                'estimated_dowry_amount': round(float(estimated_dowry), 2),
                'confidence': round(float(max(probability, 1 - probability)), 4)
            }
            
            return result
            
        except Exception as e:
            return {
                'error': str(e),
                'appearance_score': appearance_score,
                'gender': gender
            }


def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 3:
        print(json.dumps({
            'error': 'Usage: python predict_dowry.py <appearance_score> <gender>',
            'example': 'python predict_dowry.py 8.5 Female'
        }))
        sys.exit(1)
    
    try:
        appearance_score = sys.argv[1]
        gender = sys.argv[2]
        
        predictor = DowryPredictor()
        result = predictor.predict(appearance_score, gender)
        
        # Output as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'appearance_score': appearance_score if 'appearance_score' in locals() else None,
            'gender': gender if 'gender' in locals() else None
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
