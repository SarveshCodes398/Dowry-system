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
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Dowry Prediction System</h1>
          <p className="hero-subtitle">
            A matrimonial system that predicts dowry amounts using logistic regression
          </p>
          
          <div className="hero-buttons">
            <Link to="/predict" className="btn btn-primary btn-lg">
              📷 Predict Dowry
            </Link>
            <Link to="/stats" className="btn btn-outline btn-lg">
              📊 View Statistics
            </Link>
          </div>

          {/* API Status */}
          {isLoading ? (
            <div className="mt-4">
              <div className="spinner" style={{ width: '2rem', height: '2rem', display: 'inline-block' }}></div>
            </div>
          ) : (
            <div className="mt-4">
              <span className={`badge ${apiStatus.online ? 'badge-success' : 'badge-danger'}`}>
                {apiStatus.online ? '✓ API Online' : '✗ API Offline'}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="hero-features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Features</h2>
            <p className="section-subtitle">
              Everything you need for accurate dowry predictions
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple and straightforward process
            </p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4 className="step-title">Upload Image</h4>
                <p className="step-description">Upload a clear image of the person (male or female)</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4 className="step-title">Select Gender</h4>
                <p className="step-description">Choose whether the person is male or female</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4 className="step-title">Get Prediction</h4>
                <p className="step-description">Receive dowry prediction based on appearance analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Predict?</h2>
          <p className="cta-subtitle">Start using our system to predict dowry amounts</p>
          <Link to="/predict" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
