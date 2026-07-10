import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Dowry System</h3>
            <p className="footer-description">
              A matrimonial dowry prediction system using logistic regression and image analysis.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-section-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/predict">Predict Dowry</Link></li>
              <li><Link to="/history">History</Link></li>
              <li><Link to="/stats">Statistics</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-section-title">Technologies</h4>
            <ul className="footer-links">
              <li>React.js</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>Multer</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dowry System. All rights reserved.</p>
          <p className="disclaimer">
            <small>Note: This is a demonstration system for educational purposes only.</small>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
