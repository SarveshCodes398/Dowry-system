import React, { useState, useRef } from 'react';
import { uploadImage, getPrediction } from '../services/api';

function PredictionPage() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [appearanceScore, setAppearanceScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Handle gender selection
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setError(null);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // Validate and set image
  const validateAndSetImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, JPG, or WebP)');
      return;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // Handle appearance score change
  const handleAppearanceScoreChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 4 && parseFloat(value) <= 10)) {
      setAppearanceScore(value);
      setError(null);
    } else {
      setError('Appearance score must be between 4 and 10');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedGender) {
      setError('Please select a gender');
      return;
    }

    // Check if using image upload or direct score
    if (imageFile) {
      // Upload image
      setIsLoading(true);
      try {
        const response = await uploadImage(imageFile, selectedGender, name);
        setPrediction(response.data);
        setSuccess('Dowry prediction successful!');
      } catch (err) {
        setError(err.message || 'Failed to upload image and predict dowry');
      } finally {
        setIsLoading(false);
      }
    } else if (appearanceScore) {
      // Use direct score
      setIsLoading(true);
      try {
        const response = await getPrediction(
          parseFloat(appearanceScore),
          selectedGender,
          name
        );
        setPrediction(response.data);
        setSuccess('Dowry prediction successful!');
      } catch (err) {
        setError(err.message || 'Failed to predict dowry');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please upload an image or enter an appearance score');
    }
  };

  // Clear form
  const clearForm = () => {
    setSelectedGender(null);
    setImageFile(null);
    setImagePreview(null);
    setName('');
    setAppearanceScore('');
    setPrediction(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="prediction-page">
      <div className="container">
        <div className="prediction-header text-center">
          <h1 className="prediction-title">Predict Dowry</h1>
          <p className="prediction-subtitle">Upload an image or enter appearance score to get dowry prediction</p>
        </div>

        <div className="prediction-container">
          <div className="row">
            {/* Left Column - Input Form */}
            <div className="col-md-6">
              <form onSubmit={handleSubmit} className="prediction-form">
                {/* Name Input */}
                <div className="form-group">
                  <label className="form-label">Name (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>

                {/* Gender Selection */}
                <div className="form-group">
                  <label className="form-label">Select Gender</label>
                  <div className="gender-selector">
                    <div
                      className={`gender-card ${selectedGender === 'Female' ? 'selected' : ''}`}
                      onClick={() => handleGenderSelect('Female')}
                    >
                      <div className="icon">👩</div>
                      <div className="title">Female</div>
                    </div>
                    <div
                      className={`gender-card ${selectedGender === 'Male' ? 'selected' : ''}`}
                      onClick={() => handleGenderSelect('Male')}
                    >
                      <div className="icon">👨</div>
                      <div className="title">Male</div>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label className="form-label">Upload Image (Optional)</label>
                  <div
                    ref={dropZoneRef}
                    className={`image-upload-container ${isDragging ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      style={{ display: 'none' }}
                    />
                    {imagePreview ? (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                        <p className="upload-text mt-2">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="upload-icon">📷</div>
                        <p className="upload-text">
                          Click to upload or drag and drop
                        </p>
                        <p className="upload-hint">
                          JPEG, PNG, JPG, WebP (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* OR Divider */}
                <div className="or-divider">
                  <span>OR</span>
                </div>

                {/* Appearance Score Input */}
                <div className="form-group">
                  <label className="form-label">Appearance Score (4-10)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={appearanceScore}
                    onChange={handleAppearanceScoreChange}
                    placeholder="Enter appearance score (4-10)"
                    min="4"
                    max="10"
                    step="0.1"
                  />
                  <small className="text-muted">
                    Skip if uploading image
                  </small>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" style={{ width: 20, height: 20, marginRight: 8 }}></div>
                        Predicting...
                      </>
                    ) : (
                      'Predict Dowry'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={clearForm}
                    disabled={isLoading}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Results */}
            <div className="col-md-6">
              {error && (
                <div className="alert alert-danger animate-fade-in">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success animate-fade-in">
                  {success}
                </div>
              )}

              {prediction && (
                <div className="result-card animate-fade-in">
                  <div className="result-header">
                    <h3 className="result-title">Prediction Result</h3>
                    <p className="result-subtitle">Based on your input</p>
                  </div>
                  
                  <div className="result-grid">
                    <div className="result-item">
                      <span className="result-label">Name:</span>
                      <span className="result-value">{prediction.name || 'Anonymous'}</span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Gender:</span>
                      <span className="result-value">{prediction.gender}</span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Appearance Score:</span>
                      <span className="result-value">{prediction.appearanceScore || prediction.appearance_score}/10</span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Predicted Category:</span>
                      <span className="result-value">
                        <span className={`badge ${prediction.predicted_category === 'High Dowry' ? 'badge-success' : 'badge-warning'}`}>
                          {prediction.predicted_category}
                        </span>
                      </span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Probability:</span>
                      <span className="result-value">{prediction.probability_percentage || (prediction.probability_high_dowry * 100).toFixed(2)}%</span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Estimated Dowry:</span>
                      <span className="result-value">
                        {formatCurrency(prediction.estimated_dowry_amount)}
                      </span>
                    </div>
                    
                    <div className="result-item">
                      <span className="result-label">Confidence:</span>
                      <span className="result-value">{((prediction.confidence || prediction.probability_high_dowry) * 100).toFixed(2)}%</span>
                    </div>
                  </div>

                  {prediction.imageUrl && (
                    <div className="mt-4 text-center">
                      <img
                        src={prediction.imageUrl}
                        alt="Uploaded"
                        className="image-preview"
                        style={{ maxHeight: 200, borderRadius: 'var(--radius-md)' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {!prediction && !error && !success && (
                <div className="card empty-state animate-fade-in">
                  <div className="empty-state-icon">📊</div>
                  <h4>No Prediction Yet</h4>
                  <p className="text-muted mt-2">
                    Upload an image or enter an appearance score and click "Predict Dowry"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;
