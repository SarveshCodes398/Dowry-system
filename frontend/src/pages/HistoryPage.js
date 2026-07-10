import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getHistory();
      setHistory(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'male') return item.gender === 'Male';
    if (filter === 'female') return item.gender === 'Female';
    if (filter === 'high') return item.prediction.predicted_category === 'High Dowry';
    if (filter === 'low') return item.prediction.predicted_category === 'Low/Medium Dowry';
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="history-page">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">Prediction History</h1>
            <p className="section-subtitle">Loading your prediction history...</p>
          </div>
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">Prediction History</h1>
          </div>
          <div className="alert alert-danger animate-fade-in">
            {error}
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={fetchHistory}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Prediction History</h1>
          <p className="section-subtitle">View all your previous dowry predictions</p>
        </div>

        <div className="history-container">
          {/* Filters */}
          <div className="history-filters text-center">
            <div className="filter-buttons">
              <button
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                All ({history.length})
              </button>
              <button
                className={`btn ${filter === 'male' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('male')}
              >
                Male ({history.filter(h => h.gender === 'Male').length})
              </button>
              <button
                className={`btn ${filter === 'female' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('female')}
              >
                Female ({history.filter(h => h.gender === 'Female').length})
              </button>
              <button
                className={`btn ${filter === 'high' ? 'btn-success' : 'btn-outline'}`}
                onClick={() => setFilter('high')}
              >
                High Dowry ({history.filter(h => h.prediction.predicted_category === 'High Dowry').length})
              </button>
              <button
                className={`btn ${filter === 'low' ? 'btn-warning' : 'btn-outline'}`}
                onClick={() => setFilter('low')}
              >
                Low/Medium ({history.filter(h => h.prediction.predicted_category === 'Low/Medium Dowry').length})
              </button>
            </div>
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="card empty-state animate-fade-in">
              <div className="empty-state-icon">📜</div>
              <h4>No History Found</h4>
              <p className="text-muted mt-2">
                No predictions match the selected filter
              </p>
            </div>
          ) : (
            <div className="card history-list animate-fade-in">
              {filteredHistory.map((item, index) => (
                <div key={item.id || index} className="history-item">
                  {item.imagePath && (
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className="history-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="history-info">
                    <div className="history-name">
                      {item.name || 'Anonymous'}
                      <span className={`badge ${item.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} ml-2`}>
                        {item.gender}
                      </span>
                    </div>
                    <div className="history-details">
                      <span>Score: {item.appearanceScore}/10</span>
                      <span>
                        Category: {item.prediction.predicted_category}
                      </span>
                      <span>
                        Dowry: {formatCurrency(item.prediction.estimated_dowry_amount)}
                      </span>
                    </div>
                    <div className="history-meta">
                      <small>
                        {formatDate(item.timestamp)} • 
                        {item.prediction.probability_percentage}% confidence
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {filteredHistory.length > 0 && (
            <div className="history-summary">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{filteredHistory.length}</div>
                  <div className="stat-label">Total Predictions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{filteredHistory.filter(h => h.gender === 'Male').length}</div>
                  <div className="stat-label">Male</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{filteredHistory.filter(h => h.gender === 'Female').length}</div>
                  <div className="stat-label">Female</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{filteredHistory.filter(h => h.prediction.predicted_category === 'High Dowry').length}</div>
                  <div className="stat-label">High Dowry</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
