import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkHealth } from '../services/api';

function HomePage() {
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await checkHealth();
        setApiStatus({ online: true, message: 'API is running', data: response });
      } catch (error) {
        setApiStatus({ online: false, message: 'API is offline', error: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    checkApi();
  }, []);

  const features = [
    {
      icon: '📷',
      title: 'Image Upload',
      description: 'Upload male or female images for dowry prediction'
    },
    {
      icon: '🎯',
      title: 'Logistic Regression',
      description: 'Uses trained logistic regression model for accurate predictions'
    },
    {
      icon: '💰',
      title: 'Dowry Calculation',
      description: 'Calculate estimated dowry amounts based on appearance'
    },
    {
      icon: '📊',
      title: 'Statistics',
      description: 'View prediction history and system statistics'
    }
  ];

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section text-center mb-5">
          <h1 className="hero-title gradient-text">
            Dowry Prediction System
          </h1>
          <p className="hero-subtitle text-white">
            A matrimonial system that predicts dowry amounts using logistic regression
          </p>
          
          <div className="hero-buttons mt-4">
            <Link to="/predict" className="btn btn-primary">
              📷 Predict Dowry
            </Link>
            <Link to="/stats" className="btn btn-outline ml-3">
              📊 View Statistics
            </Link>
          </div>

          {/* API Status */}
          {isLoading ? (
            <div className="api-status mt-3">
              <div className="spinner" style={{ width: 20, height: 20, display: 'inline-block' }}></div>
              <span className="ml-2 text-white">Checking API...</span>
            </div>
          ) : (
            <div className={`api-status mt-3 badge ${apiStatus.online ? 'badge-success' : 'badge-danger'}`}>
              {apiStatus.online ? '✓ API Online' : '✗ API Offline'}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="features-section mb-5">
          <h2 className="section-title text-center mb-4">Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card p-4 text-center">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title mt-2">{feature.title}</h3>
                <p className="feature-description text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section mb-5">
          <h2 className="section-title text-center mb-4">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Upload Image</h4>
                <p>Upload a clear image of the person (male or female)</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Select Gender</h4>
                <p>Choose whether the person is male or female</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Get Prediction</h4>
                <p>Receive dowry prediction based on appearance analysis</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section text-center">
          <h2 className="cta-title">Ready to Predict?</h2>
          <p className="cta-subtitle">Start using our system to predict dowry amounts</p>
          <Link to="/predict" className="btn btn-primary btn-lg mt-3">
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
